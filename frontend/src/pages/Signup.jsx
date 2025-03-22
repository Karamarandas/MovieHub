import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import useUserStore from "../store/useUserStore";

const schema = yup.object().shape({
  name: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

function Signup() {
  let navigate = useNavigate();
  const { signup } = useUserStore();

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...userData } = data;
    try {
      await signup(userData);
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card w-96 bg-base-200 shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-orange-600">
          Join MovieHub! 🎬
        </h2>
        <p className="text-sm text-center text-gray-600 mb-4">
          Create an account to explore movies.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            className="input input-bordered w-full mt-1 mb-1"
            placeholder="Enter your full name"
            {...register("name")}
          />
          <p className="text-red-500 text-xs">{errors.name?.message}</p>

          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="input input-bordered w-full mt-1 mb-1"
            placeholder="Enter your email"
            {...register("email")}
          />
          <p className="text-red-500 text-xs">{errors.email?.message}</p>

          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="input input-bordered w-full mt-1 mb-1 pr-10"
              placeholder="Enter a strong password"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:cursor-pointer"
              onClick={togglePassword}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p className="text-red-500 text-xs">{errors.password?.message}</p>

          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              className="input input-bordered w-full mt-1 mb-1 pr-10"
              placeholder="Re-enter your password"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:cursor-pointer"
              onClick={togglePassword}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p className="text-red-500 text-xs">
            {errors.confirmPassword?.message}
          </p>

          {errorMessage && (
            <p className="text-red-500 text-lg mt-4 text-center font-semibold">
              {errorMessage}
            </p>
          )}

          <button type="submit" className="btn bg-orange-600 w-full mt-4">
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
