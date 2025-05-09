import { useState } from "react";
import { X } from "lucide-react";

const AddUserForm = ({ closeForm, fetchUsers }) => {
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({});

  // Define initial field structures
  const tenantFields = {
    firstName: "",
    lastName: "",
    email: "",
    phoneno: "",
    gender: "",
    createPassword: "",
    confirmPassword: "",
    status: "",
  };

  const landlordFields = {
    name: "",
    email: "",
    phoneno: "",
    agencyName: "",
    licenseNo: "",
    experienceYears: "",
    rating: "",
    address: "",
    createPassword: "",
    confirmPassword: "",
    status: "",
  };

  // Handle role selection
  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setFormData(selectedRole === "Tenant" ? tenantFields : landlordFields);
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://pgfinderbackend.onrender.com/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });

      if (response.ok) {
        fetchUsers();
        closeForm();
      } else {
        console.error("Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button className="absolute top-2 right-2 text-gray-600" onClick={closeForm}>
          <X className="w-5 h-5" />
        </button>

        {!role ? (
          // Role selection screen
          <div>
            <h2 className="text-xl font-bold mb-4">Select User Role</h2>
            <button
              className="bg-[#D96851] text-white p-2 rounded w-full mb-2"
              onClick={() => handleRoleSelect("Tenant")}
            >
              Add Tenant
            </button>
            <button
              className="bg-[#103538] text-white p-2 rounded w-full"
              onClick={() => handleRoleSelect("Landlord")}
            >
              Add Landlord
            </button>
          </div>
        ) : (
          // User Form based on role
          <div>
            <h2 className="text-xl font-bold mb-4">Add {role}</h2>
            <form onSubmit={handleSubmit}>
              <div className={`${role === "Landlord" ? "grid grid-cols-2 gap-4" : ""}`}>
                {Object.keys(formData).map((field) => (
                  <div className="mb-2" key={field}>
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type={field.toLowerCase().includes("password") ? "password" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                ))}
              </div>
              <button type="submit" className="bg-[#D96851] text-white p-2 rounded w-full mt-4">
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddUserForm;
