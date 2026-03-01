package api

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"real-time-log-analyzer/backend/internal/storage"
)

type Handler struct {
	Store storage.Store
}

func NewHandler(store storage.Store) *Handler {
	return &Handler{Store: store}
}

func (h *Handler) GetMetrics(w http.ResponseWriter, r *http.Request) {
	service := r.URL.Query().Get("service")
	if service == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error":"service parameter required"}`))
		return
	}

	log.Printf("[API] Fetching metrics for service: %s\n", service)

	metrics, err := h.Store.GetMetrics(service)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"failed to fetch metrics"}`))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(metrics)
}

func (h *Handler) GetMetricsHistorical(w http.ResponseWriter, r *http.Request) {
	service := r.URL.Query().Get("service")
	if service == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error":"service parameter required"}`))
		return
	}

	log.Printf("[API] Fetching historical metrics for service: %s\n", service)

	metrics, err := h.Store.GetMetrics(service)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"failed to fetch metrics"}`))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(metrics)
}

func (h *Handler) GetLogs(w http.ResponseWriter, r *http.Request) {
	service := r.URL.Query().Get("service")
	level := r.URL.Query().Get("level")
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")

	limit := 100
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 1000 {
			limit = l
		}
	}

	offset := 0
	if offsetStr != "" {
		if o, err := strconv.Atoi(offsetStr); err == nil && o >= 0 {
			offset = o
		}
	}

	log.Printf("[API] Fetching logs for service=%s level=%s limit=%d offset=%d\n", service, level, limit, offset)

	logs, total, err := h.Store.GetLogs(service, level, limit, offset)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"failed to fetch logs"}`))
		return
	}

	response := map[string]interface{}{
		"logs":  logs,
		"total": total,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *Handler) GetServices(w http.ResponseWriter, r *http.Request) {
	log.Println("[API] Fetching services list")

	services := h.Store.GetServices()
	if services == nil {
		services = []string{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(services)
}

func (h *Handler) GetRealTimeMetrics(w http.ResponseWriter, r *http.Request) {
	log.Println("[API] Fetching real-time metrics")

	metrics := h.Store.GetRealTimeMetrics()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(metrics)
}

func (h *Handler) StreamMetrics(w http.ResponseWriter, r *http.Request) {
	log.Println("[API] Client connected to metrics stream")

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	flusher, ok := w.(http.Flusher)
	if !ok {
		w.WriteHeader(http.StatusInternalServerError)
		log.Println("[API] Streaming not supported")
		return
	}

	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-r.Context().Done():
			log.Println("[API] Client disconnected from metrics stream")
			return
		case <-ticker.C:
			metrics := h.Store.GetRealTimeMetrics()
			data, _ := json.Marshal(metrics)
			w.Write([]byte("data: " + string(data) + "\n\n"))
			flusher.Flush()
		}
	}
}
