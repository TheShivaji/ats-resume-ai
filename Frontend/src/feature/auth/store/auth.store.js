import { create } from "zustand";
import axios from "axios";

// ✅ Axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true, // refresh token ke liye
});

// ✅ Zustand Store
export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // 🔹 set token
  setToken: (token) => set({ token }),

  // 🔹 SIGNUP
  signup: async (userData) => {
    try {
      set({ isLoading: true, error: null });

      const res = await api.post("/signup", userData);

      set({
        user: res.data.user,
        token: res.data.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });

      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Signup failed",
        isLoading: false,
      });
      throw error;
    }
  },

  // 🔹 LOGIN
  login: async (userData) => {
    try {
      set({ isLoading: true, error: null });

      const res = await api.post("/login", userData);

      set({
        user: res.data.user,
        token: res.data.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });

      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  // 🔹 LOGOUT
  logout: async () => {
    try {
      set({ isLoading: true });

      await api.post("/logout");

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Logout failed",
        isLoading: false,
      });
    }
  },

  // 🔹 CHECK AUTH
  checkAuth: async () => {
    try {
      set({ isLoading: true });

      const res = await api.get("/get-me");

      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

// ===============================
// 🔥 AXIOS INTERCEPTORS
// ===============================

// ✅ Request interceptor → token add karega
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Response interceptor → refresh token handle karega
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post("http://localhost:3000/api/auth/refresh-token" , {} , {
          withCredentials: true,
        });

        const newAccessToken = res.data.accessToken;

        useAuthStore.getState().setToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        // 🔥 refresh token bhi fail → logout
        const logout = useAuthStore.getState().logout;

        await logout();

        // redirect
        window.location.href = "/login";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;