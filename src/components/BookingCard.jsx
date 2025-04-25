import React, { useState } from "react";
import { Calendar, MapPin, Phone, Mail, Trash2 } from "lucide-react";
import axios from "axios";

export function BookingCard({ bookingId, propertyId, checkInDate, checkOutDate, status, landlordId, onDelete }) {
  const [showContact, setShowContact] = useState(false);

  const propertyImage = propertyId.image;
  const propertyName = propertyId.propertyName;
  const city = propertyId?.cityId?.name;
  const checkIn = new Date(checkInDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const checkOut = new Date(checkOutDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const landlordName = landlordId.name;
  const landlordPhone = landlordId.phoneno || "Not Available";
  const landlordEmail = landlordId.email || "Not Available";

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // Handle Delete Function
  const handleDelete = async () => {
    if (!bookingId) {
      console.error("Error: bookingId is undefined");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://pgfinderbackend.onrender.com/tenant/bookings/${bookingId}`);
      onDelete(bookingId); // Remove from UI after deletion
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking");
    }
  };

  return (
    <div className="bg-[#FDFCF4] rounded-xl p-5 shadow-md border border-gray-200 relative">
      <div className="flex space-x-5">
        <img
          src={propertyImage}
          alt={propertyName}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{propertyName}</h3>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-1 text-green-600" />
            <span>{city}</span>
          </div>
          <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-1 text-yellow-600" />
            <span>{checkIn} - {checkOut}</span>
          </div>
        </div>
      </div>

      {/* Status Badge & Delete Button */}
      <div className="absolute top-5 right-5 flex items-center space-x-2">
        <div className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
          {status}
        </div>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 transition"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-sm text-gray-700">
          Landlord: <span className="font-medium text-gray-900">{landlordName}</span>
        </span>
        <button
          className="flex items-center px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-all"
          onClick={() => setShowContact(true)}
        >
          <Phone className="w-4 h-4 mr-1" />
          Contact Info
        </button>
      </div>

      {/* Pop-up Modal */}
      {showContact && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Landlord Contact</h3>
            <div className="flex items-center space-x-3 mb-2 text-gray-700">
              <Phone className="w-5 h-5 text-teal-600" />
              <a href={`tel:${landlordPhone}`} className="hover:underline">{landlordPhone}</a>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <Mail className="w-5 h-5 text-teal-600" />
              <a href={`mailto:${landlordEmail}`} className="hover:underline">{landlordEmail}</a>
            </div>
            <button
              className="mt-4 w-full px-4 py-2 bg-[#D96851] hover:bg-[#c55a45] text-white rounded-lg"
              onClick={() => setShowContact(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingCard;
