import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { 
  Drawer,
  Button,
  Typography,
  MenuItem
} from "@material-tailwind/react";
import {
  UserIcon,
  DocumentTextIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Header from "../components/Header";
import Footer from "../components/Footer";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout: authLogout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    
    if (!token || !user) {
      navigate("/auth");
      return;
    }

    setUserData(user);
  }, [navigate]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      if (authLogout) {
        authLogout();
      }

      setTimeout(() => {
        navigate("/auth", { replace: true });
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsDrawerOpen(false);
  };

  const navigationItems = [
    {
      path: "/home",
      label: "Beranda",
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      path: "/magang",
      label: "Magang",
      icon: <DocumentTextIcon className="w-5 h-5" />,
    },
  ];

  if (!userData) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header 
        userData={userData} 
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onLogout={handleLogout}
      />

      {/* Mobile Drawer */}
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        className="p-4"
      >
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h5" color="blue" className="font-bold">
            Nagari Intern
          </Typography>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setIsDrawerOpen(false)}
          >
            <XMarkIcon className="w-6 h-6" />
          </Button>
        </div>
        <div className="space-y-4">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant="text"
              color={location.pathname === item.path ? "blue" : "blue-gray"}
              className={`flex items-center gap-2 w-full ${
                location.pathname === item.path ? "bg-blue-50" : ""
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
          <hr className="my-2 border-blue-gray-50" />
          <Button
            size="lg"
            variant="text"
            color="red"
            onClick={handleLogout}
            className="w-full"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </Drawer>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet context={{ userData }} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;