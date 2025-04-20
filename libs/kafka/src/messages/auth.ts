type Request<T> = {
  requestId: string;
  data: T;
};

type Response<T> = {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
};

// Login
export type LoginRequestData = {
  username: string;
  password: string;
};

export type LoginResponseData = {
  accessToken: string;
  refreshToken: string;
  userId: string;
  username: string;
  email?: string;
};

export type LoginRequest = Request<LoginRequestData>;
export type LoginResponse = Response<LoginResponseData>;

// Register
export type RegisterRequestData = {
  username: string;
  password: string;
  email: string;
};

export type RegisterResponseData = {
  userId: string;
  username: string;
  email: string;
};

export type RegisterRequest = Request<RegisterRequestData>;
export type RegisterResponse = Response<RegisterResponseData>;

// RefreshToken
export type RefreshTokenRequestData = {
  refreshToken: string;
};

export type RefreshTokenResponseData = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshTokenRequest = Request<RefreshTokenRequestData>;
export type RefreshTokenResponse = Response<RefreshTokenResponseData>;

// Logout
export type LogoutRequestData = {
  accessToken: string;
};

export type LogoutResponseData = void;

export type LogoutRequest = Request<LogoutRequestData>;
export type LogoutResponse = Response<LogoutResponseData>;

// ValidateToken
export type ValidateTokenRequestData = {
  accessToken: string;
};

export type ValidateTokenResponseData = {
  isValid: boolean;
  userId?: string;
};

export type ValidateTokenRequest = Request<ValidateTokenRequestData>;
export type ValidateTokenResponse = Response<ValidateTokenResponseData>;
