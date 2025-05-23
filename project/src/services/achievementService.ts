import { Achievement, AchievementFormData, ReviewData } from "../types";
import api from "./api";

// Get achievements for the current user
export const getUserAchievements = async (): Promise<Achievement[]> => {
  const userJson = localStorage.getItem("user");
  if (!userJson) throw new Error("Not authenticated");
  const user = JSON.parse(userJson);
  const response = await fetch(`${API_URL}/user`, {
    credentials: "include", // if using cookies/session
    headers: {
      "Content-Type": "application/json",
      // Add API key if required:
      // "x-api-key": process.env.REACT_APP_API_KEY,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch achievements");
  }
  return response.json();
};

// Get all achievements (admin/HOD)
export const getAllAchievements = async (): Promise<Achievement[]> => {
  const { data } = await api.get<Achievement[]>("/achievements"); // Removed extra /api
  return data;
};

// Create a new achievement (with Google Drive link)
export const createAchievement = async (
  achievementData: AchievementFormData
): Promise<Achievement> => {
  try {
    const { data } = await api.post<Achievement>(
      "/achievements",
      achievementData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return data;
  } catch (error) {
    console.error("Failed to create achievement:", error);
    throw error;
  }
};

// Get pending achievements (for HOD/admin)
export const getPendingAchievements = async (): Promise<Achievement[]> => {
  const { data } = await api.get<Achievement[]>("/achievements/pending"); // Removed extra /api
  return data;
};

// Review (approve/reject) an achievement
export const reviewAchievement = async (
  achievementId: string,
  reviewData: ReviewData
): Promise<Achievement> => {
  const userJson = localStorage.getItem("user");
  if (!userJson) throw new Error("Not authenticated");
  const user = JSON.parse(userJson);

  const { data } = await api.put<Achievement>(
    `/achievements/${achievementId}/review`, // Removed extra /api
    {
      status: reviewData.status,
      reviewedBy: user.teacherId,
    }
  );
  return data;
};

// Get achievements for a specific teacher
export const getTeacherAchievements = async (
  teacherId: string
): Promise<Achievement[]> => {
  const { data } = await api.get<Achievement[]>(
    `/achievements/teacher/${teacherId}` // Removed extra /api
  );
  return data;
};

// Get only approved achievements for public view
export const getPublicTeacherAchievements = async (
  teacherId: string
): Promise<Achievement[]> => {
  const { data } = await api.get<Achievement[]>(
    `/achievements/teacher/${teacherId}`
  );
  return data.filter((a) => a.status === "Approved");
};

// Optionally, implement getAchievementStats if you have a stats endpoint

export const getMockAchievements = (): Achievement[] => {
  return [
    {
      id: "1",
      title: "Achievement 1",
      description: "Description for achievement 1",
      academicYear: "2023-2024",
      certificateYear: 2023,
      teacherId: "teacher1",
      status: "Approved",
      createdAt: "2023-10-01T12:00:00Z",
      updatedAt: "2023-10-01T12:00:00Z",
    },
    {
      id: "2",
      title: "Achievement 2",
      description: "Description for achievement 2",
      academicYear: "2023-2024",
      certificateYear: 2023,
      teacherId: "teacher2",
      status: "Pending",
      createdAt: "2023-10-02T12:00:00Z",
      updatedAt: "2023-10-02T12:00:00Z",
    },
    // Add more mock achievements as needed
  ];
};
