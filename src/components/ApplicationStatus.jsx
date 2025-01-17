import React from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClipboardDocumentListIcon,
  ArrowRightIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  AcademicCapIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const ApplicationStatus = () => {
  const navigate = useNavigate();
  const [applicationStatus, setApplicationStatus] = React.useState(null);

  React.useEffect(() => {
    const fetchApplicationStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/my-intern", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setApplicationStatus(data);
        }
      } catch (error) {
        console.error("Error fetching application status:", error);
      }
    };

    fetchApplicationStatus();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const EmptyState = () => (
    <Card className="mt-6">
      <CardBody className="flex flex-col items-center text-center py-12">
        {/* Icon Section */}
        <div className="rounded-full p-6 bg-blue-50 mb-4">
          <ClipboardDocumentListIcon className="w-12 h-12 text-blue-500" />
        </div>

        {/* Title and Description */}
        <Typography variant="h4" color="blue-gray" className="mb-2">
          Belum Ada Pengajuan Magang
        </Typography>
        <Typography variant="paragraph" color="gray" className="mb-8 max-w-lg">
          Anda belum mengajukan permohonan magang. Mulai perjalanan karir Anda
          dengan mengajukan permohonan magang sekarang.
        </Typography>

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
            onClick={() => navigate("/application/siswa")}
          >
            Ajukan Magang untuk Siswa
          </button>
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all"
            onClick={() => navigate("/application/mahasiswa")}
          >
            Ajukan Magang untuk Mahasiswa
          </button>
        </div>
      </CardBody>
    </Card>
  );

  const StatusView = () => (
    <>
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
              <Typography variant="h6" className="capitalize">
                {applicationStatus.data.status}
              </Typography>
            </div>
          </CardBody>
        </Card>

        <Card className="mt-6">
          <CardBody className="flex items-center gap-4">
            <div className="rounded-full p-3 bg-green-100">
              <BuildingOfficeIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <Typography variant="small" color="blue-gray">
                Unit Kerja
              </Typography>
              <Typography variant="h6" className="capitalize">
                {applicationStatus.data.unitKerja}
              </Typography>
            </div>
          </CardBody>
        </Card>

        <Card className="mt-6">
          <CardBody className="flex items-center gap-4">
            <div className="rounded-full p-3 bg-orange-100">
              <CalendarIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <Typography variant="small" color="blue-gray">
                Periode Magang
              </Typography>
              <Typography variant="h6">
                {formatDate(applicationStatus.data.tanggalMulai)} -{" "}
                {formatDate(applicationStatus.data.tanggalSelesai)}
              </Typography>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-6">
            Detail Pengajuan Magang
          </Typography>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-blue-gray-50 rounded-lg">
              <div>
                <Typography variant="h6">
                Diajukan pada:{" "}
                {formatDate(applicationStatus.data.createdAt)}
                </Typography>
          
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <UserIcon className="w-5 h-5 text-blue-gray-500" />
                    <Typography variant="h6">Informasi Pemohon</Typography>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Typography variant="small" color="gray">
                        Status
                      </Typography>
                      <Typography className="font-medium capitalize">
                        {applicationStatus.data.type}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="small" color="gray">
                        No. Telepon
                      </Typography>
                      <Typography className="font-medium">
                        {applicationStatus.data.biodata.noHp}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPinIcon className="w-5 h-5 text-blue-gray-500" />
                    <Typography variant="h6">Alamat</Typography>
                  </div>
                  <Typography className="font-medium">
                    {applicationStatus.data.biodata.alamat}
                  </Typography>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AcademicCapIcon className="w-5 h-5 text-blue-gray-500" />
                    <Typography variant="h6">Informasi Akademik</Typography>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Typography variant="small" color="gray">
                        Institusi
                      </Typography>
                      <Typography className="font-medium">
                        {applicationStatus.data.institusi}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="small" color="gray">
                        Program Studi
                      </Typography>
                      <Typography className="font-medium">
                        {applicationStatus.data.jurusan}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Dokumen Pendukung
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {applicationStatus.data.dokumen && (
                  <Button
                    variant="outlined"
                    className="flex items-center gap-2 normal-case"
                    onClick={() =>
                      window.open(
                        `http://localhost:3000/uploads/${applicationStatus.data.dokumen[0].url}`,
                        "_blank"
                      )
                    }
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    {applicationStatus.data.dokumen[0].tipe}
                  </Button>
                )}
                {applicationStatus.data.dokumen && (
                  <Button
                    variant="outlined"
                    className="flex items-center gap-2 normal-case"
                    onClick={() =>
                      window.open(
                        `http://localhost:3000/uploads/${applicationStatus.data.dokumen[2].url}`,
                        "_blank"
                      )
                    }
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    {applicationStatus.data.dokumen[2].tipe}
                  </Button>
                )}
                {applicationStatus.data.dokumen && (
                  <Button
                    variant="outlined"
                    className="flex items-center gap-2 normal-case"
                    onClick={() =>
                      window.open(
                        `http://localhost:3000/uploads/${applicationStatus.data.dokumen[3].url}`,
                        "_blank"
                      )
                    }
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    {applicationStatus.data.dokumen[3].tipe}
                  </Button>
                )}
                {applicationStatus.data.dokumen && (
                  <Button
                    variant="outlined"
                    className="flex items-center gap-2 normal-case"
                    onClick={() =>
                      window.open(
                        `http://localhost:3000/uploads/${applicationStatus.data.dokumen[1].url}`,
                        "_blank"
                      )
                    }
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    {applicationStatus.data.dokumen[0].tipe}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );

  return applicationStatus ? <StatusView /> : <EmptyState />;
};

export default ApplicationStatus;
