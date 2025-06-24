import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement backend call for password reset
    setSent(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
          Reset Password
        </h2>
        {sent ? (
          <div className="text-green-600 mb-4">
            If this email exists, a reset link has been sent.
          </div>
        ) : (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="btn btn-primary w-full mb-2" type="submit">
              Send Reset Link
            </button>
          </>
        )}
        <div className="flex justify-between text-sm mt-2">
          <Link to="/login" className="text-indigo-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}