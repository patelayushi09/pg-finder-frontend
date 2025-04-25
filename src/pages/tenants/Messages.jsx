import { useState, useEffect, useRef } from "react"
import { Send, ChevronDown } from "lucide-react"
import axios from "axios"
import moment from "moment"
import InputEmoji from "react-input-emoji"

const API_BASE_URL = "https://pgfinderbackend.onrender.com"

export default function Messages() {
  const [landlords, setLandlords] = useState([])
  const [selectedLandlord, setSelectedLandlord] = useState(null)
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState({
    landlords: false,
    conversations: false,
    messages: false,
    sending: false,
    properties: false,
  })
  const [error, setError] = useState(null)
  const [properties, setProperties] = useState([])
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false)
  const messagesEndRef = useRef(null)

  function savePropertyToLocalStorage(property) {
    if (property) {
      localStorage.setItem("selectedPropertyId", property._id)
      // Also save the property name to ensure it's available after refresh
      localStorage.setItem("selectedPropertyName", property.propertyName || property.name)
    }
  }

  const tenantId = localStorage.getItem("tenantId")

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Fetch Landlords from Database
  useEffect(() => {
    const fetchLandlords = async () => {
      setLoading((prev) => ({ ...prev, landlords: true }))
      setError(null)
      try {
        const response = await axios.get(`${API_BASE_URL}/landlord/`)
        setLandlords(response.data.data)
      } catch (error) {
        setError("Failed to load landlords. Please try again.")
      } finally {
        setLoading((prev) => ({ ...prev, landlords: false }))
      }
    }
    fetchLandlords()
  }, [])

  // Fetch tenant conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!tenantId) return
      setLoading((prev) => ({ ...prev, conversations: true }))
      setError(null)
      try {
        const response = await axios.get(`${API_BASE_URL}/message/tenant/${tenantId}/conversations`)
        setConversations(response.data.data)

        // Check if we have saved conversation/property/landlord in localStorage
        const savedConversationId = localStorage.getItem("selectedConversationId")
        const savedLandlordId = localStorage.getItem("selectedLandlordId")
        const savedPropertyId = localStorage.getItem("selectedPropertyId")

        if (savedConversationId) {
          const conversation = response.data.data.find((conv) => conv._id === savedConversationId)
          if (conversation) {
            setSelectedLandlord(conversation.participants.landlord)
            setSelectedProperty(conversation.property)
            selectConversation(conversation)
            return
          }
        }

        if (savedLandlordId && savedPropertyId) {
          const conversation = response.data.data.find(
            (conv) => conv.participants.landlord._id === savedLandlordId && conv.property._id === savedPropertyId,
          )

          // Find the landlord
          const landlord = response.data.data.find((conv) => conv.participants.landlord._id === savedLandlordId)
            ?.participants.landlord

          if (landlord) {
            setSelectedLandlord(landlord)

            // Fetch properties for this landlord
            const propertiesResponse = await axios.get(`${API_BASE_URL}/landlord/${savedLandlordId}/properties`)
            setProperties(propertiesResponse.data.data)

            // Find the property
            const property = propertiesResponse.data.data.find((prop) => prop._id === savedPropertyId)
            if (property) {
              setSelectedProperty(property)
            } else if (conversation) {
              // If property not found in properties list but exists in conversation
              setSelectedProperty(conversation.property)
            } else {
              // If property not found in either place, try to create a temporary property object
              // using the saved ID and name
              const savedPropertyName = localStorage.getItem("selectedPropertyName")
              if (savedPropertyId && savedPropertyName) {
                setSelectedProperty({
                  _id: savedPropertyId,
                  name: savedPropertyName,
                  propertyName: savedPropertyName,
                })
              }
            }

            // If conversation exists, select it
            if (conversation) {
              selectConversation(conversation)
            }
          }
        }
      } catch (error) {
        setError("Failed to load conversations. Please try again.")
      } finally {
        setLoading((prev) => ({ ...prev, conversations: false }))
      }
    }
    fetchConversations()
  }, [tenantId])

  // Fetch properties when a landlord is selected
  useEffect(() => {
    const fetchProperties = async () => {
      if (!selectedLandlord) return
      setLoading((prev) => ({ ...prev, properties: true }))
      setError(null)
      try {
        const response = await axios.get(`${API_BASE_URL}/landlord/${selectedLandlord._id}/properties`)

        // Add conversation info to properties
        const propertiesWithConvInfo = response.data.data.map((property) => {
          const conversation = conversations.find(
            (conv) => conv.participants.landlord._id === selectedLandlord._id && conv.property._id === property._id,
          )

          return {
            ...property,
            hasConversation: !!conversation,
            conversation: conversation || null,
          }
        })

        setProperties(propertiesWithConvInfo)

        // If only one property, select it automatically
        if (response.data.data.length === 1 && !selectedProperty) {
          setSelectedProperty(response.data.data[0])
        }

        // Save landlord ID to localStorage
        localStorage.setItem("selectedLandlordId", selectedLandlord._id)
      } catch (error) {
        setError("Failed to load properties. Please try again.")
        setProperties([])
      } finally {
        setLoading((prev) => ({ ...prev, properties: false }))
      }
    }
    fetchProperties()
  }, [selectedLandlord, conversations])

  // Select a landlord and filter conversations
  const selectLandlord = (landlord) => {
    setSelectedLandlord(landlord)
    setMessages([])
    setSelectedProperty(null)
    setSelectedConversation(null)

    // Clear saved property and conversation from localStorage
    localStorage.removeItem("selectedPropertyId")
    localStorage.removeItem("selectedConversationId")

    // Save landlord ID to localStorage
    localStorage.setItem("selectedLandlordId", landlord._id)
  }

  // Select a property
  const selectProperty = async (property) => {
    setSelectedProperty(property)

    // Save property ID and name to localStorage
    savePropertyToLocalStorage(property)

    // Check if there's an existing conversation for this property
    if (property.hasConversation && property.conversation) {
      selectConversation(property.conversation)
    } else {
      // No existing conversation, start a new one
      setSelectedConversation(null)
      setMessages([])

      // Clear saved conversation from localStorage
      localStorage.removeItem("selectedConversationId")
    }
  }

  // Select a conversation and load messages
  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation)
    setSelectedProperty(conversation.property)
    setLoading((prev) => ({ ...prev, sending: true }))
    setError(null)

    // Save conversation ID to localStorage
    localStorage.setItem("selectedConversationId", conversation._id)
    savePropertyToLocalStorage(conversation.property)

    try {
      const response = await axios.get(`${API_BASE_URL}/message/conversations/${conversation._id}`)
      setMessages(response.data.data)
      await axios.put(`${API_BASE_URL}/message/read`, {
        conversationId: conversation._id,
        userId: tenantId,
        userType: "tenant",
      })
    } catch (error) {
      setError("Failed to load messages. Please try again.")
    } finally {
      setLoading((prev) => ({ ...prev, messages: false }))
    }
  }

  // Send Message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !tenantId || !selectedLandlord) return
    if (!selectedProperty) {
      setError("Please select a property to send a message about.")
      return
    }

    setLoading((prev) => ({ ...prev, sending: true }))
    setError(null)

    try {
      const messageData = {
        propertyId: selectedProperty._id,
        senderId: tenantId,
        receiverId: selectedLandlord._id,
        senderType: "tenant",
        receiverType: "landlord",
        content: newMessage,
      }

      const response = await axios.post(`${API_BASE_URL}/message`, messageData)

      // Add the new message to the messages array
      setMessages((prev) => [...prev, response.data.data])

      // If this is a new conversation, refresh conversations
      if (!selectedConversation) {
        const conversationsResponse = await axios.get(`${API_BASE_URL}/message/tenant/${tenantId}/conversations`)
        setConversations(conversationsResponse.data.data)

        // Find the new conversation
        const newConversation = conversationsResponse.data.data.find(
          (conv) =>
            conv.participants.landlord._id === selectedLandlord._id && conv.property._id === selectedProperty._id,
        )

        if (newConversation) {
          setSelectedConversation(newConversation)
          localStorage.setItem("selectedConversationId", newConversation._id)
        }
      }

      setNewMessage("")
    } catch (error) {
      setError("Failed to send message. Please try again.")
    } finally {
      setLoading((prev) => ({ ...prev, sending: false }))
    }
  }

  // Toggle property dropdown
  const togglePropertyDropdown = () => {
    setShowPropertyDropdown(!showPropertyDropdown)
  }

  // Change property during active chat
  const changeProperty = (property) => {
    // Check if there's an existing conversation for this property
    const existingConversation = conversations.find(
      (conv) => conv.participants.landlord._id === selectedLandlord._id && conv.property._id === property._id,
    )

    if (existingConversation) {
      selectConversation(existingConversation)
    } else {
      setSelectedProperty(property)
      setSelectedConversation(null)
      setMessages([])
      savePropertyToLocalStorage(property)
      localStorage.removeItem("selectedConversationId")
    }

    setShowPropertyDropdown(false)
  }

  // Ensure property is set when conversation is selected
  useEffect(() => {
    if (
      selectedConversation &&
      selectedConversation.property &&
      (!selectedProperty || selectedProperty._id !== selectedConversation.property._id)
    ) {
      setSelectedProperty(selectedConversation.property)
    }
  }, [selectedConversation, selectedProperty])

  return (
    <div className="min-h-screen space-y-6 p-8 bg-cream/10 flex-1">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-[#103538] mb-6">Messages</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 h-[70vh]">
            {/* Landlords List */}
            <div className="border-r overflow-y-auto">
              <div className="p-4 border-b bg-[#E6F0ED]">
                <h2 className="font-semibold text-[#103538]">Landlords</h2>
              </div>
              {loading.landlords ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#103538]"></div>
                </div>
              ) : landlords.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No landlords available</div>
              ) : (
                landlords.map((landlord) => (
                  <button
                    key={landlord._id}
                    onClick={() => selectLandlord(landlord)}
                    className={`w-full p-4 flex items-center hover:bg-gray-50 border-b ${selectedLandlord?._id === landlord._id ? "bg-gray-100" : ""
                      }`}
                  >
                    <div className="h-8 w-8 bg-[#759B87] rounded-full flex items-center justify-center text-white">
                      {landlord.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="ml-3 text-left">
                      <h3 className="font-medium text-[#103538]">{landlord.name}</h3>
                      {conversations.some(
                        (conv) => conv.participants.landlord._id === landlord._id && conv.unreadCount > 0,
                      ) && (
                          <span className="inline-block bg-[#103538] text-white text-xs px-2 py-1 rounded-full ml-2">
                            New
                          </span>
                        )}
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Chat Section */}
            <div className="col-span-2 flex flex-col min-h-0">
              {selectedLandlord ? (
                <>
                  <div className="p-4 border-b bg-[#E6F0ED] flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-[#759B87] rounded-full flex items-center justify-center text-white">
                        {selectedLandlord.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <h2 className="font-semibold text-[#103538]">{selectedLandlord.name}</h2>
                        {selectedProperty ? (
                          <div className="relative">
                            <button
                              onClick={togglePropertyDropdown}
                              className="text-sm text-gray-600 flex items-center hover:text-[#103538]"
                            >
                              Property: {selectedProperty.propertyName || selectedProperty.name}
                              <ChevronDown className="h-4 w-4 ml-1" />
                            </button>

                            {showPropertyDropdown && (
                              <div className="absolute z-10 mt-1 w-56 bg-white rounded-md shadow-lg">
                                <div className="py-1">
                                  <div className="px-3 py-2 text-xs font-semibold text-gray-500">Change Property</div>
                                  {loading.properties ? (
                                    <div className="px-3 py-2 text-sm">Loading...</div>
                                  ) : (
                                    properties.map((property) => (
                                      <button
                                        key={property._id}
                                        onClick={() => changeProperty(property)}
                                        className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${selectedProperty._id === property._id ? "bg-gray-50 font-medium" : ""
                                          }`}
                                      >
                                        {property.propertyName || property.name}
                                        {property.hasConversation && (
                                          <span className="ml-2 inline-block w-2 h-2 bg-[#103538] rounded-full"></span>
                                        )}
                                      </button>
                                    ))
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600">No property selected</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {!selectedProperty && (
                    <div className="p-3 border-b">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select a property to message about:
                      </label>
                      {loading.properties ? (
                        <div className="flex justify-center items-center h-8">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#103538]"></div>
                        </div>
                      ) : properties.length === 0 ? (
                        <div className="text-sm text-gray-500">No properties available for this landlord</div>
                      ) : (
                        <select
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#103538] focus:outline-none"
                          value={selectedProperty?._id || ""}
                          onChange={(e) => {
                            const property = properties.find((p) => p._id === e.target.value)
                            if (property) {
                              selectProperty(property)
                            }
                          }}
                        >
                          <option value="">Select a property</option>
                          {properties.map((property) => (
                            <option key={property._id} value={property._id}>
                              {property.propertyName || property.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

                  <div className="flex-1 min-h-0 p-4 overflow-y-auto bg-gray-50">
                    {loading.messages ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#103538]"></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      <div>
                        {messages.map((message) => (
                          <div
                            key={message._id}
                            className={`mb-4 flex ${message.senderType === "tenant" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${message.senderType === "tenant"
                                ? "bg-[#103538] text-white"
                                : "bg-gray-200 text-gray-800"
                                }`}
                            >
                              <p>{message.content}</p>
                              <span className="text-xs opacity-70 block mt-1">
                                {/* {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })} */}
                                {moment(message?.createdAt).calendar()}
                              </span>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* <div className="p-3 border-t flex items-center">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className="flex-1 border p-2 mx-2 rounded-lg focus:ring-2 focus:ring-[#103538] focus:outline-none resize-none"
                      rows={1}
                      disabled={!selectedProperty}
                    />

                    <button
                      onClick={handleSendMessage}
                      disabled={loading.sending || !selectedProperty || !newMessage.trim()}
                      className="bg-[#103538] text-white p-2 rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50"
                    >
                      {loading.sending ? (
                        <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </button>
                  </div> */}
                  <div className="p-3 border-t flex items-center">
                    <div className="flex-1 mx-2">
                      <InputEmoji
                        value={newMessage || ""}
                        onChange={(value) => setNewMessage(value || "")}
                        cleanOnEnter={false}
                        onEnter={handleSendMessage}
                        fontFamily="nunito"
                        borderColor="rgba(72,112,223,0.2)"
                        placeholder="Type a message..."
                        disabled={!selectedProperty}
                      />
                    </div>

                    <button
                      onClick={handleSendMessage}
                      disabled={loading.sending || !selectedProperty || !newMessage.trim()}
                      className="bg-[#103538] text-white p-2 rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50"
                    >
                      {loading.sending ? (
                        <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a landlord to start messaging
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

