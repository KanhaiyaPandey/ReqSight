import axios from "axios";

const API_BASE_URL = "http://localhost:5001";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface Metrics {
  totalRequests: number;
  avgResponseTime: number;
  errorRate: number;
  requestsPerMinute: number;
}

export interface LogEntry {
  _id: string;
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
}

export interface LogsResponse {
  logs: LogEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ErrorsResponse {
  errors: LogEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const getMetrics = async (): Promise<Metrics> => {
  const response = await api.get<Metrics>("/log/metrics");
  return response.data;
};

export const getLogs = async (page = 1, limit = 50): Promise<LogsResponse> => {
  const response = await api.get<LogsResponse>(
    `/log/logs?page=${page}&limit=${limit}`,
  );
  return response.data;
};

export const getErrors = async (
  page = 1,
  limit = 50,
): Promise<ErrorsResponse> => {
  const response = await api.get<ErrorsResponse>(
    `/log/errors?page=${page}&limit=${limit}`,
  );
  return response.data;
};
