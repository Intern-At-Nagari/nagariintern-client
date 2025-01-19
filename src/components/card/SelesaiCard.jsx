import React from 'react';
import { Typography } from "@material-tailwind/react";
import { FileCheck, CheckCircle, FileText, Calendar, Award, Clock } from "lucide-react";

const SelesaiCard = () => {
  const completionData = {
    program: {
      startDate: "1 Feb 2025",
      endDate: "31 Jul 2025",
      totalDuration: "6 bulan",
      unitKerja: "Divisi Digital Innovation"
    },
    completion: {
      status: "completed",
      completionDate: "31 Jul 2025",
      certificateNumber: "CERT/DI/2025/078",
      certificateIssueDate: "2 Aug 2025"
    },
    documents: {
      evaluationStatus: "submitted",
      evaluationDate: "29 Jul 2025",
      reportStatus: "submitted",
      reportDate: "30 Jul 2025"
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <Typography variant="h4" className="font-bold text-gray-800">
          Status Penyelesaian Magang
        </Typography>
        <Typography className="text-gray-600 mt-1">
          Informasi penyelesaian program dan dokumen akhir
        </Typography>
      </div>

      {/* Program Status */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-start mb-4">
          <Typography className="font-medium text-gray-800">
            Status Program
          </Typography>
          <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Selesai</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <Typography className="text-gray-600">Periode Magang</Typography>
            <Typography className="font-medium">
              {completionData.program.startDate} - {completionData.program.endDate}
            </Typography>
          </div>
          <div>
            <Typography className="text-gray-600">Total Durasi</Typography>
            <Typography className="font-medium">
              {completionData.program.totalDuration}
            </Typography>
          </div>
        </div>
      </div>

      {/* Final Documents */}
      <div className="border border-gray-200 rounded-lg p-4">
        <Typography className="font-medium text-gray-800 mb-4">
          Dokumen Akhir
        </Typography>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FileText className="w-4 h-4 text-gray-600 mr-2" />
              <Typography className="text-gray-800">Laporan Magang</Typography>
            </div>
            <Typography className="text-sm text-gray-600">
              Dikumpulkan {completionData.documents.reportDate}
            </Typography>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FileText className="w-4 h-4 text-gray-600 mr-2" />
              <Typography className="text-gray-800">Formulir Evaluasi</Typography>
            </div>
            <Typography className="text-sm text-gray-600">
              Dikumpulkan {completionData.documents.evaluationDate}
            </Typography>
          </div>
        </div>
      </div>

      {/* Certificate Info */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-start mb-4">
          <Typography className="font-medium text-gray-800">
            Sertifikat Magang
          </Typography>
          <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            <Award className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Diterbitkan</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <Typography className="text-gray-600">Nomor Sertifikat</Typography>
            <Typography className="font-medium">
              {completionData.completion.certificateNumber}
            </Typography>
          </div>
          <div>
            <Typography className="text-gray-600">Tanggal Terbit</Typography>
            <Typography className="font-medium">
              {completionData.completion.certificateIssueDate}
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
              Sertifikat Telah Tersedia
            </Typography>
            <Typography className="text-sm text-gray-600 mt-1">
              Sertifikat magang dapat diunduh melalui menu Dokumen. 
              Sertifikat diterbitkan setelah semua dokumen akhir dikumpulkan.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelesaiCard;