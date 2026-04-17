import { Log, ILog } from "../models/Log.js";

export interface LogFilters {
  method?: string;
  url?: string;
  statusCode?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface Metrics {
  totalRequests: number;
  avgResponseTime: number;
  errorRate: number;
  requestsPerMinute: number;
}

export const createLog = async (data: {
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
}): Promise<ILog> => {
  const log = new Log(data);
  return await log.save();
};

export const getLogs = async (
  filters: LogFilters = {},
  pagination: PaginationOptions = {},
): Promise<{ logs: ILog[]; total: number }> => {
  const { page = 1, limit = 50 } = pagination;
  const skip = (page - 1) * limit;

  const query: {
    method?: string;
    url?: RegExp;
    statusCode?: number;
    timestamp?: { $gte?: Date; $lte?: Date };
  } = {};

  if (filters.method) query.method = filters.method;
  if (filters.url) query.url = new RegExp(filters.url, "i");
  if (filters.statusCode) query.statusCode = filters.statusCode;
  if (filters.startDate || filters.endDate) {
    query.timestamp = {};
    if (filters.startDate) query.timestamp.$gte = filters.startDate;
    if (filters.endDate) query.timestamp.$lte = filters.endDate;
  }

  const logs = await Log.find(query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Log.countDocuments(query);

  return { logs, total };
};

export const getMetrics = async (): Promise<Metrics> => {
  const [totalResult, avgResult, errorResult, rpmResult] = await Promise.all([
    Log.countDocuments(),
    Log.aggregate([{ $group: { _id: null, avg: { $avg: "$responseTime" } } }]),
    Log.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          errors: { $sum: { $cond: [{ $gte: ["$statusCode", 400] }, 1, 0] } },
        },
      },
      {
        $project: {
          errorRate: { $multiply: [{ $divide: ["$errors", "$total"] }, 100] },
        },
      },
    ]),
    Log.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d %H:%M", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 1 },
      { $project: { requestsPerMinute: "$count" } },
    ]),
  ]);

  const totalRequests = totalResult;
  const avgResponseTime = avgResult[0]?.avg || 0;
  const errorRate = errorResult[0]?.errorRate || 0;
  const requestsPerMinute = rpmResult[0]?.requestsPerMinute || 0;

  return {
    totalRequests,
    avgResponseTime,
    errorRate,
    requestsPerMinute,
  };
};

export const getErrors = async (
  pagination: PaginationOptions = {},
): Promise<{ errors: ILog[]; total: number }> => {
  const { page = 1, limit = 50 } = pagination;
  const skip = (page - 1) * limit;

  const errors = await Log.find({ statusCode: { $gte: 400 } })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Log.countDocuments({ statusCode: { $gte: 400 } });

  return { errors, total };
};
