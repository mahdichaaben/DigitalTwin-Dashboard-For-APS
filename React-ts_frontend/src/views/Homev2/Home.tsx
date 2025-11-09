import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Factory,
  Play,
  Monitor,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Package,
  Drill,
  Cog,
  Truck,
  Battery,
  Camera,
  Warehouse,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import ImageModal from "./image-modal (1)"
import AppLogo from "@/assets/AppIcon/icon.png"

import FisherLogo from "@/assets/AppIcon/Fischertechnik-Logo.png"

const apsModules = [

    {
    id: 1,
    name: "Agile Production Simulation 24V",
    icon: Factory,
    description:
      `The Agile Production Simulation is the ideal learning concept for industry and higher education.\n\nThe compact simulation model offers a unique opportunity to make hands-on future technologies tangible.\n\nKey features:\n- Modular production\n- Digitalization in the production environment\n- Quality Assurance with artificial intelligence\n- Automated guided vehicles\n - Automation and PLC programming`,
    image: "/ApsImages/aps.png",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "High-Bay Warehouse",
    icon: Warehouse,
    description:
      "Contains nine slots for workpieces with a stacker crane and vacuum gripper. Picks up workpieces from the AGV at the docking station and stores them using the FIFO principle.",
    image: "/ApsImages/hbw.png",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    name: "Drilling Station",
    icon: Drill,
    description:
      "Features a docking station for AGV and vacuum gripper that places workpieces onto a conveyor belt. The workpiece is transported under the drilling head for simulated drilling, then returned to the AGV.",
    image: "/ApsImages/drill.png",
    color: "from-orange-500 to-red-500",
  },
  {
    id: 4,
    name: "Milling Station",
    icon: Cog,
    description:
      "Equipped with AGV docking and vacuum gripper system. Transports workpieces under the milling machine to simulate milling of two pockets, then returns them via conveyor belt to the AGV.",
    image: "/ApsImages/mill.png",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 5,
    name: "Incoming & Outgoing Goods",
    icon: Package,
    description:
      "Material flow begins here with a 6-axis robot and vacuum gripper. Includes quality control via color sensor, NFC encoding, central control unit (Raspberry Pi), and environmental sensors with movable camera.",
    image: "/ApsImages/aiqs.png",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 6,
    name: "Automated Guided Vehicle",
    icon: Truck,
    description:
      "Track-bound vehicle with omniwheels for multi-directional movement. Uses ultrasonic sensors for obstacle detection and follows printed black tracks. Powered by rechargeable 8.4V battery pack.",
    image: "/ApsImages/agv.png",
    color: "from-amber-500 to-yellow-500",
  },
  {
    id: 7,
    name: "Charging Station",
    icon: Battery,
    description:
      "Automatic charging dock with -ΔU charge monitoring. When AGV battery runs low, it navigates autonomously to the charging station where bottom contacts connect with charging electronics.",
    image: "/ApsImages/charging.png",
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: 8,
    name: "Quality Assurance with AI",
    icon: Camera,
    description:
      "AI-powered inspection system with camera and conveyor belt. Classifies workpieces by color (white, red, blue), machining features (drilling, milling), and fault patterns using trained TensorFlow models.",
    image: "/ApsImages/aiqs.png",
    color: "from-indigo-500 to-purple-500",
  },
];


export default function Home2() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImages, setModalImages] = useState<string[]>([])
  const [modalIndex, setModalIndex] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % apsModules.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + apsModules.length) % apsModules.length)
  }

  const openImageModal = (index: number) => {
    setModalImages(apsModules.map((m) => m.image))
    setModalIndex(index)
    setIsModalOpen(true)
  }

  const currentModule = apsModules[currentSlide]
  const Icon = currentModule.icon

  return (
<>
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Digital Twin Platform for
              <span className="text-green-500 block">fischertechnik APS</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We've adapted our advanced digital twin solution specifically for the fischertechnik Agile Production
              Simulation 24V — transforming physical training models into powerful, interactive software experiences.
            </p>
            <div className="mt-8 flex justify-center">
              <Link to="/dashboard">
                <Button className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  <Play className="h-5 w-5" />
                  Launch Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* fischertechnik Product Showcase Section */}
        <section className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 py-20 relative overflow-hidden">
          <div className="container mx-auto px-6">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">

                <span className="text-sm font-medium text-white">Powered by fischertechnik</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Explore the Agile Production Simulation
              </h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                Discover each module of the modular factory — from high-bay warehouse to AI-powered quality control. Our
                platform brings every component to life digitally.
              </p>
            </div>

            {/* Main Slider */}
            <div className="max-w-6xl mx-auto">
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                {/* Slide Content */}
                <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                  {/* Left: Image */}
                  <div className="relative group">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${currentModule.color} opacity-20 rounded-xl blur-xl`}
                    />
                    <div
                      className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
                      onClick={() => openImageModal(currentSlide)}
                    >
                      <img
                        src={currentModule.image || "/placeholder.svg"}
                        alt={currentModule.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                          <Maximize2 className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Description */}
                  <div className="flex flex-col justify-center">

                    <h3 className="text-3xl font-bold text-white mb-4">{currentModule.name}</h3>
                    <p className="text-lg text-slate-300 leading-relaxed mb-6">{currentModule.description}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="bg-white/10 px-3 py-1 rounded-full">
                        Module {currentModule.id} of {apsModules.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>

                {/* Slide Indicators */}
                <div className="flex justify-center gap-2 pb-8">
                  {apsModules.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>


            </div>

            {/* Product Documentation Link */}
            <div className="text-center mt-12">
              <a
                href="https://www.fischertechnik.de/en/products/industry-and-universities/training-models/569289-agile-production-simulation-24v"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg transition-all border border-white/20"
              >
                <Factory className="h-4 w-4" />
                View fischertechnik Product Details
              </a>
            </div>
          </div>
        </section>

        {/* Platform Features */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Digital Twin Solution</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform the physical fischertechnik APS into a comprehensive digital experience with real-time
              monitoring, 3D visualization, and advanced analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link
              to="/dashboard/monitoring"
              className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-sm hover:shadow-xl transition-all border border-green-100 group hover:-translate-y-2 hover:border-green-200"
            >
              <Monitor className="h-12 w-12 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">Live Monitoring</h3>
              <p className="text-gray-600">Real-time sensor data, KPIs, and system status across all modules</p>
            </Link>

            <Link
              to="/dashboard/Management"
              className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-sm hover:shadow-xl transition-all border border-green-100 group hover:-translate-y-2 hover:border-green-200"
            >
              <Settings className="h-12 w-12 text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">Operations</h3>
              <p className="text-gray-600">Manage orders, inventory, and production planning</p>
            </Link>

            <Link
              to="/dashboard/overview"
              className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-sm hover:shadow-xl transition-all border border-green-100 group hover:-translate-y-2 hover:border-green-200"
            >
              <BarChart3 className="h-12 w-12 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">3D Digital Twin</h3>
              <p className="text-gray-600">Interactive factory visualization with real-time updates</p>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-green-500 via-green-600 to-blue-500 py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/90 to-blue-600/90"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Experience the Digital Factory?</h2>
            <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
              Transform your fischertechnik APS into a powerful digital twin platform with real-time insights and
              interactive 3D visualization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard/overview"
                className="inline-flex items-center gap-2 bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-lg text-lg font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Play className="h-5 w-5" />
                Launch Dashboard
              </Link>

            </div>
          </div>
        </section>
      </main>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        images={modalImages}
        currentIndex={modalIndex}
        onClose={() => setIsModalOpen(false)}
        onPrevious={() => setModalIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length)}
        onNext={() => setModalIndex((prev) => (prev + 1) % modalImages.length)}
        eventName="APS Modules"
      />
      </>
 
  )
}
