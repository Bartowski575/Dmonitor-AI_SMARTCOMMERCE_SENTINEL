import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
// import { FaGoogle, FaFacebookF } from "react-icons/fa";
import dMonitorUrl from "../../assets/dashboardUI.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
      <div className="flex w-full max-w-5xl h-[550px] shadow-lg rounded-2xl overflow-hidden">
        {/* Left: Sign In Form */}
        <div className="w-1/2 bg-white p-10 flex flex-col justify-center">
          <div className="mb-6">
            <p className="text-center text-5xl text-blue-900 font-extrabold">Dmonitor</p>
            {/* <img src="/logo.svg" alt="Filiuck Pay Logo" className="h-10" /> */}
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-1">Sign In</h2>
          <p className="text-sm text-gray-500 mb-6">
            Welcome back! Please enter your details
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            <div className="flex justify-between items-center text-sm">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2">Remember for 30 Days</span>
              </label>
              <a href="#" className="text-blue-900 hover:underline">a
                Forgot password
              </a>
            </div>
            {/* {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )} */}
            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-900 font-medium"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* <div className="my-4 flex items-center justify-center space-x-4">
            <button className="flex items-center gap-2 border rounded px-4 py-2 hover:bg-gray-100">
              <FaGoogle className="text-red-500" /> Sign up with Google
            </button>
            <button className="flex items-center gap-2 border rounded px-4 py-2 hover:bg-gray-100">
              <FaFacebookF className="text-blue-600" /> Sign up with Facebook
            </button>
          </div> */}
          <div className="text-center text-sm text-gray-500 mt-4">
            <p className="text-center text-sm">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-900 font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right: Dashboard Preview Section */}
        <div className="w-1/2 bg-blue-900 text-white p-10 flex flex-col justify-center items-center relative">
          <h2 className="text-3xl font-bold mb-2 text-center">
            Welcome back!
            <br />
            Please sign in to your <span className="underline">
              Dmonitor
            </span>{" "}
            account
          </h2>
          {/* <p className="text-sm text-center mb-8">Lorem ipsum dolor sit amet consectetur. Facilisi neque lectus turpis id tincidunt eget. Sagittis id et cursus porttitor.</p> */}
          <div className="w-full">
            <img
              src={dMonitorUrl}
              alt="Dashboard Preview"
              className=" w-2xl rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
