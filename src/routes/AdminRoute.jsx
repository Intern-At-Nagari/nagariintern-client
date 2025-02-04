import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const AdminRoute = () => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/admina" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
