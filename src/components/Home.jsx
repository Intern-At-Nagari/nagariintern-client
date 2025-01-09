import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardBody,
  Typography,
  Button,
  IconButton,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  UserIcon,
  DocumentTextIcon,
  ClockIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get user data from localStorage when component mounts
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // If no token or user data, redirect to login
    if (!token || !user) {
      navigate("/auth");
      return;
    }

    setUserData(user);
  }, [navigate]);

  // Fungsi untuk logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  // Dummy data for application status
  const applicationStatus = {
    status: "Dalam Review",
    submittedDate: "2025-01-05",
    department: "IT Development",
    duration: "3 bulan",
  };

  if (!userData) return null; // atau loading spinner

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Typography variant="h5" color="blue" className="font-bold">
                Nagari Intern
              </Typography>

              <div className="hidden md:flex ml-10 space-x-8">
                <Button
                  variant={activeTab === "home" ? "filled" : "text"}
                  onClick={() => setActiveTab("home")}
                  className="flex items-center gap-2"
                  color="blue"
                >
                  <HomeIcon className="w-4 h-4" />
                  Beranda
                </Button>
                <Button
                  variant={activeTab === "application" ? "filled" : "text"}
                  onClick={() => setActiveTab("application")}
                  className="flex items-center gap-2"
                  color="blue"
                >
                  <DocumentTextIcon className="w-4 h-4" />
                  Ajukan Magang
                </Button>
                <Button
                  variant={activeTab === "status" ? "filled" : "text"}
                  onClick={() => setActiveTab("status")}
                  className="flex items-center gap-2"
                  color="blue"
                >
                  <ClockIcon className="w-4 h-4" />
                  Status Pengajuan
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <IconButton variant="text" size="sm">
                <BellIcon className="w-5 h-5" />
              </IconButton>
              <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                <Typography variant="small" className="font-medium">
                  {userData.nama}
                </Typography>
              </div>
              <IconButton variant="text" size="sm">
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </IconButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Typography variant="h3" color="blue-gray">
            Selamat Datang, {userData.nama}
          </Typography>
          <Typography color="gray" className="mt-1">
            Kelola pengajuan magang Anda di sini
          </Typography>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="mt-6">
            <CardBody className="flex items-center gap-4">
              <div className="rounded-full p-3 bg-blue-100">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <Typography variant="small" color="blue-gray">
                  Status Pengajuan
                </Typography>
                <Typography variant="h6">{applicationStatus.status}</Typography>
              </div>
            </CardBody>
          </Card>

          <Card className="mt-6">
            <CardBody className="flex items-center gap-4">
              <div className="rounded-full p-3 bg-green-100">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <Typography variant="small" color="blue-gray">
                  Departemen
                </Typography>
                <Typography variant="h6">
                  {applicationStatus.department}
                </Typography>
              </div>
            </CardBody>
          </Card>

          <Card className="mt-6">
            <CardBody className="flex items-center gap-4">
              <div className="rounded-full p-3 bg-orange-100">
                <ExclamationCircleIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <Typography variant="small" color="blue-gray">
                  Durasi Magang
                </Typography>
                <Typography variant="h6">
                  {applicationStatus.duration}
                </Typography>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Application Form Section */}
        {activeTab === "application" && (
          <Card className="mb-8">
            <CardBody>
              <Typography variant="h5" color="blue-gray" className="mb-6">
                Form Pengajuan Magang
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="text"
                  label="Nama Lengkap"
                  size="lg"
                  value={userData.nama}
                  disabled
                />
                <Input
                  type="email"
                  label="Email"
                  size="lg"
                  value={userData.email}
                  disabled
                />
                <Input type="text" label="Institusi Pendidikan" size="lg" />
                <Input type="text" label="Program Studi" size="lg" />
                <Select label="Durasi Magang" size="lg">
                  <Option value="1">1 Bulan</Option>
                  <Option value="2">2 Bulan</Option>
                  <Option value="3">3 Bulan</Option>
                  <Option value="6">6 Bulan</Option>
                </Select>
                <Select label="Departemen Yang Dituju" size="lg">
                  <Option value="it">IT Development</Option>
                  <Option value="hr">Human Resources</Option>
                  <Option value="finance">Finance</Option>
                  <Option value="marketing">Marketing</Option>
                </Select>
                <div className="col-span-2">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-2 font-medium"
                  >
                    Upload CV (PDF)
                  </Typography>
                  <Input type="file" accept=".pdf" size="lg" />
                </div>
                <div className="col-span-2">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-2 font-medium"
                  >
                    Surat Pengantar dari Institusi (PDF)
                  </Typography>
                  <Input type="file" accept=".pdf" size="lg" />
                </div>
                <div className="col-span-2">
                  <Button size="lg" className="w-full" color="blue">
                    Submit Pengajuan
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Application Status Section */}
        {activeTab === "status" && (
          <Card>
            <CardBody>
              <Typography variant="h5" color="blue-gray" className="mb-6">
                Status Pengajuan Magang
              </Typography>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-gray-50 rounded-lg">
                  <div>
                    <Typography variant="h6">
                      Pengajuan #{applicationStatus.submittedDate}
                    </Typography>
                    <Typography variant="small" color="gray">
                      Diajukan pada: {applicationStatus.submittedDate}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <Typography
                      variant="small"
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full"
                    >
                      {applicationStatus.status}
                    </Typography>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Typography variant="h6" color="blue-gray" className="mb-4">
                    Detail Pengajuan
                  </Typography>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Typography variant="small" color="gray">
                        Departemen
                      </Typography>
                      <Typography className="font-medium">
                        {applicationStatus.department}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="small" color="gray">
                        Durasi
                      </Typography>
                      <Typography className="font-medium">
                        {applicationStatus.duration}
                      </Typography>
                    </div>
                  </dl>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
