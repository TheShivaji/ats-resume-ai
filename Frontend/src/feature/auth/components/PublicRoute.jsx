import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import LoadingSpinner from "./LoaderSpiner";

export const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};