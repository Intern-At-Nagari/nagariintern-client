import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
  Alert,
} from "@material-tailwind/react";
import {
  UserIcon,
  PhoneIcon,
  BriefcaseIcon,
  IdentificationIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../../layout/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 for password, 2 for profile
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [profileForm, setProfileForm] = useState({
    nama: "",
    nik: "",
    nomorHp: "",
    jabatan: "",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setAlert({
        show: true,
        message: "Password tidak cocok",
        type: "error",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/admin/change-password`,
        {
          newPassword: passwordForm.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlert({
        show: true,
        message: "Password berhasil diubah",
        type: "success",
      });

      setTimeout(() => {
        setStep(2);
        setAlert({ show: false, message: "", type: "success" });
      }, 1500);
    } catch (error) {
      setAlert({
        show: true,
        message: "Gagal mengubah password",
        type: "error",
      });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/admin/profile/update`,
        profileForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlert({
        show: true,
        message: "Profil berhasil dilengkapi",
        type: "success",
      });

      setTimeout(() => {
        navigate("/admin/peserta-magang");
      }, 1500);
    } catch (error) {
      setAlert({
        show: true,
        message: "Gagal melengkapi profil",
        type: "error",
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-blue-gray-50">
      <div className="h-full px-4 md:px-8 pb-8">
        <div className="max-w-3xl mx-auto pt-8">
          {alert.show && (
            <Alert
              variant="gradient"
              color={alert.type === "success" ? "green" : "red"}
              className="mb-6"
              animate={{
                mount: { y: 0 },
                unmount: { y: 100 },
              }}
            >
              {alert.message}
            </Alert>
          )}

          <div className="mb-8">
            <Typography variant="h3" className="font-bold text-gray-800 text-2xl md:text-3xl">
              {step === 1 ? "Ganti Password" : "Lengkapi Profil"}
            </Typography>
            <Typography className="mt-2 text-gray-600">
              {step === 1
                ? "Silakan ganti password default Anda dengan password baru"
                : "Silakan lengkapi data profil Anda"}
            </Typography>
          </div>

          <Card className="overflow-hidden">
            <CardBody className="p-6">
              {step === 1 ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                        Password Baru
                      </Typography>
                      <Input
                        type="password"
                        name="newPassword"
                        icon={<LockClosedIcon className="h-5 w-5" />}
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="!border-blue-gray-200 focus:!border-blue-500"
                        labelProps={{
                          className: "before:content-none after:content-none",
                        }}
                      />
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                        Konfirmasi Password Baru
                      </Typography>
                      <Input
                        type="password"
                        name="confirmPassword"
                        icon={<LockClosedIcon className="h-5 w-5" />}
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="!border-blue-gray-200 focus:!border-blue-500"
                        labelProps={{
                          className: "before:content-none after:content-none",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" variant="gradient" color="blue">
                      Simpan & Lanjutkan
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                        Nama Lengkap
                      </Typography>
                      <Input
                        type="text"
                        name="nama"
                        icon={<UserIcon className="h-5 w-5" />}
                        value={profileForm.nama}
                        onChange={handleProfileChange}
                        required
                        className="!border-blue-gray-200 focus:!border-blue-500"
                        labelProps={{
                          className: "before:content-none after:content-none",
                        }}
                      />
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                        NIK
                      </Typography>
                      <Input
                        type="text"
                        name="nik"
                        icon={<IdentificationIcon className="h-5 w-5" />}
                        value={profileForm.nik}
                        onChange={handleProfileChange}
                        required
                        className="!border-blue-gray-200 focus:!border-blue-500"
                        labelProps={{
                          className: "before:content-none after:content-none",
                        }}
                      />
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                        Nomor HP
                      </Typography>
                      <Input
                        type="tel"
                        name="nomorHp"
                        icon={<PhoneIcon className="h-5 w-5" />}
                        value={profileForm.nomorHp}
                        onChange={handleProfileChange}
                        required
                        className="!border-blue-gray-200 focus:!border-blue-500"
                        labelProps={{
                          className: "before:content-none after:content-none",
                        }}
                      />
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                        Jabatan
                      </Typography>
                      <Input
                        type="text"
                        name="jabatan"
                        icon={<BriefcaseIcon className="h-5 w-5" />}
                        value={profileForm.jabatan}
                        onChange={handleProfileChange}
                        required
                        className="!border-blue-gray-200 focus:!border-blue-500"
                        labelProps={{
                          className: "before:content-none after:content-none",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" variant="gradient" color="blue">
                      Simpan Profil
                    </Button>
                  </div>
                </form>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;