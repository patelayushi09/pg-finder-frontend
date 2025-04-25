import { useState } from "react";
import { X } from "lucide-react";

const UpdateUserForm = ({ user, closeForm, fetchUsers }) => {
  const initialData = user.role === "Tenant"
    ? { firstName: user.firstName, lastName: user.lastName, email: user.email, phoneno: user.phoneno, gender: user.gender, status: user.status }
    : { name: user.name, email: user.email, phoneno: user.phoneno, agencyName: user.agencyName, licenseNo: user.licenseNo, experienceYears: user.experienceYears, rating: user.rating, address: user.address, status: user.status };

  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://pgfinderbackend.onrender.com/admin/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchUsers();
        closeForm();
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button className="absolute top-2 right-2 text-gray-600" onClick={closeForm}>
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-4">Update {user.role}</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((field) => (
            <div className="mb-2" key={field}>
              <label className="block text-sm font-medium text-gray-700">{field}</label>
              <input type="text" name={field} value={formData[field]} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          ))}
          <button type="submit" className="bg-[#D96851] text-white p-2 rounded w-full">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserForm;
