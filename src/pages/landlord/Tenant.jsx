import React, { useEffect, useState } from "react";
import axios from "axios";
import { Phone, Mail, X } from "lucide-react";

const Tenant = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState(null);

  useEffect(() => {
    const fetchConfirmedTenants = async () => {
      try {
        const response = await axios.get("https://pgfinderbackend.onrender.com/landlord/tenants/confirmed");
        setTenants(response.data.tenants);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmedTenants();
  }, []);

  const handleMailClick = (tenant) => {
    setSelectedTenant(tenant);
  };

  const closeModal = () => {
    setSelectedTenant(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D8B258]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
      <h3 className="text-xl font-bold text-[#103538] mb-6">Confirmed Tenants</h3>
      {tenants.length === 0 ? (
        <p className="text-center text-gray-500">No confirmed tenants available.</p>
      ) : (
        <div className="space-y-4">
          {tenants.map((tenant) => (
            <div key={tenant.id} className="p-6 rounded-2xl shadow-md border border-gray-200 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-[#103538]">{tenant.name}</h4>
                  <p className="text-sm text-[#D96851]">
                    <span className="font-bold">{tenant.propertyName}</span>
                  </p>
                  <div className="mt-2 flex items-center space-x-6 text-gray-600 text-sm">
                    <p>Joined: {tenant.joinDate}</p>
                    <p className="flex items-center">
                      <Phone size={16} className="mr-2 text-[#D96851]" /> {tenant.contact}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    className="p-2 text-[#759B87] hover:bg-[#759B87]/10 rounded-full transition"
                    onClick={() => handleMailClick(tenant)}
                  >
                    <Mail size={22} />
                  </button>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Email Popup Modal */}
      {selectedTenant && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
            <button className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700" onClick={closeModal}>
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold text-[#103538] mb-4">Tenant Email</h3>
            <p className="text-gray-700">{selectedTenant.email}</p>
            <button
              className="mt-4 px-4 py-2 bg-[#759B87] text-white rounded-lg hover:bg-[#5d8572] transition"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tenant;
