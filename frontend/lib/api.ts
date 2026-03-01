import type { ServiceMetrics, LogEntry, RealTimeMetrics } from "@/types";

// backend url - change this if running on different port
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// all the api calls to talk to the backend
export const apiClient = {
  async getMetrics(
    service?: string,
    window: string = "5m"
  ): Promise<ServiceMetrics> {
    const params = new URLSearchParams();
    if (service) params.append("service", service);
    params.append("window", window);

    const response = await fetch(
      `${API_BASE_URL}/api/metrics?${params.toString()}`
    );
    if (!response.ok) throw new Error("Failed to fetch metrics");
    return response.json();
  },

  async getMetricsHistorical(
    service: string,
    from: string,
    to: string
  ): Promise<ServiceMetrics> {
    const params = new URLSearchParams({
      service,
      from,
      to,
    });

    const response = await fetch(
      `${API_BASE_URL}/api/metrics/historical?${params.toString()}`
    );
    if (!response.ok) throw new Error("Failed to fetch historical metrics");
    return response.json();
  },

  async getLogs(
    service?: string,
    level?: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<{ logs: LogEntry[]; total: number }> {
    const params = new URLSearchParams();
    if (service) params.append("service", service);
    if (level) params.append("level", level);
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());

    const response = await fetch(
      `${API_BASE_URL}/api/logs?${params.toString()}`
    );
    if (!response.ok) throw new Error("Failed to fetch logs");
    return response.json();
  },

  async getServices(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/api/services`);
    if (!response.ok) throw new Error("Failed to fetch services");
    return response.json();
  },

  async getRealTimeMetrics(): Promise<RealTimeMetrics> {
    const response = await fetch(`${API_BASE_URL}/api/metrics/realtime`);
    if (!response.ok) throw new Error("Failed to fetch real-time metrics");
    return response.json();
  },

  subscribeToMetricsStream(
    onData: (data: RealTimeMetrics) => void,
    onError?: (error: Error) => void
  ) {
    const eventSource = new EventSource(
      `${API_BASE_URL}/api/metrics/stream`
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onData(data);
      } catch (error) {
        onError?.(error instanceof Error ? error : new Error("Parse error"));
      }
    };

    eventSource.onerror = () => {
      onError?.(new Error("Stream connection lost"));
      eventSource.close();
    };

    return () => eventSource.close();
  },
};

// keys for caching api responses
export const queryKeys = {
  all: ["logs"] as const,
  metrics: () => [...queryKeys.all, "metrics"] as const,
  metricsByService: (service: string) =>
    [...queryKeys.metrics(), { service }] as const,
  logs: () => [...queryKeys.all, "logs"] as const,
  logsList: (filters: Record<string, any>) =>
    [...queryKeys.logs(), filters] as const,
  services: () => ["services"] as const,
  realtime: () => ["realtime"] as const,
};
