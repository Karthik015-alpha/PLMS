import { z } from "zod";

// ==================================================
// REUSABLE FIELD SCHEMAS
// ==================================================

export const progressValueSchema = z
  .number()
  .min(0, "Progress value cannot be less than 0")
  .max(100, "Progress value cannot be greater than 100");

export const taskIdSchema = z
  .string()
  .uuid({ message: "Task ID must be a valid UUID format" });

export const subjectIdSchema = z
  .string()
  .uuid({ message: "Subject ID must be a valid UUID format" })
  .optional();

export const noteIdSchema = z
  .string()
  .uuid({ message: "Note ID must be a valid UUID format" })
  .optional();

export const isCompletedSchema = z
  .boolean();

// ==================================================
// FEATURE SCHEMAS
// ==================================================

/**
 * Payload for updating progress on a specific task
 */
export const updateProgressSchema = z.object({
  taskId: taskIdSchema,
  value: progressValueSchema,
  subjectId: subjectIdSchema,
  noteId: noteIdSchema,
  isCompleted: isCompletedSchema.optional().default(false),
});

/**
 * Payload explicitly for marking a task as completely finished
 */
export const markTaskCompletedSchema = z.object({
  taskId: taskIdSchema,
  isCompleted: z.literal(true),
});

/**
 * Payload for updating progress at the subject/course level
 */
export const updateSubjectProgressSchema = z.object({
  subjectId: z.string().uuid("Subject ID must be a valid UUID"),
  value: progressValueSchema,
  isCompleted: isCompletedSchema.optional().default(false),
});

// ==================================================
// TYPES
// ==================================================

export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
export type MarkTaskCompletedInput = z.infer<typeof markTaskCompletedSchema>;
export type UpdateSubjectProgressInput = z.infer<typeof updateSubjectProgressSchema>;
