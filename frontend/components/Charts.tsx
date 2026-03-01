"use client";

// charts using recharts - for showing latency, errors, status codes etc
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card";

interface MetricsChartProps {
  data: any[];
  title?: string;
  description?: string;
}

export function LatencyChart({
  data,
  title = "Latency Over Time",
}: MetricsChartProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#293246" />
            <XAxis stroke="#93a4bf" />
            <YAxis stroke="#93a4bf" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #30384b",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="latency"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorLatency)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ErrorRateChart({
  data,
  title = "Error Rate Trend",
}: MetricsChartProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#293246" />
            <XAxis stroke="#93a4bf" />
            <YAxis stroke="#93a4bf" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #30384b",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="errorRate"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: "#ef4444", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function StatusCodeDistribution({
  data,
  title = "Status Code Distribution",
}: MetricsChartProps) {
  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #30384b",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function RequestsPerSecondChart({
  data,
  title = "Requests Per Second",
}: MetricsChartProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#293246" />
            <XAxis stroke="#93a4bf" />
            <YAxis stroke="#93a4bf" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #30384b",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="rps" fill="#06b6d4" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
