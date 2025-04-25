
import ChatNotification from "./ChatNotification";
import { useEffect, useState } from "react";
import axios from "axios";

export function Header() {
  const tenantId = localStorage.getItem("tenantId");

  const [tenantData, setTenantData] = useState(null)
  
  useEffect(() => {
    fetchTenantData()
  }, [])

  const fetchTenantData = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const tenantId = localStorage.getItem("tenantId")

      const response = await axios.get(`https://pgfinderbackend.onrender.com/tenant/${tenantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const tenantData = response.data.data
      setTenantData(tenantData)

    } catch (error) {
      console.error("Error fetching tenant data:", error)
    }
  }

  let userData = { firstName: "Guest", lastName: "" };

  if (tenantId) {
    try {
      const savedTenantName = localStorage.getItem("tenantName");
      if (savedTenantName) {
        userData = JSON.parse(savedTenantName);
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }

  return (
    <header className="bg-[#E6F0ED] shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Welcome Message */}
        <h2 className="text-xl font-semibold text-[#103538]">
          Welcome back, {tenantData ? `${tenantData.firstName} ${tenantData.lastName}` : "Guest"}!
        </h2>

        {/* User Section */}
        <div className="flex items-center space-x-4 border-l pl-6">
          {/* Chat Notification First */}
          <div className="relative">
            <ChatNotification />
          </div>

          {/* User Profile Icon */}
          <img src={tenantData?.profileImage} className="w-8 h-8 rounded-full object-cover"/>

          {/* User Name */}
          <p className="text-sm font-bold text-[#1c5b37]">
            {tenantData ? `${tenantData.firstName} ${tenantData.lastName}` : "Guest"}
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
