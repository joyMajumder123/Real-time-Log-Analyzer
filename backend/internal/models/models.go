package models

import (
	"time"

	"github.com/google/uuid"
)

type LogEntry struct {
	ID        string `json:"id"`
	Service   string `json:"service"`
	Level     string `json:"level"`
	Endpoint  string `json:"endpoint"`
	Status    int    `json:"status"`
	LatencyMs int64  `json:"latency_ms"`
	Timestamp string `json:"timestamp"`
	Message   string `json:"message,omitempty"`
}

func NewLogEntry(service, level, endpoint string, status int, latencyMs int64, message string) LogEntry {
	return LogEntry{
		ID:        uuid.New().String(),
		Service:   service,
		Level:     level,
		Endpoint:  endpoint,
		Status:    status,
		LatencyMs: latencyMs,
		Timestamp: time.Now().Format(time.RFC3339),
		Message:   message,
	}
}
