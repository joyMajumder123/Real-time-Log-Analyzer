


# 🚀 Real-Time Web Log Analyzer

A high-performance, low-latency log ingestion and analytics pipeline designed to process massive volumes of web logs with **<2s end-to-end latency**.

## 📌 Overview

Modern distributed systems generate logs faster than traditional batch-processing systems can handle. This project provides a scalable architecture to ingest, normalize, and visualize logs in real-time, allowing teams to debug issues and monitor performance as it happens.

### Key Highlights

* **Low Latency:** Logs are visible on the dashboard in near real-time.
* **Highly Scalable:** Horizontal scaling across Ingestion, Processing, and API layers.
* **Resilient:** Built-in backpressure handling and failure isolation.
* **Hybrid Storage:** Redis for high-speed "hot" metrics; PostgreSQL for durable "cold" historical data.

---

## 🏗️ Architecture

The system follows a decoupled, asynchronous flow to ensure that ingestion is never blocked by downstream processing.

### 1. Ingestion Layer (Go)

* Receives structured logs via **gRPC/HTTP**.
* Performs schema validation and normalization.
* Offloads data to an internal message queue immediately to maintain high throughput.

### 2. Stream Processing (Worker Pool)

* Decoupled workers consume from the queue.
* Implements sliding window aggregations (e.g., 1-minute error rates).
* Updates real-time counters.

### 3. Dual-Storage Strategy

* **Redis:** Powers the "Hot Path." Stores real-time counters and rolling metrics for instant dashboard updates.
* **PostgreSQL:** Powers the "Cold Path." Stores aggregated metrics and raw logs for historical analysis and trend reporting.

### 4. Presentation Layer

* **API (Go):** High-concurrency endpoints for querying metrics.
* **Dashboard (Next.js + TS):** Real-time data visualization using WebSockets/Polling and optimized charting libraries.

---

## 🛠️ Tech Stack

| Component | Technology |
| --- | --- |
| **Backend** | Go (Golang) |
| **Frontend** | Next.js, TypeScript, Tailwind CSS |
| **Real-time Store** | Redis |
| **Durable Store** | PostgreSQL |
| **Communication** | gRPC / REST |
| **Infrastructure** | Docker, Kubernetes (Scalable replicas) |

---

## 🚀 Getting Started

### Prerequisites

* Go 1.21+
* Node.js 18+
* Docker & Docker Compose

### Setup & Installation

1. **Clone the repository**
```bash
git clone https://github.com/joyMajumder123/Real-time-Log-Analyzer
cd log-analyzer

```


2. **Start Infrastructure (Redis & Postgres)**
```bash
docker-compose up -d

```


3. **Run the Ingestion Service**
```bash
cd services/ingestion
go run main.go

```


4. **Launch the Dashboard**
```bash
cd frontend
npm install
npm run dev

```



---

## 📈 Scaling & Resilience

* **Horizontal Scaling:** Each service is stateless. Use Kubernetes HPA to scale workers based on queue depth.
* **Backpressure:** The Ingestion API implements rate-limiting and buffer management to prevent cascading failures during traffic spikes.
* **Fault Tolerance:** If a worker fails, the internal queue ensures no data loss; another worker will pick up the task.

---

## 🛡️ Security

* **Auth:** JWT-based authentication for API and Ingestion endpoints.
* **Validation:** Strict input sanitization to prevent injection attacks via log payloads.
* **Isolation:** Multi-tenant data isolation at the storage level.

---

## 🗺️ Roadmap

* [ ] ML-based anomaly detection.
* [ ] Full-text search integration.
* [ ] Exporting metrics to Prometheus/Grafana.
* [ ] Distributed tracing support.

---

