import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContextValue";

export default function RequireLogout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}
