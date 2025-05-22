import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AchievementCard from "../components/AchievementCard";
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Achievement } from "../types";

const AchievementsPage: React.FC = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAchievements = async () => {
      setError(null);
      try {
        if (user) {
          const res = await api.get<Achievement[]>(
            `/achievements/teacher/${user.teacherId}`
          );
          if (isMounted) setAchievements(res.data);
        }
      } catch (err: any) {
        if (isMounted) setError("Failed to load achievements.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (user) fetchAchievements();
    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Achievements</h1>
        <Link to="/achievements/new">
          <Button variant="primary">Add New Achievement</Button>
        </Link>
      </div>
      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : achievements.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No achievements found.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {achievements
              .sort(
                (a, b) =>
                  new Date(b.submittedAt).getTime() -
                  new Date(a.submittedAt).getTime()
              )
              .map((achievement) => (
                <AchievementCard
                  key={achievement._id}
                  achievement={achievement}
                />
              ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default AchievementsPage;
