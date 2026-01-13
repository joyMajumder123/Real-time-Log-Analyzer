# Design Decisions

## Why Golang for Backend?
- High concurrency model
- Low latency
- Excellent for I/O heavy workloads
- Strong standard library

## Why PostgreSQL?
- Strong consistency guarantees
- Mature ecosystem
- Time-series friendly
- Easy to operate

## Why Redis?
- Sub-millisecond latency
- Ideal for real-time counters
- Reduces load on Postgres

## Why Worker Pool Model?
- Controlled concurrency
- Predictable resource usage
- Easier backpressure handling

## Why Asynchronous Ingestion?
- Prevents blocking on slow storage
- Improves resilience under spikes
- Enables buffering and retries

## Schema-on-Write vs Schema-on-Read
We choose schema-on-write for:
- better performance
- early validation
- predictable structure


