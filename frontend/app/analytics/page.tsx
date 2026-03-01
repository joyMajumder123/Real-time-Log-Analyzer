"use client";

import React, { useMemo } from "react";
import { CalendarClock, LineChart } from "lucide-react";
import { useHistoricalMetrics } from "@/hooks/useMetrics";
import { LatencyChart, ErrorRateChart } from "@/components/Charts";
import { Badge } from "@/components/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";
import { Button } from "@/components/Button";
import { LoadingSpinner } from "@/components/States";

// historical data view - see past performance trends
export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState<"1h" | "24h" | "7d">("24h");
  const [selectedService, setSelectedService] = React.useState("api-server");

  const from = useMemo(() => {
    const now = new Date();
    switch (timeRange) {
      case "1h":
        return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      case "24h":
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case "7d":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    }
  }, [timeRange]);

  const to = new Date().toISOString();

  const { isLoading } = useHistoricalMetrics(
    selectedService,
    from,
    to,
    true
  );

  const chartData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      latency: Math.random() * 150 + 50,
      errorRate: Math.random() * 15,
    }));
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 p-6">
      <div className="surface flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h1 className="headline">Historical analytics</h1>
          <p className="subtle-text mt-1">Correlate trends, failure windows, and performance shape over time.</p>
        </div>
        <Badge variant="info">
          <LineChart className="mr-1 h-3 w-3" />
          trend mode
        </Badge>
      </div>

      <Card variant="elevated">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Service
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option>api-server</option>
                <option>auth-service</option>
                <option>payment-api</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Time Range
              </label>
              <div className="flex gap-2">
                {(["1h", "24h", "7d"] as const).map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>

            <div className="sm:ml-auto">
              <label className="mb-2 block text-sm font-medium">Window</label>
              <div className="flex h-9 items-center gap-2 rounded-md border border-border/70 bg-background px-3 text-xs text-muted-foreground">
                <CalendarClock className="h-3.5 w-3.5" />
                {timeRange} rolling
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LatencyChart data={chartData} title="Latency Trends" />
        <ErrorRateChart data={chartData} title="Error Rate Trends" />
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-md border border-border/60 bg-background/50 p-4">
              <p className="text-xs text-muted-foreground">Min Latency</p>
              <p className="text-2xl font-bold">45 ms</p>
            </div>
            <div className="rounded-md border border-border/60 bg-background/50 p-4">
              <p className="text-xs text-muted-foreground">Max Latency</p>
              <p className="text-2xl font-bold">2.5 s</p>
            </div>
            <div className="rounded-md border border-border/60 bg-background/50 p-4">
              <p className="text-xs text-muted-foreground">Median Latency</p>
              <p className="text-2xl font-bold">245 ms</p>
            </div>
            <div className="rounded-md border border-border/60 bg-background/50 p-4">
              <p className="text-xs text-muted-foreground">Uptime</p>
              <p className="text-2xl font-bold">99.9%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
