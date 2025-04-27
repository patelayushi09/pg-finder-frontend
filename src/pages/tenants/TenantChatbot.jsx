import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the GoogleGenerativeAI client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const TenantChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const [landlordDetails, setLandlordDetails] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // New loading state

  useEffect(() => {
    fetchLandlordsInformation();
    fetchProperties();
  }, []);

  const fetchLandlordsInformation = async () => {
    try {
      const response = await axios.get('https://pgfinderbackend.onrender.com/admin/landlords');
      console.log(response.data.data);
      setLandlordDetails(response.data.data);
    } catch (error) {
      console.error('Error fetching landlord data:', error);
    }
  };

  const landlordsDetails = landlordDetails
    .map((landlord, index) =>
      `${index + 1}. Landlord name ${landlord.name}, Contact number: ${landlord.phoneno} and their email is ${landlord.email}`
    )
    .join("\n");

  const fetchProperties = async () => {
    try {
      const response = await axios.get('https://pgfinderbackend.onrender.com/admin/properties');
      console.log(response.data.data);
      setProperties(response.data.data);
    } catch (error) {
      console.error('Error fetching properties data:', error);
    }
  };

  const propertiesDetails = properties
    .map((property, index) =>
      `${index + 1}. Property name ${property.propertyName}, Address: ${property.address}, Base price: ${property.basePrice}, Total bathrooms:${property.bathrooms}, Total bedrooms:${property.bedrooms}, Availability Status:${property.availabilityStatus} , Furnishing Status:${property.furnishingStatus}, City:${property.cityId?.name}, State:${property.stateId?.name}, Owner Name:${property.landlordId?.name}, Owner Email:${property.landlordId?.email}, Owner Number:${property.landlordId?.phoneno}`
    )
    .join("\n");

  const handleSendMessage = async () => {
    if (input.trim()) {
      // Display user's message
      setMessages([...messages, { sender: 'User', text: input }]);
      setInput('');

      const prompt = `
      PG Finder is a comprehensive digital platform that simplifies the process of finding and booking Paying Guest (PG) accommodations by connecting tenants, landlords, and administrators through a seamless web application. Tenants can explore PG listings using advanced filters like location, price, room type, gender preference, and amenities such as Wi-Fi, meals, and air conditioning. Listings include detailed descriptions, photos, and real-time availability, allowing for informed decisions. Secure payments are enabled via Razorpay integration, while a WebSocket-based messaging system facilitates instant communication between tenants and landlords. Landlords benefit from a powerful dashboard to manage PG listings, update availability, track revenue, and respond to tenant queries. Real-time analytics help optimize property performance. Administrators oversee the platform through an admin panel, managing user activities, resolving disputes, monitoring financial transactions, and assigning properties. Each user type—tenant, landlord, and admin—has access to a role-specific dashboard for managing tasks efficiently. PG Finder emphasizes a secure, scalable, and user-friendly experience, reducing the complexity of traditional PG bookings and ensuring transparency, convenience, and satisfaction for all stakeholders.

      Landlords Information:
      ${landlordsDetails}

      Properties Information:
      ${propertiesDetails}

      Based on this information, please provide a direct answer to the following question:
      "${input}"

      Respond with a clear, concise answer in text format only.
      `;

      // Call Google Generative AI to get the response
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Display chatbot response
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: 'AI Assistant', text }
      ]);
    }
  };

  const handleChatbotToggle = () => {
    setIsChatbotVisible(!isChatbotVisible);
  };

  const handleCloseChatbot = () => {
    setIsChatbotVisible(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Button */}
      {!isChatbotVisible && (
        <button
          onClick={handleChatbotToggle}
          className="bg-[#D96851] text-white p-4 rounded-full shadow-lg hover:bg-[#D96851] focus:outline-none focus:ring-2 focus:ring-[#D8B258]"
        >
          <span className="text-xl">💬</span>
        </button>
      )}

      {/* Chatbot Window */}
      {isChatbotVisible && (
        <div className="relative bg-white shadow-xl p-6 rounded-3xl w-[400px] md:w-[500px] h-[600px] flex flex-col">
          <h2 className="text-2xl font-bold text-center text-[#103538] mb-5">Q&A Helper</h2>

          {/* Close Button */}
          <button
            onClick={handleCloseChatbot}
            className="absolute top-3 right-3 text-[#D96851] font-semibold hover:text-[#D8B258] focus:outline-none"
          >
            ✖
          </button>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#f5f4ee] rounded-lg shadow-inner mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 mb-4 rounded-lg max-w-[80%] ${message.sender === 'User' ? 'ml-auto bg-[#D8B258] text-right' : 'mr-auto bg-[#759B87] text-left'}`}
              >
                <div className="font-semibold text-sm text-gray-700">{message.sender}:</div>
                <div>{message.text}</div>
              </div>
            ))}
            {isLoading && (
              <div className="text-gray-500 text-sm">AI Assistant is typing...</div>
            )}
          </div>

          {/* Input */}
          <div className="flex mt-auto">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-grow p-3 text-lg border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#D96851]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-[#D96851] text-white p-3 rounded-r-lg hover:bg-[#D8B258] focus:outline-none focus:ring-2 focus:ring-[#103538]"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantChatbot;
