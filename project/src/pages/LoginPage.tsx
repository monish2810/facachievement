import { zodResolver } from "@hookform/resolvers/zod";
import { Book, LogIn } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";

const schema = z.object({
  teacherId: z.string().min(1, "Teacher ID is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof schema>;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      await login(data.teacherId, data.password);
      navigate("/dashboard", { replace: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Book className="h-12 w-12 text-primary-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Faculty Achievements Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Login to manage your academic achievements
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-4 py-8 sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="teacherId"
              label="Teacher ID"
              type="text"
              autoComplete="username"
              error={errors.teacherId?.message}
              {...register("teacherId")}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center items-center"
                isLoading={isLoading}
                disabled={isLoading}
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm"></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
