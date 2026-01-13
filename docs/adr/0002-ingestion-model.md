# ADR 0002: Ingestion Model

## Context
Logs may arrive in bursts and at high volume.

## Decision
Use asynchronous ingestion with internal queue and worker pool.

## Consequences
- Better resilience to spikes
- Added complexity in concurrency management
