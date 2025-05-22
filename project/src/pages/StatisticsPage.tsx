import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";
import { getAllAchievements } from "../services/achievementService";
import { getAllUsers } from "../services/userService";
import { Achievement, User } from "../types";

const POLL_INTERVAL = 10000; // 10 seconds

const StatisticsPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout;

    const fetchData = async () => {
      const [usersData, achievementsData] = await Promise.all([
        getAllUsers(),
        getAllAchievements(),
      ]);
      if (isMounted) {
        setUsers(usersData);
        setAchievements(achievementsData);
        setLoading(false);
      }
    };

    fetchData();
    intervalId = setInterval(fetchData, POLL_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  const totalFaculty = users.filter(
    (u) => u.role === "teacher" || u.role === "hod"
  ).length;
  const totalHODs = users.filter((u) => u.role === "hod").length;
  const totalAchievements = achievements.length;
  const approved = achievements.filter((a) => a.status === "Approved").length;
  const pending = achievements.filter(
    (a) => a.status === "Under Review"
  ).length;
  const rejected = achievements.filter((a) => a.status === "Rejected").length;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div>
            <div className="text-sm font-medium text-primary-600">
              Total Faculty
            </div>
            <div className="text-2xl font-bold">{totalFaculty}</div>
          </div>
        </Card>
        <Card>
          <div>
            <div className="text-sm font-medium text-blue-600">HODs</div>
            <div className="text-2xl font-bold">{totalHODs}</div>
          </div>
        </Card>
        <Card>
          <div>
            <div className="text-sm font-medium text-purple-600">
              Achievements
            </div>
            <div className="text-2xl font-bold">{totalAchievements}</div>
          </div>
        </Card>
        <Card>
          <div>
            <div className="text-sm font-medium text-green-600">Approved</div>
            <div className="text-2xl font-bold">{approved}</div>
          </div>
        </Card>
        <Card>
          <div>
            <div className="text-sm font-medium text-yellow-600">Pending</div>
            <div className="text-2xl font-bold">{pending}</div>
          </div>
        </Card>
        <Card>
          <div>
            <div className="text-sm font-medium text-red-600">Rejected</div>
            <div className="text-2xl font-bold">{rejected}</div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StatisticsPage;
