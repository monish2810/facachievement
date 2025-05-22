import { AuthResponse, LoginCredentials, PasswordChange, User } from "../types";
import api from "./api";

export const loginUser = async (
  credentials: LoginCredentials
): Promise<User> => {
  try {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("token", response.data.token || "real-token");
    return response.data.user;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    // No backend logout endpoint needed, just clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userJson = localStorage.getItem("user");
    if (!userJson) return null;
    const user = JSON.parse(userJson) as User;
    const response = await api.get<User>("/users/me", {
      headers: { "x-teacher-id": user.teacherId },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
};

export const changePassword = async (data: PasswordChange): Promise<void> => {
  try {
    await api.put("/users/me/password", data);
  } catch (error) {
    console.error("Failed to change password:", error);
    throw error;
  }
};
