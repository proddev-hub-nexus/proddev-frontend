export interface User {
  user_id: string; // Changed from 'id' to 'user_id' to match backend
  email: string;
  full_name: string;
  is_verified: boolean;
  created_at: string;
}

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  error?: string;
  errors?: string[];
}

export interface LoginResponse {
  token_id: string;
  access_token: string;
  token_expires_in: Date;
  device: string;
}

export interface ActiveToken {
  token_id: string;
  access_token: string;
  expires_in: Date;
  device: string;
}

export interface RegisterResponse {
  user_id: string;
  created_at: string;
}

export interface Dashboard {
  id: string;
  owner: string;
  created_at: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
}

export interface VerifyEmailResponse extends LoginResponse {
  message: string;
}

export interface ResendVerificationData {
  email: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
}
