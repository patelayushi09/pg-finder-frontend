import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [tenant, setTenant] = useState(null);
  const [landlord, setLandlord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      const tenantId = localStorage.getItem("tenantId");
      const landlordId = localStorage.getItem("landlordId");

      if (!token || (!tenantId && !landlordId)) {
        setTenant(null);
        setLandlord(null);
        setIsLoading(false);
        return;
      }

      if (tenantId) {
        const tenantResponse = await axios.get(`https://pgfinderbackend.onrender.com/tenant/${tenantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (tenantResponse.data.error === false) {
          setTenant(tenantResponse.data.data);
        } else {
          setError(tenantResponse.data.message || "Failed to fetch tenant data");
          setTenant(null);
        }
      }

      if (landlordId) {
        const landlordResponse = await axios.get(`https://pgfinderbackend.onrender.com/landlord/${landlordId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (landlordResponse.data.error === false) {
          setLandlord(landlordResponse.data.data);
        } else {
          setError(landlordResponse.data.message || "Failed to fetch landlord data");
          setLandlord(null);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data");
      setTenant(null);
      setLandlord(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTenant = (updatedTenant) => {
    setTenant((prev) => (prev ? { ...prev, ...updatedTenant } : null));
  };

  const updateLandlord = (updatedLandlord) => {
    setLandlord((prev) => (prev ? { ...prev, ...updatedLandlord } : null));
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider
      value={{
        tenant,
        landlord,
        isLoading,
        error,
        updateTenant,
        updateLandlord,
        refreshUser: fetchUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}