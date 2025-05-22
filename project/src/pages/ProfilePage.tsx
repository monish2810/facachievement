import React, { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { changePassword } from "../services/authService";
import { updateUserProfile } from "../services/userService";

const ProfilePage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, isLoading, logout } = useAuth();
  const [phone, setPhone] = useState(user?.phone || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  if (!user) return null;

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg(null);
    setErr(null);
    try {
      await updateUserProfile({ phone });
      setMsg("Profile updated successfully.");
    } catch {
      setErr("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg(null);
    setErr(null);
    try {
      await changePassword({ oldPassword, newPassword });
      setMsg("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      await logout();
      window.location.href = "/login";
    } catch {
      setErr("Failed to change password. Please check your old password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto">
        <Card title="My Profile">
          <form className="space-y-4" onSubmit={handleProfileUpdate}>
            <Input label="Teacher ID" value={user.teacherId} disabled id={""} />
            <Input label="Full Name" value={user.name} disabled id={""} />
            <Input
                          label="Phone Number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required id={""}            />
            <Input label="Designation" value={user.designation} disabled id={""} />
            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Update Profile
              </Button>
            </div>
          </form>
        </Card>
        <Card title="Change Password" className="mt-6">
          <form className="space-y-4" onSubmit={handlePasswordChange}>
            <Input
                          label="Old Password"
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          required id={""}            />
            <Input
                          label="New Password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required id={""}            />
            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Change Password
              </Button>
            </div>
          </form>
        </Card>
        {msg && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
            {msg}
          </div>
        )}
        {err && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {err}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
