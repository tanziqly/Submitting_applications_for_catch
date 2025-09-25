import axios from "axios";
import { authStore } from "@features/auth";
import { API_BASE_URL } from "@shared/config";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = authStore.token;
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  console.log("Interceptor добавляет заголовки:", config.headers);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("=== ОШИБКА API ===");
    console.log("URL:", error.config?.url);
    console.log("Метод:", error.config?.method);
    console.log("Статус:", error.response?.status);
    console.log("Данные:", error.response?.data);
    console.log("Заголовки запроса:", error.config?.headers);

    if (error.response?.status === 401) {
      console.log("Ошибка аутентификации 401, но НЕ выходим автоматически");
      // НЕ выходим автоматически, только логируем
      // authStore.logout();
      // window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);
export { api };
