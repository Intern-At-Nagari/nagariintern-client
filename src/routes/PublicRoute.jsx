import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const PublicRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Bisa diganti dengan loading spinner
  }
  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;