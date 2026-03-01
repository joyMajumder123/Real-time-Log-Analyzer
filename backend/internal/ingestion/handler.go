package ingestion

import (
	"encoding/json"
	"log"
	"net/http"

	"real-time-log-analyzer/backend/internal/models"
)

type Handler struct {
	LogQueue chan<- models.LogEntry
}

func NewHandler(queue chan<- models.LogEntry) *Handler {
	return &Handler{LogQueue: queue}
}

func (h *Handler) Ingest(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		log.Printf("[INGEST] Method not allowed: %s\n", r.Method)
		return
	}

	if r.Body == nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Println("[INGEST] Request body is empty")
		return
	}

	defer r.Body.Close()

	var logEntry models.LogEntry
	if err := json.NewDecoder(r.Body).Decode(&logEntry); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Printf("[INGEST] Failed to decode: %v\n", err)
		return
	}

	if logEntry.Service == "" || logEntry.Level == "" {
		w.WriteHeader(http.StatusBadRequest)
		log.Println("[INGEST] Missing required fields")
		return
	}

	log.Printf("[INGEST] Received log: service=%s level=%s endpoint=%s\n", logEntry.Service, logEntry.Level, logEntry.Endpoint)

	select {
	case h.LogQueue <- logEntry:
		w.WriteHeader(http.StatusAccepted)
		log.Printf("[INGEST] Log queued successfully\n")
	default:
		log.Println("[INGEST] Queue full, rejecting request")
		w.WriteHeader(http.StatusTooManyRequests)
	}
}
