import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const EmptyState = () => {
  const navigate = useNavigate();
  
  return (
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
            onClick={() => navigate("/form-siswa")}
          >
            Ajukan Magang untuk Siswa
          </button>
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all"
            onClick={() => navigate("/form-mahasiswa")}
          >
            Ajukan Magang untuk Mahasiswa
          </button>
        </div>
      </CardBody>
    </Card>
  );
};

export default EmptyState;