import api from "@/api/axios";

// -----------------------------
// Types
// -----------------------------
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface Profile {
  id: string;
  username: string;
  email: string;
  role?: string;
}

// -----------------------------
// Register
// -----------------------------
export const registerUser = async (data: RegisterData): Promise<Profile> => {
  try {
    const res = await api.post("/Auth/register", data);
    return res.data;
  } catch (err: any) {
    const msg = err.response?.data?.message || "Registration failed";
    throw new Error(msg);
  }
};

// -----------------------------
// Login
// -----------------------------
export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const res = await api.post<LoginResponse>("/Auth/login", data);

    // Save tokens
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);

    return res.data;
  } catch (err: any) {
    const msg = err.response?.data?.message || "Login failed";
    throw new Error(msg);
  }
};

// -----------------------------
// Logout
// -----------------------------
export const logoutUser = async (): Promise<void> => {
  try {
    await api.post("/Auth/logout");
  } catch (err) {
    console.warn("Logout API failed", err);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};

// -----------------------------
// Get profile (protected route)
// -----------------------------
export const getProfile = async (): Promise<Profile> => {
  try {
    const res = await api.get<Profile>("/Auth/profile");
    return res.data;
  } catch (err: any) {
    const msg = err.response?.data?.message || "Failed to fetch profile";
    throw new Error(msg);
  }
};

// -----------------------------
// Refresh access token
// -----------------------------
export const refreshToken = async (): Promise<string> => {
  const token = localStorage.getItem("refreshToken");
  if (!token) throw new Error("No refresh token available");

  try {
    const res = await api.post<{ accessToken: string; refreshToken: string }>("/Auth/refresh", {
      refreshToken: token,
    });

    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);

    return res.data.accessToken;
  } catch (err: any) {
    const msg = err.response?.data?.message || "Token refresh failed";
    throw new Error(msg);
  }
};
