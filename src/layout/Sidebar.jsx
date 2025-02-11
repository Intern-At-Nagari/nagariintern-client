import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Squares2X2Icon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightEndOnRectangleIcon,
  UserGroupIcon,
  DocumentChartBarIcon, 
} from "@heroicons/react/24/outline";
import { Typography } from "@material-tailwind/react";
import { User2Icon } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserData(user);

    const path = location.pathname.slice(1);
    if (["diproses", "diterima", "diverifikasi"].includes(path)) {
      setActiveItem(path.charAt(0).toUpperCase() + path.slice(1));
      setActiveDropdown("Permintaan");
      setOpenPermintaan(true);
    } else if (
      ["tambah-profil-cabang", "atur-jadwal-pendaftaran"].includes(path)
    ) {
      setActiveItem(
        path === "tambah-profil-cabang"
          ? "Buat Profil Cabang"
          : "Atur Jadwal Pendaftaran"
      );
      setActiveDropdown("Pengaturan");
      setOpenPengaturan(true);
    } else if (path === "mapping") {
      setActiveItem("PesertaMagang");
    } else if (path === "anggaran") {
      setActiveItem("Anggaran");
    }
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsMobileOpen(false);
    }
  };

  const getPesertaMagangClassName = () => {
    const isActive = activeItem === "PesertaMagang";
    const isHovered = hoveredItem === "PesertaMagang";

    return `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 
      ${
        isActive || isHovered
          ? "bg-white/20 text-white translate-x-1"
          : "hover:bg-white/20 hover:text-white hover:translate-x-1"
      }`;
  };

  const getRekapitulasiClassName = () => {
    const isActive = activeItem === "Rekapitulasi";
    const isHovered = hoveredItem === "Rekapitulasi";
    return `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 
    ${
      isActive || isHovered
        ? "bg-white/20 text-white translate-x-1"
        : "hover:bg-white/20 hover:text-white hover:translate-x-1"
    }`;
  };

  const getProfilClassName = () => {
    const isActive = activeItem === "Profil";
    const isHovered = hoveredItem === "Profil";
    return `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 
    ${
      isActive || isHovered
        ? "bg-white/20 text-white translate-x-1"
        : "hover:bg-white/20 hover:text-white hover:translate-x-1"
    }`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isMobileOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-all duration-300"
          onClick={handleOverlayClick}
        />
      )}

      <div
        className={`fixed top-0 left-0 z-40 h-full transform transition-transform duration-300 ease-in-out lg:translate-x-0 
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="min-h-screen bg-blue-gray-50 p-4">
          <div className="w-72 min-h-[calc(100vh-2rem)] bg-gradient-to-b from-blue-600 to-blue-800 p-6 text-white shadow-xl rounded-3xl relative">
            {/* Logo and Title */}
            <div className="mb-8 flex items-center gap-3">
              <Squares2X2Icon className="h-8 w-8" color="white" />
              <Typography variant="h4" className="font-bold text-white">
                Nagari Intern
              </Typography>
            </div>

            {/* Profile Card */}
            <div className="mb-8 p-4 bg-white/15 rounded-xl backdrop-blur-lg transform transition-all duration-300 hover:scale-[1.02]">
              <Typography
                variant="h6"
                className="text-white font-semibold text-center"
              >
                {userData?.UnitKerja}
              </Typography>
              <Typography variant="small" className="text-blue-100 text-center">
                {userData?.email}
              </Typography>
            </div>

            <div className="space-y-2">
              {/* PesertaMagang Link */}
              <a
                href="/mapping"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/admin/peserta-magang");
                  setActiveItem("PesertaMagang");
                }}
                onMouseEnter={() => setHoveredItem("PesertaMagang")}
                onMouseLeave={() => setHoveredItem(null)}
                className={getPesertaMagangClassName()}
              >
                <UserGroupIcon className="h-5 w-5" />
                <span className="font-medium text-white">Peserta Magang</span>
              </a>

              <a
                href="/rekapitulasi"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/admin/rekapitulasi");
                  setActiveItem("Rekapitulasi");
                }}
                onMouseEnter={() => setHoveredItem("Rekapitulasi")}
                onMouseLeave={() => setHoveredItem(null)}
                className={getRekapitulasiClassName()}
              >
                <DocumentChartBarIcon className="h-5 w-5" />
                <span className="font-medium text-white">Rekapitulasi</span>
              </a>

              <a
                href="/admin/profil"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/admin/profil");
                  setActiveItem("Profil");
                }}
                onMouseEnter={() => setHoveredItem("Profil")}
                onMouseLeave={() => setHoveredItem(null)}
                className={getProfilClassName()}
              >
                <User2Icon className="h-5 w-5" />
                <span className="font-medium text-white">Profil</span>
              </a>

              {/* Logout Section */}
              <div className="pt-6 mt-6 border-t border-white/30">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full gap-3 p-3 font-bold hover:bg-white rounded-xl transition-all duration-300 text-red-white hover:text-red-600 hover:shadow-lg hover:scale-[1.02]"
                >
                  <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
                  <span className="font-medium">Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
