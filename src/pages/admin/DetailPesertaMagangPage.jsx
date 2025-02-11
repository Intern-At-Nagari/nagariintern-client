import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Alert,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";
import {
  ClockIcon,
  BuildingOfficeIcon,
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  CheckCircleIcon,
  IdentificationIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Sidebar from "../../layout/Sidebar";
import { toast } from "react-toastify";
import MonthlyAttendanceTable from "../../components/MonthlyAttendanceTable";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DetailPesertaMagangPage = () => {
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState({
    url: "",
    title: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [internResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/intern/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);
        setData(internResponse.data);
        setSelectedUnit(internResponse.data.UnitKerjaPengajuan.id);
      } catch (err) {
        setError(err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleDocumentModal = (url = "", title = "") => {
    setSelectedDocument({ url, title });
    setIsDocumentModalOpen(!isDocumentModalOpen);
  };

  if (loading) {
    return (
      <div className="lg:ml-80 min-h-screen bg-blue-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:ml-80 min-h-screen bg-blue-gray-50 p-4">
        <Alert color="red">{error}</Alert>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="lg:ml-80 min-h-screen bg-blue-gray-50 p-4">
        <Alert color="blue">No data found</Alert>
      </div>
    );
  }

  const checkAttendanceComplete = () => {
    return data.Kehadirans.every((attendance) => attendance.totalKehadiran !== null);
  };
  const handleUpdateStatus = async () => {
    if (!checkAttendanceComplete()) {
      toast.error(
        "Tidak dapat menyelesaikan magang. Pastikan semua absensi telah diisi."
      );
      return;
    }

    setIsUpdateStatusOpen(true);
  };

  const confirmUpdateStatus = async () => {
    setIsUpdatingStatus(true);
    try {
      await axios.patch(
        `${API_BASE_URL}/admin/intern/${id}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Status magang berhasil diperbarui");
      // Refresh data
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal memperbarui status");
    } finally {
      setIsUpdatingStatus(false);
      setIsUpdateStatusOpen(false);
    }
  };

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="pt-4 mb-8 flex items-center gap-3">
            <Typography
              variant="h3"
              className="font-bold text-gray-800 text-2xl md:text-3xl"
            >
              Detail Peserta Magang
            </Typography>
          </div>

          <Card className="mb-6">
            <CardBody className="p-6">
              {/* Personal Information Section */}
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-6 pb-2 border-b"
              >
                Informasi Pendaftar
              </Typography>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Personal Details */}
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <UserIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        Nama
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {data.User?.Mahasiswas[0]?.name ||
                          data.User?.Siswas[0]?.name}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        {data.type === "siswa"
                          ? "SMK & Jurusan"
                          : "Institusi & Program Studi"}
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {data.type === "siswa"
                          ? `${data.Smk?.name} - ${data.Jurusan?.name}`
                          : `${data.PerguruanTinggi?.name} - ${data.Prodi?.name}`}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <EnvelopeIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        Email
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {data.User?.email}
                      </Typography>
                    </div>
                  </div>

                  {data.type === "mahasiswa" && (
                    <div className="flex items-start gap-3">
                      <IdentificationIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                      <div className="flex-1">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-medium"
                        >
                          NIM
                        </Typography>
                        <Typography
                          variant="small"
                          className="text-blue-gray-500"
                        >
                          {data.User?.Mahasiswas[0]?.nim || "-"}
                        </Typography>
                      </div>
                    </div>
                  )}
                  {data.type === "siswa" && (
                    <div className="flex items-start gap-3">
                      <IdentificationIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                      <div className="flex-1">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-medium"
                        >
                          NISN
                        </Typography>
                        <Typography
                          variant="small"
                          className="text-blue-gray-500"
                        >
                          {data.User?.Siswas[0]?.nisn || "-"}
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Details */}
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        No. Telepon
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {(data.type === "siswa"
                          ? data.User?.Siswas[0]?.no_hp
                          : data.User?.Mahasiswas[0]?.no_hp) || "-"}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        Alamat
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {(data.type === "siswa"
                          ? data.User?.Siswas[0]?.alamat
                          : data.User?.Mahasiswas[0]?.alamat) || "-"}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        Periode Magang
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {formatDate(data.tanggalMulai)} -{" "}
                        {formatDate(data.tanggalSelesai)}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        Unit Kerja
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {data.UnitKerjaPengajuan?.name}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <MonthlyAttendanceTable data={data.Kehadirans} />

          <Card className="mt-6">
            <CardBody>
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-6 pb-2 border-b"
              >
                Status Penyelesaian Magang
              </Typography>

              <div className="overflow-x-auto">
                <div className="mb-4">
                  <Alert color="blue" className="mb-4">
                    {checkAttendanceComplete()
                      ? "Semua kehadiran telah diisi lengkap. Anda dapat menyelesaikan proses magang."
                      : "Mohon lengkapi semua data kehadiran sebelum menyelesaikan magang."}
                  </Alert>
                  {data.Status?.name === "Selesai" ? (
                    <Alert color="green">
                      Peserta telah menyelesaikan program magang
                    </Alert>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Button
                        size="small"
                        className="flex items-center gap-2"
                        onClick={handleUpdateStatus}
                        color="green"
                        disabled={!checkAttendanceComplete()}
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        Selesaikan Magang
                      </Button>
                      {!checkAttendanceComplete() && (
                        <Typography
                          variant="small"
                          color="gray"
                          className="italic"
                        >
                          Lengkapi semua kehadiran terlebih dahulu
                        </Typography>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
      <Dialog
        open={isUpdateStatusOpen}
        handler={() => setIsUpdateStatusOpen(false)}
      >
        <DialogHeader>Konfirmasi Penyelesaian Magang</DialogHeader>
        <DialogBody divider>
          Apakah Anda yakin ingin menyelesaikan magang ini? Pastikan semua
          absensi telah diisi dengan benar.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setIsUpdateStatusOpen(false)}
            className="mr-1"
          >
            Batal
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={confirmUpdateStatus}
            disabled={isUpdatingStatus}
          >
            {isUpdatingStatus ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Memproses...
              </div>
            ) : (
              "Konfirmasi"
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default DetailPesertaMagangPage;
