import axios from "axios";
import { useAuthStore } from "./store/auth.store";

const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

// ✅ REQUEST INTERCEPTOR (token attach)
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ RESPONSE INTERCEPTOR (NO LOOP FIXED)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh-token") &&
      !originalRequest.url.includes("/logout")
    ) {
      originalRequest._retry = true;

      try {
        // 🔄 refresh token call
        const res = await api.post("/refresh-token");

        const newAccessToken = res.data.accessToken;

        // ✅ store new token
        useAuthStore.getState().setToken(newAccessToken);

        // ✅ update header safely
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 🔁 retry original request
        return api(originalRequest);
      } catch (err) {
        useAuthStore.setState({
          user: null,
          token: null,
          isAuthenticated: false
        });
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;