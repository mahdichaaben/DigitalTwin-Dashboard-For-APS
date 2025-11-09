import { useEffect, useState } from "react";
import axios from "@/api/axios";
import { Users, Shield, Save, RefreshCw } from "lucide-react";

const ROLES = [
  { value: "Admin", label: "Admin", color: "bg-red-100 text-red-800" },
  { value: "Operator", label: "Operator", color: "bg-blue-100 text-blue-800" },
  { value: "Viewer", label: "Viewer", color: "bg-gray-100 text-gray-800" },
];

export default function UserAccessSettings() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [pendingChanges, setPendingChanges] = useState({});

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/User");
      setUsers(res.data);
      setPendingChanges({});
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = (userId, newRole) => {
    setPendingChanges(prev => ({
      ...prev,
      [userId]: newRole
    }));
  };

  const saveRoleChange = async (userId) => {
    const newRole = pendingChanges[userId];
    if (!newRole) return;

    try {
      setSaving(prev => ({ ...prev, [userId]: true }));
      
      // API call to update role - adjust endpoint as needed
      await axios.put(`/api/User/${userId}/role`, { role: newRole });
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      // Clear pending change
      setPendingChanges(prev => {
        const newChanges = { ...prev };
        delete newChanges[userId];
        return newChanges;
      });
    } catch (error) {
      console.error("Failed to update role:", error);
      alert("Failed to update user role. Please try again.");
    } finally {
      setSaving(prev => ({ ...prev, [userId]: false }));
    }
  };

  const getRoleColor = (role) => {
    const roleConfig = ROLES.find(r => r.value === role);
    return roleConfig?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-green-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">User Access Management</h3>
              <p className="text-sm text-gray-500">Manage user roles and permissions</p>
            </div>
          </div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-blue-50 rounded-md transition-colors border border-green-100"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading users...
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-green-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Username</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Current Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Change Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Joined</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  const hasPendingChange = pendingChanges[user.id];
                  const isSaving = saving[user.id];
                  
                  return (
                    <tr key={user.id} className="border-b border-green-100 hover:bg-blue-50/40">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{user.username}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getRoleColor(user.role)}`}>
                          <Shield className="w-3 h-3" />
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={pendingChanges[user.id] || user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={isSaving}
                          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {ROLES.map(role => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {hasPendingChange && (
                          <button
                            onClick={() => saveRoleChange(user.id)}
                            disabled={isSaving}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50"
                          >
                            {isSaving ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Save className="w-3 h-3" />
                            )}
                            Save
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-red-500 bg-red-50 border border-red-200 rounded p-4">
              Could not load users. Please check your connection and try again.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
