import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const ProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;