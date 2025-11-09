
import { useState } from "react";
import ProfileSettings from "./ProfileSettings";
import UserAccessSettings from "./UserAccessSettings";
import { User, Users, Settings as SettingsIcon } from "lucide-react";

const TABS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "access", label: "User Access", icon: Users },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 mb-6">
          <div className="flex border-b border-green-100">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors relative ${
                    activeTab === tab.key
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800 hover:bg-blue-50"
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
          {activeTab === "profile" && <ProfileSettings />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
