import React from "react";
import { Typography } from "@material-tailwind/react";
import {
  Users,
  Calendar,
  Building2,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Clock,
  Building,
  User,
} from "lucide-react";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const DiprosesCard = ({ applicationStatus }) => {
  const {
    biodata,
    createdAt,
    email,
    institusi,
    jurusan,
    tanggalMulai,
    tanggalSelesai,
    unitKerja
  } = applicationStatus.data;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <Typography variant="h6" color="blue-gray" className="font-medium">
              Diajukan pada {formatDate(createdAt)}
            </Typography>
          </div>
        </div>
        <span className="inline-flex items-center rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-600/10">
          Diproses
        </span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Personal Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-blue-500" />
              <Typography className="font-semibold text-gray-700">
                Informasi Pribadi
              </Typography>
            </div>
            <div className="bg-white rounded-xl p-4 space-y-4">
              <div className="text-center pb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-3">
                  <Typography className="text-2xl font-bold text-blue-500">
                    {biodata.nama.charAt(0).toUpperCase()}
                  </Typography>
                </div>
                <Typography className="text-lg font-semibold text-gray-800">
                  {biodata.nama}
                </Typography>
                <Typography className="text-sm text-gray-500">
                  {biodata.nim}
                </Typography>
              </div>
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <Typography className="text-sm text-gray-600">{biodata.noHp}</Typography>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <Typography className="text-sm text-gray-600">{email}</Typography>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <Typography className="text-sm text-gray-600">{biodata.alamat}</Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Academic Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-5 w-5 text-blue-500" />
              <Typography className="font-semibold text-gray-700">
                Informasi Akademik
              </Typography>
            </div>
            <div className="bg-white rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-gray-400" />
                <div>
                  <Typography className="text-sm font-medium text-gray-700">
                    {institusi}
                  </Typography>
                  <Typography className="text-sm text-gray-500">
                    {jurusan}
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Internship Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building className="h-5 w-5 text-blue-500" />
              <Typography className="font-semibold text-gray-700">
                Detail Magang
              </Typography>
            </div>
            <div className="bg-white rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <Typography className="text-sm text-blue-600">Periode Magang</Typography>
                <Typography className="text-sm font-medium text-blue-700">
                  {formatDate(tanggalMulai)} - {formatDate(tanggalSelesai)}
                </Typography>
              </div>
              <div className="flex items-center gap-3 p-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <Typography className="text-sm text-gray-500">Unit Kerja</Typography>
                  <Typography className="text-sm font-medium text-gray-700">{unitKerja}</Typography>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <Typography className="text-sm text-gray-500">Durasi</Typography>
                  <Typography className="text-sm font-medium text-gray-700">
                    {Math.ceil((new Date(tanggalSelesai) - new Date(tanggalMulai)) / (1000 * 60 * 60 * 24 * 30))} Bulan
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiprosesCard;