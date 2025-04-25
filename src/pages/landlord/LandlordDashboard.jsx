import React from "react";
import { LandlordSidebar } from "./LandlordSidebar";
import { Outlet } from "react-router-dom";
import { LandlordHeader } from "./LandlordHeader";

export const LandlordDashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <LandlordSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <LandlordHeader />

        {/* Page Content */}
        <div className="p-6 bg-[#F9F9F9] mt-16 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
