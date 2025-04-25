import { useState, useEffect } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import { FileUploaderRegular } from "@uploadcare/react-uploader"
import "@uploadcare/react-uploader/core.css"

const AddPropertyForm = ({ onClose, onPropertyAdded }) => {
  const { register, handleSubmit, reset } = useForm()
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [areas, setAreas] = useState([])
  const [landlords, setLandlords] = useState([])
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedArea, setSelectedArea] = useState("")
  const [selectedLandlord, setSelectedLandlord] = useState("")
  const [image, setImage] = useState("")
  const [imageError, setImageError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch all states
  useEffect(() => {
    axios
      .get("https://pgfinderbackend.onrender.com/state/getallstates")
      .then((res) => setStates(res.data.data || []))
      .catch((error) => console.error("Error fetching states:", error))
  }, [])

  // Fetch all landlords
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    setIsLoading(true)

    axios
      .get("https://pgfinderbackend.onrender.com/admin/landlords", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      .then((res) => {
        setLandlords(res.data.data || [])
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching landlords:", error)
        setIsLoading(false)
      })
  }, [])

  // Fetch cities when selectedState changes
  useEffect(() => {
    if (!selectedState) {
      setCities([])
      return
    }
    axios
      .get(`https://pgfinderbackend.onrender.com/city/getcitybystate/${selectedState}`)
      .then((res) => setCities(res.data.data || []))
      .catch((error) => console.error("Error fetching cities:", error))
  }, [selectedState])

  // Fetch areas when selectedCity changes
  useEffect(() => {
    if (!selectedCity) {
      setAreas([])
      return
    }
    axios
      .get(`https://pgfinderbackend.onrender.com/area/getareabycityid/${selectedCity}`)
      .then((res) => setAreas(res.data.data || []))
      .catch((error) => console.error("Error fetching areas:", error))
  }, [selectedCity])

  const handleFileChange = (fileList) => {
    if (fileList && fileList.allEntries.length > 0) {
      const fileInfo = fileList.allEntries[0]

      // console.log("🔹 File Info:", fileInfo) // Debugging log

      if (fileInfo.cdnUrl) {
        setImage(fileInfo.cdnUrl) // Save URL to state
        setImageError("") // Clear error
      } else {
        setImageError("Image upload failed. Please try again.")
      }
    }
  }



  const onSubmit = async (data) => {
    if (!selectedLandlord) {
      alert("Please select a landlord before submitting!");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...data,
      stateId: selectedState,
      cityId: selectedCity,
      areaId: selectedArea,
      landlordId: selectedLandlord,  //  Ensure landlordId is included
      image: image || "",
    };

    const token = localStorage.getItem("accessToken");



    try {
      const res = await axios.post("https://pgfinderbackend.onrender.com/admin/properties", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      console.log("🔹 Response from server:", res.data);
      onPropertyAdded && onPropertyAdded(res.data);
      reset();
      onClose();
    } catch (error) {
      console.error(" Error adding property:", error.response?.data || error.message);
      alert("Failed to add property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Property for Landlord</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D96851]"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Landlord */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Landlord*</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedLandlord}
                onChange={(e) => setSelectedLandlord(e.target.value)}
                required
              >
                <option value="">Select Landlord</option>
                {landlords.map((landlord) => (
                  <option key={landlord._id} value={landlord._id}>
                    {landlord.name} ({landlord.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
              <input
                type="text"
                placeholder="Property Title"
                className="w-full p-2 border rounded"
                {...register("title", { required: true })}
              />
            </div>

            {/* Property Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Name*</label>
              <input
                type="text"
                placeholder="Property Name"
                className="w-full p-2 border rounded"
                {...register("propertyName", { required: true })}
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
              <input
                type="text"
                placeholder="Full Address"
                className="w-full p-2 border rounded"
                {...register("address", { required: true })}
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                required
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state._id} value={state._id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedState}
                required
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area*</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                disabled={!selectedCity}
                required
              >
                <option value="">Select Area</option>
                {areas.map((area) => (
                  <option key={area._id} value={area._id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Base Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price*</label>
              <input
                type="number"
                placeholder="Base Price"
                className="w-full p-2 border rounded"
                {...register("basePrice", { required: true })}
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="Rating (0-5)"
                className="w-full p-2 border rounded"
                {...register("rating", { required: true, valueAsNumber: true })}
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms*</label>
              <input
                type="number"
                placeholder="Bedrooms"
                className="w-full p-2 border rounded"
                {...register("bedrooms", { required: true })}
              />
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms*</label>
              <input
                type="number"
                placeholder="Bathrooms"
                className="w-full p-2 border rounded"
                {...register("bathrooms", { required: true })}
              />
            </div>

            {/* Furnishing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing Status*</label>
              <select className="w-full p-2 border rounded" {...register("furnishingStatus", { required: true })}>
                <option value="">Select Furnishing</option>
                <option value="Furnished">Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability*</label>
              <select className="w-full p-2 border rounded" {...register("availabilityStatus", { required: true })}>
                <option value="">Select Status</option>
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
              </select>
            </div>

            {/* Description (full width) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
              <textarea
                placeholder="Property Description"
                className="w-full p-2 border rounded"
                rows={4}
                {...register("description", { required: true })}
              ></textarea>
            </div>

            {/* Image Upload (full width) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Property Image*</label>
              <FileUploaderRegular
                onChange={handleFileChange}
                pubkey={import.meta.env.VITE_UPLOAD_CARE_PUBLIC_KEY}
                accept="image/*"
                className="file-uploader"
              />
              {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
              {image && (
                <div className="mt-2">
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Property preview"
                    className="h-20 w-auto object-cover rounded"
                  />
                </div>
              )}
            </div>

            {/* Buttons (full width) */}
            <div className="flex justify-end space-x-4 pt-2 md:col-span-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#D96851] text-white rounded hover:bg-[#c55a45] transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Property"}
              </button>
            </div>
          </form>

        )}
      </div>
    </div>
  )
}

export default AddPropertyForm

