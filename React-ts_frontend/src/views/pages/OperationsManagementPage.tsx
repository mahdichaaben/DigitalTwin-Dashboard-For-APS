"use client";
import { useState } from "react";
import Tabs from "@/components/WpManagement/Tabs";
import WorkpiecesTable from "@/components/WpManagement/WorkpiecesTable";
import TypesGrid from "@/components/WpManagement/TypesGrid";
import Inventory from "@/components/OrderManagement/Inventory";
import OrdersTable from "@/components/OrderManagement/OrdersTable";
import { Settings } from "lucide-react";

export default function OperationsManagementPage() {
  const [activeTab, setActiveTab] = useState("Inventory");

  const tabs = [
    { id: "Inventory", label: "Inventory" },
    { id: "Orders", label: "Orders" },
    { id: "workpieces", label: "Workpieces" },
    { id: "types", label: "Types" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-3">

                Operations Management
              </h1>
              <p className="text-gray-600 mt-1">
                Control types and inventory; add/remove workpieces and manage orders.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Content */}
        {activeTab === "Inventory" && <Inventory />}
        {activeTab === "Orders" && <OrdersTable />}
        {activeTab === "workpieces" && <WorkpiecesTable />}
        {activeTab === "types" && <TypesGrid />}
      </div>
    </div>
  );
}
