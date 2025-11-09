import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { User, BellRing, Settings, LogOut } from "lucide-react";
import { AuthContext } from "@/contexts/AuthContextValue";

export interface UserMenuProps {
  buttonVariant?: "border" | "gradient";
  className?: string;
  showGreeting?: boolean;
  greetingPrefix?: string;
  separateGreeting?: boolean; // show greeting text outside the button
}

const UserMenu = ({
  buttonVariant = "border",
  className = "",
  showGreeting = true,
  greetingPrefix = "Hello,",
  separateGreeting = true,
}: UserMenuProps) => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  if (!user) return null;

  const buttonBase =
    buttonVariant === "gradient"
      ? "flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow hover:shadow-md focus:outline-none"
      : `flex items-center gap-2 rounded-full border ${open ? "border-primary" : "border-gray-300"} px-3 py-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary`;

  return (
    <div className={`relative flex items-center gap-3 ${className}`} ref={menuRef}>
      {showGreeting && separateGreeting && (
        <div className="hidden sm:block max-w-[200px] truncate">
          <span className="text-sm md:text-base font-semibold text-gray-800">
            {greetingPrefix} <span className="text-primary-dark">{user.username}</span>
          </span>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className={buttonBase}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="User menu"
      >
        {buttonVariant === "gradient" ? (
          <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700">
            {user.username ? user.username.charAt(0).toUpperCase() : "U"}
          </span>
        ) : (
          <User className="h-5 w-5 text-gray-600" />
        )}
        {!separateGreeting && showGreeting && (
          <span className={buttonVariant === "gradient" ? "text-white" : "text-sm font-medium text-gray-700"}>
            {greetingPrefix} {user.username}
          </span>
        )}
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="User menu"
          className="absolute right-0 top-10 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 animate-fadeIn"
        >

          <Link
            to="/dashboard/alerts"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <BellRing className="w-4 h-4 text-primary" /> Alerts
          </Link>
          <Link
            to="/dashboard/settings"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <Settings className="w-4 h-4 text-primary" /> Settings
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            <LogOut className="w-4 h-4 text-red-500" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
