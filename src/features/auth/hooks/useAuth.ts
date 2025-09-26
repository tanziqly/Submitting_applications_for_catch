import { useMemo } from "react";
import { authStore } from "../store/authStore";

export const useAuth = () => {
  return useMemo(
    () => ({
      user: authStore.user,
      isAuth: !!authStore.user,
      loading: authStore.loading,
      error: authStore.error,
      signIn: authStore.signIn.bind(authStore),
      logout: authStore.logout.bind(authStore),
    }),
    []
  );
};
