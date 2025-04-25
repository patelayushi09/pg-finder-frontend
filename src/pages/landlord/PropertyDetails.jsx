import React from "react";
const PropertyDetails = ({ property, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-[#103538] mb-4">
          {property.propertyName || "No Property Name"}
        </h2>

        <div className="space-y-2">
          <p>
            <strong> Title:</strong> {property.title || "No Title"}
          </p>
          <p>
            <strong>Property Name:</strong> {property.propertyName || "No Property Name"}
          </p>
          <p>
            <strong>Address:</strong> {property.address || "No Address"}
          </p>
          <p>
            <strong>State:</strong> {property.stateId?.name || "Unknown State"}
          </p>
          <p>
            <strong>City:</strong> {property.cityId?.name || "Unknown City"}
          </p>
          <p>
            <strong>Area:</strong> {property.areaId?.name || "Unknown Area"}
          </p>
          <p>
            <strong>Base Price:</strong>{" "}
            {property.basePrice ? `₹${property.basePrice}` : "Not Available"}
          </p>
          <p>
            <strong>Bedrooms:</strong> {property.bedrooms|| "no bedroom"}
          </p>
          <p>
            <strong>Bathrooms:</strong> {property.bathrooms || "no bathrooms"}
          </p>
          <p>
            <strong>Furnishing Status:</strong>{" "}
            {property.furnishingStatus || "Not Specified"}
          </p>
          <p>
            <strong>Status:</strong> {property.availabilityStatus || "Not Specified"}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {property.description || "No Description Available"}
          </p>
        </div>

        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
