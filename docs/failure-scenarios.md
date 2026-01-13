# Failure Scenarios & System Behavior

## Ingestion Service Down
- Log shipper retries with exponential backoff
- Logs are buffered at shipper side
- No data loss if buffer exists

## Processor Crash
- Workers restart automatically
- Unprocessed logs remain in queue
- Processing resumes from last state

## Postgres Down
- System continues updating Redis
- Aggregates are buffered in memory
- Retry mechanism flushes once DB is back

## Redis Down
- Skip real-time counters
- Continue durable writes to Postgres
- Dashboard shows degraded mode

## Traffic Spike (10x)
- Queue absorbs burst
- Backpressure applied
- Debug-level logs dropped first

## One Bad Tenant Flooding Logs
- Rate limiting per tenant
- Quotas enforced
- Isolation prevents impact on others

## Partial Network Failure
- Timeouts trigger retries
- Circuit breakers open
- System degrades gracefully
