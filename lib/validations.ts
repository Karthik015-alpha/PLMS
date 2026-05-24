import { z } from "zod";

export const VALIDATION_LIMITS = {
  emailMax: 254,
  passwordMin: 8,
  passwordMax: 72,
  fullNameMin: 2,
  fullNameMax: 100,
} as const;

export const ValidationMessages = {
  emailRequired: "Email is required.",
  emailInvalid: "Enter a valid email address.",
  emailMax: `Email must be at most ${VALIDATION_LIMITS.emailMax} characters.`,
  passwordRequired: "Password is required.",
  passwordMin: `Password must be at least ${VALIDATION_LIMITS.passwordMin} characters.`,
  passwordMax: `Password must be at most ${VALIDATION_LIMITS.passwordMax} characters.`,
  passwordUppercase: "Password must include at least one uppercase letter.",
  passwordLowercase: "Password must include at least one lowercase letter.",
  passwordNumber: "Password must include at least one number.",
  passwordSpecial: "Password must include at least one special character.",
  confirmPasswordRequired: "Please confirm your password.",
  passwordMismatch: "Passwords do not match.",
  fullNameRequired: "Full name is required.",
  fullNameMin: `Full name must be at least ${VALIDATION_LIMITS.fullNameMin} characters.`,
  fullNameMax: `Full name must be at most ${VALIDATION_LIMITS.fullNameMax} characters.`,
  fullNameInvalid:
    "Full name can only include letters, spaces, hyphens, and apostrophes.",
} as const;

type Sanitizer = (value: unknown) => unknown;

const sanitizeString: Sanitizer = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
};

const sanitizeEmail: Sanitizer = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }

  return trimmed.toLowerCase();
};

const sanitizeFullName: Sanitizer = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed.length === 0 ? undefined : trimmed;
};

const FULL_NAME_PATTERN = /^[\p{L}][\p{L}'-]*(?:\s+[\p{L}][\p{L}'-]*)*$/u;

export const createSanitizedStringSchema = (
  message: string,
  sanitizer: Sanitizer = sanitizeString,
) =>
  z.preprocess(
    sanitizer,
    z.string({ error: message }),
  );

export const createStrictObjectSchema = <TShape extends z.ZodRawShape>(
  shape: TShape,
) => z.object(shape).strict();

export const emailSchema = createSanitizedStringSchema(
  ValidationMessages.emailRequired,
  sanitizeEmail,
).pipe(
  z
    .string()
    .max(VALIDATION_LIMITS.emailMax, { message: ValidationMessages.emailMax })
    .email({ message: ValidationMessages.emailInvalid }),
);

export const passwordSchema = createSanitizedStringSchema(
  ValidationMessages.passwordRequired,
).pipe(
  z
    .string()
    .min(VALIDATION_LIMITS.passwordMin, {
      message: ValidationMessages.passwordMin,
    })
    .max(VALIDATION_LIMITS.passwordMax, {
      message: ValidationMessages.passwordMax,
    })
    .regex(/[a-z]/, { message: ValidationMessages.passwordLowercase })
    .regex(/[A-Z]/, { message: ValidationMessages.passwordUppercase })
    .regex(/[0-9]/, { message: ValidationMessages.passwordNumber })
    .regex(/[^A-Za-z0-9]/, { message: ValidationMessages.passwordSpecial }),
);

export const confirmPasswordSchema = createSanitizedStringSchema(
  ValidationMessages.confirmPasswordRequired,
);

export const fullNameSchema = createSanitizedStringSchema(
  ValidationMessages.fullNameRequired,
  sanitizeFullName,
).pipe(
  z
    .string()
    .min(VALIDATION_LIMITS.fullNameMin, {
      message: ValidationMessages.fullNameMin,
    })
    .max(VALIDATION_LIMITS.fullNameMax, {
      message: ValidationMessages.fullNameMax,
    })
    .regex(FULL_NAME_PATTERN, { message: ValidationMessages.fullNameInvalid }),
);

type MatchFieldsOptions<T> = {
  field: keyof T;
  matchField: keyof T;
  message: string;
};

export const matchFields = <TSchema extends z.ZodObject<z.ZodRawShape>>(
  schema: TSchema,
  options: MatchFieldsOptions<z.infer<TSchema>>,
) =>
  schema.superRefine((data, ctx) => {
    const fieldValue = data[options.field];
    const matchValue = data[options.matchField];

    if (fieldValue === undefined || matchValue === undefined) {
      return;
    }

    if (fieldValue !== matchValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [options.matchField as string],
        message: options.message,
      });
    }
  });

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> };

export const formatZodErrors = (error: z.ZodError): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const path = issue.path.length > 0 ? issue.path.join(".") : "form";
    if (!fieldErrors[path]) {
      fieldErrors[path] = issue.message;
    }
  }

  return fieldErrors;
};

export const validateSchema = async <T>(
  schema: z.ZodType<T>,
  payload: unknown,
): Promise<ValidationResult<T>> => {
  const result = await schema.safeParseAsync(payload);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: formatZodErrors(result.error) };
};
