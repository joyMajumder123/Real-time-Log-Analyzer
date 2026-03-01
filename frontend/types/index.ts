export interface LogEntry {
  id: string;
  service: string;
  level: "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL";
  endpoint: string;
  status: number;
  latency_ms: number;
  timestamp: string;
  message?: string;
}

export interface ServiceMetrics {
  service: string;
  total_logs: number;
  error_count: number;
  error_rate: number;
  avg_latency_ms: number;
  p95_latency_ms: number;
  p99_latency_ms: number;
  status_codes: Record<string, number>;
  endpoints: EndpointMetrics[];
  updated_at: string;
}

export interface EndpointMetrics {
  endpoint: string;
  method: string;
  request_count: number;
  error_count: number;
  avg_latency_ms: number;
  p95_latency_ms: number;
}

export interface RealTimeMetrics {
  timestamp: string;
  services: ServiceMetrics[];
  total_logs_per_second: number;
  active_services: number;
}

export interface FilterOptions {
  services: string[];
  levels: LogEntry["level"][];
  statusCodes: number[];
  endDate: Date;
  startDate: Date;
  searchQuery: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
