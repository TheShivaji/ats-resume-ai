import { create } from "zustand";
import api from "../api";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isCheckingAuth: true,

  setToken: (token) => set({ token }),

  signup: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const res = await api.post("/signup", data);

      set({
        user: res.data.user,
        token: res.data.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      let errorMessage = "Signup failed. Please try again.";
      if (err.response?.data?.errors && err.response.data.errors.length > 0) {
        errorMessage = err.response.data.errors[0].msg;
      }
      else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  login: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const res = await api.post("/login", data);

      set({
        user: res.data.user,
        token: res.data.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";
      if (err.response?.data?.errors && err.response.data.errors.length > 0) {
        errorMessage = err.response.data.errors[0].msg;
      }
      else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await api.post("/logout");
    } catch (err) { }

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });

      const res = await api.get("/get-me");

      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
        isCheckingAuth: false
      });
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";
      if (err.response?.data?.errors && err.response.data.errors.length > 0) {
        errorMessage = err.response.data.errors[0].msg;
      }
      else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } 
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
        error: errorMessage
      });
    }
  },
}));