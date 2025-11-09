import { Link } from "react-router-dom";
import { 
  Factory, 
  Play, 
  Monitor, 
  Settings, 
  BarChart3,
  Zap,
  Shield,
  Globe,
  Users,
  BookOpen,
  Cpu,
  Eye,
  Gauge,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  Clock,
  TrendingUp,
  Database,
  TestTube,
  RefreshCw
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Factory className="h-8 w-8 text-green-500" />
              <h1 className="text-xl font-bold text-slate-800">Factory Digital Twin</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-slate-600 hover:text-slate-800 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
              Welcome to your
              <span className="text-green-500 block">Digital Factory</span>
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your Agile Production Simulation into a powerful software-only experience. 
              Monitor, control, and optimize production systems with real-time insights, 3D visualization, 
              and comprehensive analytics — no hardware required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/dashboard/overview" 
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all hover:scale-105 shadow-lg"
              >
                <Play className="h-5 w-5" />
                Launch Dashboard
              </Link>
              <Link 
                to="/register" 
                className="inline-flex items-center gap-2 border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-4 rounded-lg text-lg font-medium transition-colors"
              >
                <Users className="h-5 w-5" />
                Start Free Trial
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link 
              to="/dashboard/monitoring" 
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 group hover:-translate-y-1"
            >
              <Monitor className="h-12 w-12 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Live Monitoring</h3>
              <p className="text-slate-600 mb-4">Real-time sensor data, KPIs, and system status across all modules</p>
              <div className="flex items-center text-blue-500 font-medium">
                View Dashboard <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </Link>

            <Link 
              to="/dashboard/Management" 
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 group hover:-translate-y-1"
            >
              <Settings className="h-12 w-12 text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Operations</h3>
              <p className="text-slate-600 mb-4">Manage orders, inventory, workpiece tracking, and production planning</p>
              <div className="flex items-center text-purple-500 font-medium">
                Manage Operations <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </Link>

            <Link 
              to="/dashboard/overview" 
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 group hover:-translate-y-1"
            >
              <BarChart3 className="h-12 w-12 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">3D Digital Twin</h3>
              <p className="text-slate-600 mb-4">Interactive factory visualization with WebGL and VR-ready architecture</p>
              <div className="flex items-center text-green-500 font-medium">
                Explore 3D View <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </Link>
          </div>
        </section>

        {/* Virtual Production Process */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Start Virtual Production Process
              </h2>
              <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Run complete production cycles in simulation, watch real-time 3D processes, analyze data-driven insights, 
                calculate timelines and logs — then apply to real world with peaceful mind knowing your system works perfectly.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left - Process Flow */}
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <PlayCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">1. Virtual Production Simulation</h3>
                      <p className="text-blue-100">Start complete production runs with workpiece tracking from HBW → Drill → Mill → Quality → AGV cycles</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">2. Real-Time 3D Visualization</h3>
                      <p className="text-blue-100">Watch your factory in action with live 3D processes, module states, and workpiece flow visualization</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Database className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">3. Data-Driven Analytics</h3>
                      <p className="text-blue-100">Calculate precise timelines, running times, cycle logs, throughput metrics, and performance analytics</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">4. Confident Real-World Application</h3>
                      <p className="text-blue-100">Deploy tested configurations to real hardware with peace of mind — your system is already proven to work</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Key Metrics */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">What You Can Monitor & Test</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="text-center">
                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">Timeline Calculation</h4>
                    <p className="text-sm text-blue-100">Cycle times, lead times, queue duration</p>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">Performance Logs</h4>
                    <p className="text-sm text-blue-100">Throughput, OEE, efficiency metrics</p>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TestTube className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">Process Testing</h4>
                    <p className="text-sm text-blue-100">Different scenarios, configurations, optimizations</p>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <RefreshCw className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">Dashboard Optimization</h4>
                    <p className="text-sm text-blue-100">Test UI, alerts, thresholds before deployment</p>
                  </div>
                </div>

                <div className="text-center">
                  <Link 
                    to="/dashboard/Management" 
                    className="inline-flex items-center gap-2 bg-white text-purple-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Start Virtual Production
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Transform Hardware into Software
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Experience the full power of Agile Production Simulation without physical constraints. 
                Learn, test, and optimize in a safe, scalable environment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Safe Testing</h3>
                <p className="text-slate-600">Test scenarios and configurations without risk to physical equipment</p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Always Available</h3>
                <p className="text-slate-600">Access your factory 24/7 from anywhere, no lab scheduling required</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Educational</h3>
                <p className="text-slate-600">Perfect for Industry 4.0 learning with interactive modules and assignments</p>
              </div>

              <div className="text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Real Protocols</h3>
                <p className="text-slate-600">Built with OPC UA, MQTT, and other industrial standards</p>
              </div>
            </div>
          </div>
        </section>


        {/* Technology Stack */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Built with Industrial Standards
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Production-ready architecture using the same protocols and tools you'll find in real manufacturing environments.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-blue-50 p-6 rounded-xl mb-4">
                  <h3 className="font-semibold text-slate-800 mb-1">OPC UA</h3>
                  <p className="text-sm text-slate-600">Industrial connectivity</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-green-50 p-6 rounded-xl mb-4">
                  <h3 className="font-semibold text-slate-800 mb-1">MQTT</h3>
                  <p className="text-sm text-slate-600">Edge messaging</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-purple-50 p-6 rounded-xl mb-4">
                  <h3 className="font-semibold text-slate-800 mb-1">Docker</h3>
                  <p className="text-sm text-slate-600">Containerization</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-orange-50 p-6 rounded-xl mb-4">
                  <h3 className="font-semibold text-slate-800 mb-1">Unity 3D</h3>
                  <p className="text-sm text-slate-600">Visualization</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-green-500 py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Digital Journey?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students and professionals learning Industry 4.0 concepts 
              through hands-on digital twin experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/dashboard/overview" 
                className="inline-flex items-center gap-2 bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-lg text-lg font-medium transition-colors"
              >
                <Play className="h-5 w-5" />
                Launch Dashboard
              </Link>
              <Link 
                to="/register" 
                className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-lg text-lg font-medium transition-colors"
              >
                <Users className="h-5 w-5" />
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Factory className="h-8 w-8 text-green-500" />
                <h3 className="text-xl font-bold text-white">Factory Digital Twin</h3>
              </div>
              <p className="text-slate-400">
                Transforming industrial education through digital twin technology and real-time simulation.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/dashboard/monitoring" className="hover:text-white transition-colors">Live Monitoring</Link></li>
                <li><Link to="/dashboard/Management" className="hover:text-white transition-colors">Operations</Link></li>
                <li><Link to="/dashboard/overview" className="hover:text-white transition-colors">3D Digital Twin</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Quick Start Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Troubleshooting</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Account</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/dashboard/settings" className="hover:text-white transition-colors">Settings</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-slate-400">
              © {new Date().getFullYear()} Factory Digital Twin - Built for APS learning and optimization
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
