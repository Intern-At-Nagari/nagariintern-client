import React from 'react';
import { Typography } from "@material-tailwind/react";
import { FileCheck, CheckCircle, FileText, Building, MapPin } from "lucide-react";

const PersetujuanCard = () => {
  const approvalData = {
    documentStatus: {
      title: "Surat Pernyataan Siswa/Mahasiswa",
      approvalDate: "20 Jan 2025",
      fileName: "surat_pernyataan_siswa.pdf"
    },
    assignmentLetter: {
      referenceNumber: "123/SP/HR/I/2025",
      issueDate: "21 Jan 2025",
      unitKerja: "Divisi Digital Innovation",
      lokasi: "Jakarta Pusat",
      startDate: "1 Feb 2025",
      endDate: "31 Jul 2025"
    }
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

      {/* Approval Status */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Typography className="font-medium text-gray-800">
              Status Dokumen
            </Typography>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <FileText className="w-4 h-4 mr-1" />
              {approvalData.documentStatus.fileName}
            </div>
          </div>
          <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Disetujui</span>
          </div>
        </div>
      </div>

      {/* Assignment Letter */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-start justify-between mb-4">
          <Typography className="font-medium text-gray-800">
            Surat Pengantar Magang
          </Typography>
          <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            <FileCheck className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Diterbitkan</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Typography className="text-gray-600">Nomor Surat</Typography>
              <Typography className="font-medium">
                {approvalData.assignmentLetter.referenceNumber}
              </Typography>
            </div>
            <div>
              <Typography className="text-gray-600">Tanggal Terbit</Typography>
              <Typography className="font-medium">
                {approvalData.assignmentLetter.issueDate}
              </Typography>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <Typography className="text-gray-600 mb-2">Penempatan Magang</Typography>
            <div className="space-y-2">
              <div className="flex items-center text-gray-800">
                <Building className="w-4 h-4 mr-2" />
                <Typography className="font-medium">
                  {approvalData.assignmentLetter.unitKerja}
                </Typography>
              </div>
              <div className="flex items-center text-gray-800">
                <MapPin className="w-4 h-4 mr-2" />
                <Typography className="font-medium">
                  {approvalData.assignmentLetter.lokasi}
                </Typography>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <Typography className="text-gray-600 mb-2">Periode Magang</Typography>
            <Typography className="font-medium">
              {approvalData.assignmentLetter.startDate} - {approvalData.assignmentLetter.endDate}
            </Typography>
          </div>
        </div>
      </div>

      {/* Download Info */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <FileCheck className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <Typography className="font-medium text-gray-800">
              Surat Pengantar Telah Diterbitkan
            </Typography>
            <Typography className="text-sm text-gray-600 mt-1">
              Silakan download surat pengantar melalui menu Dokumen. 
              Harap membawa surat pengantar saat hari pertama magang.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersetujuanCard;