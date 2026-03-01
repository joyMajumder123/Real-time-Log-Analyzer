"use client";

// cards that show numbers with up/down arrows
import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/Card";
import { cn } from "@/lib/cn";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  description?: string;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "error" | "warning";
}

const variantStyles = {
  default: "border-border bg-card",
  success: "border-green-500/30 bg-green-500/5",
  error: "border-red-500/30 bg-red-500/5",
  warning: "border-yellow-500/30 bg-yellow-500/5",
};

export function MetricCard({
  title,
  value,
  unit,
  trend,
  description,
  icon,
  variant = "default",
}: MetricCardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <Card
      className={cn(
        "border-2 transition-smooth hover:shadow-lg hover:scale-105",
        variantStyles[variant]
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon && <span className="text-2xl">{icon}</span>}
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>

          {trend !== undefined && (
            <div className="flex items-center gap-1">
              {isPositive && (
                <>
                  <ArrowUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">{trend}%</span>
                </>
              )}
              {isNegative && (
                <>
                  <ArrowDown className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">{Math.abs(trend)}%</span>
                </>
              )}
            </div>
          )}

          {description && (
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function MetricsGrid({
  metrics,
}: {
  metrics: MetricCardProps[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => (
        <MetricCard key={idx} {...metric} />
      ))}
    </div>
  );
}

interface RealtimeIndicatorProps {
  isConnected: boolean;
  lastUpdate?: Date;
}

export function RealtimeIndicator({
  isConnected,
  lastUpdate,
}: RealtimeIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "w-2 h-2 rounded-full animate-pulse",
          isConnected ? "bg-green-500" : "bg-red-500"
        )}
      />
      <span className="text-xs text-muted-foreground">
        {isConnected ? "Live" : "Offline"}
      </span>
      {lastUpdate && (
        <span className="text-xs text-muted-foreground">
          • {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
