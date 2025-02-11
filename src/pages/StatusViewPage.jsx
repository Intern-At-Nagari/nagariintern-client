import React from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import {
  DocumentTextIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  AcademicCapIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StatusView = ({ applicationStatus }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
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
                  Diajukan pada: {formatDate(applicationStatus.data.createdAt)}
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
                {applicationStatus.data.dokumen?.map((doc, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    className="flex items-center gap-2 normal-case"
                    onClick={() =>
                      window.open(
                        `${API_BASE_URL}/uploads/${doc.url}`,
                        "_blank"
                      )
                    }
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    {doc.tipe}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default StatusView;