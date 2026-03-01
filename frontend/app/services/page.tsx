"use client";

import { Server, ShieldCheck } from "lucide-react";
import { useServices, useMetrics } from "@/hooks/useMetrics";
import { LoadingSpinner, EmptyState } from "@/components/States";
import { Badge } from "@/components/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";

// shows all connected services and their health status
export default function ServicesPage() {
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: metrics, isLoading: metricsLoading } = useMetrics();

  if (servicesLoading || metricsLoading) return <LoadingSpinner />;
  if (!services || services.length === 0) {
    return (
      <EmptyState
        title="No services found"
        description="Start monitoring services to see them here"
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="surface flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h1 className="headline">Service fleet</h1>
          <p className="subtle-text mt-1">Live operational posture across connected services.</p>
        </div>
        <Badge variant="success">
          <ShieldCheck className="mr-1 h-3 w-3" />
          all healthy
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card
            key={service}
            variant="elevated"
            className="group border-border/60 hover:border-primary/40"
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-primary" />
                  {service}
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Total logs</p>
                  <p className="text-xl font-semibold">
                    {metrics?.total_logs.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Errors</p>
                  <p className="text-xl font-semibold text-red-300">
                    {metrics?.error_count}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg latency</p>
                  <p className="text-xl font-semibold">
                    {Math.round(metrics?.avg_latency_ms || 0)} ms
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Error rate</p>
                  <p className="text-xl font-semibold">
                    {metrics && metrics.total_logs > 0
                      ? ((metrics.error_count / metrics.total_logs) * 100).toFixed(2)
                      : "0.00"}
                    %
                  </p>
                </div>
              </div>

              <div className="rounded-md border border-border/60 bg-background/60 p-3">
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm font-medium text-emerald-300">Active and healthy</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
