import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import useUserStore from "../store/useUserStore";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function Login() {
  const { login } = useUserStore();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  let navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card w-96 bg-base-200 shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-orange-600">
          Welcome Back! 🎬
        </h2>
        <p className="text-sm text-center text-gray-600 mb-4">
          Log in to continue exploring movies.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
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
              placeholder="Enter your password"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p className="text-red-500 text-xs">{errors.password?.message}</p>

          {errorMessage && (
            <p className="text-red-500 text-lg mt-4 text-center font-semibold">
              {errorMessage}
            </p>
          )}

          <div className="text-right text-sm mb-4">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="btn bg-orange-600 w-full">
            Login
          </button>
        </form>
        
        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
