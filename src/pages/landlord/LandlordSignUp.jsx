import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const LandlordSignUp = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const [signupInformation, setSignupInformation] = useState({
    name: "",
    email: "",
    phoneno: "",
    agencyName: "",
    licenseNo: "",
    experienceYears: "",
    rating: "",
    address: "",
    status: "",
    createPassword: "",
    confirmPassword: ""
  });

  const [error, setError] = useState('');

  const validatePhone = (phone) => /^[789]\d{9}$/.test(phone);  // Ensures 10 digits, starting with 7, 8, or 9
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateNumber = (num) => !isNaN(num) && num >= 0;

  async function submitHandler(e) {
    e.preventDefault();
    setError('');

    if (!Object.values(signupInformation).every(field => field !== "")) {
      setError("All fields are required");
      return;
    }

    if (signupInformation.createPassword !== signupInformation.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validatePhone(signupInformation.phoneno)) {
      setError("Phone number must be 10 digits and start with 7, 8, or 9");
      return;
    }

    if (!validateEmail(signupInformation.email)) {
      setError("Invalid email format");
      return;
    }

    if (!validateNumber(signupInformation.experienceYears) || !validateNumber(signupInformation.rating)) {
      setError("Experience and Rating must be valid numbers");
      return;
    }

    try {
      const response = await axios.post('https://pgfinderbackend.onrender.com/landlord/signup', signupInformation);

      if (response.data.error === false) {
        //alert(response.data.message);
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3000, // 3 seconds

        });
        setTimeout(() => {
          navigate("/landlord-dashboard");
        }, 3000)
      } else {
        setError(response.data.message || 'Signup failed');
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'An error occurred');
    }
  }

  return (
    <div className="relative bg-gradient-to-br from-[#F6F4EB] via-[#E3DAC9] to-[#D8B258] min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-1/2">
        <svg className="absolute top-0 w-full" viewBox="0 0 1440 320">
          <path fill="#D96851" fillOpacity="1" d="M0,160L80,186.7C160,213,320,267,480,277.3C640,288,800,256,960,234.7C1120,213,1280,203,1360,208L1440,224V0H0Z"></path>
          <path fill="#D8B258" fillOpacity="0.4" d="M0,224L100,192C200,160,400,96,600,128C800,160,1000,288,1200,304C1400,320,1600,256,1700,224L1800,192V0H0Z"></path>
        </svg>
      </div>

      <form onSubmit={submitHandler}>
        <div className="relative bg-white p-12 rounded-3xl shadow-2xl w-full max-w-2xl z-10 text-center border border-gray-200 backdrop-blur-lg bg-opacity-90">
          <h2 className="text-3xl font-bold text-[#103538]">Landlord Registration</h2>
          <p className="text-gray-500 mb-8">Register your agency and start listing accommodations.</p>

          {error && <div className="text-sm text-red-600">{error}</div>}

          {step === 1 && (
            <div className="space-y-6 text-left">
              <h3 className="text-lg font-semibold text-[#103538] border-b pb-2">Personal Information</h3>
              <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg bg-gray-50" onChange={(e) => setSignupInformation({ ...signupInformation, name: e.target.value })} />
              <input type="email" placeholder="Email Address" className="w-full p-3 border rounded-lg bg-gray-50" onChange={(e) => setSignupInformation({ ...signupInformation, email: e.target.value })} />
              <input type="tel" placeholder="Phone Number" className="w-full p-3 border rounded-lg bg-gray-50" onChange={(e) => setSignupInformation({ ...signupInformation, phoneno: e.target.value })} />
              <button type="button" onClick={nextStep} className="w-full mt-6 bg-[#103538] text-white py-3 rounded-lg font-semibold hover:bg-[#759B87] transition">Next</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 text-left">
              <h3 className="text-lg font-semibold text-[#103538] border-b pb-2">Agency Information</h3>
              <input type="text" placeholder="Agency Name" className="w-full p-3 border rounded-lg bg-gray-50" onChange={(e) => setSignupInformation({ ...signupInformation, agencyName: e.target.value })} />
              <input type="text" placeholder="License Number" className="w-full p-3 border rounded-lg bg-gray-50" onChange={(e) => setSignupInformation({ ...signupInformation, licenseNo: e.target.value })} />
              <input type="number" placeholder="Years of Experience" className="w-full p-3 border rounded-lg bg-gray-50" onChange={(e) => setSignupInformation({ ...signupInformation, experienceYears: e.target.value })} />
              <input type="number" placeholder="Rating (1-5)" className="w-full p-3 border rounded-lg bg-gray-50" onChange={(e) => setSignupInformation({ ...signupInformation, rating: e.target.value })} />
              <input type="text" placeholder="Address" className="w-full p-3 border rounded-lg bg-gray-50" onChange={(e) => setSignupInformation({ ...signupInformation, address: e.target.value })} />
              <input type="text" placeholder="Status" className="w-full p-3 border rounded-lg bg-gray-50" onChange={(e) => setSignupInformation({ ...signupInformation, status: e.target.value })} />
              <div className="flex justify-between">
                <button type="button" onClick={prevStep} className="bg-gray-400 text-white py-2 px-4 rounded-lg">Back</button>
                <button type="button" onClick={nextStep} className="bg-[#103538] text-white py-2 px-4 rounded-lg">Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-left">
              <h3 className="text-lg font-semibold text-[#103538] border-b pb-2">Account Security</h3>
              <input type="password" placeholder="Create Password" className="w-full p-3 border rounded-lg bg-gray-50" onChange={(e) => setSignupInformation({ ...signupInformation, createPassword: e.target.value })} />
              <input type="password" placeholder="Confirm Password" className="w-full p-3 border rounded-lg bg-gray-50" onChange={(e) => setSignupInformation({ ...signupInformation, confirmPassword: e.target.value })} />
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
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};
