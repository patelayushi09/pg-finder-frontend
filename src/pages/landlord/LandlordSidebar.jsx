import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Home, MessageSquare, LayoutDashboardIcon,
    Settings, LogOut, Building2, User2Icon, HomeIcon,
    CurrencyIcon
} from "lucide-react";

export const LandlordSidebar = () => {
    const location = useLocation(); // Get current URL
    const navigate = useNavigate(); // Navigation hook

    const navItems = [
        { name: "Dashboard", icon: LayoutDashboardIcon, path: "/landlord-dashboard/" },
        { name: "Properties", icon: Home, path: "/landlord-dashboard/properties" },
        { name: "Messages", icon: MessageSquare, path: "/landlord-dashboard/messages" },
        { name: "Bookings", icon: HomeIcon, path: "/landlord-dashboard/bookings" },
        { name: "Tenants", icon: User2Icon, path: "/landlord-dashboard/tenants" },
        { name: "Payment", icon: CurrencyIcon, path: "/landlord-dashboard/payments" },
        { name: "Settings", icon: Settings, path: "/landlord-dashboard/settings" }
    ];
    const handleLogout = () => {
        localStorage.removeItem("accessToken");  
        localStorage.removeItem("tenantId");     
        navigate("/landlord/login");  //  Use navigate here
      };
    

    return (
        <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-0 left-0 w-64 h-full z-50 flex flex-col shadow-xl rounded-r-3xl bg-gradient-to-b from-[#103538] to-[#5E8674] text-white"
        >
            {/* Logo Section */}
            <div className="p-6 flex items-center space-x-3 border-b border-[#D8B258]">
                <Building2 className="w-10 h-10 text-[#D8B258]" />
                <div>
                    <h1 className="text-2xl font-bold text-[#DCD29F]">PG Finder</h1>
                    <p className="text-sm text-white opacity-80">Your Stay, Your Way</p>
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="mt-6 flex-1 relative space-y-2">
                {navItems.map((item) => (
                    <Link to={item.path} key={item.name} className="block">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative w-full flex items-center px-6 py-3 text-lg font-medium rounded-lg transition-all duration-300 
                                ${location.pathname === item.path
                                    ? 'bg-[#D8B258] text-[#103538] shadow-md font-semibold'
                                    : 'text-[#DCD29F] hover:bg-[#D8B258] hover:bg-opacity-40 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-6 h-6 mr-4" />
                            {item.name}
                            {location.pathname === item.path && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute left-0 top-0 h-full w-2 bg-[#D8B258] rounded-r-lg"
                                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                />
                            )}
                        </motion.div>
                    </Link>
                ))}
            </nav>

            {/* Logout Button */}
            <motion.div
                   whileHover={{ scale: 1.05, boxShadow: "0px 4px 10px rgba(216, 178, 88, 0.4)" }}
                   whileTap={{ scale: 0.95 }}
                   className="p-4 border-t border-[#D8B258]"
                 >
                   <button className="w-full flex items-center px-6 py-3 text-lg font-medium text-[#103538] bg-[#D8B258] rounded-lg transition-all duration-300 hover:bg-[#D96851] hover:text-white shadow-md" onClick={handleLogout}>
                     <LogOut className="w-6 h-6 mr-4" />
                     Logout
                   </button>
                 </motion.div>
               </motion.div>
        
    );
};
