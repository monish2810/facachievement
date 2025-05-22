import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Role, User } from "../types";

interface ProtectedRouteProps {
  children: ReactNode | ((user: User) => ReactNode);
  roles: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  if (typeof children === "function" && user) {
    return <>{children(user)}</>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
