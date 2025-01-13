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
        <div className="rounded-full p-6 bg-blue-50 mb-4">
          <ClipboardDocumentListIcon className="w-12 h-12 text-blue-500" />
        </div>
        <Typography variant="h4" color="blue-gray" className="mb-2">
          Belum Ada Pengajuan Magang
        </Typography>
        <Typography variant="paragraph" color="gray" className="mb-8 max-w-lg">
          Anda belum mengajukan permohonan magang. Mulai perjalanan karir Anda
          dengan mengajukan permohonan magang sekarang.
        </Typography>
        <Button
          size="lg"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700"
          onClick={() => navigate("/application")}
        >
          Ajukan Permohonan Magang
          <ArrowRightIcon className="w-4 h-4" />
        </Button>
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
                {applicationStatus.statusPermohonan}
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
                Divisi
              </Typography>
              <Typography variant="h6" className="capitalize">
                {applicationStatus.Divisi.name}
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
                {formatDate(applicationStatus.tanggalMulai)} -{" "}
                {formatDate(applicationStatus.tanggalSelesai)}
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
                  Pengajuan #{applicationStatus.id}
                </Typography>
                <Typography variant="small" color="gray">
                  Diajukan pada:{" "}
                  {formatDate(applicationStatus.tanggalPengajuan)}
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <Typography
                  variant="small"
                  className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full capitalize"
                >
                  {applicationStatus.statusPermohonan}
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
                        {applicationStatus.tipePemohon}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="small" color="gray">
                        No. Telepon
                      </Typography>
                      <Typography className="font-medium">
                        {applicationStatus.noHp}
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
                    {applicationStatus.alamat}
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
                        {applicationStatus.Institusi.name}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="small" color="gray">
                        Program Studi
                      </Typography>
                      <Typography className="font-medium">
                        {applicationStatus.Jurusan.name}
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
                {applicationStatus.Dokumens && (
                  <Button
                    variant="outlined"
                    className="flex items-center gap-2 normal-case"
                    onClick={() => window.open(`http://localhost:3000/uploads/${applicationStatus.Dokumens[0].url}`, "_blank")}
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Curriculum Vitae
                  </Button>
                )}
                {applicationStatus.Dokumens && (
                  <Button
                    variant="outlined"
                    className="flex items-center gap-2 normal-case"
                    onClick={() => window.open(`http://localhost:3000/uploads/${applicationStatus.Dokumens[2].url}`, "_blank")}

                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Kartu Tanda Penduduk
                  </Button>
                )}
                {applicationStatus.Dokumens && (
                  <Button
                    variant="outlined"
                    className="flex items-center gap-2 normal-case"
                    onClick={() => window.open(`http://localhost:3000/uploads/${applicationStatus.Dokumens[3].url}`, "_blank")}

                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Surat Pengantar
                  </Button>
                )}
                {applicationStatus.Dokumens && (
                  <Button
                    variant="outlined"
                    className="flex items-center gap-2 normal-case"
                    onClick={() => window.open(`http://localhost:3000/uploads/${applicationStatus.Dokumens[1].url}`, "_blank")}

                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Transkrip Nilai
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
