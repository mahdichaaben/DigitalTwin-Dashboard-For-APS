import  { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContextValue";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return null; // or a spinner
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
