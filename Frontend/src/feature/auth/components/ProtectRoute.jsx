import { useAuthStore } from "../store/auth.store";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoaderSpiner";

export const ProtectRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; 
  }

  
  return children;
};