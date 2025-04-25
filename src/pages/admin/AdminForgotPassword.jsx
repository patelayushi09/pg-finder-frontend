import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        setError('');

        if (!email) {
            setError("Email is required");
            return;
        }

        try {
            const response = await axios.post("https://pgfinderbackend.onrender.com/admin/send-otp", { email });

            if (response.data.error) {
                setError(response.data.message);
            } else {
                navigate('/admin/otp', { state: { email } });
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error(err);
        }
    };

    return (
        <div className="relative bg-gradient-to-br from-[#F6F4EB] via-[#E3DAC9] to-[#D8B258] min-h-screen flex items-center justify-center px-4 overflow-hidden">
            {/* Expanded Wave Background */}
            <div className="absolute top-0 left-0 w-full h-1/2">
                <svg className="absolute top-0 w-full" viewBox="0 0 1440 320">
                    <path fill="#D96851" fillOpacity="1" d="M0,160L80,186.7C160,213,320,267,480,277.3C640,288,800,256,960,234.7C1120,213,1280,203,1360,208L1440,224V0H0Z"></path>
                    <path fill="#D8B258" fillOpacity="0.4" d="M0,224L100,192C200,160,400,96,600,128C800,160,1000,288,1200,304C1400,320,1600,256,1700,224L1800,192V0H0Z"></path>
                </svg>
            </div>

            {/* Glassmorphic Forgot Password Card */}
            <div className="relative bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md z-10 text-center border border-gray-200 backdrop-blur-lg bg-opacity-90">
                <h2 className="text-3xl font-bold text-[#103538]">Forgot Password</h2>
                <p className="text-gray-500 mb-6">Enter your email to receive a reset OTP.</p>
                <form className="space-y-4" onSubmit={handleForgotPassword}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#759B87] transition bg-gray-50 shadow-sm"
                    />

                    {error && <div className="text-sm text-red-600">{error}</div>}

                    <button type="submit" className="w-full mt-4 bg-[#103538] text-white py-3 rounded-lg font-semibold hover:bg-[#759B87] transition shadow-lg transform hover:scale-105 hover:shadow-xl">
                        Generate OTP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminForgotPassword;