import { useState, useEffect } from "react";
import axios from "axios";
import { User } from "lucide-react";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";

const SettingBox = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
  });

  const [image, setImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLandlordData();
  }, []);

  const fetchLandlordData = async () => {
    setIsLoading(true);
    try {
        const token = localStorage.getItem("accessToken");
        const landlordId = localStorage.getItem("landlordId");

        console.log("Fetching landlord data for ID:", landlordId); // Debugging

        if (!landlordId) {
            console.error("Landlord ID is missing in localStorage");
            return;
        }

        const response = await axios.get(`https://pgfinderbackend.onrender.com/landlord/${landlordId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response.data); // Debugging

        const { name, email, phoneno, location, profileImage } = response.data.data;

        setFormData({
            fullName: name || "",
            email: email || "",
            phone: phoneno || "",
            location: location || "",
        });

        setImage(profileImage || "");
    } catch (error) {
        console.error("Error fetching landlord data:", error.response?.data || error.message);
    } finally {
        setIsLoading(false);
    }
};

  const handleFileChange = async (fileList) => {
    if (fileList?.allEntries?.length > 0) {
      setIsUploading(true);
      const fileInfo = fileList.allEntries[0];
      if (fileInfo.cdnUrl) {
        setImage(fileInfo.cdnUrl);
        try {
          const landlordId = localStorage.getItem("landlordId");
          const token = localStorage.getItem("accessToken");
          await axios.put(`https://pgfinderbackend.onrender.com/landlord/${landlordId}`, { profileImage: fileInfo.cdnUrl }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          console.error("Failed to save image");
        }
      }
      setIsUploading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    try {
      const landlordId = localStorage.getItem("landlordId");
      const token = localStorage.getItem("accessToken");
      await axios.put(`https://pgfinderbackend.onrender.com/landlord/${landlordId}`, {
        name: formData.fullName,
        email: formData.email,
        phoneno: formData.phone,
        location: formData.location,
        profileImage: image,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-8 bg-[#F5F5F1] min-h-screen flex flex-col items-center">
      <h2 className="text-xl font-semibold text-[#103538] mb-6">Profile Settings</h2>
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-gray-300">
          <img src={image || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
          <label className="absolute bottom-1 right-1 bg-[#103538] text-white p-2 rounded-full cursor-pointer">
            <User className="w-4 h-4" />
            <FileUploaderRegular onChange={handleFileChange} pubkey={import.meta.env.VITE_UPLOAD_CARE_PUBLIC_KEY} accept="image/*" multiple={false} className="absolute inset-0 opacity-0 cursor-pointer" />
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-3xl">
        {['fullName', 'email', 'phone', 'location'].map((field, idx) => (
          <div key={idx} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input type={field === "email" ? "email" : "text"} name={field} value={formData[field]} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-md focus:ring-[#103538] focus:outline-none" />
          </div>
        ))}
      </div>
      <div className="flex justify-end w-full max-w-3xl mt-6">
        <button onClick={fetchLandlordData} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50">Cancel</button>
        <button onClick={handleSaveChanges} className="px-4 py-2 bg-[#103538] text-white rounded-md hover:bg-opacity-90">Save Changes</button>
      </div>
    </div>
  );
};

export default SettingBox;
