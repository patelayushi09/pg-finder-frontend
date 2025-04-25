import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const LandlordLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    const submitHandler = async (e) => {
        e.preventDefault(); 
        setError('');
    
        if (!email) {
            setError('Email is required');
            return;
        }
        if (!password) {
            setError('Password is required');
            return;
        }
    
        try {
            const response = await axios.post('https://pgfinderbackend.onrender.com/landlord/login', { email, password });
    
            if (response.data.error === false) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem("landlordId", response.data.landlordId);
                localStorage.setItem("landlordName", JSON.stringify(response.data.landlordName));

                //alert(response.data.message);
                 toast.success(response.data.message, {
                          position: "top-right",
                          autoClose: 3000, // 3 seconds
                         
                        });
                        setTimeout(()=>{
                          navigate("/landlord-dashboard");
                        },3000)
            } else {
                setError(response.data.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'An error occurred');
        }
    };
    

    return (
        <div className="relative bg-gradient-to-br from-[#F6F4EB] via-[#E3DAC9] to-[#D8B258] min-h-screen flex items-center justify-center px-4 overflow-hidden">
            {/* Top Wave Background */}
            <div className="absolute top-0 left-0 w-full">
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

            {/* Decorative Elements */}
            <div className="absolute inset-0 flex flex-col justify-between items-start">
                <div className="absolute top-20 left-10 w-32 h-32 bg-[#D96851] rounded-full opacity-30 shadow-xl"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-[#103538] rounded-full opacity-30 shadow-xl"></div>
                <div className="absolute bottom-28 left-20 w-28 h-28 bg-[#759B87] rounded-full opacity-30 shadow-xl"></div>
                <div className="absolute bottom-40 right-36 w-36 h-36 bg-[#D8B258] rounded-full opacity-30 shadow-xl"></div>
            </div>

            {/* Login Form */}
            <form onSubmit={submitHandler}>
                <div className="relative bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md z-10 text-center border border-gray-200 backdrop-blur-lg bg-opacity-90">
                    <div className="absolute -top-1 left-0 w-full h-1 bg-gradient-to-r from-[#D96851] via-[#D8B258] to-[#759B87] rounded-t-lg"></div>

                    <h2 className="text-3xl font-bold text-[#103538]">Landlord Login</h2>



                    <div className="space-y-4">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            placeholder="Email Address"
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#759B87] transition bg-gray-50 shadow-sm"
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
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#759B87] transition bg-gray-50 shadow-sm"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <div className="text-sm text-red-600">{error}</div>}


                    <button
                        type="submit"
                        className="w-full mt-6 bg-[#103538] text-white py-3 rounded-lg font-semibold hover:bg-[#759B87] transition shadow-lg transform hover:scale-105 hover:shadow-xl"
                    >
                        Login
                    </button>

                    <div className="flex items-center justify-between mt-2">
                        <div className="text-sm">
                            <Link to="/landlord/forgot-password" className="font-medium text-[#759B87] hover:text-[#103538]">
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    <p className="mt-4 text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/landlord/signup" className="font-medium text-[#759B87] hover:text-[#103538]">
                            Sign up
                        </Link>
                    </p>
                </div>
            </form>
             <ToastContainer/>
        </div>
    );
};
