# Data Flow – Real-Time Web Log Analyzer

## End-to-End Flow

1. Application generates a structured log event
2. Log shipper reads log from file/stdout
3. Log shipper sends log to ingestion API
4. Ingestion service validates and normalizes the log
5. Log is pushed into internal in-memory queue
6. Worker pool consumes log from queue
7. Worker parses log and extracts fields
8. Metrics are updated in Redis (real-time)
9. Aggregated data is batch inserted into Postgres
10. API layer queries Redis/Postgres
11. Frontend fetches data and updates dashboard

---

## Hot Path

Log → Ingestion → Queue → Worker → Redis → API → Frontend

Used for:
- real-time metrics
- live dashboards

---

## Cold Path

Log → Ingestion → Queue → Worker → Postgres → API → Frontend

Used for:
- historical analysis
- long-term trends
- debugging

---

## Why This Separation Matters

Hot path must be:
- fast
- lightweight
- non-blocking

Cold path can be:
- slower
- heavier
- more complex

This prevents analytics queries from impacting ingestion.
