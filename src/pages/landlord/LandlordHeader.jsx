import React, { useState, useEffect } from "react";
import ChatNotification from "../../components/ChatNotification";
import { UserCircle } from "lucide-react";
import axios from "axios";


export const LandlordHeader = () => {
  const landlordId = localStorage.getItem("landlordId");

  const [landlordData, setLandlordData] = useState(null)
  


  useEffect(() => {
    fetchLandlordData()
  }, [])


  const fetchLandlordData = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const landlordId = localStorage.getItem("landlordId");

      const response = await axios.get(`https://pgfinderbackend.onrender.com/landlord/${landlordId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const landlordData = response.data.data
      setLandlordData(landlordData)

    } catch (error) {
      console.error("Error fetching landlord data:", error)
    }
  }

  let userData = { firstName: "Guest", lastName: "" };

  if (landlordId) {
    try {
      const savedLandlordName = localStorage.getItem("landlordName");
      if (savedLandlordName) {
        userData = JSON.parse(savedLandlordName);
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }


  return (
    <header className="bg-[#E6F0ED] shadow-sm fixed top-0 left-64 w-[calc(100%-16rem)] z-10">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logged-in User Welcome Text */}
        <h2 className="text-xl font-semibold text-[#103538]">
          Welcome back, {landlordData ? `${landlordData.name}` : "Guest"}!
        </h2>

        {/* Right Side Icons & Profile */}
        <div className="flex items-center gap-6">
          {/* Chat Notification First */}
          <div className="relative">
            <ChatNotification />
          </div>

          {/* Profile Section */}
          <img src={landlordData?.profileImage} className="w-8 h-8 rounded-full object-cover"/>

           {/* User Name */}
           <p className="text-sm font-bold text-[#1c5b37]">
           {landlordData ? `${landlordData.name}` : "Guest"}!
          </p>
        </div>
      </div>
    </header>
  );
};

export default LandlordHeader;