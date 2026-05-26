import client from "./client";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  is_admin?: boolean;
  is_active?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await client.post("/auth/login", { email, password });
    return data;
  },

  async adminLogin(email: string, password: string): Promise<AuthResponse> {
    const { data } = await client.post("/auth/admin-login", { email, password });
    return data;
  },

  async register(payload: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
  }): Promise<AuthResponse> {
    const { data } = await client.post("/auth/register", payload);
    return data;
  },

  async logout(): Promise<void> {
    await client.post("/auth/logout");
  },

  async logoutAll(): Promise<void> {
    await client.post("/auth/logout-all");
  },

  async getUser(): Promise<User> {
    const { data } = await client.get("/auth/user");
    return data;
  },

  async updateUser(payload: Partial<User>): Promise<User> {
    const { data } = await client.put("/auth/user", payload);
    return data.user ?? data;
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await client.put("/auth/password", {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirmation: newPassword,
    });
  },

  async forgotPassword(email: string): Promise<{ code: string | number }> {
    const { data } = await client.post("/auth/forgot-password", { email });
    return data;
  },

  async resetPassword(
    email: string,
    code: string,
    password: string
  ): Promise<void> {
    await client.post("/auth/reset-password", {
      email,
      code,
      password,
      password_confirmation: password,
    });
  },
};
