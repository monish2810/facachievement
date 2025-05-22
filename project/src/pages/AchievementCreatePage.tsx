import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AchievementForm from "../components/AchievementForm";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { createAchievement } from "../services/achievementService";
import { AchievementFormData } from "../types";

const AchievementCreatePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: AchievementFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createAchievement(data);
      navigate("/achievements");
    } catch (err: any) {
      setError(err.message || "Failed to submit achievement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Add New Achievement
      </h1>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      <AchievementForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        teacherId={user.teacherId}
      />
    </DashboardLayout>
  );
};

export default AchievementCreatePage;
