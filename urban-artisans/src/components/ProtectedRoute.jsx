import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// wrap any route that should only be accessible after login
export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}