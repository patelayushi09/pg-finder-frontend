import { useState } from "react";
import { Filter } from "lucide-react";

const PropertyFilter = ({ onApplyFilter }) => {
  const [furnishingFilter, setFurnishingFilter] = useState("");
  const [rentFilter, setRentFilter] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="flex items-center gap-2 px-4 py-2 border border-[#759B87] text-[#759B87] rounded-lg"
      >
        <Filter className="w-4 h-4" /> Filter
      </button>

      {/* Filter Dropdown */}
      {showFilter && (
        <div className="absolute right-0 top-12 bg-white shadow-md rounded-lg p-4 w-64 z-10 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-600">Furnishing:</label>
          <select
            className="w-full p-2 border rounded-md mt-1"
            value={furnishingFilter}
            onChange={(e) => setFurnishingFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Furnished">Furnished</option>
            <option value="Semi-Furnished">Semi-Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
          </select>

          <label className="block text-sm font-semibold text-gray-600 mt-3">Availability:</label>
          <select
            className="w-full p-2 border rounded-md mt-1"
            value={rentFilter}
            onChange={(e) => setRentFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
          </select>

          <button
            onClick={() => {
              setShowFilter(false);
              onApplyFilter(furnishingFilter, rentFilter);
            }}
            className="w-full mt-4 py-2 bg-[#D96851] text-white rounded-lg"
          >
            Apply Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyFilter;
