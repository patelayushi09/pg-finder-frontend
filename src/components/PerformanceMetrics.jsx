import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

function PerformanceMetrics({ metrics = {} }) {
  const { responseRate = 0, bookingCompletionRate = 0, favoriteUtilizationRate = 0 } = metrics

  const data = [
    { name: "Response Rate", value: responseRate },
    { name: "Booking Completion", value: bookingCompletionRate },
    { name: "Favorite Utilization", value: favoriteUtilizationRate },
  ]

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#103538] mb-4">Performance Metrics</h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#759B87" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">Response Rate</p>
          <p className="text-xl font-semibold text-[#103538]">{responseRate}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Booking Completion</p>
          <p className="text-xl font-semibold text-[#103538]">{bookingCompletionRate}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Favorite Utilization</p>
          <p className="text-xl font-semibold text-[#103538]">{favoriteUtilizationRate}%</p>
        </div>
      </div>
    </div>
  )
}

export default PerformanceMetrics