# Low Level Design (LLD)

## Data Models

### LogEntry
- timestamp
- level
- service
- endpoint
- status
- latency
- ip
- trace_id

## Goroutine Model
- Ingestion handler pushes to channel
- Fixed worker pool consumes channel
- Each worker processes and aggregates logs

## Package Structure
- ingestion/ → HTTP handlers
- processor/ → worker logic
- storage/ → DB + Redis logic
- api/ → REST endpoints
- models/ → structs

## Database Tables
- request_metrics
- error_logs
- latency_metrics

## Indexing Strategy
- Index on timestamp
- Composite index on service + endpoint
