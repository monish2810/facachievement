import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User } from "../types";
import Button from "./ui/Button";
import Input from "./ui/Input";

interface ProfileFormProps {
  user: User;
  onSubmit: (data: Partial<User>) => void;
  isSubmitting?: boolean;
}

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  designation: z.string().min(3, "Designation is required"),
});

const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  onSubmit,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      phone: user.phone,
      designation: user.designation,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="teacherId"
        label="Teacher ID"
        value={user.teacherId}
        disabled
      />

      <Input
        id="name"
        label="Full Name"
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        id="phone"
        label="Phone Number"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <Input
        id="designation"
        label="Designation"
        error={errors.designation?.message}
        {...register("designation")}
      />

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
          Update Profile
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
