import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import {
  getAllUsers,
  updateUserRole as updateUserRoleService,
} from "../services/userService";
import { User as UserType } from "../types";

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  async function handleRemoveHOD(id: string) {
    setLoading(true);
    await updateUserRoleService(id, "teacher");
    setUsers(users.map((u) => (u._id === id ? { ...u, role: "teacher" } : u)));
    setLoading(false);
  }

  async function handlePromoteToHOD(id: string) {
    setLoading(true);
    await updateUserRoleService(id, "hod");
    setUsers(users.map((u) => (u._id === id ? { ...u, role: "hod" } : u)));
    setLoading(false);
  }

  async function handleMakeAdmin(id: string) {
    setLoading(true);
    await updateUserRoleService(id, "admin");
    const usersData = await getAllUsers();
    setUsers(usersData);
    setLoading(false);
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <Link to="/admin/users/new">
          <Button>
            <Plus size={16} className="mr-2" />
            Add New Teacher
          </Button>
        </Link>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Name
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Faculty ID
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Designation
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Role
                </th>
                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
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
                        <>
                          <button
                            className="text-blue-600 hover:text-blue-900 mr-2"
                            onClick={() => handlePromoteToHOD(user._id)}
                          >
                            Make HOD
                          </button>
                          <button
                            className="text-purple-600 hover:text-purple-900"
                            onClick={() => handleMakeAdmin(user._id)}
                          >
                            Make Admin
                          </button>
                        </>
                      ) : user.role === "hod" ? (
                        <>
                          <button
                            className="text-gray-600 hover:text-gray-900 mr-2"
                            onClick={() => handleRemoveHOD(user._id)}
                          >
                            Remove HOD
                          </button>
                          <button
                            className="text-purple-600 hover:text-purple-900"
                            onClick={() => handleMakeAdmin(user._id)}
                          >
                            Make Admin
                          </button>
                        </>
                      ) : null}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default UserManagementPage;
