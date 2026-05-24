import { z } from "zod";

import { createSanitizedStringSchema, validateSchema } from "@/lib/validations";

export const NOTE_TYPE_VALUES = ["txt", "md", "pdf"] as const;

export const NOTE_VALIDATION_LIMITS = {
  titleMin: 2,
  titleMax: 120,
  contentMin: 1,
  pdfFileMaxBytes: 10 * 1024 * 1024,
} as const;

export const PDF_MIME_TYPE = "application/pdf";

export const NoteValidationMessages = {
  titleRequired: "Note title is required.",
  titleMin: `Note title must be at least ${NOTE_VALIDATION_LIMITS.titleMin} characters.`,
  titleMax: `Note title must be at most ${NOTE_VALIDATION_LIMITS.titleMax} characters.`,
  noteTypeRequired: "Note type is required.",
  noteTypeInvalid: "Note type must be one of: txt, md, pdf.",
  subjectIdRequired: "Subject is required.",
  topicIdRequired: "Topic is required.",
  contentRequired: "Note content is required.",
  contentMin: `Note content must be at least ${NOTE_VALIDATION_LIMITS.contentMin} character.`,
  fileRequired: "PDF file is required.",
  fileInvalid: "Please provide a valid file.",
  fileTooLarge: `PDF file must be at most ${Math.floor(
    NOTE_VALIDATION_LIMITS.pdfFileMaxBytes / (1024 * 1024),
  )} MB.`,
  fileInvalidType: "Only PDF files are allowed.",
} as const;

const sanitizeOptionalFileString = (value: unknown): unknown => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
};

const isPdfFile = (value: unknown): value is File =>
  typeof File !== "undefined" && value instanceof File;

export const noteTitleSchema = createSanitizedStringSchema(
  NoteValidationMessages.titleRequired,
).pipe(
  z
    .string()
    .min(NOTE_VALIDATION_LIMITS.titleMin, {
      message: NoteValidationMessages.titleMin,
    })
    .max(NOTE_VALIDATION_LIMITS.titleMax, {
      message: NoteValidationMessages.titleMax,
    }),
);

export const noteTypeSchema = createSanitizedStringSchema(
  NoteValidationMessages.noteTypeRequired,
).pipe(
  z.enum(NOTE_TYPE_VALUES, {
    error: NoteValidationMessages.noteTypeInvalid,
  }),
);

export const noteSubjectIdSchema = z.preprocess(
  sanitizeOptionalFileString,
  z.string({ error: NoteValidationMessages.subjectIdRequired }).min(1, {
    message: NoteValidationMessages.subjectIdRequired,
  }),
);

export const noteTopicIdSchema = z.preprocess(
  sanitizeOptionalFileString,
  z.string({ error: NoteValidationMessages.topicIdRequired }).min(1, {
    message: NoteValidationMessages.topicIdRequired,
  }),
);

export const noteContentSchema = createSanitizedStringSchema(
  NoteValidationMessages.contentRequired,
).pipe(
  z.string().min(NOTE_VALIDATION_LIMITS.contentMin, {
    message: NoteValidationMessages.contentMin,
  }),
);

export const notePdfFileSchema = z
  .custom<File>(isPdfFile, {
    message: NoteValidationMessages.fileInvalid,
  })
  .refine((file) => file.size > 0, {
    message: NoteValidationMessages.fileRequired,
  })
  .refine((file) => file.size <= NOTE_VALIDATION_LIMITS.pdfFileMaxBytes, {
    message: NoteValidationMessages.fileTooLarge,
  })
  .refine((file) => file.type === PDF_MIME_TYPE, {
    message: NoteValidationMessages.fileInvalidType,
  });

export const noteBaseSchema = z
  .object({
    title: noteTitleSchema,
    noteType: noteTypeSchema,
    subjectId: noteSubjectIdSchema,
    topicId: noteTopicIdSchema,
  })
  .strict();

export const noteTxtStorageSchema = noteBaseSchema
  .extend({
    noteType: z.literal("txt"),
    content: noteContentSchema,
  })
  .strict();

export const noteMdStorageSchema = noteBaseSchema
  .extend({
    noteType: z.literal("md"),
    content: noteContentSchema,
  })
  .strict();

export const notePdfStorageSchema = noteBaseSchema
  .extend({
    noteType: z.literal("pdf"),
    file: notePdfFileSchema,
  })
  .strict();

export const noteStorageSchema = z.union([
  noteTxtStorageSchema,
  noteMdStorageSchema,
  notePdfStorageSchema,
]);

export type NoteType = (typeof NOTE_TYPE_VALUES)[number];
export type NoteBaseInput = z.infer<typeof noteBaseSchema>;
export type NoteTxtStorageInput = z.infer<typeof noteTxtStorageSchema>;
export type NoteMdStorageInput = z.infer<typeof noteMdStorageSchema>;
export type NotePdfStorageInput = z.infer<typeof notePdfStorageSchema>;
export type NoteStorageInput = z.infer<typeof noteStorageSchema>;

export const validateNoteBase = async (payload: unknown) =>
  await validateSchema(noteBaseSchema, payload);

export const validateNoteTxtStorage = async (payload: unknown) =>
  await validateSchema(noteTxtStorageSchema, payload);

export const validateNoteMdStorage = async (payload: unknown) =>
  await validateSchema(noteMdStorageSchema, payload);

export const validateNotePdfStorage = async (payload: unknown) =>
  await validateSchema(notePdfStorageSchema, payload);

export const validateNoteStorage = async (payload: unknown) =>
  await validateSchema(noteStorageSchema, payload);
