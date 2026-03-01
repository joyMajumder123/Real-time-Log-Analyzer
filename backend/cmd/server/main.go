package main

import (
	"context"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"real-time-log-analyzer/backend/internal/api"
	"real-time-log-analyzer/backend/internal/ingestion"
	"real-time-log-analyzer/backend/internal/models"
	"real-time-log-analyzer/backend/internal/processor"
	"real-time-log-analyzer/backend/internal/storage"
	"real-time-log-analyzer/backend/pkg/config"
)

func main() {
	log.Println("=== Starting Server ===")

	cfg := config.LoadConfig()
	log.Printf("✓ Config loaded (DB: %s@%s:%s/%s)\n", cfg.DBUser, cfg.DBHost, cfg.DBPort, cfg.DBName)

	store, err := storage.NewPostgresStore(cfg.GetDSN())
	if err != nil {
		log.Printf("⚠ PostgreSQL connection failed: %v\n", err)
		log.Println("⚠ Falling back to in-memory storage")
		store = nil
	}

	var storeInterface storage.Store
	if store != nil {
		storeInterface = store
		defer store.Close()
	} else {
		memStore := storage.NewInMemoryStore()
		storeInterface = memStore
		defer memStore.Close()
	}
	log.Println("✓ Storage initialized")

	logQueue := make(chan models.LogEntry, 10000)
	log.Println("✓ Log queue created (buffer: 10000)")

	processor.StartWorkerPool(4, logQueue, storeInterface)

	ingestHandler := ingestion.NewHandler(logQueue)
	apiHandler := api.NewHandler(storeInterface)

	mux := http.NewServeMux()

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		log.Println("[HEALTH] Request received")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	mux.HandleFunc("/api/ingest", withCORS(ingestHandler.Ingest))

	mux.HandleFunc("/api/metrics", withCORS(apiHandler.GetMetrics))
	mux.HandleFunc("/api/metrics/historical", withCORS(apiHandler.GetMetricsHistorical))
	mux.HandleFunc("/api/metrics/realtime", withCORS(apiHandler.GetRealTimeMetrics))
	mux.HandleFunc("/api/metrics/stream", withCORS(apiHandler.StreamMetrics))

	mux.HandleFunc("/api/logs", withCORS(apiHandler.GetLogs))

	mux.HandleFunc("/api/services", withCORS(apiHandler.GetServices))

	addr := "127.0.0.1:8080"
	log.Printf("Binding to %s\n", addr)

	listener, err := net.Listen("tcp", addr)
	if err != nil {
		log.Fatalf("Failed to listen: %v\n", err)
	}
	defer listener.Close()

	log.Printf("✓ Successfully listening on %s\n", addr)

	server := &http.Server{
		Handler:      mux,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	log.Printf("✓ Starting HTTP server\n")

	go func() {
		sigch := make(chan os.Signal, 1)
		signal.Notify(sigch, syscall.SIGINT, syscall.SIGTERM)
		<-sigch

		log.Println("\n✓ Shutdown signal received, closing gracefully...")
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		if err := server.Shutdown(ctx); err != nil {
			log.Printf("Server shutdown error: %v\n", err)
		}

		close(logQueue)
		log.Println("✓ Server closed")
	}()

	err = server.Serve(listener)
	if err != nil && err != http.ErrServerClosed {
		log.Fatalf("Server error: %v\n", err)
	}
}

func withCORS(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Max-Age", "86400")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		handler(w, r)
	}
}
