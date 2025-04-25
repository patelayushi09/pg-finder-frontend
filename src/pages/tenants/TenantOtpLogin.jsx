import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export const TenantOtpLogin = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [resendMessage, setResendMessage] = useState('');
    const [isResending, setIsResending] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};

    if (!email) {
        navigate("/tenant/login");
    }

    const resendOtp = async () => {
        if (isResending) return;

        setIsResending(true);
        setResendMessage('');

        try {
            const response = await axios.post("https://pgfinderbackend.onrender.com/tenant/resend-otp", { email });

            if (response.data.error) {
                setResendMessage('Failed to resend OTP. Please try again.');
            } else {
                setResendMessage('OTP has been resent successfully! It will expire in 1 minute.');
            }
        } catch (error) {
            console.error("Error resending OTP:", error);
            setResendMessage('Error resending OTP. Please try again.');
        }

        setTimeout(() => setIsResending(false), 60 * 1000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://pgfinderbackend.onrender.com/tenant/forgot-password/otp', { email, otp });

            if (response.data.error) {
                setError(response.data.message);
            } else {
                navigate('/tenant/reset-password', {
                    state: { email }
                });
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setError('Error verifying OTP');
        }
    };

    return (
        <div className="relative bg-gradient-to-br from-[#F6F4EB] via-[#E3DAC9] to-[#D8B258] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Wave Background */}
            <div className="absolute top-0 left-0 w-full h-1/2 pointer-events-none">
                <svg className="absolute top-0 w-full" viewBox="0 0 1440 320">
                    <path fill="#D96851" fillOpacity="1" d="M0,160L80,186.7C160,213,320,267,480,277.3C640,288,800,256,960,234.7C1120,213,1280,203,1360,208L1440,224V0H0Z"></path>
                    <path fill="#D8B258" fillOpacity="0.4" d="M0,224L100,192C200,160,400,96,600,128C800,160,1000,288,1200,304C1400,320,1600,256,1700,224L1800,192V0H0Z"></path>
                </svg>
            </div>

            {/* OTP Card */}
            <div className="relative bg-white px-6 py-10 sm:p-12 rounded-3xl shadow-2xl w-full max-w-md z-10 text-center border border-gray-200 backdrop-blur-lg bg-opacity-90">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#103538]">Enter OTP</h2>
                <p className="text-gray-500 mb-6 text-sm sm:text-base">OTP sent to your email</p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#759B87] transition bg-gray-50 shadow-sm text-sm sm:text-base"
                    />
                    {error && <span className="text-sm text-red-600">{error}</span>}

                    <button
                        type="submit"
                        className="w-full mt-4 bg-[#103538] text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-[#759B87] transition shadow-lg transform hover:scale-105 hover:shadow-xl text-sm sm:text-base"
                    >
                        Verify OTP
                    </button>

                    {/* Resend OTP Section */}
                    <div className="mt-4">
                        <p
                            className={`text-gray-500 cursor-pointer text-sm sm:text-base ${isResending ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={resendOtp}
                        >
                            {isResending ? 'Resending OTP...' : 'Resend OTP'}
                        </p>
                        {resendMessage && <p className="text-sm text-green-600 mt-1">{resendMessage}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};
