import React from "react";
import  AdminSidebar  from "./AdminSidebar";
import { Outlet } from "react-router-dom";
import Header from "./Header";

export const AdminDashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Main Page Content */}
        <div className="p-6 bg-[#F9F9F9] flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
