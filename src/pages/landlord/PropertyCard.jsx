import { Edit, Trash2, MapPin } from "lucide-react";

const PropertyCard = ({ property, onEdit, onDelete,onClick }) => {
  // Function to get image URL with fallback
  const getImageUrl = () => {
    if (property.image && typeof property.image === "string") {
      if (property.image.startsWith("http")) {
        return property.image;
      }
      return `https://pgfinderbackend.onrender.com/${property.image}`;
    }
    return "https://via.placeholder.com/150?text=No+Image";
  };

  return (
  <div
  className="flex items-center p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
  style={{ backgroundColor: "#FFFCF6", borderColor: "#EEE7DB" }}
  // Open details on click
>
  
   
     {/* Property Image */}
      <div className="w-24 h-24 mr-4 flex-shrink-0"  onClick={onClick}>
        <img
          src={getImageUrl()}
          alt={property.propertyName || "Property"}
          className="w-full h-full object-cover rounded-md"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://www.istockphoto.com/photo/cozy-living-room-with-yellow-walls-gm1362711189-434533675?utm_source=pixabay&utm_medium=affiliate&utm_campaign=sponsored_image&utm_content=srp_topbanner_media&utm_term=room";
          }}
        />
      </div>

      {/* Property Details */}
      <div className="flex-grow">
        <h3 className="text-lg font-medium" style={{ color: "#103538" }}>
          {property.propertyName || "Unnamed Property"}
        </h3>

        {/* Location - City & State */}
        <div className="flex items-center text-sm mt-1 space-x-2">
          {property.cityId?.name && (
            <div className="flex items-center" style={{ color: "#759B49" }}>
              <MapPin size={14} className="mr-1" />
              <span>{property.cityId?.name}</span>
            </div>
          )}
          {property.stateId?.name && (
            <div className="flex items-center" style={{ color: "#759B10", fontWeight: "500" }}> 
              <MapPin size={14} className="mr-1" />
              <span>{property.stateId?.name }</span>
            </div>
          )}
        </div>

        {/* Occupancy & Revenue */}
        <div className="flex mt-2 text-sm">
          <div className="mr-6">
            <span style={{ color: "#759B87" }}>Rating</span> 
            <div className="font-medium" style={{ color: "#D96851" }}>
              {property.rating}
            </div>
          </div>

          <div>
            <span style={{ color: "#759B87" }}>Monthly Revenue</span> 
            <div className="font-medium" style={{ color: "#D96851" }}>
              ₹{property.basePrice ? property.basePrice.toLocaleString() : "0"}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 ml-4">
        <button
          onClick={onEdit}
          className="p-2 rounded-full transition-colors"
          style={{ color: "#759B87", backgroundColor: "#F8F4EB" }}
          aria-label="Edit property"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-full transition-colors"
          style={{ color: "#D96851", backgroundColor: "#FDECEC" }}
          aria-label="Delete property"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;


  
     

