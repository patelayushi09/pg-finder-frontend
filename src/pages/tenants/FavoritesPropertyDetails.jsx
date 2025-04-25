import React from "react";

const FavoritesPropertyDetails = ({ property, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-[#103538] mb-4">
          {property.propertyName}
        </h2>

        <div className="space-y-2">
          <p>
            <strong>Title:</strong> {property.title}
          </p>
          <p>
            <strong>Property Name:</strong> {property.propertyName}
          </p>
          <p>
            <strong>Address:</strong> {property.address}
          </p>
          <p>
            <strong>Owner:</strong> {property.landlord?.name}
          </p>
          <p>
            <strong>Owner Email:</strong> {property.landlord?.email}
          </p>
          <p>
            <strong>Owner Phone No:</strong> {property.landlord?.phoneno}
          </p>
          <p>
            <strong>State:</strong> {property.stateId?.name}
          </p>
          <p>
            <strong>City:</strong> {property.cityId?.name}
          </p>
          <p>
            <strong>Area:</strong> {property.areaId?.name}
          </p>
          <p>
            <strong>Base Price:</strong> ₹{property.basePrice}
          </p>
          <p>
            <strong>Bedrooms:</strong> {property.bedrooms}
          </p>
          <p>
            <strong>Bathrooms:</strong> {property.bathrooms}
          </p>
          <p>
            <strong>Furnishing Status:</strong> {property.furnishingStatus}
          </p>
          <p>
            <strong>Status:</strong> {property.availabilityStatus}
          </p>
          <p>
            <strong>Description:</strong> {property.description}
          </p>
        </div>

        <div className="mt-4 flex justify-end">
          <button 
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition-colors" 
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPropertyDetails;