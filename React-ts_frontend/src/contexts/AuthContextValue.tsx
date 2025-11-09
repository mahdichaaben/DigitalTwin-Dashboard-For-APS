import { createContext } from "react";
import { Profile, LoginData } from "@/api/authService";

export interface AuthContextType {
  user: Profile | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  refresh: async () => {},
  loading: false,
  error: null,
});