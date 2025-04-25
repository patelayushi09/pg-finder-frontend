
import { useEffect, useState } from "react"
import axios from "axios"
import PropertyCard from "../../components/PropertyCard"
import CreateBooking from "../../components/CreateBooking"
import PropertyDetails from "./FavoritesPropertyDetails"

function Favorites() {
  const [favoriteProperties, setFavoriteProperties] = useState([])
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [detailsProperty, setDetailsProperty] = useState(null)

  const fetchFavorites = async () => {
    try {
      const tenantId = localStorage.getItem("tenantId")

      if (!tenantId) {
        console.error("Tenant ID not found")
        return
      }

      const response = await axios.get(`https://pgfinderbackend.onrender.com/tenant/favorites/${tenantId}`)
      const properties = response.data.data || []

      const formattedProperties = properties.map((property) => ({
        ...property,
        _id: property.id || property._id,
        propertyName: property.propertyName,
        title: property.title,
        basePrice: property.basePrice,
        price: property.basePrice,
        cityId: { name: property.city || "Unknown City" },
        stateId: { name: property.state || "Unknown State" },
        areaId: { name: property.area || "Unknown Area" },
        furnishingStatus: property.furnishingStatus || "Not Specified",
        availabilityStatus: property.availabilityStatus || "Not Specified",
        bedrooms: property.bedrooms || "no bedroom",
        bathrooms: property.bathrooms || "no bathrooms",
        description: property.description || "No Description Available",
        address: property.address || "No Address",
        landlordId: {
          name: property.landlord?.name || "NA",
          email: property.landlord?.email || "NA",
          phoneno: property.landlord?.phoneno || "NA",
          _id: property.landlord?.id || property.landlord?._id
        },
        isFavorited: true,
      }));

      setFavoriteProperties(formattedProperties)

    } catch (error) {
      console.error("Error fetching favorites:", error)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  const handleFavoriteUpdate = () => {
    fetchFavorites()
  }

  const handleImageClick = (property) => {
    setDetailsProperty(property)
  }

  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1">
      <h2 className="text-2xl font-semibold text-[#103538]">Your Favorite Properties</h2>

      {favoriteProperties.length === 0 ? (
        <p className="text-gray-600">No favorite properties yet. Start adding some!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProperties.map((property) => (
            <div key={property._id || property.id}>
              <PropertyCard
                {...property}
                isFavorited={true}
                onFavorite={handleFavoriteUpdate}
                onImageClick={() => handleImageClick(property)}
                style={{ backgroundColor: "#FFFCF6", borderColor: "#EEE7DB" }}
              />
              {/* Book Now Button in Favorites */}
              <button
                className="mt-2 bg-[#a0ccb4] text-white px-4 py-2 rounded-lg w-full"
                onClick={() => setSelectedProperty(property)}
              >
                Book Now
              </button>

            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Book {selectedProperty.propertyName}</h2>

            <CreateBooking
              propertyId={selectedProperty._id}
              propertyName={selectedProperty.propertyName}
              price={selectedProperty.basePrice }  // Ensure price is correctly passed
              landlordId={selectedProperty.landlordId }
            />
            

            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg w-full"
              onClick={() => setSelectedProperty(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      

      {detailsProperty && <PropertyDetails property={detailsProperty} onClose={() => setDetailsProperty(null)} />}
    </div>
  )
}

export default Favorites

