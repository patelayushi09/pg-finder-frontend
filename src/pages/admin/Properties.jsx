import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Filter, MoreVertical, MapPin } from "lucide-react";
import AddPropertyForm from "./AddPropertyForm";
import UpdatePropertyForm from "./UpdatePropertyForm";
import PropertyDetails from "../tenants/PropertyDetails";
import PropertyFilter from "./PropertyFilter";

const API_URL = "https://pgfinderbackend.onrender.com/admin/properties";

const Properties = () => {
  const [showForm, setShowForm] = useState(false);
  const [properties, setProperties] = useState([]); // Always initialize as an array
  const [updateProperty, setUpdateProperty] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [furnishingFilter, setFurnishingFilter] = useState("");
  const [rentFilter, setRentFilter] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(API_URL);
        console.log("API Response:", response.data); // Debugging log

        // Ensure data is an array
        if (Array.isArray(response.data)) {
          setProperties(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setProperties(response.data.data);
        } else {
          console.error("Unexpected API response format", response.data);
          setProperties([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]); // Ensure it's always an array
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Handle property update
  const handlePropertyUpdated = (updatedProperty) => {
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property._id === updatedProperty._id ? updatedProperty : property
      )
    );
  };

  // Delete a property
  const deleteProperty = async (propertyId) => {
    try {
      await axios.delete(`${API_URL}/${propertyId}`);
      setProperties((prev) => prev.filter((property) => property._id !== propertyId));
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  // Apply Filters
  const filteredProperties = Array.isArray(properties)
    ? properties.filter((property) => {
        return (
          (furnishingFilter ? property.furnishingStatus === furnishingFilter : true) &&
          (rentFilter ? property.availabilityStatus === rentFilter : true)
        );
      })
    : [];

  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#103538]">Property Listings</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#D96851] text-white rounded-lg"
          >
            <Plus className="w-4 h-4" /> Add Property
          </button>

          {/* Filter Button & Dropdown */}
          <PropertyFilter
            onApplyFilter={(furnishing, availability) => {
              setFurnishingFilter(furnishing);
              setRentFilter(availability);
            }}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading properties...</p>
      ) : filteredProperties.length === 0 ? (
        <p>No properties match your filter</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              onDelete={() => deleteProperty(property._id)}
              onUpdate={() => setUpdateProperty(property)}
              onViewDetails={() => setSelectedProperty(property)}
            />
          ))}
        </div>
      )}

      {/* Add Property */}
      {showForm && <AddPropertyForm onClose={() => setShowForm(false)} />}

      {/* Update Property */}
      {updateProperty && (
        <UpdatePropertyForm
          property={updateProperty}
          onClose={() => setUpdateProperty(null)}
          onPropertyUpdated={handlePropertyUpdated}
        />
      )}

      {/* Property Details */}
      {selectedProperty && <PropertyDetails property={selectedProperty} onClose={() => setSelectedProperty(null)} />}
    </div>
  );
};

const PropertyCard = ({ property, onDelete, onUpdate, onViewDetails }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm relative">
      {/* Property Image */}
      {property.image ? (
        <img
          src={property.image}
          alt={property.propertyName}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
          <span className="text-gray-500">No Image Available</span>
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#103538]">{property.propertyName}</h3>
          <p className="text-[#759B87] flex items-center gap-2">
            <MapPin className="w-4 h-4" /> {property.cityId?.name || "Unknown City"}
          </p>
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 bg-white shadow-md rounded-lg p-2 mt-1 z-10">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={onUpdate}
              >
                Update
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={onDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center text-sm mb-4">
        <span className="text-lg font-semibold text-[#103538]">₹{property.basePrice}</span>
        <span className="text-sm font-medium text-[#759B87] bg-[#DCD29F] px-3 py-1 rounded-md">
          {property.furnishingStatus || "Unknown"}
        </span>
      </div>

      <button
        className="w-full py-2 text-center border border-[#D96851] text-[#D96851] rounded-lg hover:bg-[#D96851] hover:text-white transition-colors"
        onClick={onViewDetails}
      >
        View Details
      </button>
    </div>
  );
};

export default Properties;
