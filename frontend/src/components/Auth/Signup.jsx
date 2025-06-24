import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiPhone } from "react-icons/fi";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [mobile, setMobile] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return alert("Passwords doesn't match");
    const result = await dispatch(signupUser({ email, password, mobile }));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
          Dmonitor
        </h2>
        <div className="relative mb-4">
          <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="relative mb-4">
          <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="relative mb-4">
          <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border border-gray-300 rounded px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        <div className="relative mb-4">
          <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Mobile (optional)"
            className="w-full border border-gray-300 rounded px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button
          className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 font-medium cursor-grab"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <div className="text-center text-sm text-gray-500 mt-4">
          <p className="text-center text-sm">
            Already have an account? 
            <Link to="/login" className="text-blue-900 hover:underline font-medium">
               Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
