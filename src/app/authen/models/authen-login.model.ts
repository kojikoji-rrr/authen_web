export interface AuthenLoginRequest {
  userId: string;
  password: string;
  redirect?: string | null;
}

export interface AuthenLoginResponse {
  userId: string;
  roles: string[];
  accountStatus: string;
  redirect: string | null;
}
