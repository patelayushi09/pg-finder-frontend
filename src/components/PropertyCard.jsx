
// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import { MapPin, Heart, Star } from 'lucide-react';
// import axios from 'axios';

// const getFurnishingStyles = (status) => {
//   switch (status?.toLowerCase()) {
//     case 'furnished': return 'bg-[#759B87] text-white';
//     case 'semi-furnished': return 'bg-[#D8B258] text-white';
//     case 'unfurnished': return 'bg-[#D96851] text-white';
//     default: return 'bg-gray-300 text-gray-700';
//   }
// };

// const renderStars = (rating) => {
//   const stars = [];
//   const filledStars = Math.round(rating);

//   for (let i = 1; i <= 5; i++) {
//     stars.push(
//       <Star 
//         key={i} 
//         className={`w-4 h-4 ${i <= filledStars ? 'text-[#D8B258] fill-[#D8B258]' : 'text-gray-300'}`} 
//       />
//     );
//   }
//   return stars;
// };

// export function PropertyCard({ _id, id, image, propertyName, cityId, stateId, basePrice, rating, furnishingStatus, onFavorite, isFavorited: initialIsFavorited = false }) {
//   const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
//   const propertyId = _id || id;

//   useEffect(() => {
//     setIsFavorited(initialIsFavorited);
//   }, [initialIsFavorited]);

//   const handleFavoriteClick = async () => {
//     try {
//       const tenantId = localStorage.getItem('tenantId');
      
//       if (!tenantId) {
//         console.error('Tenant ID not found');
//         return;
//       }

//       if (!propertyId) {
//         console.error("Property ID is missing in PropertyCard");
//         return;
//       }

//       if (isFavorited) {
//         // For delete request, send tenantId and propertyId as URL parameters
//         const response = await axios.delete(`https://pgfinderbackend.onrender.com/tenant/favorites/${tenantId}/${propertyId}`);
//         if (response.status === 200) {
//           setIsFavorited(false);
//           if (onFavorite) {
//             onFavorite();
//           }
//         }
//       } else {
//         // For post request, send data in the body
//         const response = await axios.post(`https://pgfinderbackend.onrender.com/tenant/favorites`, {
//           tenantId,
//           propertyId
//         });
//         if (response.status === 201) {
//           setIsFavorited(true);
//           if (onFavorite) {
//             onFavorite();
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Failed to update favorite:', error.response?.data || error);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
//       <div className="relative">
//         <img 
//           src={image || '/default-image.jpg'} 
//           alt={propertyName || 'Property'} 
//           className="w-full h-48 object-cover" 
//         />
//         <button 
//           className={`absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm transition ${
//             isFavorited ? 'text-red-500' : 'hover:text-[#D96851]'
//           }`} 
//           onClick={handleFavoriteClick}
//         >
//           <Heart className="w-5 h-5" fill={isFavorited ? '#D96851' : 'none'} />
//         </button>
//       </div>

//       <div className="p-4">
//         <h3 className="text-lg font-semibold text-[#103538]">
//           {propertyName || 'Unnamed Property'}
//         </h3>

//         <div className="flex items-center text-[#759B87] mb-3">
//           <MapPin className="w-4 h-4 mr-1" />
//           {/* <span className="text-sm">{cityId?.name || 'Unknown City'}, {stateId?.name|| 'Unknown State'}</span> */}
//           <span className="text-sm">{cityId?.name || cityId || 'Unknown City'}, {stateId?.name || stateId || 'Unknown State'}</span>

//         </div>

//         <div className="flex justify-between items-center">
//           <div>
//             <span className="text-2xl font-bold text-[#D96851]">
//               {basePrice ? `₹${basePrice}` : 'N/A'}
//             </span>
//             <span className="text-sm text-gray-500">/month</span>
//           </div>

//           <div className={`px-4 py-1 rounded-full text-sm font-medium ${getFurnishingStyles(furnishingStatus)}`}>
//             {furnishingStatus || 'Not Specified'}
//           </div>
//         </div>

//         {rating && (
//           <div className="flex items-center mt-2">
//             {renderStars(rating)}
//             <span className="text-sm text-gray-600 ml-2">({rating})</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// PropertyCard.propTypes = {
//   _id: PropTypes.string,
//   id: PropTypes.string,
//   image: PropTypes.string,
//   propertyName: PropTypes.string,
//   cityId: PropTypes.string,  
//   stateId: PropTypes.string, 
//   basePrice: PropTypes.string,
//   rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   furnishingStatus: PropTypes.string,
//   onFavorite: PropTypes.func.isRequired,
//   isFavorited: PropTypes.bool,
// };

// export default PropertyCard;


import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { MapPin, Heart, Star } from "lucide-react"
import axios from "axios"

const getFurnishingStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "furnished":
      return "bg-[#759B87] text-white"
    case "semi-furnished":
      return "bg-[#D8B258] text-white"
    case "unfurnished":
      return "bg-[#D96851] text-white"
    default:
      return "bg-gray-300 text-gray-700"
  }
}

const renderStars = (rating) => {
  const stars = []
  const filledStars = Math.round(rating)

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star key={i} className={`w-4 h-4 ${i <= filledStars ? "text-[#D8B258] fill-[#D8B258]" : "text-gray-300"}`} />,
    )
  }
  return stars
}

export function PropertyCard({
  _id,
  id,
  image,
  propertyName,
  cityId,
  stateId,
  basePrice,
  rating,
  furnishingStatus,
  onFavorite,
  onImageClick,
  isFavorited: initialIsFavorited = false,
}) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const propertyId = _id || id

  useEffect(() => {
    setIsFavorited(initialIsFavorited)
  }, [initialIsFavorited])

  const handleFavoriteClick = async (e) => {
    e.stopPropagation() // Prevent image click event from firing
    try {
      const tenantId = localStorage.getItem("tenantId")

      if (!tenantId) {
        console.error("Tenant ID not found")
        return
      }

      if (!propertyId) {
        console.error("Property ID is missing in PropertyCard")
        return
      }

      if (isFavorited) {
        // For delete request, send tenantId and propertyId as URL parameters
        const response = await axios.delete(`https://pgfinderbackend.onrender.com/tenant/favorites/${tenantId}/${propertyId}`)
        if (response.status === 200) {
          setIsFavorited(false)
          if (onFavorite) {
            onFavorite()
          }
        }
      } else {
        // For post request, send data in the body
        const response = await axios.post(`https://pgfinderbackend.onrender.com/tenant/favorites`, {
          tenantId,
          propertyId,
        })
        if (response.status === 201) {
          setIsFavorited(true)
          if (onFavorite) {
            onFavorite()
          }
        }
      }
    } catch (error) {
      console.error("Failed to update favorite:", error.response?.data || error)
    }
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={image || "/default-image.jpg"}
          alt={propertyName || "Property"}
          className="w-full h-48 object-cover cursor-pointer"
          onClick={onImageClick}
        />
        <button
          className={`absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm transition ${
            isFavorited ? "text-red-500" : "hover:text-[#D96851]"
          }`}
          onClick={handleFavoriteClick}
        >
          <Heart className="w-5 h-5" fill={isFavorited ? "#D96851" : "none"} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#103538]">{propertyName || "Unnamed Property"}</h3>

        <div className="flex items-center text-[#759B87] mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">
            {cityId?.name || cityId || "Unknown City"}, {stateId?.name || stateId || "Unknown State"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-[#D96851]">{basePrice ? `₹${basePrice}` : "N/A"}</span>
            <span className="text-sm text-gray-500">/month</span>
          </div>

          <div className={`px-4 py-1 rounded-full text-sm font-medium ${getFurnishingStyles(furnishingStatus)}`}>
            {furnishingStatus || "Not Specified"}
          </div>
        </div>

        {rating && (
          <div className="flex items-center mt-2">
            {renderStars(rating)}
            <span className="text-sm text-gray-600 ml-2">({rating})</span>
          </div>
        )}
      </div>
    </div>
  )
}

PropertyCard.propTypes = {
  _id: PropTypes.string,
  id: PropTypes.string,
  image: PropTypes.string,
  propertyName: PropTypes.string,
  cityId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  stateId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  basePrice: PropTypes.string,
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  furnishingStatus: PropTypes.string,
  onFavorite: PropTypes.func.isRequired,
  onImageClick: PropTypes.func,
  isFavorited: PropTypes.bool,
}

export default PropertyCard
