import React from 'react';
import { Typography, Button } from "@material-tailwind/react";
import { FileCheck, Clock, CheckCircle, AlertCircle, FileText, Download } from "lucide-react";

const PernyataanCard = ({ applicationStatus }) => {
  const documents = [
    {
      title: "Surat Pernyataan Siswa/Mahasiswa",
      fileName: applicationStatus.data.dokumen[0].url
    },
    {
      title: "Surat Pernyataan Orang Tua/Wali & Sekolah/Perguruan Tinggi",
      fileName: applicationStatus.data.dokumen[1].url
    }
  ];

  const handleDownload = (fileUrl) => {
    if (!fileUrl) {
      console.error("File URL is invalid or missing.");
      return;
    }
  
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = `http://localhost:3000/uploads/${fileUrl}`;
  
    // Extract file name from the URL or set a default name
    const fileName = fileUrl.split('/').pop() || 'document.pdf';
    link.setAttribute('download', fileName);
  
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <Typography variant="small" color="green" className="flex items-center gap-2">
            <CheckCircle size={16} /> Terverifikasi
          </Typography>
        );
      case 'pending':
        return (
          <Typography variant="small" color="orange" className="flex items-center gap-2">
            <Clock size={16} /> Sedang Diproses
          </Typography>
        );
      case 'rejected':
        return (
          <Typography variant="small" color="red" className="flex items-center gap-2">
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
          <div key={index} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <Typography variant="small" color="blue-gray" className="font-medium">
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
        <Typography variant="small" color="blue-gray" className="flex items-center gap-2 mb-2">
          <Clock size={16} /> Estimasi Waktu Verifikasi
        </Typography>
        <Typography variant="small" color="gray">
          Proses verifikasi dokumen membutuhkan waktu 1-2 hari kerja. 
          Anda akan mendapatkan notifikasi setelah dokumen selesai diverifikasi.
        </Typography>
      </div>
    </div>
  );
};

export default PernyataanCard;