import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const PGLocationSelector = ({ onSelect }) => {
  const { register, handleSubmit, reset } = useForm();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  // Fetch all states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get("https://pgfinderbackend.onrender.com/state/getallstates");
        setStates(res.data.data || []);
      } catch (error) {
        console.error("Error fetching states:", error);
        setStates([]);
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
        setCities([]);
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
        setAreas([]);
      }
    };
    fetchAreas();
  }, [selectedCity]);

  // Handle form submission
  const submitHandler = (data) => {
    console.log("Selected Location:", data);
    onSelect?.(data);

    // Reset form fields
    reset(); // Reset react-hook-form values
    setSelectedState("");
    setSelectedCity("");
    setSelectedArea("");
    setCities([]); // Clear cities dropdown
    setAreas([]); // Clear areas dropdown
  };

  return (
    <div className="relative bg-gradient-to-br from-[#F6F4EB] via-[#E3DAC9] to-[#D8B258] min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-1/2">
        <svg className="absolute top-0 w-full" viewBox="0 0 1440 320">
          <path fill="#D96851" d="M0,160L80,186.7C160,213,320,267,480,277.3C640,288,800,256,960,234.7C1120,213,1280,203,1360,208L1440,224V0H0Z"></path>
          <path fill="#D8B258" fillOpacity="0.4" d="M0,224L100,192C200,160,400,96,600,128C800,160,1000,288,1200,304C1400,320,1600,256,1700,224L1800,192V0H0Z"></path>
        </svg>
      </div>

      {/* Form Container */}
      <div className="relative bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md z-10 text-center border border-gray-200 backdrop-blur-lg bg-opacity-90">
        <h2 className="text-3xl font-bold text-[#103538]">Select PG Location</h2>
        <p className="text-gray-500 mb-6">Choose your state, city, and area</p>

        <form onSubmit={handleSubmit(submitHandler)}>
          {/* State Dropdown */}
          <div>
            <label className="block text-left text-gray-700 font-semibold mb-2">Select State</label>
            <select
              className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#759B87] transition"
              {...register("stateId", { required: true })}
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state._id} value={state._id}>{state.name}</option>
              ))}
            </select>
          </div>

          {/* City Dropdown */}
          <div className="mt-4">
            <label className="block text-left text-gray-700 font-semibold mb-2">Select City</label>
            <select
              className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#759B87] transition"
              {...register("cityId", { required: true })}
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedState || cities.length === 0} // Disable if no cities
            >
              <option value="">Select City</option>
              {cities.length > 0 ? (
                cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))
              ) : (
                <option disabled>No cities available</option>
              )}
            </select>
          </div>

          {/* Area Dropdown */}
          <div className="mt-4">
            <label className="block text-left text-gray-700 font-semibold mb-2">Select Area</label>
            <select
              className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#759B87] transition"
              {...register("areaId", { required: true })}
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              disabled={!selectedCity || areas.length === 0} // Disable if no areas
            >
              <option value="">Select Area</option>
              {areas.length > 0 ? (
                areas.map((area) => (
                  <option key={area._id} value={area._id}>
                    {area.name}
                  </option>
                ))
              ) : (
                <option disabled>No areas available</option>
              )}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-[#103538] text-white py-3 rounded-lg font-semibold hover:bg-[#759B87] transition shadow-lg transform hover:scale-105 hover:shadow-xl"
          >
            Confirm Selection
          </button>
        </form>
      </div>
    </div>
  );
};

export default PGLocationSelector;
