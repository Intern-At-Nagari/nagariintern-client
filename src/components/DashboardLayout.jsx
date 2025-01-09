import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  Typography,
  Button,
  IconButton,
  Drawer,
} from "@material-tailwind/react";
import {
  UserIcon,
  DocumentTextIcon,
  ClockIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!token || !user) {
      navigate("/auth");
      return;
    }

    setUserData(user);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const navigationItems = [
    {
      path: "/home",
      label: "Beranda",
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      path: "/status",
      label: "Magang",
      icon: <DocumentTextIcon className="w-5 h-5" />,
    },
  ];

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Typography variant="h5" color="blue" className="font-bold">
                Nagari Intern
              </Typography>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? "filled" : "text"}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2"
                  color="blue"
                >
                  {item.icon}
                  {item.label}
                </Button>
              ))}
            </div>

            {/* User Info and Mobile Menu */}
            <div className="flex items-center gap-4">
              <IconButton variant="text" size="sm">
                <BellIcon className="w-5 h-5" />
              </IconButton>
              <div className="hidden md:flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                <Typography variant="small" className="font-medium">
                  {userData.nama}
                </Typography>
              </div>
              <IconButton
                variant="text"
                size="sm"
                className="hidden md:block"
                onClick={handleLogout}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </IconButton>
              {/* Mobile Menu Button */}
              <IconButton
                variant="text"
                size="sm"
                className="md:hidden"
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              >
                <Bars3Icon className="w-6 h-6" />
              </IconButton>
            </div>
          </div>
        </div>
      </nav>

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
          <IconButton variant="text" onClick={() => setIsDrawerOpen(false)}>
            <XMarkIcon className="w-6 h-6" />
          </IconButton>
        </div>
        <div className="space-y-4">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "filled" : "text"}
              onClick={() => {
                navigate(item.path);
                setIsDrawerOpen(false);
              }}
              className="flex items-center gap-2 w-full"
              color="blue"
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
          <Button
            size="lg"
            className="w-full"
            variant="text"
            color="red"
            onClick={handleLogout}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </Drawer>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet context={{ userData }} />
      </div>
    </div>
  );
};

export default DashboardLayout;
