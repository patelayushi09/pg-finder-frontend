import { useEffect, useState } from "react";
import { Plus, Filter } from "lucide-react";
import UpdateUserForm from "./UpdateUserForm"; // Import Update Form
import AddUserForm from "./AddUserForm"; // Import Add Form

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false); // Toggle Filter Modal

  const [filter, setFilter] = useState({
    role: "",
    status: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://pgfinderbackend.onrender.com/admin/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchFilteredUsers = async () => {
    try {
      let query = `?role=${filter.role}&status=${filter.status.toLowerCase()}`; // Convert status to lowercase
      console.log("Fetching users with query:", query); // Debugging

      const response = await fetch(`https://pgfinderbackend.onrender.com/admin/users${query}`);
      const data = await response.json();

      console.log("Fetched Users:", data); // Debugging

      setUsers(data);
      setShowFilter(false);
    } catch (error) {
      console.error("Error fetching filtered users:", error);
    }
  };


  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`https://pgfinderbackend.onrender.com/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
        console.log("User deleted successfully");
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="space-y-6 p-8 bg-cream/10 min-h-screen flex-1 ml-64">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#103538]">User Management</h2>
        <div className="flex gap-4 relative">
          {/* Add User Button */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#D96851] text-white rounded-lg"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4" /> Add User
          </button>

          {/* Filter Button */}
          <button
            className="flex items-center gap-2 px-4 py-2 border border-[#759B87] text-[#759B87] rounded-lg"
            onClick={() => setShowFilter(!showFilter)}
          >
            <Filter className="w-4 h-4" /> Filter
          </button>

          {/* Filter Modal */}
          {showFilter && (
            <div className="absolute bg-white shadow-lg p-4 border rounded mt-2 right-0 w-64">
              <label className="block text-sm font-medium text-gray-700">Role:</label>
              <select
                className="w-full p-2 border rounded mt-1"
                value={filter.role}
                onChange={(e) => setFilter({ ...filter, role: e.target.value })}
              >
                <option value="">All</option>
                <option value="Tenant">Tenant</option>
                <option value="Landlord">Landlord</option>
              </select>

              <label className="block text-sm font-medium text-gray-700 mt-3">Status:</label>
              <select
                className="w-full p-2 border rounded mt-1"
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value.toLowerCase() })} // Ensure lowercase
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
              </select>


              <button
                onClick={fetchFilteredUsers}
                className="mt-3 bg-[#D96851] text-white p-2 rounded w-full"
              >
                Apply Filter
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#103538] text-white">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Phone No</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <UserRow key={user._id} user={user} deleteUser={deleteUser} setSelectedUser={setSelectedUser} />
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Show Update User Form if a user is selected */}
      {selectedUser && (
        <UpdateUserForm user={selectedUser} closeForm={() => setSelectedUser(null)} fetchUsers={fetchUsers} />
      )}

      {/* Show Add User Form when Add User button is clicked */}
      {showAddForm && <AddUserForm closeForm={() => setShowAddForm(false)} fetchUsers={fetchUsers} />}
    </div>
  );
};

const UserRow = ({ user, deleteUser, setSelectedUser }) => {
  return (
    <tr className="border-b border-gray-100">
      <td className="px-6 py-4">{user.name || `${user.firstName} ${user.lastName}`}</td>
      <td className="px-6 py-4">{user.role}</td>
      <td className="px-6 py-4">{user.email}</td>
      <td className="px-6 py-4">{user.phoneno}</td>
      <td className="px-6 py-4">
        <span
          className={`px-2 py-1 rounded-full text-xs ${user.status?.toLowerCase() === "active"
              ? "bg-green-100 text-green-600"
              : user.status?.toLowerCase() === "pending"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-gray-100 text-gray-600"
            }`}
        >
          {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1).toLowerCase() : "N/A"}
        </span>
      </td>



      <td className="px-6 py-4">
        <button
          className="text-[#759B87] hover:text-[#103538] focus:outline-none mr-2"
          onClick={() => setSelectedUser(user)}
        >
          Update
        </button>
        <button
          className="text-red-600 hover:text-red-800 focus:outline-none"
          onClick={() => deleteUser(user._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default Users;
