import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

// Pages
import AchievementCreatePage from "./pages/AchievementCreatePage";
import AchievementsPage from "./pages/AchievementsPage";
import AddTeacherPage from "./pages/AddTeacherPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import DepartmentOverviewPage from "./pages/DepartmentOverviewPage";
import FacultyProfilePage from "./pages/FacultyProfilePage";
import HodDashboardPage from "./pages/HodDashboardPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import StatisticsPage from "./pages/StatisticsPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import UserManagementPage from "./pages/UserManagementPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/search" element={<SearchPage />} />

          {/* Role-based dashboard redirection */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["teacher", "hod", "admin"]}>
                {(user) => {
                  if (user?.role === "admin")
                    return <Navigate to="/admin/dashboard" />;
                  if (user?.role === "hod") return <HodDashboardPage />;
                  return <TeacherDashboardPage />;
                }}
              </ProtectedRoute>
            }
          />

          {/* Protected Route - Achievements */}
          <Route
            path="/achievements"
            element={
              <ProtectedRoute roles={["teacher", "hod", "admin"]}>
                <AchievementsPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Profile Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={["teacher", "hod", "admin"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - HOD */}
          <Route
            path="/achievements/new"
            element={
              <ProtectedRoute roles={["teacher", "hod"]}>
                <AchievementCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/department"
            element={
              <ProtectedRoute roles={["hod"]}>
                <DepartmentOverviewPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/new"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AddTeacherPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <ProtectedRoute roles={["admin"]}>
                <StatisticsPage />
              </ProtectedRoute>
            }
          />

          {/* Faculty Profile Route (public or protected as needed) */}
          <Route path="/faculty/:teacherId" element={<FacultyProfilePage />} />
          {/* Optionally, add department overview by teacherId */}
          <Route
            path="/department/:teacherId"
            element={
              <ProtectedRoute roles={["hod"]}>
                <DepartmentOverviewPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
