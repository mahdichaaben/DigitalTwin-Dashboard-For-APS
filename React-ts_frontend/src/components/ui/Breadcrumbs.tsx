import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function titleize(segment: string) {
  if (!segment) return "";
  // Friendly names for known routes
  const map: Record<string, string> = {
    dashboard: "Dashboard",
    monitoring: "Monitoring",
    settings: "Settings",
    management: "Management",
    alerts: "Alerts",
    accessibility: "Accessibility",
    drill001: "Drill 001",
    mill001: "Mill 001",
    aiqs001: "AIQS 001",
    dps001: "DPS 001",
    hbw001: "HBW 001",
    login: "Login",
    register: "Register",
  };
  if (map[segment.toLowerCase()]) return map[segment.toLowerCase()];
  const s = segment.replace(/[-_]+/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);

  const crumbs = parts.map((part, idx) => {
    const to = "/" + parts.slice(0, idx + 1).join("/");
    return { label: titleize(part), to };
  });

  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex items-center min-w-0">
      <ol className="flex items-center gap-1 text-sm text-gray-500 min-w-0">
        <li className="flex items-center gap-1">
          <Link to="/" className="text-gray-700 hover:text-primary-dark font-medium truncate max-w-[12ch]">
            APS
          </Link>
        </li>
        {crumbs.length > 0 && (
          <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
        )}
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={c.to} className="flex items-center gap-1 min-w-0">
              {!isLast ? (
                <>
                  <Link
                    to={c.to}
                    className="text-gray-600 hover:text-primary-dark truncate max-w-[16ch]"
                  >
                    {c.label}
                  </Link>
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                </>
              ) : (
                <span className="text-gray-500 truncate max-w-[18ch]" title={c.label}>
                  {c.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
