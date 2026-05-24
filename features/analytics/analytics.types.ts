import { Analytics, ChartDataPoint, TimeSeriesDataPoint } from '@/types/analytics';

// ==================================================
// FILTER PAYLOAD TYPES
// ==================================================

/**
 * Payload defining filter criteria to be sent to the Analytics API.
 */
export interface AnalyticsFilterPayload {
  startDate?: string;
  endDate?: string;
  subjects?: string[];
  statuses?: string[];
}

// ==================================================
// COMPONENT PROP TYPES
// ==================================================

/**
 * Standard properties for a standard statistical chart (bar, pie, doughnut).
 */
export interface AnalyticsChartProps {
  data: ChartDataPoint[];
  title?: string;
  isLoading?: boolean;
}

/**
 * Standard properties for a time-series line or area chart.
 */
export interface TimeSeriesChartProps {
  data: TimeSeriesDataPoint[];
  title?: string;
  isLoading?: boolean;
}

/**
 * Properties for a component displaying high-level analytic summaries.
 */
export interface AnalyticsSummaryProps {
  analytics: Analytics;
  isLoading?: boolean;
  error?: string | null;
}
