export interface LoginRequest {
  userId: string;
  password: string;
  redirect?: string;
}

export interface LoginResponse {
  userId: string;
  roles: string[];
  accountStatus: string;
  redirectTo?: string;
}
