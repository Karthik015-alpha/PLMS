import type { z } from 'zod'
import { registerSchema, loginSchema } from './auth.validation'

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>

export type AuthResult = {
  userId?: string
  error?: string | null
}
import type {
  AuthForgotPasswordPayload,
  AuthLoginCredentials,
  AuthRegisterPayload,
  AuthResetPasswordPayload,
  AuthResponse,
  AuthSession,
  AuthUser,
} from "@/types/auth";
import type {
  AuthForgotPasswordInput,
  AuthLoginInput,
  AuthRegisterInput,
  AuthResetPasswordInput,
} from "./auth.validation";

export type AuthFormMode =
  | "login"
  | "register"
  | "forgot-password"
  | "reset-password";

export type AuthFormStatus = "idle" | "submitting" | "success" | "error";

export interface AuthFormValuesByMode {
  login: AuthLoginInput;
  register: AuthRegisterInput;
  "forgot-password": AuthForgotPasswordInput;
  "reset-password": AuthResetPasswordInput;
}

export type AuthFormValues<TMode extends AuthFormMode> =
  AuthFormValuesByMode[TMode];

export type AuthFormFieldKey<TValues> = Extract<keyof TValues, string> | "form";

export type AuthFormFieldErrors<TValues> = Partial<
  Record<AuthFormFieldKey<TValues>, string>
>;

export type AuthSubmitHandler<TValues, TResponse> = (
  values: TValues,
) => Promise<TResponse> | TResponse;

export interface AuthBaseFormProps<TValues, TResponse> {
  onSubmit: AuthSubmitHandler<TValues, TResponse>;
  initialValues?: Partial<TValues>;
  errors?: AuthFormFieldErrors<TValues>;
  status?: AuthFormStatus;
  disabled?: boolean;
}

export type AuthFormProps<TMode extends AuthFormMode> = AuthBaseFormProps<
  AuthFormValues<TMode>,
  AuthFormResponse<TMode>
> & {
  mode: TMode;
};

export type AuthLoginRequest = AuthLoginCredentials;
export type AuthRegisterRequest = AuthRegisterPayload;
export type AuthForgotPasswordRequest = AuthForgotPasswordPayload;
export type AuthResetPasswordRequest = AuthResetPasswordPayload;

export interface AuthSessionPayload<TUser extends AuthUser = AuthUser> {
  session: AuthSession<TUser>;
  user: TUser;
}

export interface AuthMessagePayload {
  message: string;
}

export type AuthLoginResponse = AuthResponse<AuthSessionPayload>;
export type AuthRegisterResponse = AuthResponse<AuthSessionPayload>;
export type AuthForgotPasswordResponse = AuthResponse<AuthMessagePayload>;
export type AuthResetPasswordResponse = AuthResponse<AuthMessagePayload>;
export type AuthLogoutResponse = AuthResponse<AuthMessagePayload>;
export type AuthRefreshSessionResponse = AuthResponse<AuthSessionPayload>;

export interface AuthFormResponseByMode {
  login: AuthLoginResponse;
  register: AuthRegisterResponse;
  "forgot-password": AuthForgotPasswordResponse;
  "reset-password": AuthResetPasswordResponse;
}

export type AuthFormResponse<TMode extends AuthFormMode> =
  AuthFormResponseByMode[TMode];

export type AuthLoginFormValues = AuthFormValues<"login">;
export type AuthRegisterFormValues = AuthFormValues<"register">;
export type AuthForgotPasswordFormValues = AuthFormValues<"forgot-password">;
export type AuthResetPasswordFormValues = AuthFormValues<"reset-password">;

export type AuthLoginFormProps = AuthFormProps<"login">;
export type AuthRegisterFormProps = AuthFormProps<"register">;
export type AuthForgotPasswordFormProps = AuthFormProps<"forgot-password">;
export type AuthResetPasswordFormProps = AuthFormProps<"reset-password">;
