/**
 * Core entity interface for Analytics summary.
 * Represents aggregated statistical data.
 */
export interface Analytics {
  totalSubjects: number;
  totalTopics: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  streakCount: number;
}

/**
 * Reusable interface for generic chart data points (e.g., pie charts, bar charts).
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

/**
 * Reusable interface for time-series chart data points (e.g., line charts for progress over time).
 */
export interface TimeSeriesDataPoint {
  timestamp: string | Date;
  value: number;
}

/**
 * Generic API response wrapper for Analytics endpoints.
 */
export interface AnalyticsApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type AnalyticsSummaryResponse = AnalyticsApiResponse<Analytics>;
export type ChartDataResponse = AnalyticsApiResponse<ChartDataPoint[]>;
export type TimeSeriesResponse = AnalyticsApiResponse<TimeSeriesDataPoint[]>;
