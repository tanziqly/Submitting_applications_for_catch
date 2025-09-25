import type { SignInDto, SignUpDto, AuthResponse } from "./types";

export const mockSignIn = async (dto: SignInDto): Promise<AuthResponse> => {
  console.log("SignIn request", dto);
  await new Promise((res) => setTimeout(res, 1000));
  return {
    token: "mock-token",
    user: {
      id: "1",
      full_name: "ivan",
      role: "Иван",
    },
  };
};

export const mockSignUp = async (dto: SignUpDto): Promise<AuthResponse> => {
  console.log("SignUp request", dto);
  await new Promise((res) => setTimeout(res, 1000));
  return {
    token: "mock-token",
    user: {
      id: "2",
      full_name: dto.full_name,
      role: dto.role,
    },
  };
};
