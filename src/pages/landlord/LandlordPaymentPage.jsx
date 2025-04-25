import { useState, useEffect } from "react"
import axios from "axios"
import { Calendar, CreditCard, DollarSign, FileText, User, CheckCircle, XCircle } from "lucide-react"

const LandlordPaymentPage = () => {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedPayment, setSelectedPayment] = useState(null)

    const landlordId = localStorage.getItem("landlordId")

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const token = localStorage.getItem("accessToken")
                const response = await axios.get(`https://pgfinderbackend.onrender.com/landlord/payments/${landlordId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })

                // Filter to only show paid bookings
                const paidPayments = response.data.data.filter((payment) => payment.status === "completed")
                setPayments(paidPayments)
                setLoading(false)
            } catch (err) {
                setError("Failed to fetch payment details")
                setLoading(false)
            }
        }

        fetchPayments()
    }, [landlordId])

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }


    if (loading) return <div className="p-8 ml-64 flex justify-center">Loading payment details...</div>
    if (error) return <div className="p-8 ml-64 text-red-500">{error}</div>

    return (
        <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
            <h3 className="text-2xl font-bold text-[#103538]">Payment Details</h3>

            {payments.length === 0 ? (
                <p className="text-gray-600">No paid booking records found.</p>
            ) : (
                <div className="space-y-4">
                    {payments.map((payment) => (
                        <div
                            key={payment._id}
                            className="p-6 rounded-lg shadow-sm border flex justify-between items-center"
                            style={{ backgroundColor: "#FFFCF6", borderColor: "#EEE7DB", borderWidth: "1px" }}
                        >
                            <div className="flex items-center space-x-6">
                                <div className="w-28 h-28 overflow-hidden rounded-lg border border-gray-200">
                                    <img
                                        src={payment.bookingId?.propertyId?.image || "https://via.placeholder.com/150"}
                                        alt="Property"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-semibold text-lg text-gray-900">
                                        {payment.bookingId?.propertyId?.propertyName || "Property Name"}
                                    </h4>

                                    <div className="flex items-center text-gray-600">
                                        <User className="w-4 h-4 mr-1 text-blue-600" />
                                        <span>
                                            From: {payment.bookingId?.tenantId
                                                ? `${payment.bookingId.tenantId.firstName || ""} ${payment.bookingId.tenantId.lastName || ""}`.trim()
                                                : "Tenant Name"}
                                        </span>


                                    </div>

                                    <div className="flex items-center text-gray-600">
                                        <User className="w-4 h-4 mr-1 text-green-600" />
                                        <span>To: {payment.bookingId?.landlordId?.name || "Landlord Name"}</span>
                                    </div>

                                    <div className="flex items-center text-gray-600">
                                        <FileText className="w-4 h-4 mr-1 text-purple-600" />
                                        <span>Payment ID: {payment.transactionId || "N/A"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end space-y-3">
                                <div className="flex items-center text-green-600 font-semibold text-lg">
                                    <span>₹{payment.bookingId?.totalAmount}</span>
                                </div>


                                <div className="flex items-center text-gray-600">
                                    <Calendar className="w-4 h-4 mr-1 text-yellow-600" />
                                    <span>{formatDate(payment.paymentDate)}</span>
                                </div>

                                <div className="flex items-center text-gray-600">
                                    <CreditCard className="w-4 h-4 mr-1 text-gray-600" />
                                    <span>{payment.paymentMethod}</span>
                                </div>

                                <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Paid
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Payment Details Modal */}
            {selectedPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-[#103538]">Payment Details</h3>
                            <button onClick={closePaymentDetails} className="text-gray-500 hover:text-gray-700">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Payment ID</p>
                                <p className="font-medium">{selectedPayment.transactionId || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Payment Date</p>
                                <p className="font-medium">{formatDate(selectedPayment.paymentDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Amount</p>
                                <p className="font-medium">₹{selectedPayment.amount}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Payment Method</p>
                                <p className="font-medium">{selectedPayment.paymentMethod}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Sender (Tenant)</p>
                                <p className="font-medium">{selectedPayment.bookingId?.tenantId?.name || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Receiver (Landlord)</p>
                                <p className="font-medium">{selectedPayment.receiverName || "N/A"}</p>
                            </div>
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <h4 className="font-medium mb-2">Booking Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Property</p>
                                    <p className="font-medium">{selectedPayment.bookingId?.propertyId?.propertyName || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Booking ID</p>
                                    <p className="font-medium">{selectedPayment.bookingId?._id || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Check-in Date</p>
                                    <p className="font-medium">
                                        {selectedPayment.bookingId?.checkInDate ? formatDate(selectedPayment.bookingId.checkInDate) : "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Check-out Date</p>
                                    <p className="font-medium">
                                        {selectedPayment.bookingId?.checkOutDate
                                            ? formatDate(selectedPayment.bookingId.checkOutDate)
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            )}
        </div>
    )
}

export default LandlordPaymentPage