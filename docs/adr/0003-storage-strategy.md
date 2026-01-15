# ADR 0003: Storage Strategy

## Context
Need fast real-time metrics and durable analytics storage.

## Decision
Use Redis for real-time counters and PostgreSQL for long-term storage.

## Consequences
- Higher operational complexity
- Better performance and scalability
