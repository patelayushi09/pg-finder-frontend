import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const SignUp = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const [signupInfo, setsignupInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneno: "",
    gender: "",
    status: "",
    createPassword: "",
    confirmPassword: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    if (signupInfo.createPassword !== signupInfo.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post('https://pgfinderbackend.onrender.com/tenant/signup', signupInfo);

      if (response.data.error === false) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate("/tenant/tenant-dashboard");
        }, 3000);
        setError('');
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-[#F6F4EB] via-[#E3DAC9] to-[#D8B258] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1/2">
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

      {/* Decorative Circles */}
      <div className="absolute inset-0 hidden sm:flex flex-col justify-between items-start">
        <div className="absolute top-20 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-[#D96851] rounded-full opacity-30 shadow-xl"></div>
        <div className="absolute top-40 right-20 w-20 h-20 sm:w-24 sm:h-24 bg-[#103538] rounded-full opacity-30 shadow-xl"></div>
        <div className="absolute bottom-28 left-20 w-20 h-20 sm:w-28 sm:h-28 bg-[#759B87] rounded-full opacity-30 shadow-xl"></div>
        <div className="absolute bottom-40 right-36 w-28 h-28 sm:w-36 sm:h-36 bg-[#D8B258] rounded-full opacity-30 shadow-xl"></div>
      </div>

      <form
        onSubmit={submitHandler}
        className="relative bg-white px-6 py-10 sm:p-10 md:p-12 rounded-3xl shadow-2xl w-full max-w-md z-10 text-center border border-gray-200 backdrop-blur-lg bg-opacity-90"
        autoComplete="off"
      >
        <div className="absolute -top-1 left-0 w-full h-1 bg-gradient-to-r from-[#D96851] via-[#D8B258] to-[#759B87] rounded-t-lg"></div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-[#103538]">Tenant Registration</h2>
        <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-8">Create your account to find your perfect PG accommodation</p>

        {step === 1 && (
          <div className="space-y-5 text-left">
            <h3 className="text-lg font-semibold text-[#103538] border-b pb-2">Personal Information</h3>
            <input type="text" placeholder="First Name" className="w-full px-3 py-2 sm:p-3 border rounded-lg bg-gray-50"
              onChange={(e) => setsignupInfo((prev) => ({ ...prev, firstName: e.target.value }))} />
            <input type="text" placeholder="Last Name" className="w-full px-3 py-2 sm:p-3 border rounded-lg bg-gray-50"
              onChange={(e) => setsignupInfo((prev) => ({ ...prev, lastName: e.target.value }))} />
            <input type="email" placeholder="Email Address" className="w-full px-3 py-2 sm:p-3 border rounded-lg bg-gray-50"
              onChange={(e) => setsignupInfo((prev) => ({ ...prev, email: e.target.value }))} />
            <input type="tel" placeholder="Phone Number" className="w-full px-3 py-2 sm:p-3 border rounded-lg bg-gray-50"
              onChange={(e) => setsignupInfo((prev) => ({ ...prev, phoneno: e.target.value }))} />

            <select className="w-full px-3 py-2 sm:p-3 border rounded-lg bg-gray-50"
              onChange={(e) => setsignupInfo((prev) => ({ ...prev, gender: e.target.value }))}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <select className="w-full px-3 py-2 sm:p-3 border rounded-lg bg-gray-50"
              onChange={(e) => setsignupInfo((prev) => ({ ...prev, status: e.target.value }))}>
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="disable">Disable</option>
            </select>

            <button type="button" onClick={nextStep} className="w-full bg-[#103538] text-white py-2 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#759B87] transition">
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 text-left">
            <h3 className="text-lg font-semibold text-[#103538] border-b pb-2">Account Security</h3>
            <input type="password" placeholder="Create Password" className="w-full px-3 py-2 sm:p-3 border rounded-lg bg-gray-50"
              onChange={(e) => setsignupInfo((prev) => ({ ...prev, createPassword: e.target.value }))} />
            <input type="password" placeholder="Confirm Password" className="w-full px-3 py-2 sm:p-3 border rounded-lg bg-gray-50"
              onChange={(e) => setsignupInfo((prev) => ({ ...prev, confirmPassword: e.target.value }))} />

            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input type="checkbox" className="accent-[#103538]" required />
              <span>
                I agree to the <a href="#" className="text-[#D8B258] font-semibold hover:underline">Terms & Conditions</a> and <a href="#" className="text-[#D8B258] font-semibold hover:underline">Privacy Policy</a>
              </span>
            </label>

            <div className="flex justify-between">
              <button type="button" onClick={prevStep} className="bg-gray-400 text-white py-2 px-4 rounded-lg">Back</button>
              <button type="submit" className="bg-[#103538] text-white py-2 px-4 rounded-lg">Submit</button>
            </div>
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>

      <ToastContainer />
    </div>
  );
};
