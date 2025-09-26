import type { SignInDto, AuthResponse } from "./types";

export const mockSignIn = async (dto: SignInDto): Promise<AuthResponse> => {
  console.log("SignIn request", dto);
  await new Promise((res) => setTimeout(res, 1000));
  
  if (dto.login === "admin" && dto.password === "admin") {
    return {
      token: "mock-admin-token",
      user: {
        id: "1",
        full_name: "Администратор Системы",
        role: "admin",
        login: "admin"
      },
    };
  }
  
  if (dto.login === "user" && dto.password === "user") {
    return {
      token: "mock-user-token",
      user: {
        id: "2",
        full_name: "Иван Петров",
        role: "user",
        login: "user"
      },
    };
  }
  
  // Стандартный успешный ответ
  return {
    token: "mock-token",
    user: {
      id: "3",
      full_name: "Тестовый Пользователь",
      role: "user",
      login: dto.login
    },
  };
};