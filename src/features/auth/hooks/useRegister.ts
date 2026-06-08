import { useState } from "react";
import { api } from "@shared/api/axios";
import type { SignUpDto } from "@features/auth/api/types";

const DEFAULT_ROLE_ID = "e57ef349-176a-4b06-9116-fb12c0e21f58";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const register = async (data: {
    full_name: string;
    login: string;
    password: string;
    ter_otdel_id: string;
  }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload: SignUpDto = {
        full_name: data.full_name,
        login: data.login,
        password: data.password,
        role_id: DEFAULT_ROLE_ID,
        ter_otdel_id: data.ter_otdel_id,
      };

      await api.post("/auth/register", payload);
      setSuccess(true);
      return true;
    } catch (e: any) {
      const msg =
        e.response?.data?.message || e.message || "Ошибка регистрации";
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, success, setError };
};
