import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Typography,
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserIcon,
  DocumentTextIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  Bars3Icon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import profileImg from "../assets/profile.png";

const Header = ({ onOpenDrawer, userData, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Typography variant="h5" color="blue" className="font-bold">
              Nagari Intern
            </Typography>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "filled" : "text"}
                onClick={() => {
                  console.log('Navigating to:', item.path);
                  navigate(item.path);
                }}
                className="flex items-center gap-2"
                color="blue"
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <Menu open={isMenuOpen} handler={setIsMenuOpen}>
              <MenuHandler>
                <Button
                  variant="text"
                  color="blue-gray"
                  className="flex items-center gap-3 py-0.5 pr-2 pl-0.5"
                >
                  <Avatar
                    variant="circular"
                    size="sm"
                    alt="Profile"
                    className="border border-blue-500 p-0.5"
                    src={profileImg}
                  />
                  <div className="hidden md:flex flex-col items-start">
                    <Typography variant="small" className="font-normal">
                      {userData?.email}
                    </Typography>
                  </div>
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`h-4 w-4 transition-transform ${
                      isMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </MenuHandler>
              <MenuList className="p-1">
                <MenuItem className="flex items-center gap-2 rounded">
                  <BellIcon className="h-5 w-5" />
                  <Typography variant="small" className="font-normal">
                    Notifikasi
                  </Typography>
                </MenuItem>
                <MenuItem
                  className="flex items-center gap-2 rounded"
                  onClick={() => navigate("/profile")}
                >
                  <UserIcon className="h-5 w-5" />
                  <Typography variant="small" className="font-normal">
                    Profil Saya
                  </Typography>
                </MenuItem>
                <hr className="my-2 border-blue-gray-50" />
                <MenuItem
                  onClick={onLogout}
                  className="flex items-center gap-2 rounded text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <Typography variant="small" className="font-normal">
                    Logout
                  </Typography>
                </MenuItem>
              </MenuList>
            </Menu>

            <IconButton
              variant="text"
              size="sm"
              className="md:hidden"
              onClick={onOpenDrawer}
            >
              <Bars3Icon className="w-6 h-6" />
            </IconButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

