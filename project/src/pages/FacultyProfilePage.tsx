import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AchievementCard from "../components/AchievementCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";
import { getTeacherAchievements } from "../services/achievementService";
import { getAllUsers } from "../services/userService";
import { Achievement, User } from "../types";

const FacultyProfilePage: React.FC = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setError(null);
        const users = await getAllUsers();
        const foundUser = users.find((u) => u.teacherId === teacherId);
        if (isMounted) setUser(foundUser || null);

        if (teacherId) {
          const achs = await getTeacherAchievements(teacherId);
          if (isMounted) setAchievements(achs);
        }
      } catch (err: any) {
        if (isMounted) setError("Failed to load data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [teacherId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-red-500">{error}</div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Faculty Not Found
          </h2>
          <p className="text-gray-600">No faculty found with ID: {teacherId}</p>
          <Link to="/department" className="text-primary-600 underline">
            Back to Department Overview
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const sortedAchievements = [...achievements].sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="mb-4 md:mb-0 md:mr-6">
              <div className="h-20 w-20 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                <span className="text-3xl font-bold">
                  {user.name.charAt(0)}
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {user.name}
              </h2>
              <p className="text-gray-600 mb-2">{user.designation}</p>
              <p className="text-gray-500 text-sm">
                Faculty ID: {user.teacherId}
              </p>
              <p className="text-gray-500 text-sm">Phone: {user.phone}</p>
              <p className="text-gray-500 text-sm">
                Role: {user.role.toUpperCase()}
              </p>
              <p className="text-gray-700 mt-2 font-medium">
                Number of Achievements: {achievements.length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          {achievements.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No achievements found.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {sortedAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement._id}
                  achievement={achievement}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FacultyProfilePage;
