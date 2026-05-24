export type AppUser = {
  id: string
  email?: string | null
  fullName?: string | null
}
export type AuthProvider =
  | "credentials"
  | "google"
  | "github"
  | "microsoft"
  | "apple"
  | (string & {});

export type AuthRole = "student" | "educator" | "admin" | (string & {});

export type AuthPermission = string & {};

export type AuthStatus = "authenticated" | "unauthenticated" | "loading";

export type AuthSessionStatus = "active" | "expired" | "revoked";

export type AuthTokenType = "Bearer" | (string & {});

export type IsoDateString = string;

export type AuthMetadataValue = string | number | boolean | null;

export type AuthMetadata = Record<string, AuthMetadataValue>;

export interface AuthUserProfile {
  fullName: string;
  displayName?: string;
  avatarUrl?: string | null;
  locale?: string;
  timezone?: string;
  metadata?: AuthMetadata;
}

export interface AuthUserIdentity {
  provider: AuthProvider;
  providerUserId?: string;
}

export interface AuthUser<TRole extends string = AuthRole>
  extends AuthUserProfile,
    AuthUserIdentity {
  id: string;
  email: string;
  roles: readonly TRole[];
  isEmailVerified: boolean;
  createdAt: IsoDateString;
  updatedAt?: IsoDateString;
  lastLoginAt?: IsoDateString;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  tokenType: AuthTokenType;
  expiresIn: number;
  expiresAt: IsoDateString;
}

export interface AuthSession<TUser extends AuthUser = AuthUser> {
  sessionId: string;
  user: TUser;
  tokens: AuthTokens;
  status: AuthSessionStatus;
  issuedAt: IsoDateString;
  expiresAt: IsoDateString;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuthState<TUser extends AuthUser = AuthUser> {
  status: AuthStatus;
  user: TUser | null;
  session: AuthSession<TUser> | null;
}

export interface AuthEmailCredentials {
  email: string;
}

export interface AuthPasswordCredentials {
  password: string;
}

export interface AuthLoginCredentials
  extends AuthEmailCredentials,
    AuthPasswordCredentials {}

export interface AuthRegisterPayload extends AuthLoginCredentials {
  fullName: string;
}

export interface AuthResetPasswordPayload extends AuthPasswordCredentials {}

export interface AuthForgotPasswordPayload extends AuthEmailCredentials {}

export type AuthErrorCode =
  | "invalid-credentials"
  | "user-not-found"
  | "account-locked"
  | "email-not-verified"
  | "token-expired"
  | "invalid-token"
  | "password-reset-required"
  | (string & {});

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  field?: string;
  details?: AuthMetadata;
}

export interface AuthSuccessResponse<TData> {
  success: true;
  data: TData;
  message?: string;
}

export interface AuthFailureResponse {
  success: false;
  error: AuthError;
}

export type AuthResponse<TData> = AuthSuccessResponse<TData> | AuthFailureResponse;
