import { Award, Check, Clock, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AchievementForm from "../components/AchievementForm";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";
import {
  createAchievement,
  getAllAchievements,
  reviewAchievement,
} from "../services/achievementService";
import { getAllUsers } from "../services/userService";
import { Achievement, User } from "../types";

const POLL_INTERVAL = 10000; // 10 seconds

const HodDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout;

    const fetchData = async () => {
      const [achievementsData, usersData] = await Promise.all([
        getAllAchievements(),
        getAllUsers(),
      ]);
      if (isMounted) {
        setAchievements(achievementsData);
        setTeachers(usersData.filter((user) => user.role === "teacher"));
      }
    };

    fetchData();
    intervalId = setInterval(fetchData, POLL_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const pendingAchievements = achievements.filter(
    (a) => a.status === "Under Review"
  );

  const countByStatus = {
    total: achievements.length,
    approved: achievements.filter((a) => a.status === "Approved").length,
    pending: achievements.filter((a) => a.status === "Under Review").length,
    faculty: teachers.length,
  };

  // Approve/Reject handlers
  async function handleReview(status: "Approved" | "Rejected") {
    if (!selectedAchievement) return;
    setReviewLoading(true);
    try {
      await reviewAchievement(selectedAchievement._id, { status });
      // Refresh achievements after review
      const achievementsData = await getAllAchievements();
      setAchievements(achievementsData);
      setModalOpen(false);
      setSelectedAchievement(null);
    } finally {
      setReviewLoading(false);
    }
  }

  // Add achievement handler for HOD
  async function handleAddAchievement(data: any) {
    setIsSubmitting(true);
    setAddError(null);
    try {
      await createAchievement(data);
      setShowAddModal(false);
      // Refresh achievements after adding
      const achievementsData = await getAllAchievements();
      setAchievements(achievementsData);
    } catch (err: any) {
      setAddError(err.message || "Failed to submit achievement.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">HOD Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded font-medium"
            onClick={() => setShowAddModal(true)}
          >
            Add New Achievement
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-blue-50 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-blue-100 mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">
                Faculty Members
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {countByStatus.faculty}
              </p>
            </div>
          </div>
        </Card>

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

        <Card className="bg-yellow-50 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-yellow-100 mr-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-600">
                Pending Review
              </p>
              <p className="text-2xl font-bold text-yellow-700">
                {countByStatus.pending}
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
      </div>

      {/* Pending Reviews */}
      <Card title="Pending Achievement Reviews" className="mb-8">
        {pendingAchievements.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {pendingAchievements.slice(0, 3).map((achievement) => {
              const teacher = teachers.find(
                (t) => t._id === achievement.teacher
              );

              return (
                <div
                  key={achievement._id}
                  className="py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {achievement.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        By <span className="font-medium">{teacher?.name}</span>{" "}
                        • Submitted on{" "}
                        {new Date(achievement.submittedAt).toLocaleDateString()}
                      </p>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {achievement.description}
                      </p>
                    </div>
                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      onClick={() => {
                        setSelectedAchievement(achievement);
                        setModalOpen(true);
                      }}
                    >
                      Review
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">No pending reviews.</p>
          </div>
        )}

        {pendingAchievements.length > 3 && (
          <div className="mt-4 text-center">
            <Link
              to="/review"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View all {pendingAchievements.length} pending reviews
            </Link>
          </div>
        )}
      </Card>

      {/* Modal for Achievement Review */}
      {modalOpen && selectedAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">
              {selectedAchievement.title}
            </h2>
            <p className="mb-2 text-gray-700">
              {selectedAchievement.description}
            </p>
            <div className="mb-2 text-sm text-gray-500">
              Academic Year: {selectedAchievement.academicYear} <br />
              Certificate Year: {selectedAchievement.certificateYear} <br />
              Submitted:{" "}
              {new Date(selectedAchievement.submittedAt).toLocaleDateString()}
            </div>
            {selectedAchievement.certificatePdf && (
              <div className="mb-4">
                <a
                  href={`/api/certificates/${selectedAchievement.certificatePdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 underline"
                >
                  View Certificate PDF
                </a>
              </div>
            )}
            <div className="flex gap-4 mt-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                onClick={() => handleReview("Approved")}
                disabled={reviewLoading}
              >
                Approve
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                onClick={() => handleReview("Rejected")}
                disabled={reviewLoading}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Achievement Modal */}
      {showAddModal && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowAddModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Add New Achievement</h2>
            {addError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {addError}
              </div>
            )}
            <AchievementForm
              onSubmit={handleAddAchievement}
              isSubmitting={isSubmitting}
              teacherId={user.teacherId}
            />
          </div>
        </div>
      )}

      {/* Department Overview */}
      <Card title="Department Faculty">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Faculty Name
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
                  Faculty ID
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Achievements
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {teachers.slice(0, 5).map((teacher) => {
                const teacherAchievements = achievements.filter(
                  (a) => a.teacher === teacher.teacherId
                );

                return (
                  <tr key={teacher._id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {teacher.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {teacher.designation}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {teacher.teacherId}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {teacherAchievements.length}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link
                        to={`/faculty/${teacher.teacherId}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {teachers.length > 5 && (
          <div className="mt-4 text-center">
            <Link
              to="/department"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View all {teachers.length} faculty members
            </Link>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default HodDashboardPage;
