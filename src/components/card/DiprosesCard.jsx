import React from 'react';
import { Typography } from "@material-tailwind/react";
import { Calendar, Users, Timer } from "lucide-react";

const DiprosesCard = ({ applicationStatus }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <Typography variant="h6" className="text-blue-800 mb-4">
          Detail Pengajuan
        </Typography>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 text-blue-500 mr-3" />
            <div>
              <Typography className="text-gray-600 text-sm">Tanggal Pengajuan</Typography>
              <Typography className="font-semibold">
                {formatDate(applicationStatus.data.createdAt)}
              </Typography>
            </div>
          </div>
          <div className="flex items-center">
            <Timer className="w-6 h-6 text-blue-500 mr-3" />
            <div>
              <Typography className="text-gray-600 text-sm">Durasi</Typography>
              <Typography className="font-semibold">
                {applicationStatus.data.tanggalMulai && applicationStatus.data.tanggalSelesai 
                  ? `${Math.ceil((new Date(applicationStatus.data.tanggalSelesai) - new Date(applicationStatus.data.tanggalMulai)) / (1000 * 60 * 60 * 24 * 30))} Bulan`
                  : 'Tidak Tersedia'}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <Typography className="text-gray-700">
          Status: Sedang ditinjau oleh admin
        </Typography>
      </div>
    </div>
  );
};

export default DiprosesCard;