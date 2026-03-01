import { useQuery } from "@tanstack/react-query";
import { apiClient, queryKeys } from "@/lib/api";
import type { ServiceMetrics, LogEntry, RealTimeMetrics } from "@/types";

// hooks to get data from backend, auto-refreshes every few seconds
export function useMetrics(
  service?: string,
  window: string = "5m",
  enabled: boolean = true
) {
  return useQuery<ServiceMetrics>({
    queryKey: queryKeys.metricsByService(service || "all"),
    queryFn: () => apiClient.getMetrics(service, window),
    enabled,
    refetchInterval: 5000, // 5 seconds
    staleTime: 2000,
  });
}

export function useHistoricalMetrics(
  service: string,
  from: string,
  to: string,
  enabled: boolean = true
) {
  return useQuery<ServiceMetrics>({
    queryKey: [...queryKeys.metricsByService(service), { from, to }],
    queryFn: () => apiClient.getMetricsHistorical(service, from, to),
    enabled,
    staleTime: 60000, // 1 minute
  });
}

export function useLogs(
  service?: string,
  level?: string,
  limit: number = 100,
  enabled: boolean = true
) {
  return useQuery<{ logs: LogEntry[]; total: number }>({
    queryKey: queryKeys.logsList({ service, level, limit }),
    queryFn: () => apiClient.getLogs(service, level, limit),
    enabled,
    refetchInterval: 3000, // 3 seconds
    staleTime: 1000,
  });
}

export function useServices(enabled: boolean = true) {
  return useQuery<string[]>({
    queryKey: queryKeys.services(),
    queryFn: () => apiClient.getServices(),
    enabled,
    staleTime: 60000, // 1 minute
  });
}

export function useRealTimeMetrics(enabled: boolean = true) {
  return useQuery<RealTimeMetrics>({
    queryKey: queryKeys.realtime(),
    queryFn: () => apiClient.getRealTimeMetrics(),
    enabled,
    refetchInterval: 5000, // 5 seconds
    staleTime: 1000,
  });
}
