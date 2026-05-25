import { apiClient } from "@/services/api-client.service";
import { setAccessToken } from "@/utils/authStorage";
import { User } from "@/types/user";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export const authApi = {
  async register(payload: RegisterPayload) {
    const response = await apiClient<AuthResponse>("/auth/register", {
      method: "POST",
      body: payload,
      auth: false,
    });
    setAccessToken(response.accessToken);
    return response;
  },

  async login(payload: LoginPayload) {
    const response = await apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: payload,
      auth: false,
    });
    setAccessToken(response.accessToken);
    return response;
  },

  getMe() {
    return apiClient<User>("/auth/me");
  },
};
