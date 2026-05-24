import { z } from "zod";

// ==================================================
// REUSABLE FIELD SCHEMAS
// ==================================================

export const searchQuerySchema = z
  .string()
  .trim()
  .min(2, "Search query must be at least 2 characters long")
  .max(100, "Search query must not exceed 100 characters");

export const paginationSchema = z.object({
  page: z
    .number()
    .int()
    .min(1, "Page must be at least 1")
    .optional()
    .default(1),
  limit: z
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100 items per page")
    .optional()
    .default(20),
});

// Filters
export const subjectFilterSchema = z
  .array(z.string().uuid("Subject filter must contain valid UUIDs"))
  .optional();

export const topicFilterSchema = z
  .array(z.string().uuid("Topic filter must contain valid UUIDs"))
  .optional();

export const taskStatusFilterSchema = z
  .array(z.string())
  .optional();

export const noteTypeFilterSchema = z
  .array(z.string())
  .optional();

export const searchFiltersSchema = z.object({
  subjects: subjectFilterSchema,
  topics: topicFilterSchema,
  taskStatuses: taskStatusFilterSchema,
  noteTypes: noteTypeFilterSchema,
});

// ==================================================
// FEATURE SCHEMAS
// ==================================================

/**
 * Universal global search payload containing query, filters, and pagination.
 */
export const globalSearchSchema = z.object({
  query: searchQuerySchema,
  filters: searchFiltersSchema.optional(),
  pagination: paginationSchema.optional(),
});

/**
 * Payload explicitly for querying specific subjects
 */
export const subjectSearchSchema = z.object({
  query: searchQuerySchema,
  pagination: paginationSchema.optional(),
});

/**
 * Payload explicitly for querying tasks with strict scoping
 */
export const taskSearchSchema = z.object({
  query: searchQuerySchema,
  filters: z.object({
    subjects: subjectFilterSchema,
    topics: topicFilterSchema,
    statuses: taskStatusFilterSchema,
  }).optional(),
  pagination: paginationSchema.optional(),
});

// ==================================================
// TYPES
// ==================================================

export type SearchPaginationInput = z.infer<typeof paginationSchema>;
export type SearchFiltersInput = z.infer<typeof searchFiltersSchema>;
export type GlobalSearchInput = z.infer<typeof globalSearchSchema>;
export type SubjectSearchInput = z.infer<typeof subjectSearchSchema>;
export type TaskSearchInput = z.infer<typeof taskSearchSchema>;
