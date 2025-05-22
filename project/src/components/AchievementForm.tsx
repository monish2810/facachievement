import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { AchievementFormData } from "../types";
import Button from "./ui/Button";
import FileInput from "./ui/FileInput";
import Input from "./ui/Input";
import Select from "./ui/Select";
import TextArea from "./ui/TextArea";

interface AchievementFormProps {
  onSubmit: (data: AchievementFormData) => void;
  isSubmitting?: boolean;
  teacherId: string; // <-- add this line
}

const schema = z.object({
  academicYear: z.string().min(1, "Academic year is required"),
  certificateYear: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z
      .number()
      .int()
      .min(2000, "Year must be 2000 or later")
      .max(new Date().getFullYear(), "Year cannot be in the future")
  ),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  certificatePdf: z.instanceof(File, {
    message: "Certificate PDF is required",
  }),
});

const AchievementForm: React.FC<AchievementFormProps> = ({
  onSubmit,
  isSubmitting = false,
  teacherId, // <-- add this line
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AchievementFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      academicYear: "",
      certificateYear: new Date().getFullYear(),
      title: "",
      description: "",
      certificatePdf: null,
    },
  });

  // Generate academic year options (e.g., 2022-2023, 2023-2024)
  const currentYear = new Date().getFullYear();
  const academicYearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = currentYear - i;
    return {
      value: `${year}-${year + 1}`,
      label: `${year}-${year + 1}`,
    };
  });

  const handleFormSubmit = (data: AchievementFormData) => {
    // Ensure certificatePdf is a File object
    if (!data.certificatePdf || !(data.certificatePdf instanceof File)) {
      return;
    }
    onSubmit({ ...data, teacherId }); // inject teacherId into form data
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="academicYear"
          control={control}
          render={({ field }) => (
            <Select
              id="academicYear"
              label="Academic Year"
              options={academicYearOptions}
              error={errors.academicYear?.message}
              {...field}
            />
          )}
        />

        <Input
          id="certificateYear"
          type="number"
          label="Certificate Year"
          error={errors.certificateYear?.message}
          {...register("certificateYear")}
        />
      </div>

      <Input
        id="title"
        label="Achievement Title"
        error={errors.title?.message}
        {...register("title")}
      />

      <TextArea
        id="description"
        label="Description"
        rows={4}
        error={errors.description?.message}
        {...register("description")}
      />

      <Controller
        name="certificatePdf"
        control={control}
        render={({ field: { onChange, value, ...field } }) => (
          <FileInput
            id="certificatePdf"
            label="Certificate PDF"
            accept=".pdf"
            error={errors.certificatePdf?.message}
            onChange={onChange}
            value={value}
            {...field}
          />
        )}
      />

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
          Submit Achievement
        </Button>
      </div>
    </form>
  );
};

export default AchievementForm;
