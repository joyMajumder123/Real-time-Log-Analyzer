"use client";

import { useMemo } from "react";
import { Activity, Cpu, ShieldAlert, Sparkles } from "lucide-react";
import { useMetrics, useServices } from "@/hooks/useMetrics";
import {
  MetricsGrid,
  RealtimeIndicator,
} from "@/components/MetricCard";
import {
  LatencyChart,
  ErrorRateChart,
  StatusCodeDistribution,
  RequestsPerSecondChart,
} from "@/components/Charts";
import { LoadingSpinner, ErrorState } from "@/components/States";
import { Badge } from "@/components/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";

// main dashboard - shows metrics, charts, and service list
export default function DashboardPage() {
  // fetch data from the backend
  const { data: metrics, isLoading, error } = useMetrics();
  const { data: services } = useServices();

  const topMetrics = useMemo(() => {
    if (!metrics) return [];

    return [
      {
        title: "Events Processed",
        value: metrics.total_logs.toLocaleString(),
        unit: "logs",
        description: "Across all services",
        icon: <Activity className="h-5 w-5 text-sky-300" />,
      },
      {
        title: "Error Signals",
        value: metrics.error_count,
        unit: "alerts",
        trend: 12,
        description: "Last 24 hours",
        icon: <ShieldAlert className="h-5 w-5 text-amber-300" />,
        variant: metrics.error_count > 0 ? ("error" as const) : ("success" as const),
      },
      {
        title: "Average Latency",
        value: Math.round(metrics.avg_latency_ms),
        unit: "ms",
        trend: -5,
        description: "Real-time response",
        icon: <Cpu className="h-5 w-5 text-violet-300" />,
      },
      {
        title: "Active Services",
        value: services?.length || 0,
        description: "Connected streams",
        icon: <Sparkles className="h-5 w-5 text-indigo-300" />,
      },
    ];
  }, [metrics, services]);

  // sample data for charts (will be replaced with real data later)
  const chartData = useMemo(() => {
    const timePoints = Array.from({ length: 20 }, (_, i) => ({
      time: `${i}m ago`,
      latency: Math.random() * 100 + 50,
      errorRate: Math.random() * 10,
      rps: Math.random() * 1000 + 500,
    }));

    return timePoints;
  }, []);

  const statusData = useMemo(
    () => [
      { name: "2xx", count: 8500 },
      { name: "3xx", count: 1200 },
      { name: "4xx", count: 420 },
      { name: "5xx", count: 180 },
    ],
    []
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState title="Failed to load metrics" />;

  return (
    <div className="space-y-6 p-6">
      <div className="surface p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="info">Realtime Control Plane</Badge>
            <h1 className="headline">Operational overview</h1>
            <p className="subtle-text max-w-2xl">
              Monitor high-volume traffic, error patterns, and latency dynamics with a sleek,
              production-focused command center.
            </p>
          </div>
          <RealtimeIndicator isConnected={true} lastUpdate={new Date()} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Core telemetry</h2>
          <p className="subtle-text mt-1">
            Critical KPIs updated every few seconds
          </p>
        </div>
      </div>

      <MetricsGrid metrics={topMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LatencyChart data={chartData} title="Latency waveform" />
        <ErrorRateChart data={chartData} title="Error pressure" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusCodeDistribution data={statusData} title="Status distribution" />
        <RequestsPerSecondChart data={chartData} title="Request throughput" />
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Service activity rail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services?.slice(0, 5).map((service) => (
              <div
                key={service}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-background/50 p-4"
              >
                <div>
                  <p className="font-medium">{service}</p>
                  <p className="subtle-text">Actively ingesting stream</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-muted-foreground">↔ 125ms</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
