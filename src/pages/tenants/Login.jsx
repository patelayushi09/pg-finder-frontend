import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      const response = await axios.post("https://pgfinderbackend.onrender.com/tenant/login", { email, password });

      if (response.data.error === false) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("tenantId", response.data.tenantId);
        localStorage.setItem("tenantName", JSON.stringify({
          firstName: response.data.tenantName.firstName,
          lastName: response.data.tenantName.lastName
        }));

        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });

        setTimeout(() => {
          navigate("/tenant/tenant-dashboard");
        }, 3000);
      } else {
        setError(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-[#F6F4EB] via-[#E3DAC9] to-[#D8B258] min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 overflow-hidden">
      {/* Background Wave */}
      <div className="absolute top-0 left-0 w-full h-1/2 pointer-events-none z-0">
        <svg className="absolute top-0 w-full" viewBox="0 0 1440 320">
          <path
            fill="#D96851"
            fillOpacity="1"
            d="M0,160L80,186.7C160,213,320,267,480,277.3C640,288,800,256,960,234.7C1120,213,1280,203,1360,208L1440,224V0H0Z"
          ></path>
          <path
            fill="#D8B258"
            fillOpacity="0.4"
            d="M0,224L100,192C200,160,400,96,600,128C800,160,1000,288,1200,304C1400,320,1600,256,1700,224L1800,192V0H0Z"
          ></path>
        </svg>
      </div>

      {/* Login Card */}
      <form
        onSubmit={submitHandler}
        className="relative bg-white px-6 py-10 sm:px-10 sm:py-12 rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg lg:max-w-xl z-10 text-center border border-gray-200 backdrop-blur-lg bg-opacity-90"
      >
        {/* Header Bar */}
        <div className="absolute -top-1 left-0 w-full h-1 bg-gradient-to-r from-[#D96851] via-[#D8B258] to-[#759B87] rounded-t-lg"></div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#103538]">Tenant Login</h2>
        <p className="text-sm sm:text-base text-gray-500 mb-6">Welcome back! Please login to your account.</p>

        {/* Inputs */}
        <div className="space-y-4 text-left">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            placeholder="Email Address"
            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#759B87] transition bg-gray-50 shadow-sm"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            id="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            type="password"
            placeholder="Password"
            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#759B87] transition bg-gray-50 shadow-sm"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Error Display */}
        {error && <div className="text-sm text-red-600 mt-2">{error}</div>}

        {/* Options */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 text-sm text-gray-600 gap-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="accent-[#103538]" />
            <span>Remember me</span>
          </label>
          <Link to="/tenant/forgot-password" className="text-[#D8B258] font-semibold hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 bg-[#103538] text-white py-3 rounded-lg font-semibold hover:bg-[#759B87] transition shadow-lg transform hover:scale-105 hover:shadow-xl"
        >
          Login
        </button>

        {/* Redirect Link */}
        <p className="text-center text-gray-500 mt-4 text-sm sm:text-base">
          Don't have an account?{' '}
          <Link to="/tenant/signup" className="font-medium text-[#759B87] hover:text-[#103538] hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
};
