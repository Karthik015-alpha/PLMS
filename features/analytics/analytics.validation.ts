import { z } from "zod";

// ==================================================
// REUSABLE FIELD SCHEMAS
// ==================================================

export const dateRangeSchema = z
  .object({
    startDate: z
      .string()
      .datetime({ message: "Start date must be a valid ISO 8601 string" })
      .optional(),
    endDate: z
      .string()
      .datetime({ message: "End date must be a valid ISO 8601 string" })
      .optional(),
  })
  .refine(
    (data) => {
      // Validate that endDate is not before startDate
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: "End date must be after or equal to the start date",
      path: ["endDate"],
    }
  );

export const subjectFilterSchema = z
  .array(z.string().uuid({ message: "Subject filter must contain valid UUIDs" }))
  .optional();

export const statusFilterSchema = z
  .array(z.string())
  .optional();

// ==================================================
// FEATURE SCHEMAS
// ==================================================

/**
 * Payload for generic analytics filters
 */
export const analyticsFilterSchema = z.object({
  dateRange: dateRangeSchema.optional(),
  subjects: subjectFilterSchema,
  statuses: statusFilterSchema,
});

// ==================================================
// TYPES
// ==================================================

export type DateRangeFilterInput = z.infer<typeof dateRangeSchema>;
export type AnalyticsFilterInput = z.infer<typeof analyticsFilterSchema>;
