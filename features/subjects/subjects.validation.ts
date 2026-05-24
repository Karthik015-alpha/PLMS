import { z } from "zod";

import { createSanitizedStringSchema, validateSchema } from "@/lib/validations";

export const SUBJECT_VALIDATION_LIMITS = {
  titleMin: 2,
  titleMax: 120,
  descriptionMax: 1000,
} as const;

export const SubjectValidationMessages = {
  titleRequired: "Subject title is required.",
  titleMin: `Subject title must be at least ${SUBJECT_VALIDATION_LIMITS.titleMin} characters.`,
  titleMax: `Subject title must be at most ${SUBJECT_VALIDATION_LIMITS.titleMax} characters.`,
  descriptionMax: `Description must be at most ${SUBJECT_VALIDATION_LIMITS.descriptionMax} characters.`,
} as const;

const sanitizeOptionalString = (value: unknown): unknown => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
};

export const subjectTitleSchema = createSanitizedStringSchema(
  SubjectValidationMessages.titleRequired,
).pipe(
  z
    .string()
    .min(SUBJECT_VALIDATION_LIMITS.titleMin, {
      message: SubjectValidationMessages.titleMin,
    })
    .max(SUBJECT_VALIDATION_LIMITS.titleMax, {
      message: SubjectValidationMessages.titleMax,
    }),
);

export const subjectDescriptionSchema = z.preprocess(
  sanitizeOptionalString,
  z
    .string()
    .max(SUBJECT_VALIDATION_LIMITS.descriptionMax, {
      message: SubjectValidationMessages.descriptionMax,
    })
    .optional(),
);

export const subjectBaseSchema = z.object({
  title: subjectTitleSchema,
  description: subjectDescriptionSchema,
});

export const subjectCreateSchema = subjectBaseSchema;

export const subjectUpdateSchema = subjectBaseSchema;

export type SubjectBaseInput = z.infer<typeof subjectBaseSchema>;
export type SubjectCreateInput = z.infer<typeof subjectCreateSchema>;
export type SubjectUpdateInput = z.infer<typeof subjectUpdateSchema>;

export const validateSubjectBase = async (payload: unknown) =>
  await validateSchema(subjectBaseSchema, payload);

export const validateSubjectCreate = async (payload: unknown) =>
  await validateSchema(subjectCreateSchema, payload);

export const validateSubjectUpdate = async (payload: unknown) =>
  await validateSchema(subjectUpdateSchema, payload);
