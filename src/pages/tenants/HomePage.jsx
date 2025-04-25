import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, Phone, ChevronDown, MessageSquare, Heart, MapPin, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import axios from 'axios';

export const HomePage = () => {
    const [showLoginOptions, setShowLoginOptions] = useState(false);
    const [showRegisterOptions, setShowRegisterOptions] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
      };

    

      const handleSubmit = async (e) => {
        e.preventDefault();
      
        console.log("Sending data:", formData);
      
        try {
          const response = await axios.post("https://pgfinderbackend.onrender.com/tenant/contact", formData);
          console.log("Response:", response.data);
          alert(response.data.message);
        } catch (error) {
          console.error("Submit error:", error);
          alert(error.response?.data?.error || "Something went wrong");
        }
      };
      
    return (
        <div className="min-h-screen bg-cream">
            {/* Navigation */}
            <nav className="bg-[#2e4e48] text-white px-6 py-4 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-8 w-8 text-[#D8B258]" />
                        <div className="flex flex-col">
                            <span className="font-bold text-xl text-white">PG Finder</span>
                            <span className="text-xs text-[#DCD29F]">Your Stay, Your Way</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#" className="hover:text-gold transition">Home</a>
                        <a href="#services" className="hover:text-gold transition">Services</a>
                        <a href="#about" className="hover:text-gold transition">About</a>
                        <a href="#contact" className="hover:text-gold transition">Contact</a>
                    </div>

                    <div className="relative flex items-center space-x-4">
                        {/* Login Dropdown Button */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLoginOptions((prev) => !prev)}
                                className="px-4 py-2 rounded-lg bg-coral text-white hover:bg-opacity-90 transition flex items-center gap-1"
                            >
                                Login <ChevronDown className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {showLoginOptions && (
                                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-50">
                                    <button
                                        onClick={() => {
                                            navigate('/tenant/login');
                                            setShowLoginOptions(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Login as Tenant
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/landlord/login');
                                            setShowLoginOptions(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Login as Landlord
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Register Dropdown Button */}
                        <div className="relative">
                            <button
                                onClick={() => setShowRegisterOptions((prev) => !prev)}
                                className="px-4 py-2 rounded-lg bg-gold text-white hover:bg-opacity-90 transition flex items-center gap-1"
                            >
                                <span>Register</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>


                            {/* Dropdown Menu */}
                            {showRegisterOptions && (
                                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-50">
                                    <button
                                        onClick={() => {
                                            navigate('/tenant/signup');
                                            setShowRegisterOptions(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Register as Tenant
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/landlord/signup');
                                            setShowRegisterOptions(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        Register as Landlord
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative bg-[#3a625d] text-white py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <h1 className="text-5xl font-bold mb-6">Find Your Perfect PG Accommodation</h1>
                            <p className="text-xl mb-8 text-[#DCD29F] opacity-90">
                                Your comfort is our priority. Discover the best PG stays that feel just like home.
                            </p>
                        </div>

                        <div className="md:w-1/2">
                            <img
                                src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800"
                                alt="PG Accommodation"
                                className="rounded-lg shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-deepTeal mb-4">Our Services</h2>
                        <p className="text-lg text-gray-600">Comprehensive solutions for all your accommodation needs</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Search className="h-8 w-8" />,
                                title: "Easy Search",
                                description: "Find PGs quickly with our advanced search filters"
                            },
                            {
                                icon: <MessageSquare className="h-8 w-8" />,
                                title: "Direct Communication",
                                description: "Chat directly with property owners"
                            },
                            {
                                icon: <Heart className="h-8 w-8" />,
                                title: "Verified Listings",
                                description: "All PGs are verified for your safety"
                            }
                        ].map((service, index) => (
                            <div key={index} className="bg-[#f8f6ef] p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
                                <div className="text-[#e27b67] mb-4">{service.icon}</div>
                                <h3 className="text-xl font-semibold text-[#2a4d44] mb-2">{service.title}</h3>
                                <p className="text-gray-600">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* About Section */}
            <section id="about" className="py-20 bg-[#f8f6ef]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <h2 className="text-4xl font-bold text-[#2a4d44] mb-6">About PG Finder</h2>
                            <p className="text-lg text-gray-600 mb-6">
                                We're dedicated to making your PG search experience seamless and efficient. Our platform connects you with verified PG owners, ensuring you find the perfect accommodation that suits your needs and budget.
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { number: "1000+", label: "Listed PGs" },
                                    { number: "5000+", label: "Happy Tenants" },
                                    { number: "50+", label: "Cities" },
                                    { number: "4.8/5", label: "User Rating" }
                                ].map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-2xl font-bold text-[#e27b67]">{stat.number}</div>
                                        <div className="text-gray-500">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="md:w-1/2 md:pl-10">
                            <img
                                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800"
                                alt="About PG Finder"
                                className="rounded-2xl shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>


            {/* Contact Section */}
            <section id="contact" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#2a4d44] mb-4">Contact Us</h2>
                        <p className="text-lg text-gray-500">Get in touch with our support team</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="bg-[#f8f6ef] p-8 rounded-xl shadow-md">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-[#2a4d44] mb-2">Name</label>
                                    <input
                                        type="text"
                                         name="name"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#d96851]"
                                        placeholder="Your name"
                                        onChange={handleChange} 
                                        value={formData.name}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#2a4d44] mb-2">Email</label>
                                    <input
                                        type="email"
                                         name="email"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#d96851]"
                                        placeholder="Your email"
                                        onChange={handleChange} 
                                        value={formData.email}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#2a4d44] mb-2">Message</label>
                                    <textarea
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#d96851] h-32"
                                        placeholder="Your message"
                                         name="message"
                                        onChange={handleChange} 
                                        value={formData.message}
                                    ></textarea>
                                </div>
                                <button className="w-full bg-sage text-white py-3 rounded-lg hover:bg-opacity-90 transition"
                                    type="submit">
                                    Send Message
                                </button>
                            </form>
                        </div>

                        <div className="space-y-8">
                            {[
                                {
                                    icon: <MapPin className="h-6 w-6 text-[#e27b67]" />,
                                    title: "Our Location",
                                    text: "123 Business Avenue, Tech Park, Bangalore - 560001",
                                },
                                {
                                    icon: <Phone className="h-6 w-6 text-[#e27b67]" />,
                                    title: "Phone",
                                    text: "+91 98765 43210",
                                },
                                {
                                    icon: <MessageSquare className="h-6 w-6 text-[#e27b67]" />,
                                    title: "Email",
                                    text: "support@pgfinder.com",
                                },
                            ].map((item, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <div className="bg-[#f8f6ef] p-3 rounded-lg">{item.icon}</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2a4d44] mb-1">{item.title}</h3>
                                        <p className="text-gray-500">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer className="bg-[#2e4e48] text-[#f5f5f5] py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12">

                        {/* Branding */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Building2 className="h-8 w-8 text-[#D8B258]" />
                                <div className="flex flex-col">
                                    <span className="font-bold text-xl text-white">PG Finder</span>
                                    <span className="text-xs text-[#DCD29F]">Your Stay, Your Way</span>
                                </div>
                            </div>
                            <p className="text-[#e8e4d1] leading-relaxed">
                                Your trusted partner in finding the perfect PG accommodation.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-lg font-semibold text-[#f5f5f5] mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-[#dcd29f]">
                                <li><a href="#" className="hover:text-white transition">Home</a></li>
                                <li><a href="#services" className="hover:text-white transition">Services</a></li>
                                <li><a href="#about" className="hover:text-white transition">About</a></li>
                                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h4 className="text-lg font-semibold text-[#f5f5f5] mb-4">Services</h4>
                            <ul className="space-y-2 text-[#dcd29f]">
                                <li><a href="#" className="hover:text-white transition">PG Search</a></li>
                                <li><a href="#" className="hover:text-white transition">Owner Connect</a></li>
                                <li><a href="#" className="hover:text-white transition">Verified Listings</a></li>
                                <li><a href="#" className="hover:text-white transition">Support</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Social Media Icons */}
                    <div className="flex justify-center space-x-6 mt-12">
                        <a href="#" className="text-[#D8B258] hover:text-white transition"><Instagram className="h-6 w-6" /></a>
                        <a href="#" className="text-[#D8B258] hover:text-white transition"><Facebook className="h-6 w-6" /></a>
                        <a href="#" className="text-[#D8B258] hover:text-white transition"><Twitter className="h-6 w-6" /></a>
                        <a href="#" className="text-[#D8B258] hover:text-white transition"><Youtube className="h-6 w-6" /></a>
                    </div>

                    <div className="border-t border-[#35544e] mt-8 pt-6 text-center text-[#dcd29f]">
                        <p>&copy; 2025 PG Finder. All rights reserved.</p>
                    </div>
                </div>
            </footer>

        </div>
    );
}
