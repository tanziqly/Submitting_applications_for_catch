export interface SignInDto {
  login: string;
  password: string;
};

export type User = {
  id: string;
  full_name: string;
  role: string;
  login: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};