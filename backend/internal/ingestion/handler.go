package ingestion

import (
	"encoding/json"
	"net/http"

	"real-time-log-analyzer/internal/models"
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
		return
	}

	var logEntry models.LogEntry
	if err := json.NewDecoder(r.Body).Decode(&logEntry); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// minimal validation
	if logEntry.Service == "" || logEntry.Level == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// enqueue (backpressure point)
	select {
	case h.LogQueue <- logEntry:
		w.WriteHeader(http.StatusAccepted)
	default:
		// queue full
		w.WriteHeader(http.StatusTooManyRequests)
	}
}
