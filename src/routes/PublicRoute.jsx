import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const PublicRoute = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;