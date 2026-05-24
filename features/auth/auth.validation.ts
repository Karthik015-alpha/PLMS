import { z } from 'zod'

export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Must be a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm password is required'),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({ path: ['confirmPassword'], code: z.ZodIssueCode.custom, message: 'Passwords do not match' })
    }
  })

export const loginSchema = z.object({
  email: z.string().email('Must be a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type RegisterSchema = typeof registerSchema
export type LoginSchema = typeof loginSchema


import {
  ValidationMessages,
  confirmPasswordSchema,
  emailSchema,
  createStrictObjectSchema,
  fullNameSchema,
  matchFields,
  passwordSchema,
  validateSchema,
} from "@/lib/validations";

export const authLoginSchema = createStrictObjectSchema({
  email: emailSchema,
  password: passwordSchema,
});

export type AuthLoginInput = z.infer<typeof authLoginSchema>;

export const authRegisterSchema = matchFields(
  createStrictObjectSchema({
    fullName: fullNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  }),
  {
    field: "password",
    matchField: "confirmPassword",
    message: ValidationMessages.passwordMismatch,
  },
);

export type AuthRegisterInput = z.infer<typeof authRegisterSchema>;

export const authForgotPasswordSchema = createStrictObjectSchema({
  email: emailSchema,
});

export type AuthForgotPasswordInput = z.infer<typeof authForgotPasswordSchema>;

export const authResetPasswordSchema = matchFields(
  createStrictObjectSchema({
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  }),
  {
    field: "password",
    matchField: "confirmPassword",
    message: ValidationMessages.passwordMismatch,
  },
);

export type AuthResetPasswordInput = z.infer<typeof authResetPasswordSchema>;

export const validateAuthLogin = async (payload: unknown) =>
  await validateSchema(authLoginSchema, payload);

export const validateAuthRegister = async (payload: unknown) =>
  await validateSchema(authRegisterSchema, payload);

export const validateAuthForgotPassword = async (payload: unknown) =>
  await validateSchema(authForgotPasswordSchema, payload);

export const validateAuthResetPassword = async (payload: unknown) =>
  await validateSchema(authResetPasswordSchema, payload);
