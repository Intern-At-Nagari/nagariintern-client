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
  ArrowDownTrayIcon,
  IdentificationIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Sidebar from "../../layout/Sidebar";
import BreadcrumbsComponent from "../../components/BreadcrumbsComponent";
import { toast } from "react-toastify";
import ModalIframe from "../../components/ModalIframe";
import MonthlyAttendanceTable from "../../components/MonthlyAttendanceTable";

const DetailPesertaMagangPage = () => {
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
          axios.get(`http://localhost:3000/intern/${id}`, {
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

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbsComponent />

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

                  <div className="flex items-start gap-3">
                    <ClockIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                    <div className="flex-1">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
                        Status
                      </Typography>
                      <Typography
                        variant="small"
                        className="text-blue-gray-500"
                      >
                        {data.Status?.name}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-4 pb-2 border-b"
              >
                Dokumen Pendukung
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {data.Dokumens &&
                  [
                    { label: "Curriculum Vitae", index: 0 },
                    { label: "Kartu Tanda Penduduk", index: 2 },
                    { label: "Surat Pengantar", index: 3 },
                    { label: "Transkrip Nilai", index: 1 },
                  ].map((doc) => (
                    <div key={doc.label} className="flex gap-2">
                      <Button
                        variant="outlined"
                        className="flex items-center gap-2 normal-case flex-1"
                        onClick={() => {
                          handleDocumentModal(
                            `http://localhost:3000/uploads/${
                              data.Dokumens[doc.index].url
                            }`,
                            doc.label
                          );
                        }}
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        {doc.label}
                      </Button>
                    </div>
                  ))}
              </div>
            </CardBody>
          </Card>

          <MonthlyAttendanceTable
            startDate={data.tanggalMulai}
            endDate={data.tanggalSelesai}
          />

          <ModalIframe
            isOpen={isDocumentModalOpen}
            handleOpen={handleDocumentModal}
            pdfUrl={selectedDocument.url}
            title={selectedDocument.title}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailPesertaMagangPage;
