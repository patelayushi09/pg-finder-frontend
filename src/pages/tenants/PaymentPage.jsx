import { useEffect, useState } from "react";
import axios from "axios";
import BookingCard from "../../components/BookingCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PaymentPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
    const [paymentId, setPaymentId] = useState("");
    const tenantId = localStorage.getItem("tenantId");

    useEffect(() => {
        const fetchConfirmedBookings = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://pgfinderbackend.onrender.com/tenant/bookings/${tenantId}`);
                const confirmedBookings = response.data.data.filter(
                    (booking) => booking.status === "confirmed" 
                );

                setBookings(confirmedBookings);
                localStorage.setItem("confirmedBookings", JSON.stringify(confirmedBookings));
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        if (tenantId) {
            // Load from localStorage first (for quick UI)
            const stored = localStorage.getItem("confirmedBookings");
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setBookings(parsed);
                    setLoading(false);
                } catch (err) {
                    console.error("Error parsing stored bookings:", err);
                }
            }

            // Then fetch fresh data
            fetchConfirmedBookings();
        }
    }, [tenantId]);

    const handleDeleteBooking = (bookingId) => {
        const booking = bookings.find(b => b._id === bookingId);
        if (booking?.paymentStatus === "paid") {
            toast.info("Cannot delete a paid booking.");
            return;
        }

        const updatedBookings = bookings.filter((b) => b._id !== bookingId);
        setBookings(updatedBookings);
        localStorage.setItem("confirmedBookings", JSON.stringify(updatedBookings));
    };

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (booking) => {
        if (booking.paymentStatus === "paid") {
            toast.info("Payment already completed for this booking.");
            return;
        }

        try {
            const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
            if (!res) {
                toast.error("Failed to load Razorpay SDK");
                return;
            }

            const orderResponse = await axios.post(`https://pgfinderbackend.onrender.com/orders`, {
                amount: Math.round(booking.totalAmount * 100),
                currency: "INR",
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderResponse.data.amount,
                currency: orderResponse.data.currency,
                name: "Property Rental",
                description: `Booking for ${booking.property?.propertyName || booking.property?.name || "Property"}`,
                order_id: orderResponse.data.order_id,
                handler: async (response) => {
                    try {
                        setPaymentId(response.razorpay_payment_id);

                        await axios.post(`https://pgfinderbackend.onrender.com/tenant/payment/verify`, {
                            bookingId: booking._id,
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                            tenantId,
                        });

                        setBookings(
                            bookings.map((b) =>
                                b._id === booking._id
                                    ? { ...b, paymentStatus: "paid", paymentMethod: "Razorpay", paymentId: response.razorpay_payment_id }
                                    : b
                            )
                        );

                        toast.success("Payment successful!");
                    } catch (error) {
                        console.error("Payment verification failed:", error);
                        toast.error("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: localStorage.getItem("tenantName") || "",
                    email: localStorage.getItem("tenantEmail") || "",
                    contact: localStorage.getItem("tenantPhone") || "",
                },
                theme: {
                    color: "#103538",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Error initiating payment:", error);
            toast.error("Failed to initiate payment. Please try again.");
        }
    };

    const verifyPaymentStatus = async (paymentId) => {
        try {
            const response = await axios.get(`https://pgfinderbackend.onrender.com/payment/${paymentId}`);
            if (response.data.status === "captured" || response.data.status === "authorized") {
                toast.success(`Payment verified: ${response.data.status}`);
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
        }
    };

    const showPaymentDetails = (booking) => {
        setSelectedBookingDetails({
            paymentId: booking.paymentId || paymentId,
            paymentMethod: booking.paymentMethod || "Razorpay",
            sender: localStorage.getItem("tenantName") || "Tenant",
            receiver: booking.landlordId?.name || "Landlord",
            property: booking.propertyId?.propertyName || "Property",
            amount: booking.totalAmount
        });
    };

    return (
        <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1">
            <h2 className="text-2xl font-semibold text-[#103538]">Payment</h2>

            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#103538]"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <BookingCard {...booking} bookingId={booking._id} onDelete={handleDeleteBooking} />

                                {booking.status === "confirmed" && booking.paymentStatus !== "paid" && (
                                    <div className="px-4 pb-4">
                                        <button
                                            onClick={() => handlePayment(booking)}
                                            className="bg-[#103538] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors w-full md:w-auto"
                                        >
                                            Pay Now
                                        </button>
                                    </div>
                                )}

                                {booking.paymentStatus === "paid" && (
                                    <div className="p-4 border-t border-gray-100 bg-green-50">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                                            <div className="flex items-center mb-2 md:mb-0">
                                                <svg
                                                    className="h-5 w-5 text-green-500 mr-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <p className="text-green-700">Payment completed</p>
                                            </div>
                                            <button
                                                onClick={() => showPaymentDetails(booking)}
                                                className="bg-[#D8B258] text-[#103538] px-4 py-1 rounded-md hover:bg-opacity-90 transition-colors text-sm"
                                            >
                                                View Payment Details
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No bookings found.</p>
                    )}
                </div>
            )}

            {paymentId && (
                <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-[#103538] mb-2">Recent Payment</h3>
                    <p className="mb-2">Payment ID: {paymentId}</p>
                    <button
                        onClick={() => verifyPaymentStatus(paymentId)}
                        className="bg-[#103538] text-white px-4 py-1 rounded-md hover:bg-opacity-90 transition-colors text-sm"
                    >
                        Verify Payment Status
                    </button>
                </div>
            )}

            {selectedBookingDetails && (
                <div className="mt-6 p-4 bg-white rounded-lg shadow-md border border-gray-200 text-sm text-gray-700">
                    <h3 className="text-lg font-semibold mb-2 text-[#103538]">Payment Details</h3>
                    <p><strong>Payment ID:</strong> {selectedBookingDetails.paymentId}</p>
                    <p><strong>Payment Method:</strong> {selectedBookingDetails.paymentMethod}</p>
                    <p><strong>Sender:</strong> {selectedBookingDetails.sender}</p>
                    <p><strong>Receiver:</strong> {selectedBookingDetails.receiver}</p>
                    <p><strong>Property Name:</strong> {selectedBookingDetails.property}</p>
                    <p><strong>Amount:</strong>{selectedBookingDetails.amount}</p>
                    <button
                        onClick={() => setSelectedBookingDetails(null)}
                        className="mt-2 text-sm text-red-600 underline"
                    >
                        Hide Details
                    </button>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}
