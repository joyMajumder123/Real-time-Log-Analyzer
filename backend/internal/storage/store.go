package storage

import (
	"log"
	"sync"
	"time"

	"real-time-log-analyzer/backend/internal/models"
)

type ServiceMetrics struct {
	Service        string           `json:"service"`
	TotalLogs      int64            `json:"total_logs"`
	ErrorCount     int64            `json:"error_count"`
	AvgLatency     float64          `json:"avg_latency_ms"`
	StatusCodes    map[string]int64 `json:"status_codes"`
	TopEndpoints   map[string]int64 `json:"top_endpoints"`
	RequestsPerSec float64          `json:"requests_per_sec"`
	LastUpdated    string           `json:"last_updated"`
}

type RealTimeMetrics struct {
	TotalRequests int64                      `json:"total_requests"`
	ErrorRate     float64                    `json:"error_rate"`
	AvgLatency    float64                    `json:"avg_latency_ms"`
	Services      map[string]*ServiceMetrics `json:"services"`
	Timestamp     string                     `json:"timestamp"`
}

type Store interface {
	AddLog(entry models.LogEntry) error
	GetLogs(service string, level string, limit int, offset int) ([]models.LogEntry, int64, error)
	GetMetrics(service string) (*ServiceMetrics, error)
	GetAllMetrics() map[string]*ServiceMetrics
	GetRealTimeMetrics() *RealTimeMetrics
	GetServices() []string
	Close() error
}

type InMemoryStore struct {
	mu      sync.RWMutex
	logs    map[string][]models.LogEntry // grouped by service
	metrics map[string]*ServiceMetrics   // aggregated per service
	startAt time.Time
}

func NewInMemoryStore() *InMemoryStore {
	return &InMemoryStore{
		logs:    make(map[string][]models.LogEntry),
		metrics: make(map[string]*ServiceMetrics),
		startAt: time.Now(),
	}
}

func (s *InMemoryStore) AddLog(entry models.LogEntry) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if entry.Service == "" {
		entry.Service = "unknown"
	}

	if len(s.logs[entry.Service]) >= 10000 {
		s.logs[entry.Service] = s.logs[entry.Service][1:]
	}
	s.logs[entry.Service] = append(s.logs[entry.Service], entry)

	if _, exists := s.metrics[entry.Service]; !exists {
		s.metrics[entry.Service] = &ServiceMetrics{
			Service:      entry.Service,
			StatusCodes:  make(map[string]int64),
			TopEndpoints: make(map[string]int64),
		}
	}

	metrics := s.metrics[entry.Service]
	metrics.TotalLogs++
	metrics.AvgLatency = (metrics.AvgLatency*(float64(metrics.TotalLogs)-1) + float64(entry.LatencyMs)) / float64(metrics.TotalLogs)
	metrics.StatusCodes[string(rune(entry.Status/100))]++
	metrics.TopEndpoints[entry.Endpoint]++
	if entry.Level == "error" || entry.Level == "ERROR" {
		metrics.ErrorCount++
	}
	metrics.LastUpdated = time.Now().Format(time.RFC3339)

	log.Printf("[STORAGE] Added log for service=%s, total=%d, avg_latency=%.2f\n",
		entry.Service, metrics.TotalLogs, metrics.AvgLatency)

	return nil
}

func (s *InMemoryStore) GetLogs(service string, level string, limit int, offset int) ([]models.LogEntry, int64, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	logs := s.logs[service]
	var filtered []models.LogEntry

	for _, log := range logs {
		if level == "" || log.Level == level {
			filtered = append(filtered, log)
		}
	}

	for i, j := 0, len(filtered)-1; i < j; i, j = i+1, j-1 {
		filtered[i], filtered[j] = filtered[j], filtered[i]
	}

	start := offset
	if start > len(filtered) {
		start = len(filtered)
	}
	end := start + limit
	if end > len(filtered) {
		end = len(filtered)
	}

	return filtered[start:end], int64(len(filtered)), nil
}

func (s *InMemoryStore) GetMetrics(service string) (*ServiceMetrics, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if metrics, ok := s.metrics[service]; ok {
		return metrics, nil
	}

	return &ServiceMetrics{
		Service:      service,
		StatusCodes:  make(map[string]int64),
		TopEndpoints: make(map[string]int64),
	}, nil
}

func (s *InMemoryStore) GetAllMetrics() map[string]*ServiceMetrics {
	s.mu.RLock()
	defer s.mu.RUnlock()

	result := make(map[string]*ServiceMetrics)
	for k, v := range s.metrics {
		result[k] = v
	}
	return result
}

func (s *InMemoryStore) GetRealTimeMetrics() *RealTimeMetrics {
	s.mu.RLock()
	defer s.mu.RUnlock()

	services := make(map[string]*ServiceMetrics)
	totalReqs := int64(0)
	totalErrors := int64(0)
	totalLatency := float64(0)

	for k, v := range s.metrics {
		services[k] = v
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

func (s *InMemoryStore) GetServices() []string {
	s.mu.RLock()
	defer s.mu.RUnlock()

	services := make([]string, 0, len(s.metrics))
	for service := range s.metrics {
		services = append(services, service)
	}
	return services
}

func (s *InMemoryStore) Close() error {
	return nil
}
