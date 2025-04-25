
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Home, Users, Building2, UserCheck } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function LandlordHomePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalProperties: 0,
      totalLandlords: 0,
      totalTenants: 0,
      activeBookings: 0,
    },
    previousStats: {
      totalProperties: 0,
      totalLandlords: 0,
      totalTenants: 0,
      activeBookings: 0,
    },
    properties: [],
  })

  const [statusFilter, setStatusFilter] = useState("All")

  // Calculate trend percentages
  const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return "+0%" // Avoid division by zero
    const change = ((current - previous) / previous) * 100
    return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`
  }

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const landlordId = localStorage.getItem("landlordId")

    if (!token) {
      navigate("/landlord/login")
      return
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`https://pgfinderbackend.onrender.com/landlord/dashboard/${landlordId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.data.error) {
          navigate("/landlord/login")
          return
        }

        setDashboardData(response.data.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [navigate])

  // Calculate trends dynamically
  const trends = {
    totalProperties: calculateTrend(dashboardData.stats.totalProperties, dashboardData.previousStats.totalProperties),
    totalLandlords: calculateTrend(dashboardData.stats.totalLandlords, dashboardData.previousStats.totalLandlords),
    totalTenants: calculateTrend(dashboardData.stats.totalTenants, dashboardData.previousStats.totalTenants),
    activeBookings: calculateTrend(dashboardData.stats.activeBookings, dashboardData.previousStats.activeBookings),
  }

  // Create stats array for rendering
  const stats = [
    {
      title: "Total Properties",
      value: dashboardData.stats.totalProperties.toString(),
      trend: trends.totalProperties,
      icon: Building2,
    },
    {
      title: "Active Tenants",
      value: dashboardData.stats.activeBookings.toString(),
      trend: trends.activeBookings,
      icon: UserCheck,
    },
    {
      title: "Total Landlords",
      value: dashboardData.stats.totalLandlords.toString(),
      trend: trends.totalLandlords,
      icon: Home,
    },
    {
      title: "Total Tenants",
      value: dashboardData.stats.totalTenants.toString(),
      trend: trends.totalTenants,
      icon: Users,
    },
  ]

  // Filter properties based on status
  const filteredProperties =
    statusFilter === "All"
      ? dashboardData.properties
      : dashboardData.properties.filter((property) => property.availabilityStatus === statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D8B258]"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-row min-h-screen w-full bg-cream/10"
    >
      {/* Sidebar Placeholder (Ensure sidebar is handled properly) */}
      <div className="w-64"></div>

      {/* Main Content (Takes up full width) */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-[#103538] mb-6">Dashboard Overview</h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#DCD29F]/20 rounded-lg">
                  <stat.icon className="w-6 h-6 text-[#D8B258]" />
                </div>
                <span
                  className={`text-sm font-medium ${stat.trend.startsWith("+") ? "text-green-500" : "text-[#D96851]"}`}
                >
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-[#759B87] text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-[#103538]">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Properties Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-[#103538]">Your Properties</h2>
            <select
              className="border border-gray-200 p-2 rounded-lg text-[#103538] focus:outline-none focus:ring-2 focus:ring-[#D96851] bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Properties</option>
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
            </select>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                No properties found matching the selected filter.
              </div>
            ) : (
              filteredProperties.map((property, index) => (
                <motion.div
                  key={property.propertyId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="aspect-w-16 aspect-h-9 relative">
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.propertyName}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <h4 className="font-semibold text-[#103538] text-lg mb-1">{property.propertyName}</h4>
                      <p className="text-sm text-[#E96821]-200">
                        {property.cityId?.name}, {property.stateId?.name}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">

                      <div>
                        <p className="text-sm text-[#103538]">Revenue</p>
                        <p className="font-semibold text-[#D8B258]">₹{property.basePrice.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${property.availabilityStatus === "Available"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                          }`}
                      >
                        {property.availabilityStatus}
                      </span>

                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default LandlordHomePage
