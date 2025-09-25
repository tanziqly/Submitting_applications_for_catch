export interface SignInDto {
  email: string;
  password: string;
}

export type SignUpDto = {
  full_name: string;
  role: string;
  login: string;
  password: string;
};

export type AuthResponse = {
  user: {
    id: string;
    full_name: string;
    role: string;
  };
  token: string;
};