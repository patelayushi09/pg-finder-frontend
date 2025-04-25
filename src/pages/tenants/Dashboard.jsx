import { useEffect, useState } from "react";
import { Building2, Users, Wallet, TrendingUp, UserCheck, Home } from "lucide-react";
import axios from "axios";
import StatsCard from "../../components/StatsCard";
import ActivityList from "../../components/ActivityList";
import PerformanceMetrics from "../../components/PerformanceMetrics";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalProperties: 0,
      totalLandlords: 0,
      totalTenants: 0,
      activeBookings: 0,
    },
    recentActivities: [],
    performanceMetrics: {
      responseRate: 0,
      bookingCompletionRate: 0,
      favoriteUtilizationRate: 0,
    },
  });

  const [previousStats, setPreviousStats] = useState(null);
  const navigate = useNavigate();

  //  Define the trend calculation function here
  const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return "+0%"; // Avoid division by zero
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const tenantId = localStorage.getItem("tenantId");

        if (!tenantId) {
          navigate("/tenant/login");
          return;
        }

        const response = await axios.get(
          `https://pgfinderbackend.onrender.com/tenant/dashboard/${tenantId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.error) {
          navigate("/tenant/login");
          return;
        }

        const fetchedData = response.data.data;

        setDashboardData({
          stats: fetchedData.stats,
          recentActivities: fetchedData.recentActivities,
          performanceMetrics: fetchedData.performanceMetrics,
        });

        if (previousStats) {
          setPreviousStats(fetchedData.stats);
        } else {
          setPreviousStats(fetchedData.stats);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Dynamically calculate trends
  const trends = previousStats
    ? {
        totalProperties: calculateTrend(
          dashboardData.stats.totalProperties,
          previousStats.totalProperties
        ),
        totalLandlords: calculateTrend(
          dashboardData.stats.totalLandlords,
          previousStats.totalLandlords
        ),
        totalTenants: calculateTrend(
          dashboardData.stats.totalTenants,
          previousStats.totalTenants
        ),
        activeBookings: calculateTrend(
          dashboardData.stats.activeBookings,
          previousStats.activeBookings
        ),
      }
    : {
        totalProperties: "+0%",
        totalLandlords: "+0%",
        totalTenants: "+0%",
        activeBookings: "+0%",
      };

  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <StatsCard
            title="Total Properties"
            value={dashboardData.stats.totalProperties.toString()}
            trend={trends.totalProperties}
            Icon={Building2}
          />
          <StatsCard
            title="Active Tenants"
            value={dashboardData.stats.activeBookings.toString()}
            trend={trends.activeBookings}
            Icon={UserCheck}
          />
          <StatsCard
            title="Total Landlords"
            value={dashboardData.stats.totalLandlords.toString()}
            trend={trends.totalLandlords}
            Icon={Home}
          />
          <StatsCard
            title="Total Tenants"
            value={dashboardData.stats.totalTenants.toString()}
            trend={trends.totalTenants}
            Icon={Users}
          />
        </div>
        <ActivityList activities={dashboardData.recentActivities} />
      </div>
      <div className="lg:col-span-1">
        <PerformanceMetrics metrics={dashboardData.performanceMetrics} />
      </div>
    </div>
  );
}

export default Dashboard;
