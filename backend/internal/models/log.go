type LogEntry struct {
	Timestamp time.Time
	Level     string
	Service   string
	Endpoint  string
	Status    int
	LatencyMs int
	IP        string
	TraceID   string
	TenatID   string
}