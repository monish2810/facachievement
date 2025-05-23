export type Role = "teacher" | "hod" | "admin" | "student";

export interface User {
  _id: string;
  teacherId: string;
  name: string;
  phone: string;
  designation: string;
  role: Role;
  createdAt: string;
  password?: string; // Added password field (optional)
}

export interface Achievement {
  _id: string;
  teacher: string | User;
  academicYear: string;
  certificateYear: number;
  title: string;
  description: string;
  certificatePdf: string; // Now: Google Drive link (required)
  status: "Under Review" | "Approved" | "Rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string | User;
}

export interface LoginCredentials {
  teacherId: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PasswordChange {
  oldPassword: string;
  newPassword: string;
}

export interface AchievementFormData {
  academicYear: string;
  certificateYear: number;
  title: string;
  description: string;
  certificatePdf: string; // Now: Google Drive link (required)
  teacherId: string;
}

export interface UserFormData {
  teacherId: string;
  name: string;
  phone: string;
  designation: string;
  password?: string;
}

export interface ReviewData {
  status: "Approved" | "Rejected";
  comment?: string;
}
