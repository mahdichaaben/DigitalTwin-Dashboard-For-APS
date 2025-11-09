import { useState, useEffect, ReactNode } from "react";
import { getProfile, loginUser, logoutUser, refreshToken, Profile, LoginData } from "@/api/authService";
import { AuthContext } from "./AuthContextValue";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load profile on app start
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Login
  const login = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      await loginUser(data);       // calls API + saves tokens
      const profile = await getProfile(); // fetch user info
      setUser(profile);
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err; // allow component to handle
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setError(null);
    }
  };

  // Refresh token
  const refresh = async () => {
    try {
      await refreshToken();
      const profile = await getProfile();
      setUser(profile);
    } catch (err: any) {
      setUser(null);
      setError("Session expired. Please login again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refresh, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
