import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Award, Plus, User, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";
import { getAllAchievements } from "../services/achievementService";
import {
  getAllUsers,
  updateUserRole as updateUserRoleService,
} from "../services/userService";
import { Achievement, User as UserType } from "../types";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const POLL_INTERVAL = 10000; // 10 seconds

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time polling for dashboard data
  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        const [usersData, achievementsData] = await Promise.all([
          getAllUsers(),
          getAllAchievements(),
        ]);
        if (isMounted) {
          setUsers(usersData);
          setAchievements(achievementsData);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) setLoading(false);
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
    intervalId = setInterval(fetchData, POLL_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const stats = {
    totalFaculty: users.filter((u) => u.role === "teacher" || u.role === "hod")
      .length,
    totalHODs: users.filter((u) => u.role === "hod").length,
    totalTeachers: users.filter((u) => u.role === "teacher").length,
    totalAchievements: achievements.length,
  };

  // Calculate achievement trends by month (real data)
  const monthLabels = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "short" })
  );
  const achievementCountsByMonth = monthLabels.map(
    (_, i) =>
      achievements.filter((a) => new Date(a.submittedAt).getMonth() === i)
        .length
  );
  const achievementTrends = {
    labels: monthLabels,
    datasets: [
      {
        label: "Achievements",
        data: achievementCountsByMonth,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Calculate faculty distribution by designation (real data)
  const designationLabels = [
    "Professor",
    "Associate Professor",
    "Assistant Professor",
  ];
  const facultyDistributionCounts = designationLabels.map(
    (designation) =>
      users.filter(
        (u) =>
          (u.role === "teacher" || u.role === "hod") &&
          u.designation &&
          u.designation.toLowerCase().includes(designation.toLowerCase())
      ).length
  );
  const facultyDistribution = {
    labels: designationLabels,
    datasets: [
      {
        data: facultyDistributionCounts,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
      },
    ],
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  async function handleRemoveHOD(id: string): Promise<void> {
    try {
      setLoading(true);
      // Call API to update the user's role in the backend
      // Assuming updateUserRole is imported from userService
      await updateUserRole(id, "teacher");

      // Update local state after successful backend update
      const updatedUsers = users.map((u) =>
        u._id === id ? { ...u, role: "teacher" as UserType["role"] } : u
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Failed to remove HOD:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePromoteToHOD(id: string): Promise<void> {
    try {
      setLoading(true);
      // Call API to update the user's role in the backend
      // Assuming updateUserRole is imported from userService
      await updateUserRole(id, "hod");

      // Update local state after successful backend update
      const updatedUsers = users.map((u) =>
        u._id === id ? { ...u, role: "hod" as UserType["role"] } : u
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Failed to promote to HOD:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <Link to="/admin/users/new">
          <Button>
            <Plus size={16} className="mr-2" />
            Add New Teacher
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-primary-50 border-l-4 border-primary-500">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-primary-100 mr-4">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary-600">
                Total Faculty
              </p>
              <p className="text-2xl font-bold text-primary-700">
                {stats.totalFaculty}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-blue-50 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-blue-100 mr-4">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">HODs</p>
              <p className="text-2xl font-bold text-blue-700">
                {stats.totalHODs}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-green-50 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-green-100 mr-4">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-600">Teachers</p>
              <p className="text-2xl font-bold text-green-700">
                {stats.totalTeachers}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-purple-50 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-purple-100 mr-4">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-600">
                Achievements
              </p>
              <p className="text-2xl font-bold text-purple-700">
                {stats.totalAchievements}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Faculty Management */}
      <Card title="Faculty Management" className="mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Faculty ID
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Designation
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Role
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users
                .filter((u) => u.role !== "admin")
                .map((user) => (
                  <tr key={user._id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {user.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.teacherId}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.designation}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "hod"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link
                        to={`/admin/users/${user._id}`}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        Edit
                      </Link>
                      {user.role === "teacher" ? (
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handlePromoteToHOD(user._id)}
                        >
                          Make HOD
                        </button>
                      ) : user.role === "hod" ? (
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          onClick={() => handleRemoveHOD(user._id)}
                        >
                          Remove HOD
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Department Stats */}
      <Card title="Department Statistics">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Faculty Distribution
            </h3>
            <div className="h-64">
              <Doughnut
                data={facultyDistribution}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Achievement Trends
            </h3>
            <div className="h-64">
              <Line
                data={achievementTrends}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
/**
 * Updates the role of a user by calling the backend service.
 * @param id - The user's ID.
 * @param newRole - The new role to assign ("teacher" or "hod").
 */
async function updateUserRole(id: string, newRole: string): Promise<void> {
  await updateUserRoleService(id, newRole);
}
