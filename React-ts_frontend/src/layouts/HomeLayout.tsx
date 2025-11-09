import { useContext } from "react";
import { useState } from "react";
import { AuthContext } from "@/contexts/AuthContextValue";
import AppLogo from "@/assets/AppIcon/icon.png";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import UserMenu from "@/components/ui/UserMenu";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [showProfile, setShowProfile] = useState(false);
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-green-100 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="ml-12 flex items-center gap-3">
          <img src={AppLogo} alt="APS Digital Twin" className="h-12 w-12 object-contain" />
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
        <UserMenu buttonVariant="border" showGreeting={true} greetingPrefix="Hello," />
            ) : (
            <>
              <Link to="/login" className="text-green-600 font-semibold hover:underline">Login</Link>
              <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 py-12">
    <div className="container mx-auto px-6 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <img src={AppLogo} alt="APS Digital Twin" className="h-12 w-12 object-contain" />
        <h3 className="text-xl font-bold text-white">APS Digital Twin Platform</h3>
      </div>
      <p className="text-slate-400 mb-4">
        Transforming fischertechnik Agile Production Simulation into powerful digital experiences
      </p>
      <p className="text-slate-500 text-sm">
        © {new Date().getFullYear()} APS Digital Twin Platform - Built for Industry 4.0 Education
      </p>
    </div>
  </footer>
);

const HomeLayout = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-blue-50 to-white">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default HomeLayout;
