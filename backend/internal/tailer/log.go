package tailer

import (
	"encoding/json"
	"log"
	"strings"

	"real-time-log-analyzer/backend/internal/models"
)

func ParseLog(line string) (models.LogEntry, error) {
	line = strings.TrimSpace(line)

	var logEntry models.LogEntry
	err := json.Unmarshal([]byte(line), &logEntry)
	if err != nil {
		log.Printf("Failed to parse log line: %s, error: %v\n", line, err)
		return models.LogEntry{}, err
	}

	return logEntry, nil
}

func ProcessLine(line string, logQueue chan<- models.LogEntry) {
	if line == "" {
		return
	}

	logEntry, err := ParseLog(line)
	if err != nil {
		return
	}

	select {
	case logQueue <- logEntry:
		log.Printf("[TAILER] Queued log: service=%s\n", logEntry.Service)
	default:
		log.Println("[TAILER] Queue full, dropping log entry")
	}
}
