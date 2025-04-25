import { useState, useEffect } from "react";
import axios from "axios";

export default function CreateBooking({ propertyId, propertyName, price = 0, landlordId }) {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  const tenantId = localStorage.getItem("tenantId");


  useEffect(() => {
    if (!checkInDate || !checkOutDate || isNaN(price) || price <= 0) {
      setTotalAmount(0);
      return;
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));

    // Calculate daily price based on monthly price
    const dailyPrice = Number(price) / 30;

    // Calculate total amount based on selected days
    setTotalAmount(diffDays * dailyPrice);
  }, [checkInDate, checkOutDate, price]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkInDate || !checkOutDate) {
      setError("Please select both check-in and check-out dates.");
      return;
    }

    const formattedCheckIn = new Date(checkInDate).toISOString().split("T")[0];
    const formattedCheckOut = new Date(checkOutDate).toISOString().split("T")[0];

    const bookingData = {
      tenantId,
      landlordId,
      propertyId,
      checkInDate: formattedCheckIn,
      checkOutDate: formattedCheckOut,
      totalAmount,
      notes,
    };

    console.log("Booking Request Data:", bookingData);

  try {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const token = localStorage.getItem('accessToken');

    const response = await axios.post("https://pgfinderbackend.onrender.com/tenant/bookings", bookingData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Booking Success:", response.data);
    setSuccess("Booking successful!");
    setCheckInDate("");
    setCheckOutDate("");
    setNotes("");
  } catch (error) {
    console.error("Error creating booking:", error.response?.data || error.message);
    setError(error.response?.data?.message || "Failed to create booking. Please try again.");
  } finally {
    setLoading(false);
  }
  };
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Book {propertyName}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Check-in Date</label>
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="w-full border p-2 rounded-md"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Check-out Date</label>
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="w-full border p-2 rounded-md"
            min={checkInDate || new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Notes (Optional)</label>
          <textarea
            placeholder="Any special requests or notes for your stay"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border p-2 h-20 rounded-md"
          />
        </div>

        {checkInDate && checkOutDate && (
          <div className="p-3 rounded-lg flex justify-between bg-gray-100">
            <span className="font-medium">Total Amount:</span>
            <span className="font-semibold text-blue-600">
              ₹{totalAmount.toFixed(2)}
            </span>
          </div>
        )}

        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg">{success}</div>}

        <div className="flex flex-col space-y-3">
          <button
            type="submit"
            className="w-full bg-[#47696c] text-white py-2 rounded-md hover:bg-[#6c7877] transition text-center"
            disabled={loading || !checkInDate || !checkOutDate}
          >
            {loading ? "Processing..." : "Book Now"}
          </button>
        </div>
      </form>
    </div>
  );
}


