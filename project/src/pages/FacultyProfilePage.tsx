import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const users = await getAllUsers();
      const foundUser = users.find((u) => u.teacherId === teacherId);
      if (isMounted) setUser(foundUser || null);

      if (teacherId) {
        const achs = await getTeacherAchievements(teacherId);
        if (isMounted) setAchievements(achs);
      }
      setLoading(false);
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
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Achievements ({achievements.length})
          </h3>
          {achievements.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No achievements found for this faculty member.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {achievements.map((a) => (
                <li key={a._id} className="py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{a.title}</span>
                    <span className="text-sm text-gray-600">
                      {a.description}
                    </span>
                    <span className="text-xs text-gray-500">
                      Academic Year: {a.academicYear} | Certificate Year:{" "}
                      {a.certificateYear} | Status: {a.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FacultyProfilePage;
