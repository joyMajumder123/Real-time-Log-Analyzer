package processor

import (
	"log"

	"real-time-log-analyzer/backend/internal/models"
	"real-time-log-analyzer/backend/internal/storage"
)

func StartWorkerPool(workerCount int, queue <-chan models.LogEntry, store storage.Store) {
	for i := 0; i < workerCount; i++ {
		go worker(i, queue, store)
	}
	log.Printf("[PROCESSOR] Started %d workers\n", workerCount)
}

func worker(id int, queue <-chan models.LogEntry, store storage.Store) {
	log.Printf("[WORKER %d] Started\n", id)
	for logEntry := range queue {
		process(logEntry, store)
	}
	log.Printf("[WORKER %d] Stopped\n", id)
}

func process(logEntry models.LogEntry, store storage.Store) {
	if err := store.AddLog(logEntry); err != nil {
		log.Printf("[PROCESSOR] Error storing log: %v\n", err)
		return
	}

	log.Printf(
		"[PROCESSOR] Processed: service=%s level=%s endpoint=%s status=%d latency=%dms",
		logEntry.Service,
		logEntry.Level,
		logEntry.Endpoint,
		logEntry.Status,
		logEntry.LatencyMs,
	)
}
