import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import { FileCheck, Download, Calendar, MapPin, UserCheck } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PersetujuanCard = ({ applicationStatus }) => {
  // Ambil data dari applicationStatus
  const { dokumen, unitKerja, penempatan, tanggalMulai } =
    applicationStatus.data;

  // Cari dokumen Surat Pengantar Divisi
  const suratPengantarDivisi = dokumen.find(
    (doc) => doc.tipe === "Surat Pengantar Divisi"
  );

  // Format tanggal
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };


  const handleDownload = async (fileUrl) => {
    const url = `${API_BASE_URL}/download/${fileUrl}`;
    const a = document.createElement("a");
        a.href = url;
        a.download = fileUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <Typography variant="h4" className="font-bold text-gray-800">
          Status Persetujuan
        </Typography>
        <Typography className="text-gray-600 mt-1">
          Informasi persetujuan dokumen dan penempatan magang
        </Typography>
      </div>

      {/* Informasi Mulai Magang */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <UserCheck className="w-6 h-6 text-blue-500" />
          <div>
            <Typography className="font-medium text-gray-800">
              Selamat! Anda Sudah Bisa Mulai Magang
            </Typography>
            <Typography className="text-sm text-gray-600 mt-1">
              Berikut adalah informasi penting untuk memulai magang Anda:
            </Typography>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {/* Tanggal Mulai Magang */}
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div>
              <Typography className="text-sm text-gray-600">
                Tanggal Mulai Magang
              </Typography>
              <Typography className="font-medium text-gray-800">
                {formatDate(tanggalMulai)}
              </Typography>
            </div>
          </div>

          {/* Unit Penempatan */}
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-600" />
            <div>
              <Typography className="text-sm text-gray-600">
                Unit Penempatan
              </Typography>
              <Typography className="font-medium text-gray-800">
                {penempatan}
              </Typography>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FileCheck className="w-5 h-5 text-gray-600" />
            <div>
              <Typography className="text-sm text-gray-600">
                Instruksi Masuk Magang
              </Typography>
              <Typography className="font-medium text-gray-800">
                Peserta magang silahkan mengambil surat pengantar magang di
                Divisi Human Capital dan sekaligus mengikuti coaching magang.
                Untuk informasi lebih lanjut silahkan menghubungi{" "}
                <a
                  href="https://wa.me/+6282391233317"
                  className="text-blue-500 hover:text-blue-700 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Download Surat Pengantar Divisi */}
      {suratPengantarDivisi ? (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <Typography className="font-medium text-gray-800">
                Surat Pengantar Divisi
              </Typography>
              <Typography variant="small" className="text-gray-600">
                {suratPengantarDivisi.tipe}
              </Typography>
            </div>
            <Button
              size="sm"
              variant="outlined"
              color="blue"
              className="flex items-center gap-2"
              onClick={() => handleDownload(suratPengantarDivisi.url)}
            >
              <Download size={16} /> Download
            </Button>
          </div>
        </div>
      ) : (
        <Typography variant="small" className="text-gray-600">
          Dokumen Surat Pengantar Divisi tidak tersedia.
        </Typography>
      )}
    </div>
  );
};

export default PersetujuanCard;
