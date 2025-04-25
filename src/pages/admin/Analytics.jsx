import { useEffect, useState } from "react";
import { Calendar, TrendingUp, Home, CalendarCheck, DollarSign } from "lucide-react";
import axios from "axios";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7d");

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("https://pgfinderbackend.onrender.com/admin/analytics");
        setAnalyticsData({
          totalProperties: response.data.totalProperties,
          totalBookings: response.data.totalBookings,
          totalRevenue: response.data.totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  const barChartData = [
    {
      name: "Overview",
      properties: analyticsData.totalProperties,
      bookings: analyticsData.totalBookings,
      revenue: analyticsData.totalRevenue / 100,
    },
  ];

  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-[#103538]">Analytics Overview</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center border border-[#759B87] text-[#759B87] px-3 py-2 rounded w-[180px]">
            <Calendar className="mr-2 h-4 w-4" />
            <select
              className="bg-transparent outline-none w-full"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnalyticsCard
          title="Total Properties"
          value={analyticsData.totalProperties}
          icon={<Home className="h-5 w-5 text-[#D96851]" />}
          color="#D96851"
          trend="+8% from last month"
          isLoading={isLoading}
        />
        <AnalyticsCard
          title="Total Bookings"
          value={analyticsData.totalBookings}
          icon={<CalendarCheck className="h-5 w-5 text-[#D8B258]" />}
          color="#D8B258"
          trend="+12% from last month"
          isLoading={isLoading}
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`₹${analyticsData.totalRevenue.toLocaleString("en-IN")}`}
          icon={<DollarSign className="h-5 w-5 text-[#759B87]" />}
          color="#759B87"
          trend="+15% from last month"
          isLoading={isLoading}
        />
      </div>

      {/* Bar Graph Only */}
      <div className="mt-10">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold text-[#103538] mb-4">Total Stats (Bar Graph)</h3>
          {isLoading ? (
            <div className="h-[350px] w-full bg-gray-200 animate-pulse rounded" />
          ) : (
            <BarChart width={500} height={300} data={barChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Bar dataKey="properties" fill="#D96851" radius={[4, 4, 0, 0]} />
              <Bar dataKey="bookings" fill="#D8B258" radius={[4, 4, 0, 0]} />
              <Bar dataKey="revenue" fill="#759B87" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </div>
      </div>
    </div>
  );
};

const AnalyticsCard = ({ title, value, icon, color, trend, isLoading }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-[#103538]">{title}</h4>
        {icon}
      </div>
      {isLoading ? (
        <>
          <div className="h-10 w-[120px] mb-4 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-[100px] bg-gray-200 animate-pulse rounded" />
        </>
      ) : (
        <>
          <div className="text-3xl font-bold mb-2">{value}</div>
          <div className="flex items-center text-sm">
            <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
            <span className="text-emerald-500">{trend}</span>
          </div>
          <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "75%", backgroundColor: color }}></div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
