"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LayoutShell } from "@repo/ui/layout-shell";
import { MetricCard } from "../../components/metric-card";
import { LoadingSpinner } from "../../components/loading-spinner";
import { ErrorMessage } from "../../components/error-message";
import {
  getMetrics,
  getLogs,
  getErrors,
  Metrics,
  LogsResponse,
  ErrorsResponse,
} from "../../lib/api";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [logs, setLogs] = useState<LogsResponse | null>(null);
  const [errors, setErrors] = useState<ErrorsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [metricsData, logsData, errorsData] = await Promise.all([
          getMetrics(),
          getLogs(1, 20),
          getErrors(1, 20),
        ]);

        setMetrics(metricsData);
        setLogs(logsData);
        setErrors(errorsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <LayoutShell title="API Monitoring Overview">
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      </LayoutShell>
    );
  }

  if (error) {
    return (
      <LayoutShell title="API Monitoring Overview">
        <ErrorMessage message={error} />
      </LayoutShell>
    );
  }

  // Mock data for the chart - in a real app, you'd fetch historical data
  const chartData = [
    { time: "00:00", requests: metrics?.requestsPerMinute || 0 },
    {
      time: "00:01",
      requests: Math.floor((metrics?.requestsPerMinute || 0) * 0.8),
    },
    {
      time: "00:02",
      requests: Math.floor((metrics?.requestsPerMinute || 0) * 1.2),
    },
    { time: "00:03", requests: metrics?.requestsPerMinute || 0 },
    {
      time: "00:04",
      requests: Math.floor((metrics?.requestsPerMinute || 0) * 0.9),
    },
  ];

  return (
    <LayoutShell title="API Monitoring Overview">
      <div className="space-y-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <MetricCard
            title="Total Requests"
            value={metrics?.totalRequests.toLocaleString() || "0"}
            description="All time requests"
          />
          <MetricCard
            title="Avg Response Time"
            value={`${metrics?.avgResponseTime.toFixed(2) || "0"}ms`}
            description="Average response time"
          />
          <MetricCard
            title="Error Rate"
            value={`${metrics?.errorRate.toFixed(2) || "0"}%`}
            description="Percentage of errors"
          />
        </div>

        {/* Requests Chart */}
        <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Requests per Minute
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "6px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="requests"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Logs Table */}
        <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Recent Logs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="pb-2 text-left text-slate-400">Method</th>
                  <th className="pb-2 text-left text-slate-400">URL</th>
                  <th className="pb-2 text-left text-slate-400">Status</th>
                  <th className="pb-2 text-left text-slate-400">
                    Response Time
                  </th>
                  <th className="pb-2 text-left text-slate-400">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs?.logs.map((log) => (
                  <tr key={log._id} className="border-b border-slate-800">
                    <td className="py-2">
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          log.method === "GET"
                            ? "bg-blue-900 text-blue-300"
                            : log.method === "POST"
                              ? "bg-green-900 text-green-300"
                              : log.method === "PUT"
                                ? "bg-yellow-900 text-yellow-300"
                                : log.method === "DELETE"
                                  ? "bg-red-900 text-red-300"
                                  : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        {log.method}
                      </span>
                    </td>
                    <td className="py-2 text-slate-300">{log.url}</td>
                    <td className="py-2">
                      <span
                        className={`${
                          log.statusCode >= 400
                            ? "text-red-400"
                            : log.statusCode >= 300
                              ? "text-yellow-400"
                              : "text-green-400"
                        }`}
                      >
                        {log.statusCode}
                      </span>
                    </td>
                    <td className="py-2 text-slate-300">
                      {log.responseTime}ms
                    </td>
                    <td className="py-2 text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Errors Table */}
        <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Recent Errors
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="pb-2 text-left text-slate-400">Method</th>
                  <th className="pb-2 text-left text-slate-400">URL</th>
                  <th className="pb-2 text-left text-slate-400">Status</th>
                  <th className="pb-2 text-left text-slate-400">
                    Response Time
                  </th>
                  <th className="pb-2 text-left text-slate-400">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {errors?.errors.map((error) => (
                  <tr
                    key={error._id}
                    className="border-b border-slate-800 bg-red-900/10"
                  >
                    <td className="py-2">
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          error.method === "GET"
                            ? "bg-blue-900 text-blue-300"
                            : error.method === "POST"
                              ? "bg-green-900 text-green-300"
                              : error.method === "PUT"
                                ? "bg-yellow-900 text-yellow-300"
                                : error.method === "DELETE"
                                  ? "bg-red-900 text-red-300"
                                  : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        {error.method}
                      </span>
                    </td>
                    <td className="py-2 text-red-300">{error.url}</td>
                    <td className="py-2 text-red-400 font-medium">
                      {error.statusCode}
                    </td>
                    <td className="py-2 text-red-300">
                      {error.responseTime}ms
                    </td>
                    <td className="py-2 text-red-400">
                      {new Date(error.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LayoutShell>
  );
}
