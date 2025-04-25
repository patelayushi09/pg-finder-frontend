import { Search, Bell } from "lucide-react";

const Header = () => {
  return (
    <div className="flex justify-between items-center bg-[#E6F0ED]   px-6 py-4 shadow-md w-full">
      {/* Left Section - Title */}
      <div className="ml-64"> {/* Push the header right to avoid overlap */}
        <h1 className="text-2xl font-bold text-[#103538]">Admin Dashboard</h1>
        <p className="text-[#759B87]">Welcome back, Admin</p>
      </div>

    </div>
  );
};

export default Header;
