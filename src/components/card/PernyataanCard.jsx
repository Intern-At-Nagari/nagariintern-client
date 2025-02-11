import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import {
  FileCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
} from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PernyataanCard = ({ applicationStatus }) => {
  const documents = [
    {
      title: "Surat Pernyataan Siswa/Mahasiswa",
      fileName: applicationStatus.data.dokumen.find(doc => doc.tipe === "Surat Keterangan Pribadi")?.url || "",
    },
    {
      title: "Surat Pernyataan Orang Tua/Wali & Sekolah/Perguruan Tinggi",
      fileName: applicationStatus.data.dokumen.find(doc => doc.tipe === "Surat Keterangan Kampus")?.url || "",
    },
    {
      title: "Fotocopy Buku Tabungan Bank Nagari",
      fileName: applicationStatus.data.dokumen.find(doc => doc.tipe === "Buku Tabungan")?.url || "",
    },
  ];

  const handleDownload = async (fileUrl) => {
    const url = `${API_BASE_URL}/download/${fileUrl}`;
    const a = document.createElement("a");
        a.href = url;
        a.download = fileUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return (
          <Typography
            variant="small"
            color="green"
            className="flex items-center gap-2"
          >
            <CheckCircle size={16} /> Terverifikasi
          </Typography>
        );
      case "pending":
        return (
          <Typography
            variant="small"
            color="orange"
            className="flex items-center gap-2"
          >
            <Clock size={16} /> Sedang Diproses
          </Typography>
        );
      case "rejected":
        return (
          <Typography
            variant="small"
            color="red"
            className="flex items-center gap-2"
          >
            <AlertCircle size={16} /> Ditolak
          </Typography>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4"></div>
      <div className="mb-4">
        <Typography variant="h5" color="blue-gray" className="mb-2">
          Verifikasi Dokumen
        </Typography>
        <Typography variant="small" color="gray">
          Status verifikasi dokumen yang telah diupload
        </Typography>
      </div>

      {/* Documents List */}
      <div className="space-y-4 mb-6">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-medium"
              >
                {doc.title}
              </Typography>
              <Typography variant="small" color="gray">
                {doc.fileName}
              </Typography>
            </div>
            <Button
              size="sm"
              variant="outlined"
              color="blue"
              className="flex items-center gap-2"
              onClick={() => handleDownload(doc.fileName)}
            >
              <Download size={16} /> Download
            </Button>
          </div>
        ))}
      </div>

      {/* Status Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <Typography
          variant="small"
          color="blue-gray"
          className="flex items-center gap-2 mb-2"
        >
          <Clock size={16} /> Estimasi Waktu Verifikasi
        </Typography>
        <Typography variant="small" color="gray">
          Proses verifikasi dokumen membutuhkan waktu 1-2 hari kerja. Anda akan
          mendapatkan notifikasi setelah dokumen selesai diverifikasi.
        </Typography>
      </div>
    </div>
  );
};

export default PernyataanCard;
