package processor

import (
	"log"

	"real-time-log-analyzer/internal/models"
)

func StartWorkerPool(workerCount int, queue <-chan models.LogEntry) {
	for i := 0; i < workerCount; i++ {
		go worker(i, queue)
	}
}

func worker(id int, queue <-chan models.LogEntry) {
	log.Printf("Worker %d started\n", id)
	for logEntry := range queue {
		process(logEntry)
	}
}

func process(logEntry models.LogEntry) {
	// placeholder for aggregation / storage
	log.Printf(
		"[LOG] service=%s level=%s endpoint=%s status=%d latency=%dms",
		logEntry.Service,
		logEntry.Level,
		logEntry.Endpoint,
		logEntry.Status,
		logEntry.LatencyMs,
	)
}
