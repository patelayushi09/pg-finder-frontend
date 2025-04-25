import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom"; 

export default function ChatNotification() {
  const { conversations, unreadCounts, selectConversation } = useChat();
  const { tenant, landlord } = useUser();
  const navigate = useNavigate(); 
  const [isOpen, setIsOpen] = useState(false);
  

  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  // Get unread conversations
  const unreadConversations = conversations.filter((conversation) => unreadCounts[conversation._id] > 0);

  const handleNotificationClick = (conversation) => {
    selectConversation(conversation);
    setIsOpen(false);

    // Navigate to the appropriate chat page
    if (tenant) {
      navigate("/tenant-dashboard/messages"); 
    } else if (landlord) {
      navigate("/landlord-dashboard/messages"); 
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".notification-container")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="notification-container relative">
      <button className="relative" onClick={() => setIsOpen(!isOpen)}>
        <Bell className="w-6 h-6 text-gray-600" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D96851] rounded-full flex items-center justify-center">
            <span className="text-xs text-white">{totalUnread}</span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 overflow-hidden">
          <div className="p-3 border-b bg-[#E6F0ED]">
            <h3 className="font-semibold text-[#103538]">Messages</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {unreadConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No new messages</div>
            ) : (
              unreadConversations.map((conversation) => (
                <button
                  key={conversation._id}
                  onClick={() => handleNotificationClick(conversation)}
                  className="w-full p-3 border-b hover:bg-gray-50 text-left flex items-center"
                >
                  <div className="h-10 w-10 bg-[#759B87] rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {tenant
                      ? conversation.participants.landlord.name.substring(0, 2).toUpperCase()
                      : `${conversation.participants.tenant.firstName.charAt(0)}${conversation.participants.tenant.lastName.charAt(0)}`}
                  </div>
                  <div>
                    <p className="font-medium text-[#103538]">
                      {tenant
                        ? conversation.participants.landlord.name
                        : `${conversation.participants.tenant.firstName} ${conversation.participants.tenant.lastName}`}
                    </p>
                    <p className="text-sm text-gray-600 truncate max-w-[200px]">
                      {conversation.lastMessage?.content || "New conversation"}
                    </p>
                    <p className="text-xs text-gray-500">{conversation.property.name}</p>
                  </div>
                  <span className="ml-auto bg-[#D96851] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCounts[conversation._id]}
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="p-2 border-t text-center">
            <button
              // onClick={() => {
              //   setIsOpen(false);
              //   if (tenant) {
              //     navigate("/tenant-dashboard/messages"); 
              //   } else if (landlord) {
              //     navigate("/landlord-dashboard/messages"); 
              //   }
              // }}
              onClick={() => {
                setIsOpen(false);
              
                // Auto-select first unread conversation (or any available)
                const defaultConversation =
                  unreadConversations[0] || conversations[0]; // fallback to first if no unread
              
                if (defaultConversation) {
                  selectConversation(defaultConversation);
                }
              
                if (tenant) {
                  navigate("/tenant/tenant-dashboard/messages");
                } else if (landlord) {
                  navigate("/landlord-dashboard/messages");
                }
              }}
              
              className="text-sm text-[#103538] hover:underline"
            >
              View all messages
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


