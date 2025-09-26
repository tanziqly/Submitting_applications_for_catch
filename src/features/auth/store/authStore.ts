import { makeAutoObservable, runInAction } from "mobx";
import { saveToken, removeToken, getToken } from "../api/authHelpers";
import type { User, SignInDto, AuthResponse } from "../api/types";

// === Store ===
class AuthStore {
  user: User | null = null;
  token: string | null = null;
  loading = false;
  error: string | null = null;
  isAuthChecked = false;

  constructor() {
    makeAutoObservable(this);
    this.initializeAuth();
  }

  async initializeAuth() {
    const token = getToken();
    if (token) {
      runInAction(() => {
        this.token = token;
      });
      await this.loadUserProfile();
    }
    this.isAuthChecked = true;
  }

  async loadUserProfile() {
    if (!this.token) return;

    try {
      const { api } = await import("@shared/api/axios");
      const response = await api.get<User>("/auth/profile/");
      runInAction(() => {
        this.user = response.data;
      });
    } catch (error) {
      this.logout();
    }
  }

  async signIn(dto: SignInDto) {
    this.loading = true;
    this.error = null;
    try {
      const { api } = await import("@shared/api/axios");
      const { data } = await api.post<AuthResponse>("/auth/sign-in/", dto);

      runInAction(() => {
        this.user = data.user;
        this.token = data.token;
        saveToken(data.token);
        this.isAuthChecked = true;
      });

      await this.loadUserProfile();
      return true;
    } catch (e: any) {
      runInAction(() => {
        this.error = "Ошибка входа";
      });
      return false;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  logout() {
    this.user = null;
    this.token = null;
    this.isAuthChecked = true;
    removeToken();
  }

  get isAuthenticated() {
    return !!this.token;
  }

  get userDisplayName() {
    return this.user?.full_name || this.user?.login || "";
  }

  get userInitials() {
    if (!this.user?.full_name) return "";
    return this.user.full_name
      .split(" ")
      .map((part) => part[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2);
  }
}

export const authStore = new AuthStore();