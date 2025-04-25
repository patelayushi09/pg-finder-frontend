import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const UpdatePropertyForm = ({ property, onClose, onPropertyUpdated }) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedState, setSelectedState] = useState(property?.stateId || "");
  const [selectedCity, setSelectedCity] = useState(property?.cityId || "");

  // Fetch all states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get("https://pgfinderbackend.onrender.com/state/getallstates");
        setStates(res.data.data || []);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    fetchStates();
  }, []);

  // Fetch cities when selectedState changes
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      return;
    }
    const fetchCities = async () => {
      try {
        const res = await axios.get(`https://pgfinderbackend.onrender.com/city/getcitybystate/${selectedState}`);
        setCities(res.data.data || []);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, [selectedState]);

  // Fetch areas when selectedCity changes
  useEffect(() => {
    if (!selectedCity) {
      setAreas([]);
      return;
    }
    const fetchAreas = async () => {
      try {
        const res = await axios.get(`https://pgfinderbackend.onrender.com/area/getareabycityid/${selectedCity}`);
        setAreas(res.data.data || []);
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    };
    fetchAreas();
  }, [selectedCity]);

  // Pre-fill form with existing property details
  useEffect(() => {
    if (property) {
      Object.keys(property).forEach((key) => setValue(key, property[key]));
    }
  }, [property, setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const updatedData = {
        ...data,
        stateId: selectedState,
        cityId: selectedCity,
      };
      const res = await axios.put(`https://pgfinderbackend.onrender.com/admin/properties/${property._id}`, updatedData);
      onPropertyUpdated(res.data); // Call onPropertyUpdated with updated property data
      reset();
      onClose();
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Update Property</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border rounded"
            {...register("title", { required: true })}
          />
          <input
            type="text"
            placeholder="Property Name"
            className="w-full p-2 border rounded"
            {...register("propertyName", { required: true })}
          />
          <input
            type="text"
            placeholder="Address"
            className="w-full p-2 border rounded"
            {...register("address", { required: true })}
          />

          {/* State Dropdown */}
          <select
            className="w-full p-2 border rounded"
            {...register("stateId", { required: true })}
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state._id} value={state._id}>
                {state.name}
              </option>
            ))}
          </select>

          {/* City Dropdown */}
          <select
            className="w-full p-2 border rounded"
            {...register("cityId", { required: true })}
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedState}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>

          {/* Area Dropdown */}
          <select
            className="w-full p-2 border rounded"
            {...register("areaId", { required: true })}
            disabled={!selectedCity}
          >
            <option value="">Select Area</option>
            {areas.map((area) => (
              <option key={area._id} value={area._id}>
                {area.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Base Price"
            className="w-full p-2 border rounded"
            {...register("basePrice", { required: true })}
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded"
            {...register("description", { required: true })}
          ></textarea>

          {/* Furnishing Status Dropdown */}
          <select
            className="w-full p-2 border rounded"
            {...register("furnishingStatus", { required: true })}
          >
            <option value="">Select Furnishing Status</option>
            <option value="Furnished">Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
            <option value="Semi-Furnished">Semi-Furnished</option>
          </select>

          {/* Availability Status Dropdown */}
          <select
            className="w-full p-2 border rounded"
            {...register("availabilityStatus", { required: true })}
          >
            <option value="">Select Status</option>
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
          </select>

          <div className="flex justify-end space-x-4">
            <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[#D96851] text-white rounded">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePropertyForm;
