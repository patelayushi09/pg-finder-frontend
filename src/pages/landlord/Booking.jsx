import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Clock, Check, X, MapPin, User, Mail, Phone } from "lucide-react";

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(null);

  const landlordId = localStorage.getItem("landlordId");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `https://pgfinderbackend.onrender.com/landlord/bookings/${landlordId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setBookings(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [landlordId]);

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `https://pgfinderbackend.onrender.com/landlord/bookings/${bookingId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status } : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error.response?.data || error.message);
    }
  };

  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
      <h3 className="text-2xl font-bold text-[#103538]">Booking Requests</h3>

      {bookings.length === 0 ? (
        <p className="text-gray-600">No booking requests found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="p-6 rounded-lg shadow-sm border flex justify-between items-center"
              style={{ backgroundColor: "#FFFCF6", borderColor: "#EEE7DB", borderWidth: "1px" }}
            >
              <div className="flex items-center space-x-6">
                <div className="w-28 h-28 overflow-hidden rounded-lg border border-gray-200">
                  <img
                    src={booking.propertyId.image || "https://via.placeholder.com/150"}
                    alt="Property"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-lg text-gray-900">
                    {booking.propertyId.propertyName}
                  </h4>

                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1 text-green-600" />
                    <span>
                      {booking.propertyId.cityId?.name}, {booking.propertyId.stateId?.name}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-1 text-yellow-600" />
                    <span>
                      {new Date(booking.checkInDate).toLocaleDateString()} -{" "}
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-red-500" />
                    <span>₹{booking.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-3">
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {booking.status}
                </div>

                {booking.status === "pending" && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleStatusUpdate(booking._id, "confirmed")}
                      className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking._id, "rejected")}
                      className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105"
                    >
                      <X className="w-5 h-5 mr-2" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Booking;

