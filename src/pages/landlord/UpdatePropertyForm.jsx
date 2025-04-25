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
  const [selectedArea, setSelectedArea] = useState(property?.areaId || "");

  // Fetch states
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

  // Fetch cities
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

  // Fetch areas
  useEffect(() => {
    if (!selectedCity || typeof selectedCity !== "string") {
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

  // Pre-fill form
  useEffect(() => {
    if (property) {
      setValue("title", property.title);
      setValue("propertyName", property.propertyName);
      setValue("address", property.address);
      setValue("basePrice", property.basePrice);
      setValue("description", property.description);
      setValue("furnishingStatus", property.furnishingStatus);
      setValue("availabilityStatus", property.availabilityStatus);

      setSelectedState(property.stateId);
      setSelectedCity(property.cityId);
      setSelectedArea(property.areaId);
    }
  }, [property, setValue]);

  const onSubmit = async (data) => {
    try {
      const updatedData = {
        ...data,
        stateId: selectedState,
        cityId: selectedCity,
        areaId: selectedArea,
      };
      const res = await axios.put(`https://pgfinderbackend.onrender.com/landlord/properties/${property._id}`, updatedData);
      onPropertyUpdated(res.data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-center w-full">Update Property</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" placeholder="Title" className="w-full p-2 border rounded" {...register("title", { required: true })} />
          <input type="text" placeholder="Property Name" className="w-full p-2 border rounded" {...register("propertyName", { required: true })} />

          <input type="text" placeholder="Address" className="w-full p-2 border rounded col-span-1 md:col-span-2" {...register("address", { required: true })} />

          {/* Location */}
          <select className="w-full p-2 border rounded" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state._id} value={state._id}>
                {state.name}
              </option>
            ))}
          </select>

          <select className="w-full p-2 border rounded" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedState}>
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </select>

          <select className="w-full p-2 border rounded" value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} disabled={!selectedCity}>
            <option value="">Select Area</option>
            {areas.map((area) => (
              <option key={area._id} value={area._id}>
                {area.name}
              </option>
            ))}
          </select>

          <input type="number" placeholder="Base Price" className="w-full p-2 border rounded" {...register("basePrice", { required: true })} />

          {/* Furnishing & Availability */}
          <select className="w-full p-2 border rounded" {...register("furnishingStatus", { required: true })}>
            <option value="">Furnishing Status</option>
            <option value="Furnished">Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
            <option value="Semi-Furnished">Semi-Furnished</option>
          </select>

          <select className="w-full p-2 border rounded" {...register("availabilityStatus", { required: true })}>
            <option value="">Availability</option>
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
          </select>

          {/* Description Full Width */}
          <textarea placeholder="Description" className="w-full p-2 border rounded col-span-1 md:col-span-2" rows={4} {...register("description", { required: true })}></textarea>

          {/* Actions */}
          <div className="col-span-1 md:col-span-2 flex justify-end gap-4">
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
