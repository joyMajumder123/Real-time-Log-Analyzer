package storage

import (
	"database/sql"
	"fmt"
	"log"
	"strings"
	"time"

	_ "github.com/lib/pq"

	"real-time-log-analyzer/backend/internal/models"
)

type PostgresStore struct {
	db *sql.DB
}

func NewPostgresStore(dsn string) (*PostgresStore, error) {
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	store := &PostgresStore{db: db}

	if err := store.migrate(); err != nil {
		return nil, fmt.Errorf("failed to run migrations: %w", err)
	}

	log.Println("✓ PostgreSQL connected and migrated")
	return store, nil
}

func (s *PostgresStore) migrate() error {
	migrations := []string{
		`CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			email VARCHAR(255) UNIQUE NOT NULL,
			name VARCHAR(255) NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			role VARCHAR(50) DEFAULT 'user',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		`CREATE TABLE IF NOT EXISTS services (
			id SERIAL PRIMARY KEY,
			name VARCHAR(255) UNIQUE NOT NULL,
			description TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		`CREATE TABLE IF NOT EXISTS logs (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			service VARCHAR(255) NOT NULL,
			level VARCHAR(50) NOT NULL,
			endpoint VARCHAR(500),
			status INTEGER,
			latency_ms BIGINT,
			message TEXT,
			timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		`CREATE TABLE IF NOT EXISTS metrics (
			id SERIAL PRIMARY KEY,
			service VARCHAR(255) NOT NULL,
			total_logs BIGINT DEFAULT 0,
			error_count BIGINT DEFAULT 0,
			avg_latency_ms FLOAT DEFAULT 0,
			period_start TIMESTAMP NOT NULL,
			period_end TIMESTAMP NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			UNIQUE(service, period_start, period_end)
		)`,

		`CREATE INDEX IF NOT EXISTS idx_logs_service ON logs(service)`,
		`CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp DESC)`,
		`CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level)`,
		`CREATE INDEX IF NOT EXISTS idx_logs_service_timestamp ON logs(service, timestamp DESC)`,
	}

	for _, migration := range migrations {
		if _, err := s.db.Exec(migration); err != nil {
			return fmt.Errorf("migration failed: %s - %w", migration[:50], err)
		}
	}

	return nil
}

func (s *PostgresStore) AddLog(entry models.LogEntry) error {
	query := `
		INSERT INTO logs (service, level, endpoint, status, latency_ms, message, timestamp)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id
	`

	timestamp := entry.Timestamp
	if timestamp == "" {
		timestamp = time.Now().Format(time.RFC3339)
	}

	var id string
	err := s.db.QueryRow(query, entry.Service, entry.Level, entry.Endpoint, entry.Status, entry.LatencyMs, entry.Message, timestamp).Scan(&id)
	if err != nil {
		return fmt.Errorf("failed to insert log: %w", err)
	}

	s.ensureService(entry.Service)

	log.Printf("[POSTGRES] Stored log: service=%s level=%s\n", entry.Service, entry.Level)
	return nil
}

func (s *PostgresStore) ensureService(name string) {
	query := `INSERT INTO services (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`
	s.db.Exec(query, name)
}

func (s *PostgresStore) GetLogs(service string, level string, limit int, offset int) ([]models.LogEntry, int64, error) {
	var conditions []string
	var args []interface{}
	argIndex := 1

	if service != "" {
		conditions = append(conditions, fmt.Sprintf("service = $%d", argIndex))
		args = append(args, service)
		argIndex++
	}

	if level != "" {
		conditions = append(conditions, fmt.Sprintf("level = $%d", argIndex))
		args = append(args, level)
		argIndex++
	}

	whereClause := ""
	if len(conditions) > 0 {
		whereClause = "WHERE " + strings.Join(conditions, " AND ")
	}

	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM logs %s", whereClause)
	var total int64
	s.db.QueryRow(countQuery, args...).Scan(&total)

	query := fmt.Sprintf(`
		SELECT id, service, level, endpoint, status, latency_ms, COALESCE(message, ''), timestamp
		FROM logs %s
		ORDER BY timestamp DESC
		LIMIT $%d OFFSET $%d
	`, whereClause, argIndex, argIndex+1)

	args = append(args, limit, offset)

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to query logs: %w", err)
	}
	defer rows.Close()

	var logs []models.LogEntry
	for rows.Next() {
		var entry models.LogEntry
		var timestamp time.Time
		if err := rows.Scan(&entry.ID, &entry.Service, &entry.Level, &entry.Endpoint, &entry.Status, &entry.LatencyMs, &entry.Message, &timestamp); err != nil {
			continue
		}
		entry.Timestamp = timestamp.Format(time.RFC3339)
		logs = append(logs, entry)
	}

	return logs, total, nil
}

func (s *PostgresStore) GetMetrics(service string) (*ServiceMetrics, error) {
	query := `
		SELECT 
			COUNT(*) as total_logs,
			COUNT(CASE WHEN LOWER(level) = 'error' THEN 1 END) as error_count,
			COALESCE(AVG(latency_ms), 0) as avg_latency
		FROM logs
		WHERE service = $1
		AND timestamp > NOW() - INTERVAL '1 hour'
	`

	var metrics ServiceMetrics
	metrics.Service = service
	metrics.StatusCodes = make(map[string]int64)
	metrics.TopEndpoints = make(map[string]int64)

	err := s.db.QueryRow(query, service).Scan(&metrics.TotalLogs, &metrics.ErrorCount, &metrics.AvgLatency)
	if err != nil {
		return &metrics, nil // Return empty metrics on error
	}

	statusQuery := `
		SELECT CAST(status / 100 AS TEXT) || 'xx' as status_class, COUNT(*) 
		FROM logs 
		WHERE service = $1 AND timestamp > NOW() - INTERVAL '1 hour'
		GROUP BY status_class
	`
	rows, _ := s.db.Query(statusQuery, service)
	if rows != nil {
		defer rows.Close()
		for rows.Next() {
			var class string
			var count int64
			rows.Scan(&class, &count)
			metrics.StatusCodes[class] = count
		}
	}

	endpointQuery := `
		SELECT endpoint, COUNT(*) as cnt
		FROM logs 
		WHERE service = $1 AND timestamp > NOW() - INTERVAL '1 hour'
		GROUP BY endpoint
		ORDER BY cnt DESC
		LIMIT 10
	`
	rows2, _ := s.db.Query(endpointQuery, service)
	if rows2 != nil {
		defer rows2.Close()
		for rows2.Next() {
			var endpoint string
			var count int64
			rows2.Scan(&endpoint, &count)
			metrics.TopEndpoints[endpoint] = count
		}
	}

	metrics.LastUpdated = time.Now().Format(time.RFC3339)
	return &metrics, nil
}

func (s *PostgresStore) GetAllMetrics() map[string]*ServiceMetrics {
	result := make(map[string]*ServiceMetrics)

	services := s.GetServices()
	for _, service := range services {
		metrics, _ := s.GetMetrics(service)
		result[service] = metrics
	}

	return result
}

func (s *PostgresStore) GetRealTimeMetrics() *RealTimeMetrics {
	services := s.GetAllMetrics()

	totalReqs := int64(0)
	totalErrors := int64(0)
	totalLatency := float64(0)

	for _, v := range services {
		totalReqs += v.TotalLogs
		totalErrors += v.ErrorCount
		totalLatency += v.AvgLatency * float64(v.TotalLogs)
	}

	avgLatency := float64(0)
	if totalReqs > 0 {
		avgLatency = totalLatency / float64(totalReqs)
	}

	errorRate := float64(0)
	if totalReqs > 0 {
		errorRate = float64(totalErrors) / float64(totalReqs) * 100
	}

	return &RealTimeMetrics{
		TotalRequests: totalReqs,
		ErrorRate:     errorRate,
		AvgLatency:    avgLatency,
		Services:      services,
		Timestamp:     time.Now().Format(time.RFC3339),
	}
}

func (s *PostgresStore) GetServices() []string {
	query := `SELECT name FROM services ORDER BY name`
	rows, err := s.db.Query(query)
	if err != nil {
		return []string{}
	}
	defer rows.Close()

	var services []string
	for rows.Next() {
		var name string
		rows.Scan(&name)
		services = append(services, name)
	}
	return services
}

func (s *PostgresStore) Close() error {
	return s.db.Close()
}
