export interface SignInDto {
  login: string;
  password: string;
}

export interface SignUpDto {
  full_name: string;
  login: string;
  password: string;
  role_id: string;
  ter_otdel_id: string;
}

export type User = {
  id: string;
  full_name: string;
  login: string;
  role: string;
  role_name: string;
};

export interface AuthResponse {
  message: string;
  status: string;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
  user: User;
}
