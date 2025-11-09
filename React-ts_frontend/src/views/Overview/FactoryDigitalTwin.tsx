import { useState } from "react";
import { Link } from "react-router-dom";
import DigitalTwin from "@/components/ui/DigitalTwin";
import UseCaseCard from "@/views/Homev2/UseCaseCard";
import AppLogo from "@/assets/AppIcon/icon.png";
import { Gauge, Layers, Drill, Activity, Settings as SettingsIcon, Eye, EyeOff, Factory, Zap } from "lucide-react";

function FactoryDigitalTwin() {
  const [showTwin, setShowTwin] = useState(false);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white px-6 py-8 flex flex-col gap-10">
      {/* Brand Header */}
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-2">
            <img src={AppLogo} alt="APS Digital Twin" className="h-12 w-12 md:h-14 md:w-14 object-contain" />
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Factory <span className="text-blue-800">Digital</span>
              <span className="text-green-600"> Twin</span>
            </h1>
          </div>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl">
            Comprehensive factory management with real-time monitoring, 3D visualization, and operations control for Agile Production simulation by Fischertechnik.
          </p>
          {/* Page Nav Links */}

        </div>
      </div>

      {/* Digital Twin Visualization Section */}
      <div className="max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden">
          {/* Digital Twin Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-4 border-b border-green-100">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
               3D <span className="text-blue-600">Digital</span>
                <span className="text-green-600"> Twin</span> Visualization
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Interactive 3D model of the factory floor with real-time module status and workflow visualization
              </p>
            </div>
            <button
              aria-pressed={showTwin}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-sm focus:outline-none focus:ring-2 transition-all duration-200
              ${showTwin ? "bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700 focus:ring-blue-300" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
              onClick={() => setShowTwin((v) => !v)}
            >
              {showTwin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showTwin ? "Hide Digital Twin" : "Show Digital Twin"}
            </button>
          </div>

          {/* Digital Twin Content */}
          <div className={`transition-all duration-500 ease-in-out ${showTwin ? "opacity-100" : "opacity-0"}`}>
            {showTwin && (
              <div className="p-6">
                <div className="w-full h-[70vh] min-h-[500px] bg-gradient-to-br from-blue-50 via-green-50 to-white rounded-lg border border-green-100 flex items-center justify-center">
                  {/* <div className="text-center">
                    <Factory className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-600 mb-2">3D Digital Twin View</h4>
                    <p className="text-gray-500 max-w-md">
                      Interactive factory visualization showing real-time status of all modules, 
                      workpiece flow, and manufacturing processes.
                    </p>
                  </div> */}
                  {/* Uncomment when DigitalTwin component is ready */}
                  <DigitalTwin />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactoryDigitalTwin;
