import { z } from "zod";

import { createSanitizedStringSchema, validateSchema } from "@/lib/validations";

export const TOPIC_STATUS_VALUES = [
  "Not Started",
  "In Progress",
  "Completed",
] as const;

export const TOPIC_VALIDATION_LIMITS = {
  titleMin: 2,
  titleMax: 120,
  estimatedStudyHoursMin: 0,
} as const;

export const TopicValidationMessages = {
  titleRequired: "Topic title is required.",
  titleMin: `Topic title must be at least ${TOPIC_VALIDATION_LIMITS.titleMin} characters.`,
  titleMax: `Topic title must be at most ${TOPIC_VALIDATION_LIMITS.titleMax} characters.`,
  statusRequired: "Topic status is required.",
  statusInvalid: "Topic status must be one of: Not Started, In Progress, Completed.",
  estimatedStudyHoursInvalid: "Estimated study hours must be a valid number.",
  estimatedStudyHoursPositive: "Estimated study hours must be greater than 0.",
} as const;

const sanitizeOptionalPositiveNumber = (value: unknown): unknown => {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return undefined;
    }

    return Number(trimmed);
  }

  return value;
};

export const topicTitleSchema = createSanitizedStringSchema(
  TopicValidationMessages.titleRequired,
).pipe(
  z
    .string()
    .min(TOPIC_VALIDATION_LIMITS.titleMin, {
      message: TopicValidationMessages.titleMin,
    })
    .max(TOPIC_VALIDATION_LIMITS.titleMax, {
      message: TopicValidationMessages.titleMax,
    }),
);

export const topicStatusSchema = createSanitizedStringSchema(
  TopicValidationMessages.statusRequired,
).pipe(
  z.enum(TOPIC_STATUS_VALUES, {
    error: TopicValidationMessages.statusInvalid,
  }),
);

export const topicEstimatedStudyHoursSchema = z.preprocess(
  sanitizeOptionalPositiveNumber,
  z
    .number({ error: TopicValidationMessages.estimatedStudyHoursInvalid })
    .positive({ message: TopicValidationMessages.estimatedStudyHoursPositive })
    .optional(),
);

export const topicBaseSchema = z.object({
  title: topicTitleSchema,
  status: topicStatusSchema,
  estimatedStudyHours: topicEstimatedStudyHoursSchema,
});

export const topicCreateSchema = topicBaseSchema;

export const topicUpdateSchema = topicBaseSchema;

export type TopicStatus = z.infer<typeof topicStatusSchema>;
export type TopicBaseInput = z.infer<typeof topicBaseSchema>;
export type TopicCreateInput = z.infer<typeof topicCreateSchema>;
export type TopicUpdateInput = z.infer<typeof topicUpdateSchema>;

export const validateTopicBase = async (payload: unknown) =>
  await validateSchema(topicBaseSchema, payload);

export const validateTopicCreate = async (payload: unknown) =>
  await validateSchema(topicCreateSchema, payload);

export const validateTopicUpdate = async (payload: unknown) =>
  await validateSchema(topicUpdateSchema, payload);
