import { Link } from "react-router-dom";
import { Waypoints, Bell, User } from "lucide-react";

const NavBar = () => {
  return (
    <header className="bg-white border-b border-surface-border shadow-sm w-full">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Logo + App Name */}
          <div className="flex items-center space-x-4">
            <Waypoints className="h-6 w-6 text-primary-dark" />
            <Link
              to="/"
              className="text-lg font-semibold text-text hover:text-primary-dark transition-colors"
            >
              Digital Twin Factory
            </Link>
          </div>

          {/* Center: Navigation Links (optional) */}
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/modules"
              className="text-text-muted hover:text-primary-dark transition"
            >
              Modules
            </Link>
            <Link
              to="/analytics"
              className="text-text-muted hover:text-primary-dark transition"
            >
              Analytics
            </Link>
            <Link
              to="/configurations"
              className="text-text-muted hover:text-primary-dark transition"
            >
              Configurations
            </Link>
          </nav>

          {/* Right: Icons */}
          <div className="flex items-center space-x-4">
            {/* Notification Icon with dropdown */}
            <div className="relative group">
              <Bell className="h-5 w-5 text-text hover:text-primary-dark cursor-pointer" />
              <div className="absolute right-0 mt-2 w-56 bg-white border border-surface-border shadow-lg rounded-md opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                <div className="p-4 text-sm text-text-muted">
                  No new notifications
                </div>
              </div>
            </div>

            {/* Profile icon */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-surface-border text-text-muted">
              <User className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
