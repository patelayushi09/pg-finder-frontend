import { useState, useEffect } from "react"
import axios from "axios"
import { User } from "lucide-react"
import { FileUploaderRegular } from "@uploadcare/react-uploader"
import "@uploadcare/react-uploader/core.css"

function Settings() {
  const [tenant, setTenant] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneno: "",
    location: "",
    profileImage: "",

  })

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
  })

  const [image, setImage] = useState("")
  const [imageError, setImageError] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTenantData()
  }, [])

  const fetchTenantData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("accessToken")
      const tenantId = localStorage.getItem("tenantId")

      const response = await axios.get(`https://pgfinderbackend.onrender.com/tenant/${tenantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const tenantData = response.data.data
      setTenant(tenantData)

      setFormData({
        fullName: `${tenantData.firstName || ""} ${tenantData.lastName || ""}`.trim(),
        email: tenantData.email || "",
        phone: tenantData.phoneno || "",
        location: tenantData.location || "",
      })

      setImage(tenantData.profileImage || "")
    } catch (error) {
      console.error("Error fetching tenant data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = async (fileList) => {
    if (fileList && fileList.allEntries && fileList.allEntries.length > 0) {
      const fileInfo = fileList.allEntries[0]
      setIsUploading(true)

      if (fileInfo.cdnUrl) {
        setImage(fileInfo.cdnUrl)
        setImageError("")

        // Immediately update the profile image in the database
        try {
          const tenantId = localStorage.getItem("tenantId")
          const token = localStorage.getItem("accessToken")

          const updateData = {
            profileImage: fileInfo.cdnUrl,
          }

          const response = await axios.put(`https://pgfinderbackend.onrender.com/tenant/${tenantId}`, updateData, {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (response.data.error === false) {
            // Update the tenant state with the new image
            setTenant((prevTenant) => ({
              ...prevTenant,
              profileImage: fileInfo.cdnUrl,
            }))
            console.log("Profile image updated successfully")
          } else {
            console.error("Failed to update profile image:", response.data.message)
            setImageError("Failed to save image to database")
          }
        } catch (error) {
          console.error("Error updating profile image:", error)
          setImageError("Failed to save image to database")
        }
      } else {
        setImageError("Image upload failed. Please try again.")
      }

      setIsUploading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSaveChanges = async () => {
    try {
      const tenantId = localStorage.getItem("tenantId")
      const token = localStorage.getItem("accessToken")

      const [firstName, ...lastNameParts] = formData.fullName.split(" ")
      const lastName = lastNameParts.join(" ")

      const updateData = {
        firstName,
        lastName,
        email: formData.email,
        phoneno: formData.phone,
        location: formData.location,
        profileImage: image || tenant.profileImage,
      }

      const response = await axios.put(`https://pgfinderbackend.onrender.com/tenant/${tenantId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.error === false) {
        await fetchTenantData()
        alert("Profile updated successfully!")
      } else {
        alert(response.data.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#103538]"></div>
      </div>
    )
  }

  return (
    
      <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1">
        <h2 className="text-xl font-semibold text-[#103538] mb-6">Profile Settings</h2>

        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center">
              <img
                src={image || tenant.profileImage || "/placeholder.svg?height=96&width=96"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md">
              <label className="cursor-pointer flex items-center justify-center bg-[#103538] text-white p-2 rounded-full hover:bg-opacity-90">
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <User className="w-4 h-4" />
                )}
                <FileUploaderRegular
                  onChange={handleFileChange}
                  pubkey={import.meta.env.VITE_UPLOAD_CARE_PUBLIC_KEY}
                  accept="image/*"
                  multiple={false}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
          </div>


          {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#103538]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#103538]"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#103538]"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#103538]"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={fetchTenantData}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-[#103538] text-white rounded-md hover:bg-opacity-90"
          >
            Save Changes
          </button>
        </div>
      </div>
   
  )
}

export default Settings

