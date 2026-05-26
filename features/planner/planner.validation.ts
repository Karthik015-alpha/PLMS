import { z } from "zod";

// ==================================================
// REUSABLE FIELD SCHEMAS
// ==================================================

export const taskTitleSchema = z
  .string()
  .trim()
  .min(1, "Task title cannot be empty")
  .min(3, "Task title must be at least 3 characters long")
  .max(100, "Task title must not exceed 100 characters");

export const taskDescriptionSchema = z
  .string()
  .trim()
  .max(500, "Description must not exceed 500 characters")
  .optional();

export const taskDueDateSchema = z
  .union([
    z.string().datetime({ message: "Due date must be a valid ISO 8601 date string" }),
    z.date()
  ])
  .optional();

export const taskCompletionStatusSchema = z
  .boolean();

export const taskStatusSchema = z.enum(["Pending", "Completed"]);

export const studyGoalTitleSchema = z
  .string()
  .trim()
  .min(3, "Study goal must be at least 3 characters long")
  .max(200, "Study goal must not exceed 200 characters");

// ==================================================
// FEATURE SCHEMAS
// ==================================================

// Schema for creating daily tasks
export const createTaskSchema = z.object({
  title: taskTitleSchema,
  description: taskDescriptionSchema,
  dueDate: taskDueDateSchema,
  subjectId: z.string().uuid().optional(),
  isCompleted: taskCompletionStatusSchema.optional().default(false),
  status: taskStatusSchema.optional().default("Pending"),
});

// Schema for editing tasks
export const updateTaskSchema = z.object({
  title: taskTitleSchema.optional(),
  description: taskDescriptionSchema,
  dueDate: taskDueDateSchema,
  subjectId: z.string().uuid().optional(),
  isCompleted: taskCompletionStatusSchema.optional(),
  status: taskStatusSchema.optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided to update",
});

// Schema for marking tasks completed
export const markTaskCompletedSchema = z.object({
  isCompleted: z.literal(true).optional(),
  status: z.literal("Completed").optional(),
}).refine((data) => data.isCompleted !== undefined || data.status !== undefined, {
  message: "Must provide either isCompleted flag or status to mark as completed",
});

// Schema for tracking pending tasks (filtering)
export const trackPendingTasksSchema = z.object({
  status: z.literal("Pending").optional().default("Pending"),
});

// Schema for setting study goals
export const setStudyGoalSchema = z.object({
  goal: studyGoalTitleSchema,
  targetDate: taskDueDateSchema,
  isCompleted: taskCompletionStatusSchema.optional().default(false),
});

// ==================================================
// TYPES
// ==================================================

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type MarkTaskCompletedInput = z.infer<typeof markTaskCompletedSchema>;
export type TrackPendingTasksInput = z.infer<typeof trackPendingTasksSchema>;
export type SetStudyGoalInput = z.infer<typeof setStudyGoalSchema>;
