import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const AdminRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>;
  }

  return user && user.role === "Admin" ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;