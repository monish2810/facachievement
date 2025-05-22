/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { createUser } from "../services/userService";
import { UserFormData } from "../types";

const designationOptions = [
  { value: "Professor", label: "Professor" },
  { value: "Associate Professor", label: "Associate Professor" },
  { value: "Assistant Professor", label: "Assistant Professor" },
];

const AddTeacherPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<UserFormData>({
    teacherId: "",
    name: "",
    phone: "",
    designation: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await createUser(form);
      navigate("/admin/dashboard"); // Redirect to admin dashboard after adding
    } catch (err) {
      setError("Failed to add teacher.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto mt-8">
        <Card title="Add New Teacher">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              id="teacherId"
              name="teacherId"
              label="Teacher ID"
              value={form.teacherId}
              onChange={handleChange}
              required
            />
            <Input
              id="name"
              name="name"
              label="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              id="phone"
              name="phone"
              label="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <Select
              id="designation"
              name="designation"
              label="Designation"
              options={designationOptions}
              value={form.designation}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setForm({ ...form, designation: e.target.value })
              }
              required
            />
            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Add Teacher
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddTeacherPage;
