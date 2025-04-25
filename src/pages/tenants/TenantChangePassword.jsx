import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const TenantChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { email } = location.state || {};

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) return setError("Password is required");
    if (!confirmPassword) return setError("Please confirm your password");
    if (password !== confirmPassword) return setError("Passwords do not match");
    if (password.length < 6) return setError('Password must be at least 6 characters long');

    try {
      const response = await axios.post("https://pgfinderbackend.onrender.com/tenant/change-password", { email, password });

      if (response.data.error) {
        setError(response.data.message);
      } else {
        toast.success(response.data.message, { autoClose: 1400 });
        setTimeout(() => navigate('/tenant/login'), 1400);
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-[#F6F4EB] via-[#E3DAC9] to-[#D8B258] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-1/2">
        <svg className="absolute top-0 w-full" viewBox="0 0 1440 320">
          <path fill="#D96851" fillOpacity="1" d="M0,160L80,186.7C160,213,320,267,480,277.3C640,288,800,256,960,234.7C1120,213,1280,203,1360,208L1440,224V0H0Z"></path>
          <path fill="#D8B258" fillOpacity="0.4" d="M0,224L100,192C200,160,400,96,600,128C800,160,1000,288,1200,304C1400,320,1600,256,1700,224L1800,192V0H0Z"></path>
        </svg>
      </div>

      {/* Change Password Card */}
      <div className="relative bg-white p-8 sm:p-10 md:p-12 rounded-3xl shadow-2xl w-full max-w-sm z-10 text-center border border-gray-200 backdrop-blur-lg bg-opacity-90">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#103538]">Change Password</h2>
        <p className="text-gray-500 mb-6 text-sm sm:text-base">Enter your new password below.</p>

        <form className="space-y-4 text-left" onSubmit={handleChangePassword}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#759B87] transition bg-gray-50 shadow-sm"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#759B87] transition bg-gray-50 shadow-sm"
          />

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            className="w-full mt-2 bg-[#103538] text-white py-3 rounded-lg font-semibold hover:bg-[#759B87] transition shadow-lg transform hover:scale-105 hover:shadow-xl"
          >
            Change Password
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};
