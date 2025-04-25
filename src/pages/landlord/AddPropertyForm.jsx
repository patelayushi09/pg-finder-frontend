import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";

const AddPropertyForm = ({ onClose, onPropertyAdded }) => {
  const { register, handleSubmit, reset } = useForm();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    axios.get("https://pgfinderbackend.onrender.com/state/getallstates")
      .then((res) => setStates(res.data.data || []));
  }, []);

  useEffect(() => {
    if (!selectedState) return setCities([]);
    axios.get(`https://pgfinderbackend.onrender.com/city/getcitybystate/${selectedState}`)
      .then((res) => setCities(res.data.data || []));
  }, [selectedState]);

  useEffect(() => {
    if (!selectedCity) return setAreas([]);
    axios.get(`https://pgfinderbackend.onrender.com/area/getareabycityid/${selectedCity}`)
      .then((res) => setAreas(res.data.data || []));
  }, [selectedCity]);

  const handleFileChange = (fileList) => {
    const fileInfo = fileList?.allEntries[0];
    if (fileInfo?.cdnUrl) {
      setImage(fileInfo.cdnUrl);
      setImageError("");
    } else {
      setImageError("Image upload failed. Please try again.");
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    formData.append("stateId", selectedState);
    formData.append("cityId", selectedCity);
    formData.append("areaId", selectedArea);
    if (!image) {
      setImageError("Please upload an image.");
      setIsSubmitting(false);
      return;
    }
    formData.append("image", image);
    const token = localStorage.getItem("accessToken");

    try {
      const res = await axios.post("https://pgfinderbackend.onrender.com/landlord/properties", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      onPropertyAdded?.(res.data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center text-[#103538]">Add Property</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {[
            { label: "Title", name: "title" },
            { label: "Property Name", name: "propertyName" },
            { label: "Address", name: "address" },
            { label: "Base Price", name: "basePrice", type: "number" },
            { label: "Rating", name: "rating", type: "number" },
            { label: "Bedrooms", name: "bedrooms", type: "number" },
            { label: "Bathrooms", name: "bathrooms", type: "number" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name} className="border p-3 rounded shadow-sm">
              <label className="block text-sm font-semibold mb-1 text-gray-700">{label}:</label>
              <input
                type={type}
                {...register(name, { required: true })}
                className="w-full bg-transparent outline-none"
              />
            </div>
          ))}

          {/* Dropdowns */}
          <div className="border p-3 rounded shadow-sm">
            <label className="block text-sm font-semibold mb-1 text-gray-700">State:</label>
            <select value={selectedState} onChange={e => setSelectedState(e.target.value)} className="w-full bg-transparent outline-none">
              <option value="">Select State</option>
              {states.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>

          <div className="border p-3 rounded shadow-sm">
            <label className="block text-sm font-semibold mb-1 text-gray-700">City:</label>
            <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} disabled={!selectedState} className="w-full bg-transparent outline-none">
              <option value="">Select City</option>
              {cities.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          <div className="border p-3 rounded shadow-sm">
            <label className="block text-sm font-semibold mb-1 text-gray-700">Area:</label>
            <select value={selectedArea} onChange={e => setSelectedArea(e.target.value)} disabled={!selectedCity} className="w-full bg-transparent outline-none">
              <option value="">Select Area</option>
              {areas.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
            </select>
          </div>

          <div className="border p-3 rounded shadow-sm">
            <label className="block text-sm font-semibold mb-1 text-gray-700">Furnishing Status:</label>
            <select {...register("furnishingStatus", { required: true })} className="w-full bg-transparent outline-none">
              <option value="">Select Furnishing Status</option>
              <option value="Furnished">Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
            </select>
          </div>

          <div className="border p-3 rounded shadow-sm">
            <label className="block text-sm font-semibold mb-1 text-gray-700">Availability Status:</label>
            <select {...register("availabilityStatus", { required: true })} className="w-full bg-transparent outline-none">
              <option value="">Select Availability Status</option>
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2 border p-3 rounded shadow-sm">
            <label className="block text-sm font-semibold mb-1 text-gray-700">Description:</label>
            <textarea {...register("description", { required: true })} className="w-full h-20 bg-transparent outline-none resize-none"></textarea>
          </div>

          {/* File Uploader */}
          <div className="md:col-span-2 border p-3 rounded shadow-sm">
            <label className="block text-sm font-semibold mb-1 text-gray-700">Property Image:</label>
            <FileUploaderRegular
              onChange={handleFileChange}
              pubkey={import.meta.env.VITE_UPLOAD_CARE_PUBLIC_KEY}
              accept="image/*"
            />
            {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="bg-gray-300 px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-[#D96851] text-white px-4 py-2 rounded">
              {isSubmitting ? "Adding..." : "Add Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyForm;


