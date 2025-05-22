import { Award, Check, Clock, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";
import { getAllAchievements } from "../services/achievementService";
import { Achievement } from "../types";

const POLL_INTERVAL = 10000; // 10 seconds

const TeacherDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (user) {
      let isMounted = true;
      let intervalId: NodeJS.Timeout;

      const fetchAchievements = async () => {
        const allAchievements = await getAllAchievements();
        const userAchievements = allAchievements.filter(
          (achievement) => achievement.teacher === user.teacherId // changed from user._id
        );
        if (isMounted) setAchievements(userAchievements);
      };

      fetchAchievements();
      intervalId = setInterval(fetchAchievements, POLL_INTERVAL);

      return () => {
        isMounted = false;
        clearInterval(intervalId);
      };
    }
  }, [user]);

  const countByStatus = {
    total: achievements.length,
    approved: achievements.filter((a) => a.status === "Approved").length,
    pending: achievements.filter((a) => a.status === "Under Review").length,
    rejected: achievements.filter((a) => a.status === "Rejected").length,
  };

  const recentAchievements = achievements
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )
    .slice(0, 3);

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/achievements/new">
            <Button variant="primary">Add New Achievement</Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-primary-50 border-l-4 border-primary-500">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-primary-100 mr-4">
              <Award className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary-600">
                Total Achievements
              </p>
              <p className="text-2xl font-bold text-primary-700">
                {countByStatus.total}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-green-50 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-green-100 mr-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-600">Approved</p>
              <p className="text-2xl font-bold text-green-700">
                {countByStatus.approved}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-yellow-50 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-yellow-100 mr-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-600">
                Under Review
              </p>
              <p className="text-2xl font-bold text-yellow-700">
                {countByStatus.pending}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-red-50 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-red-100 mr-4">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-600">Rejected</p>
              <p className="text-2xl font-bold text-red-700">
                {countByStatus.rejected}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card title="Recent Achievements">
        {recentAchievements.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {recentAchievements.map((achievement) => (
              <div key={achievement._id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {achievement.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {achievement.description}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Submitted on{" "}
                      {new Date(achievement.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        achievement.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : achievement.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {achievement.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">No achievements submitted yet.</p>
          </div>
        )}
      </Card>

      {/* <AchievementForm onSubmit={...} isSubmitting={...} teacherId={user?.teacherId} /> */}
    </DashboardLayout>
  );
};

export default TeacherDashboardPage;
