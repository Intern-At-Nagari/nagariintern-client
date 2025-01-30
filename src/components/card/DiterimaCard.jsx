import React, { useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  Building,
  Download,
  Upload,
  XCircle,
  Check,
  AlertCircle,
} from "lucide-react";

const DiterimaCard = ({ applicationStatus }) => {
  const [siswaFile, setSiswaFile] = useState(null);
  const [institusiFile, setInstitusiFile] = useState(null);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);

  const token = localStorage.getItem("token");
  console.log(token);
  const handleAcceptClick = () => {
    setShowAcceptDialog(true);
  };

  const handleRejectClick = () => {
    setShowRejectDialog(true);
  };

  const handleFileUpload = (event, documentType) => {
    const file = event.target.files[0];
    if (documentType === "siswa") {
      setSiswaFile(file);
    } else if (documentType === "institusi") {
      setInstitusiFile(file);
    }
  };

  const handleDownload = async (fileUrl) => {
    const fileName = fileUrl.split("/").pop();
    const aTag = document.createElement("a");
    aTag.href = `http://localhost:3000/uploads/${fileUrl}`;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  const handleSendDocuments = async () => {
    if (!siswaFile || !institusiFile) {
      alert("Harap unggah kedua dokumen");
      return;
    }

    const formData = new FormData();
    formData.append("fileSuratPernyataanSiswa", siswaFile);
    formData.append("fileSuratPernyataanWali", institusiFile);

    try {
      const response = await fetch(
        "http://localhost:3000/intern/send-surat-pernyataan",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        setShowAcceptDialog(false);
        setUploadStep(0);
        // Optional: Show success message
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Gagal mengunggah dokumen");
    }
  };

  const renderUploadStep = () => {
    switch (uploadStep) {
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
              <li>
                Bersedia mengikuti program magang sesuai periode yang ditentukan
              </li>
              <li>Akan mematuhi seluruh peraturan yang berlaku</li>
              <li>
                Berkomitmen untuk menyelesaikan program magang hingga selesai
              </li>
              <li>Bersedia ditempatkan di unit kerja yang telah ditentukan</li>
            </ul>
            <div className="flex justify-end space-x-3 mt-6">
              <Button onClick={() => setShowAcceptDialog(false)} color="gray">
                Batalkan
              </Button>
              <Button onClick={() => setUploadStep(1)} color="blue">
                Saya Setuju
              </Button>
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
                      onChange={(e) => handleFileUpload(e, "siswa")}
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
                      onChange={(e) => handleFileUpload(e, "institusi")}
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
              <Button onClick={() => setUploadStep(0)} color="gray">
                Kembali
              </Button>
              <Button onClick={handleSendDocuments} color="blue">
                Kirim Dokumen
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <Typography variant="h4" className="font-bold text-gray-800">
          Tawaran Magang
        </Typography>
        <Typography className="text-gray-600 mt-1">
          Silakan tinjau penawaran magang yang diberikan
        </Typography>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Typography className="text-sm text-gray-600">
              Unit Kerja Ditempatkan
            </Typography>
            <Typography className="font-medium">
              {applicationStatus.data.penempatan}
            </Typography>
          </div>
          <Building className="w-5 h-5 text-blue-500" />
        </div>
      </div>

      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex justify-between items-start">
          <div className="w-full">
            <Typography className="font-medium text-gray-800">
              Surat Pengantar
            </Typography>

            {/* Cari dokumen dengan tipe "Surat Pengantar" */}
            {applicationStatus.data.dokumen.find(
              (dokumen) => dokumen.tipe === "Surat Pengantar"
            ) ? (
              <div className="border rounded-lg p-4 mt-2 flex justify-between items-center">
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  ></Typography>
                  <Typography variant="small" color="gray">
                    {
                      applicationStatus.data.dokumen.find(
                        (dokumen) => dokumen.tipe === "Surat Pengantar"
                      ).url
                    }
                  </Typography>
                </div>
                <Button
                  size="sm"
                  variant="outlined"
                  color="blue"
                  className="flex items-center gap-2"
                  onClick={() =>
                    handleDownload(
                      applicationStatus.data.dokumen.find(
                        (dokumen) => dokumen.tipe === "Surat Pengantar"
                      ).url
                    )
                  }
                >
                  <Download size={16} /> Download
                </Button>
              </div>
            ) : (
              <Typography variant="small" color="gray" className="mt-2">
                Dokumen Surat Pengantar tidak tersedia.
              </Typography>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border border-gray-200 rounded-lg mt-4">
        <div className="flex justify-between items-start">
          <div className="w-full">
            <Typography className="font-medium text-gray-800">
              Template Surat Pernyataan
            </Typography>
            <div className="flex space-x-2 mt-2">
              <Button
                size="sm"
                variant="outlined"
                color="blue"
                className="flex items-center gap-2"
                onClick={() =>
                  window.open(
                    "http://localhost:3000/intern/download-template/siswa",
                    "_blank"
                  )
                }
              >
                <Download size={16} /> Surat Pernyataan Siswa
              </Button>
              <Button
                size="sm"
                variant="outlined"
                color="blue"
                className="flex items-center gap-2"
                onClick={() =>
                  window.open(
                    "http://localhost:3000/intern/download-template/institusi",
                    "_blank"
                  )
                }
              >
                <Download size={16} /> Surat Pernyataan Institusi
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 pt-4">
        <Button
          onClick={handleRejectClick}
          color="red"
          className="flex items-center space-x-2"
        >
          <XCircle className="w-5 h-5" />
          <span>Tolak Tawaran</span>
        </Button>

        <Button
          onClick={handleAcceptClick}
          color="blue"
          className="flex items-center space-x-2"
        >
          <Check className="w-5 h-5" />
          <span>Terima Tawaran</span>
        </Button>
      </div>

      {/* Accept Dialog */}
      <Dialog
        open={showAcceptDialog}
        handler={() => setShowAcceptDialog(false)}
        size="md"
      >
        <DialogHeader>
          <Typography variant="h5">Konfirmasi Penerimaan</Typography>
        </DialogHeader>
        <DialogBody>{renderUploadStep()}</DialogBody>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={showRejectDialog}
        handler={() => setShowRejectDialog(false)}
        size="md"
      >
        <DialogHeader>
          <Typography variant="h5">Konfirmasi Penolakan</Typography>
        </DialogHeader>
        <DialogBody>
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <Typography className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menolak tawaran magang ini? Tindakan ini
              tidak dapat dibatalkan.
            </Typography>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button color="gray" onClick={() => setShowRejectDialog(false)}>
            Batalkan
          </Button>
          <Button
            color="red"
            onClick={() => {
              setShowRejectDialog(false);
              // Logika penolakan dapat ditambahkan di sini
            }}
          >
            Ya, Tolak Tawaran
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default DiterimaCard;
