import { User, UserFormData } from "../types";
import api from "./api";
import { getMockUsers } from "./mockDb"; // Removed updateMockUserRole

export const getUserProfile = async (): Promise<User> => {
  try {
    const userJson = localStorage.getItem("user");
    if (!userJson) throw new Error("No user in localStorage");
    const user = JSON.parse(userJson) as User;
    const response = await api.get<User>("/users/me", {
      headers: { "x-teacher-id": user.teacherId },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  userData: Partial<User>
): Promise<User> => {
  try {
    const userJson = localStorage.getItem("user");
    if (!userJson) throw new Error("No user in localStorage");
    const user = JSON.parse(userJson) as User;
    const response = await api.put<User>("/users/me", userData, {
      headers: { "x-teacher-id": user.teacherId },
    });
    // Update localStorage with new user data
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>("/users");
    return response.data;
  } catch (error) {
    console.error("Failed to get all users:", error);
    throw error;
  }
};

export const createUser = async (userData: UserFormData): Promise<User> => {
  // Ensure role is set to "teacher" by default if not provided
  const dataToSend = { ...userData, role: "teacher" };
  const response = await api.post<User>("/users", dataToSend);
  return response.data;
};

export const updateUserRole = async (
  userId: string,
  role: string
): Promise<User> => {
  // If making admin, backend will handle demoting HODs
  const response = await api.put<User>(`/users/${userId}/role`, { role });
  return response.data;
};

// Mock implementation for demo
export { getMockUsers }; // Removed updateMockUserRole
