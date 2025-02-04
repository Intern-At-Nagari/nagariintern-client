import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  DocumentTextIcon,
  Squares2X2Icon,
  Bars3Icon,
  XMarkIcon,
  BanknotesIcon,
  ChevronDownIcon,
  ArrowRightEndOnRectangleIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { Typography } from "@material-tailwind/react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openPermintaan, setOpenPermintaan] = useState(false);
  const [openPengaturan, setOpenPengaturan] = useState(false);
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
      ["tambah-akun-cabang", "atur-jadwal-pendaftaran"].includes(path)
    ) {
      setActiveItem(
        path === "tambah-akun-cabang"
          ? "Buat Akun Cabang"
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

  const handleItemClick = (item, dropdown) => {
    setActiveItem(item);
    setActiveDropdown(dropdown);
    if (dropdown === "Permintaan") {
      setOpenPermintaan(true);
    } else if (dropdown === "Pengaturan") {
      setOpenPengaturan(true);
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

  const getAnggaranClassName = () => {
    const isActive = activeItem === "Anggaran";
    const isHovered = hoveredItem === "Anggaran";

    return `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 
      ${
        isActive || isHovered
          ? "bg-white/20 text-white translate-x-1"
          : "hover:bg-white/20 hover:text-white hover:translate-x-1"
      }`;
  };

  const getItemClassName = (item, dropdown) => {
    const isActive = activeItem === item && activeDropdown === dropdown;
    const isHovered = hoveredItem === item;

    return `block p-3 rounded-xl transition-all duration-300 text-blue-100 
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

  const pengaturanItems = [
    {
      label: "Buat Akun Cabang",
      path: "/tambah-akun-cabang",
    },
    {
      label: "Atur Jadwal Pendaftaran",
      path: "/atur-jadwal-pendaftaran",
    },
  ];

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
        <div className="min-h-screen bg-slate-100 p-4">
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
              {/* Permintaan Dropdown */}
              <button
                onClick={() => setOpenPermintaan(!openPermintaan)}
                className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-300 ${
                  activeDropdown === "Permintaan"
                    ? "bg-white/20 text-white translate-x-1"
                    : "hover:bg-white/20 hover:text-white hover:translate-x-1"
                }`}
              >
                <div className="flex items-center gap-3">
                  <DocumentTextIcon className="h-5 w-5" />
                  <span className="font-medium text-white">Permintaan</span>
                </div>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform duration-500 ease-in-out ${
                    openPermintaan ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openPermintaan ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-7 space-y-1 pt-1">
                  {["Diproses", "Diterima", "Diverifikasi"].map((item) => (
                    <a
                      key={item}
                      href={`/${item.toLowerCase()}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/${item.toLowerCase()}`);
                        handleItemClick(item, "Permintaan");
                      }}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={getItemClassName(item, "Permintaan")}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>

              {/* Pengaturan Sistem Dropdown */}
              <button
                onClick={() => setOpenPengaturan(!openPengaturan)}
                className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-300 ${
                  activeDropdown === "Pengaturan"
                    ? "bg-white/20 text-white translate-x-1"
                    : "hover:bg-white/20 hover:text-white hover:translate-x-1"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Cog6ToothIcon className="h-5 w-5" />
                  <span className="font-medium text-white">
                    Pengaturan Sistem
                  </span>
                </div>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform duration-500 ease-in-out ${
                    openPengaturan ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openPengaturan ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-7 space-y-1 pt-1">
                  {pengaturanItems.map(({ label, path }) => (
                    <a
                      key={label}
                      href={path}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(path);
                        handleItemClick(label, "Pengaturan");
                      }}
                      onMouseEnter={() => setHoveredItem(label)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={getItemClassName(label, "Pengaturan")}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>

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

              {/* Anggaran Link */}
              <a
                href="/anggaran"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/anggaran");
                  setActiveItem("Anggaran");
                }}
                onMouseEnter={() => setHoveredItem("Anggaran")}
                onMouseLeave={() => setHoveredItem(null)}
                className={getAnggaranClassName()}
              >
                <BanknotesIcon className="h-5 w-5" />
                <span className="font-medium text-white">Anggaran</span>
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
