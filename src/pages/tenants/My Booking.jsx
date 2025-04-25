import React, { useEffect, useState } from "react";
import axios from "axios";
import BookingCard from "../../components/BookingCard";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const tenantId = localStorage.getItem("tenantId");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`https://pgfinderbackend.onrender.com/tenant/bookings/${tenantId}`);
        setBookings(response.data.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [tenantId]);

  // Function to remove booking from UI
  const handleDeleteBooking = (bookingId) => {
    setBookings(bookings.filter((booking) => booking._id !== bookingId));
  };

  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1">
      <h2 className="text-2xl font-semibold">My Bookings</h2>
      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingCard key={booking._id} {...booking} bookingId={booking._id} onDelete={handleDeleteBooking} />
          ))
        ) : (
          <p>No bookings found.</p>
        )}

      </div>
    </div>
  );
}