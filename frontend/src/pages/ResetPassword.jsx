import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useUserStore from "../store/useUserStore";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const resetPassword = useUserStore((state) => state.resetPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await resetPassword(token, password);
    setMessage(response.message);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card w-96 bg-base-200 shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-orange-600">
          Reset Password
        </h2>
        <p className="text-sm text-center text-gray-600 mb-4">
          Enter your new password.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="input input-bordered w-full mt-1 mb-3"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn bg-orange-600 w-full">
            Reset Password
          </button>
        </form>
        {message && (
          <p className="text-center text-sm text-green-600 mt-2">{message}</p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
