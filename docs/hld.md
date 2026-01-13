# High Level Design (HLD)

## Components

### Log Shipper
- Reads logs from files/stdout
- Sends structured logs to ingestion API

### Ingestion Service
- HTTP/gRPC server
- Validates logs
- Pushes to internal queue

### Processing Layer
- Worker pool
- Parses logs
- Aggregates metrics

### Storage Layer
- Redis for real-time counters
- Postgres for durable storage

### API Layer
- Exposes metrics and logs endpoints

### Frontend
- Real-time dashboard using Next.js

## Interaction Flow
Log Source → Ingestion API → Queue → Workers → Redis/Postgres → API → Frontend

