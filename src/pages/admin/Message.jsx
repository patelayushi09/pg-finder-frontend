import { useState, useEffect, useRef } from "react"
import { Mail, Search, User, Home, MapPin, ArrowLeft, IndianRupee, Circle } from "lucide-react"
import axios from "axios"
import { formatDistanceToNow } from 'date-fns'


const API_BASE_URL = "https://pgfinderbackend.onrender.com"

export default function Message() {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState({
    conversations: false,
    messages: false,
  })
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all") // all, tenant, landlord
  const messagesEndRef = useRef(null)
  const [propertyDetails, setPropertyDetails] = useState(null)
  const [viewMode, setViewMode] = useState("list") // list or detail

  // auto scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  // Fetch all conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading((prev) => ({ ...prev, conversations: true }))
      setError(null)
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/conversations`)
        setConversations(response.data.data)
      } catch (error) {
        setError("Failed to load conversations. Please try again.")
        console.error("Error fetching conversations:", error)
      } finally {
        setLoading((prev) => ({ ...prev, conversations: false }))
      }
    }
    fetchConversations()
  }, [])



  // Select a conversation and load messages
  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation)
    setViewMode("detail")
    setLoading((prev) => ({ ...prev, messages: true }))
    setError(null)



    try {
      //   console.log("Conversation ID:", conversation._id);  //debug

      // Extract propertyId (first part before `_`)
      const propertyId = conversation._id.split("_")[0];
      //  console.log("Extracted propertyId:", propertyId); //debug

      const messagesResponse = await axios.post(
        `${API_BASE_URL}/admin/conversations/${conversation._id}`,
        { propertyId }
      );
      setMessages(messagesResponse.data.data);

      const propertyResponse = await axios.get(
        `${API_BASE_URL}/admin/fetch-property`,
        { propertyId: selectedConversation?.property?._id }
      );
      setPropertyDetails(propertyResponse.data);

    } catch (error) {
      setError("Failed to load conversation details. Please try again.");
      console.error("Error fetching conversation details:", error);
    }

    finally {
      setLoading((prev) => ({ ...prev, messages: false }))

    }
  }

  // Filter conversations based on search term and filter type
  const filteredConversations = conversations.filter((conversation) => {
    const tenantName = `${conversation.participants?.tenant?.firstName || ""} ${conversation.participants?.tenant?.lastName || ""
      }`.toLowerCase()
    const landlordName = `${conversation.participants?.landlord?.name || ""}`.toLowerCase()
    const propertyName = `${conversation.property?.name || ""}`.toLowerCase()

    const matchesSearch =
      tenantName.includes(searchTerm.toLowerCase()) ||
      landlordName.includes(searchTerm.toLowerCase()) ||
      propertyName.includes(searchTerm.toLowerCase())

    if (filter === "all") return matchesSearch
    if (filter === "tenant") return matchesSearch && conversation.lastMessage?.senderType === "tenant"
    if (filter === "landlord") return matchesSearch && conversation.lastMessage?.senderType === "landlord"

    return matchesSearch
  })

  const goBackToList = () => {
    setViewMode("list")
    setSelectedConversation(null)
  }

  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#103538]">Messages</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#103538] w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#103538]"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Messages</option>
            <option value="tenant">Tenant Messages</option>
            <option value="landlord">Landlord Messages</option>
          </select>
        </div>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}

      {viewMode === "list" ? (
        <div className="bg-white rounded-xl shadow-sm">
          {loading.conversations ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#103538]"></div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm || filter !== "all"
                ? "No conversations match your search criteria"
                : "No conversations found"}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Landlord
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredConversations.map((conversation) => (
                  <tr
                    key={conversation._id}
                    onClick={() => selectConversation(conversation)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-[#759B87] rounded-full flex items-center justify-center text-white">
                          {`${conversation.participants?.tenant?.firstName?.charAt(0) || ""}${conversation.participants?.tenant?.lastName?.charAt(0) || ""
                            }`}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {`${conversation.participants?.tenant?.firstName || ""} ${conversation.participants?.tenant?.lastName || ""
                              }`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-[#103538] rounded-full flex items-center justify-center text-white">
                          {conversation.participants?.landlord?.name?.substring(0, 2).toUpperCase() || ""}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {conversation.participants?.landlord?.name || ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{conversation.property?.name || ""}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {conversation.lastMessage?.content || "No messages yet"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {conversation.lastMessage?.senderType === "tenant" ? "From tenant" : "From landlord"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {conversation.lastMessage?.createdAt
                        ? formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })
                        : "N/A"} 
                     

                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${conversation.lastMessage?.senderType === "tenant" && !conversation.lastMessage?.readByLandlord
                          ? "bg-yellow-100 text-yellow-800"
                          : conversation.lastMessage?.senderType === "landlord" &&
                            !conversation.lastMessage?.readByTenant
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                          }`}
                      >
                        {conversation.lastMessage?.senderType === "tenant" && !conversation.lastMessage?.readByLandlord ? (
                          "Unread by landlord"
                        ) : conversation.lastMessage?.senderType === "landlord" && !conversation.lastMessage?.readByTenant ? (
                          "Unread by tenant"
                        ) : (
                          "Read"
                        )}

                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Conversation Detail View */}
          <div className="border-b p-4 bg-[#E6F0ED] flex items-center">
            <button onClick={goBackToList} className="mr-3 text-[#103538] hover:text-[#759B87]">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    <div className="h-10 w-10 bg-[#759B87] rounded-full flex items-center justify-center text-white z-10 border-2 border-white">
                      {`${selectedConversation?.participants?.tenant?.firstName?.charAt(0) || ""}${selectedConversation?.participants?.tenant?.lastName?.charAt(0) || ""
                        }`}
                    </div>
                    <div className="h-10 w-10 bg-[#103538] rounded-full flex items-center justify-center text-white border-2 border-white">
                      {selectedConversation?.participants?.landlord?.name?.substring(0, 2).toUpperCase() || ""}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-[#103538]">
                      Conversation between{" "}
                      <span className="font-semibold">
                        {`${selectedConversation?.participants?.tenant?.firstName || ""} ${selectedConversation?.participants?.tenant?.lastName || ""
                          }`}
                      </span>{" "}
                      and{" "}
                      <span className="font-semibold">{selectedConversation?.participants?.landlord?.name || ""}</span>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 h-[calc(100vh-280px)]">
            {/* Messages Panel */}
            <div className="col-span-2 flex flex-col h-[calc(100vh-280px)] border-r">
              {/* Main scrollable + sticky footer section */}
              <div className="flex flex-col h-full">

                {/* Scrollable Message Section */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 min-h-0">
                  {loading.messages ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#103538]"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No messages in this conversation yet
                    </div>
                  ) : (
                    <div>
                      {messages.map((message) => (
                        <div
                          key={message._id}
                          className={`mb-4 flex ${message.senderType === "landlord" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${message.senderType === "landlord"
                              ? "bg-[#103538] text-white"
                              : "bg-[#759B87] text-white"
                              }`}
                          >
                            <div className="flex items-center mb-1">
                              <div
                                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${message.senderType === "landlord"
                                  ? "bg-white text-[#103538]"
                                  : "bg-white text-[#759B87]"
                                  }`}
                              >
                                {message.senderType === "landlord"
                                  ? selectedConversation?.participants?.landlord?.name?.substring(0, 2).toUpperCase() || ""
                                  : `${selectedConversation?.participants?.tenant?.firstName?.charAt(0) || ""}${selectedConversation?.participants?.tenant?.lastName?.charAt(0) || ""}`}
                              </div>
                              <span className="ml-2 text-xs font-medium">
                                {message.senderType === "landlord"
                                  ? selectedConversation?.participants?.landlord?.name
                                  : `${selectedConversation?.participants?.tenant?.firstName} ${selectedConversation?.participants?.tenant?.lastName}`}
                              </span>
                            </div>
                            <p>{message.content}</p>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs opacity-70">
                                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                              </span>
                              {message.senderType === "tenant" && message.readByLandlord && (
                                <span className="text-xs">Read by landlord</span>
                              )}
                              {message.senderType === "landlord" && message.readByTenant && (
                                <span className="text-xs">Read by tenant</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Sticky Footer */}
                <div className="text-center py-4 px-2 bg-white text-sm shrink-0">
                  Admin view - You are viewing this conversation in read-only mode
                </div>

              </div>
            </div>



            {/* Property and Participants Info */}
            <div className="p-4 overflow-y-auto bg-gray-50">
              {/* Property Section */}
              <h3 className="text-lg font-semibold text-[#103538] mb-3">Property</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <div className="flex items-start mb-2">
                  <div className="h-10 w-10 bg-[#759B87] rounded-full flex items-center justify-center text-white mr-3">
                    <Home className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#103538]">
                      {propertyDetails?.propertyName || selectedConversation?.property?.name || "No name"}
                    </h4>
                  </div>
                </div>
                <div className="space-y-1 text-sm pl-12">
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    {selectedConversation?.property?.city || "City not available"}
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-400 mr-2 text-sm font-bold">₹</span>
                    {selectedConversation?.property?.basePrice || "Price not available"}
                  </p>
                  {selectedConversation?.property?.availabilityStatus && (
                    <p className="flex items-center">
                      <Circle className="h-4 w-4 text-gray-400 mr-2" />
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${selectedConversation.property.availabilityStatus === "available"
                          ? "bg-green-100 text-green-800"
                          : selectedConversation.property.availabilityStatus === "rented"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {selectedConversation.property.availabilityStatus.charAt(0).toUpperCase() +
                          selectedConversation.property.availabilityStatus.slice(1)}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Tenant Section */}
              <h3 className="text-lg font-semibold text-[#103538] mb-3">Tenant</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <div className="flex items-start">
                  <div className="h-10 w-10 bg-[#759B87] rounded-full flex items-center justify-center text-white mr-3 text-sm font-semibold">
                    {`${selectedConversation?.participants?.tenant?.firstName?.charAt(0) || ""}${selectedConversation?.participants?.tenant?.lastName?.charAt(0) || ""}`}
                  </div>
                  <div>
                    <h4 className="font-medium text-[#103538]">
                      {`${selectedConversation?.participants?.tenant?.firstName || ""} ${selectedConversation?.participants?.tenant?.lastName || ""}`}
                    </h4>
                    <div className="space-y-1 mt-2 text-sm">
                      <p className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        {selectedConversation?.participants?.tenant?.email || "No email available"}
                      </p>
                      <p className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        {selectedConversation?.participants?.tenant?.phone || "No phone available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Landlord Section */}
              <h3 className="text-lg font-semibold text-[#103538] mb-3">Landlord</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                <div className="flex items-start">
                  <div className="h-10 w-10 bg-[#103538] rounded-full flex items-center justify-center text-white mr-3 text-sm font-semibold">
                    {selectedConversation?.participants?.landlord?.name?.substring(0, 2).toUpperCase() || ""}
                  </div>
                  <div>
                    <h4 className="font-medium text-[#103538]">
                      {selectedConversation?.participants?.landlord?.name || ""}
                    </h4>
                    <div className="space-y-1 mt-2 text-sm">
                      <p className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        {selectedConversation?.participants?.landlord?.email || "No email available"}
                      </p>
                      <p className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        {selectedConversation?.participants?.landlord?.phone || "No phone available"}
                      </p>
                      <p className="flex items-center">
                        <Home className="h-4 w-4 text-gray-400 mr-2" />
                        Properties: {selectedConversation?.participants?.landlord?.propertyCount || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <div className="pt-2">
                <button
                  onClick={goBackToList}
                  className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-[#103538] rounded-lg transition-colors"
                >
                  Back to All Conversations
                </button>
              </div>
            </div>

          </div>
        </div>

      )
      }
    </div >
  )
}

