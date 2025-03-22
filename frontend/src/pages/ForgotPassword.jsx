import { useState } from "react";
import useUserStore from "../store/useUserStore";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const forgotPassword = useUserStore((state) => state.forgotPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await forgotPassword(email);
    setMessage(response.message);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card w-96 bg-base-200 shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-orange-600">
          Forgot Password?
        </h2>
        <p className="text-sm text-center text-gray-600 mb-4">
          Enter your email to receive a password reset link.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="input input-bordered w-full mt-1 mb-3"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn bg-orange-600 w-full">
            Send Reset Link
          </button>
        </form>
        {message && (
          <p className="text-center text-sm text-green-600 mt-2">{message}</p>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
