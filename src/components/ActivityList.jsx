import { Building2, UserCheck, AlertCircle } from "lucide-react"

export function ActivityList({ activities = [] }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#103538] mb-4">Recent Activity</h2>
        <p className="text-gray-500 text-center py-4">No recent activities found</p>
      </div>
    )
  }

  const getStatusStyles = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700"
      case "Pending":
        return "bg-yellow-100 text-yellow-700"
      case "Cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-blue-100 text-blue-700"
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case "Property":
      case "New Property":
        return <Building2 className="w-5 h-5 text-[#759B87]" />
      case "Booking":
        return <UserCheck className="w-5 h-5 text-[#D8B258]" />
      default:
        return <AlertCircle className="w-5 h-5 text-[#D96851]" />
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#103538] mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="bg-[#759B87] bg-opacity-20 p-2 rounded-full">{getActivityIcon(activity.type)}</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#103538]">
                  {activity.type} - {activity.propertyName || ""}
                </p>
                <p className="text-xs text-gray-500">
                  {activity.user} • {activity.time}
                </p>
              </div>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full ${getStatusStyles(activity.status)}`}>
              {activity.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActivityList

