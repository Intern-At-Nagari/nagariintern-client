import React, { useState } from 'react';
import { Typography } from "@material-tailwind/react";
import { Calendar, Building, Download, Upload, FileText, XCircle, Check, AlertCircle } from "lucide-react";

const MenungguSuratCard = () => {
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  
  const internshipDetails = {
    period: {
      start: "2 Januari 2025",
      end: "12 Februari 2025",
      duration: "2 Bulan"
    },
    placement: {
      applied: "CABANG PADANG",
      assigned: "CABANG TAPAN"
    }
  };

  const handleAcceptClick = () => {
    setShowAcceptModal(true);
  };

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const handleFileUpload = (event, documentType) => {
    console.log(`Uploading ${documentType}:`, event.target.files[0]);
  };

  const ConfirmationModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative">
          {children}
        </div>
      </div>
    );
  };

  const renderUploadStep = () => {
    switch(uploadStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <Typography variant="h5" className="font-bold text-gray-800 mb-2">
                Konfirmasi Penerimaan
              </Typography>
              <Typography className="text-gray-600">
                Dengan menerima tawaran ini, saya menyatakan:
              </Typography>
            </div>
            <ul className="space-y-2 text-gray-600 list-disc pl-6">
              <li>Bersedia mengikuti program magang sesuai periode yang ditentukan</li>
              <li>Akan mematuhi seluruh peraturan yang berlaku</li>
              <li>Berkomitmen untuk menyelesaikan program magang hingga selesai</li>
              <li>Bersedia ditempatkan di unit kerja yang telah ditentukan</li>
            </ul>
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowAcceptModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Batalkan
              </button>
              <button 
                onClick={() => setUploadStep(1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Saya Setuju
              </button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Typography variant="h5" className="font-bold text-gray-800">
                Upload Dokumen
              </Typography>
              <Typography className="text-gray-600">
                Silakan unduh template dan upload dokumen yang diperlukan
              </Typography>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <Typography className="font-medium text-gray-800">
                      Template Surat Pernyataan
                    </Typography>
                    <div className="flex space-x-2 mt-2">
                      <button className="text-sm text-blue-500 hover:text-blue-600 flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        Surat Pernyataan Siswa
                      </button>
                      <button className="text-sm text-blue-500 hover:text-blue-600 flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        Surat Pernyataan Institusi
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <Typography className="font-medium text-gray-800">
                    Surat Pernyataan Siswa/Mahasiswa
                  </Typography>
                  <label className="mt-2 flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, 'siswa')}
                    />
                    <div className="text-center">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <Typography className="text-sm text-gray-600">
                        Klik untuk upload PDF (max 2MB)
                      </Typography>
                    </div>
                  </label>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <Typography className="font-medium text-gray-800">
                    Surat Pernyataan Orang Tua/Wali & Sekolah/Perguruan Tinggi
                  </Typography>
                  <label className="mt-2 flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, 'institusi')}
                    />
                    <div className="text-center">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <Typography className="text-sm text-gray-600">
                        Klik untuk upload PDF (max 2MB)
                      </Typography>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setUploadStep(0)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Kembali
              </button>
              <button 
                onClick={() => {
                  setShowAcceptModal(false);
                  setUploadStep(0);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Kirim Dokumen
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <Typography variant="h4" className="font-bold text-gray-800">
          Tawaran Magang
        </Typography>
        <Typography className="text-gray-600 mt-1">
          Silakan tinjau penawaran magang yang diberikan
        </Typography>
      </div>

      {/* Placement Info */}
      <div className="bg-blue-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Typography className="text-sm text-gray-600">Unit Kerja Dilamar</Typography>
            <Typography className="font-medium">{internshipDetails.placement.applied}</Typography>
          </div>
          <Building className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Typography className="text-sm text-gray-600">Unit Kerja Ditempatkan</Typography>
            <Typography className="font-medium">{internshipDetails.placement.assigned}</Typography>
          </div>
          <Building className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Typography className="text-sm text-gray-600">Periode Magang</Typography>
            <Typography className="font-medium">
              {internshipDetails.period.start} - {internshipDetails.period.end}
            </Typography>
          </div>
          <Calendar className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Typography className="text-sm text-gray-600">Durasi</Typography>
            <Typography className="font-medium">{internshipDetails.period.duration}</Typography>
          </div>
          <Calendar className="w-5 h-5 text-blue-500" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 pt-4">
        <button
          onClick={handleRejectClick}
          className="px-6 py-2.5 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-2"
        >
          <XCircle className="w-5 h-5" />
          <span>Tolak Tawaran</span>
        </button>

        <button
          onClick={handleAcceptClick}
          className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
        >
          <Check className="w-5 h-5" />
          <span>Terima Tawaran</span>
        </button>
      </div>

      {/* Accept Modal */}
      <ConfirmationModal 
        isOpen={showAcceptModal} 
        onClose={() => {
          setShowAcceptModal(false);
          setUploadStep(0);
        }}
      >
        {renderUploadStep()}
      </ConfirmationModal>

      {/* Reject Modal */}
      <ConfirmationModal 
        isOpen={showRejectModal} 
        onClose={() => setShowRejectModal(false)}
      >
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <Typography variant="h5" className="font-bold text-gray-800 mb-2">
            Konfirmasi Penolakan
          </Typography>
          <Typography className="text-gray-600 mb-6">
            Apakah Anda yakin ingin menolak tawaran magang ini? Tindakan ini tidak dapat dibatalkan.
          </Typography>
          <div className="flex justify-end space-x-3">
            <button 
              onClick={() => setShowRejectModal(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Batalkan
            </button>
            <button 
              onClick={() => {
                setShowRejectModal(false);
                // Handle rejection logic
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Ya, Tolak Tawaran
            </button>
          </div>
        </div>
      </ConfirmationModal>
    </div>
  );
};

export default MenungguSuratCard;