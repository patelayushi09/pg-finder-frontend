import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const ChatContext = createContext(undefined);

export function ChatProvider({ children }) {
  const [userType, setUserType] = useState("tenant");
  const [userId, setUserId] = useState(null);

  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  const [isLoading, setIsLoading] = useState({
    conversations: false,
    messages: false,
    sending: false,
  });
  const [error, setError] = useState(null);

  // Calculate total unread count
  const totalUnreadCount = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  // Determine user type and ID on mount
  useEffect(() => {
    const tenantId = localStorage.getItem("tenantId");
    const landlordId = localStorage.getItem("landlordId");

    if (tenantId) {
      setUserType("tenant");
      setUserId(tenantId);
    } else if (landlordId) {
      setUserType("landlord");
      setUserId(landlordId);
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (!userId) return;

    const newSocket = io("https://pgfinderbackend.onrender.com");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  // Register online status
  useEffect(() => {
    if (!socket || !userId) return;

    socket.emit("addNewUser", {
      userId,
      userType,
    });

    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users.map((user) => user.userId));
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket, userId, userType]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    socket.on("getMessage", (newMessage) => {
      if (selectedConversation?._id === newMessage.propertyId) {
        setMessages((prev) => [...prev, newMessage]);
        markAsRead(newMessage.propertyId);
      } else {
        setUnreadCounts((prev) => ({
          ...prev,
          [newMessage.propertyId]: (prev[newMessage.propertyId] || 0) + 1,
        }));
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === newMessage.propertyId
            ? {
                ...conv,
                lastMessage: {
                  content: newMessage.content,
                  createdAt: newMessage.createdAt,
                  senderId: newMessage.senderId,
                },
                unreadCount:
                  selectedConversation?._id === newMessage.propertyId ? 0 : (conv.unreadCount || 0) + 1,
              }
            : conv
        )
      );
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket, selectedConversation]);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!userId) return;

    setIsLoading((prev) => ({ ...prev, conversations: true }));
    setError(null);

    try {
      const endpoint = userType === "tenant" ? `/message/tenant/${userId}/conversations` : `/message/landlord/${userId}/conversations`;

      const response = await axios.get(`https://pgfinderbackend.onrender.com${endpoint}`);

      if (response.data.error === false) {
        setConversations(response.data.data);

        const counts = {};
        response.data.data.forEach((conv) => {
          counts[conv._id] = conv.unreadCount || 0;
        });
        setUnreadCounts(counts);
      } else {
        setError(response.data.message || "Failed to fetch conversations");
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setError("Failed to load conversations");
    } finally {
      setIsLoading((prev) => ({ ...prev, conversations: false }));
    }
  }, [userId, userType]);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (conversationId) => {
    setIsLoading((prev) => ({ ...prev, messages: true }));
    setError(null);

    try {
      const response = await axios.get(`https://pgfinderbackend.onrender.com/message/conversations/${conversationId}`);

      if (response.data.error === false) {
        setMessages(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages");
    } finally {
      setIsLoading((prev) => ({ ...prev, messages: false }));
    }
  }, []);

  // Select conversation and load messages
  const selectConversation = useCallback(
    (conversation) => {
      setSelectedConversation(conversation);
      fetchMessages(conversation._id);
      markAsRead(conversation._id);
    },
    [fetchMessages]
  );

  // Mark messages as read
  const markAsRead = useCallback(
    async (conversationId) => {
      if (!userId) return;

      try {
        await axios.put(`https://pgfinderbackend.onrender.com/message/read`, {
          conversationId,
          userId,
          userType,
        });

        setUnreadCounts((prev) => ({
          ...prev,
          [conversationId]: 0,
        }));

        setConversations((prev) =>
          prev.map((conv) => (conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv))
        );
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    },
    [userId, userType]
  );

  // Send message
  const sendMessage = useCallback(
    async (content) => {
      if (!content.trim() || !selectedConversation || !userId) return;

      setIsLoading((prev) => ({ ...prev, sending: true }));
      setError(null);

      const receiverType = userType === "tenant" ? "landlord" : "tenant";
      const receiverId = userType === "tenant" ? selectedConversation.participants.landlord._id : selectedConversation.participants.tenant._id;

      const messageData = {
        senderId: userId,
        receiverId,
        senderType: userType,
        receiverType,
        content,
        propertyId: selectedConversation.property._id,
      };

      try {
        const response = await axios.post(`https://pgfinderbackend.onrender.com/message`, messageData);

        if (response.data.error === false) {
          const newMessage = response.data.data;
          setMessages((prev) => [...prev, newMessage]);

          setConversations((prev) =>
            prev.map((conv) =>
              conv._id === selectedConversation._id
                ? {
                    ...conv,
                    lastMessage: {
                      content,
                      createdAt: new Date().toISOString(),
                      senderId: userId,
                    },
                  }
                : conv
            )
          );

          if (socket) {
            socket.emit("sendMessage", newMessage);
          }
        } else {
          setError(response.data.message || "Failed to send message");
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setError("Failed to send message");
      } finally {
        setIsLoading((prev) => ({ ...prev, sending: false }));
      }
    },
    [userId, selectedConversation, socket, userType]
  );

  useEffect(() => {
    if (userId) {
      fetchConversations();
    }
  }, [fetchConversations, userId]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        messages,
        selectedConversation,
        isLoading,
        error,
        onlineUsers,
        unreadCounts,
        selectConversation,
        sendMessage,
        markAsRead,
        totalUnreadCount,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}