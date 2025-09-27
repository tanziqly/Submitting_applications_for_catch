// shared/api/axios.ts
import axios from "axios";
import { API_BASE_URL } from "@shared/config";
import { getAccessToken, isValidToken, removeTokens } from "@features/auth/api/authHelpers";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    
    if (isValidToken(token)) {
      config.headers.Authorization = `Bearer ${token}`; // Изменил на Bearer
      console.log('Добавлен заголовок Authorization');
    } else {
      console.log('Токен невалиден, заголовок не добавлен');
      delete config.headers.Authorization;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
      console.log('Обнаружена 401 ошибка, выполняем logout');
      removeTokens();
      // Можно добавить автоматический logout из store
      // window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  }
);

export { api };