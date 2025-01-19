import React from 'react';
import { Typography } from "@material-tailwind/react";
import { FileCheck, Clock, CheckCircle, AlertCircle, FileText } from "lucide-react";

const VerifikasiCard = () => {
  const documents = [
    {
      title: "Surat Pernyataan Siswa/Mahasiswa",
      uploadDate: "18 Jan 2025",
      status: "verified", // verified, pending, rejected
      verifiedBy: "Admin HR",
      verificationDate: "19 Jan 2025",
      fileName: "surat_pernyataan_siswa.pdf"
    },
    {
      title: "Surat Pernyataan Orang Tua/Wali & Sekolah/Perguruan Tinggi",
      uploadDate: "18 Jan 2025",
      status: "pending",
      fileName: "surat_pernyataan_institusi.pdf"
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Terverifikasi</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Sedang Diproses</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full">
            <AlertCircle className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Ditolak</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <Typography variant="h4" className="font-bold text-gray-800">
          Verifikasi Dokumen
        </Typography>
        <Typography className="text-gray-600 mt-1">
          Status verifikasi dokumen yang telah diupload
        </Typography>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {documents.map((doc, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Typography className="font-medium text-gray-800">
                  {doc.title}
                </Typography>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <FileText className="w-4 h-4 mr-1" />
                  {doc.fileName}
                </div>
              </div>
              {getStatusBadge(doc.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Typography className="text-gray-600">Tanggal Upload</Typography>
                <Typography className="font-medium">{doc.uploadDate}</Typography>
              </div>
              {doc.status === 'verified' && (
                <>
                  <div>
                    <Typography className="text-gray-600">Diverifikasi Oleh</Typography>
                    <Typography className="font-medium">{doc.verifiedBy}</Typography>
                  </div>
                  <div>
                    <Typography className="text-gray-600">Tanggal Verifikasi</Typography>
                    <Typography className="font-medium">{doc.verificationDate}</Typography>
                  </div>
                </>
              )}
            </div>

            {doc.status === 'rejected' && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <Typography className="text-sm text-red-600">
                  Dokumen ditolak: Format surat pernyataan tidak sesuai. Silakan upload ulang dengan format yang benar.
                </Typography>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Status Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <Typography className="font-medium text-gray-800">
              Estimasi Waktu Verifikasi
            </Typography>
            <Typography className="text-sm text-gray-600 mt-1">
              Proses verifikasi dokumen membutuhkan waktu 1-2 hari kerja. 
              Anda akan mendapatkan notifikasi setelah dokumen selesai diverifikasi.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifikasiCard;