import React, { useState, useEffect } from "react";
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
} from "@heroicons/react/24/outline";
import Sidebar from "../../layout/Sidebar";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { toast } from "react-toastify";


const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    nomorHp: "",
    jabatan: "",
    email: "",
    unitKerja: "",
  });


  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/admin/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = response.data;
      const karyawan = data.Karyawans[0]; // Get the first karyawan record

      setUserData(data);
      setFormData({
        nama: karyawan?.nama || "",
        nik: karyawan?.nik || "",
        nomorHp: karyawan?.nomorHp || "",
        jabatan: karyawan?.jabatan || "",
        email: data.email || "",
        unitKerja: karyawan?.UnitKerja.name || "",
      });
    } catch (error) {
      setAlert({
        show: true,
        message: "Gagal mengambil data profil",
        type: "error",
      });
      setTimeout(() => {
        setAlert({ show: false, message: "", type: "error" });
      }, 3000);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/admin/profile/update`,
        {
          nama: formData.nama,
          nik: formData.nik,
          nomorHp: formData.nomorHp,
          jabatan: formData.jabatan,
          unitKerjaId: formData.unitKerja,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profil berhasil diperbarui")
      setIsEditing(false);

      // Refresh data after update
      fetchUserData();

      
    } catch (error) {
      toast.error("Gagal memperbarui profil")
    }
  };

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          

          <div className="pt-4 flex justify-between items-center mb-4">
            <Typography
              variant="h3"
              className="mb-8 font-bold text-gray-800 text-2xl md:text-3xl"
            >
              Profil
            </Typography>
          </div>

          <Card className="overflow-hidden">
            <CardHeader
              floated={false}
              shadow={false}
              color="blue"
              className="m-0 p-6"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-full p-3 bg-white/20">
                  <UserIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <Typography variant="h5" color="white">
                    {formData.nama || "Nama Lengkap"}
                  </Typography>
                  <Typography
                    color="white"
                    variant="small"
                    className="font-normal opacity-80"
                  >
                    {formData.jabatan || "Jabatan"}
                  </Typography>
                </div>
              </div>
            </CardHeader>

            <CardBody className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="mb-2 font-medium"
                      >
                        Nama Lengkap
                      </Typography>
                      <Input
                        type="text"
                        icon={<UserIcon className="h-5 w-5" />}
                        name="nama"
                        value={formData.nama}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="!border-blue-gray-200 focus:!border-blue-500"
                        labelProps={{
                          className: "before:content-none after:content-none",
                        }}
                      />
                    </div>

                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="mb-2 font-medium"
                      >
                        NIK
                      </Typography>
                      <Input
                        type="text"
                        icon={<IdentificationIcon className="h-5 w-5" />}
                        name="nik"
                        value={formData.nik}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="!border-blue-gray-200 focus:!border-blue-500"
                        labelProps={{
                          className: "before:content-none after:content-none",
                        }}
                      />
                    </div>

                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="mb-2 font-medium"
                      >
                        Nomor HP
                      </Typography>
                      <Input
                        type="tel"
                        icon={<PhoneIcon className="h-5 w-5" />}
                        name="nomorHp"
                        value={formData.nomorHp}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="!border-blue-gray-200 focus:!border-blue-500"
                        labelProps={{
                          className: "before:content-none after:content-none",
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="mb-2 font-medium"
                      >
                        Jabatan
                      </Typography>
                      <Input
                        type="text"
                        icon={<BriefcaseIcon className="h-5 w-5" />}
                        name="jabatan"
                        value={formData.jabatan}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="!border-blue-gray-200 focus:!border-blue-500"
                        labelProps={{
                          className: "before:content-none after:content-none",
                        }}
                      />
                    </div>

                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="mb-2 font-medium"
                      >
                        Email
                      </Typography>
                      <Input
                        type="email"
                        value={formData.email}
                        disabled={true}
                        className="!border-blue-gray-200"
                        labelProps={{
                          className: "before:content-none after:content-none",
                        }}
                      />
                    </div>

                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="mb-2 font-medium"
                      >
                        Unit Kerja
                      </Typography>
                      <Input
                        type="text"
                        value={formData.unitKerja}
                        disabled={true}
                        className="!border-blue-gray-200"
                        labelProps={{
                          className: "before:content-none after:content-none",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outlined"
                        color="blue-gray"
                        onClick={() => setIsEditing(false)}
                      >
                        Batal
                      </Button>
                      <Button type="submit" variant="gradient" color="blue">
                        Simpan
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="gradient"
                      color="blue"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profil
                    </Button>
                  )}
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;