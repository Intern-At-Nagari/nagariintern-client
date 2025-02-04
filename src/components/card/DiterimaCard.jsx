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
  CheckCircle,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

const DiterimaCard = ({ applicationStatus }) => {
  const [siswaFile, setSiswaFile] = useState(null);
  const [tabunganFile, setTabunganFile] = useState(null);
  const [institusiFile, setInstitusiFile] = useState(null);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  const [nomorRekening, setNomorRekening] = useState('');
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
    } else if (documentType === "tabungan") {
      setTabunganFile(file);
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

  const handleReject = async () => {
    try {
      const response = await fetch("http://localhost:3000/my-intern/reject", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();

      if (result.message === "Permintaan magang berhasil ditolak.") {
        setShowRejectDialog(false);
        window.location.reload();
      } else {
        alert(result.status);
      }
    } catch (error) {
      console.error("Reject error:", error);
      alert("Gagal menolak tawaran");
    }
  };

  const handleSendDocuments = async () => {
    if (!siswaFile || !institusiFile || !tabunganFile) {
      alert("Harap unggah kedua dokumen");
      return;
    }

    const formData = new FormData();
    formData.append("fileSuratPernyataanSiswa", siswaFile);
    formData.append("fileSuratPernyataanWali", institusiFile);
    formData.append("fileTabungan", tabunganFile);
    formData.append("nomorRekening", nomorRekening);

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
        window.location.reload();
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
              <Button
                onClick={() => setShowAcceptDialog(false)}
                variant="outlined"
                color="red"
              >
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
            <div className="text-center mb-4">
              <Typography variant="h5" className="font-bold text-gray-800">
                Upload Dokumen
              </Typography>
              <Typography className="text-sm text-gray-600">
                Silakan unduh template dan upload dokumen yang diperlukan
              </Typography>
            </div>

            <div className="space-y-3">
              {/* Surat Pernyataan Siswa */}
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Typography className="font-medium text-gray-800 text-sm">
                    Surat Pernyataan Siswa/Mahasiswa
                  </Typography>
                  <label className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md cursor-pointer hover:bg-blue-100">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, "siswa")}
                    />
                    <Upload className="w-4 h-4 mr-2" />
                    <span className="text-sm">Upload PDF</span>
                  </label>
                </div>
                {siswaFile && (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <Typography className="text-xs text-gray-500 truncate max-w-[200px]">
                      {siswaFile.name}
                    </Typography>
                    <button
                      onClick={() => setSiswaFile(null)}
                      className="p-1 hover:bg-gray-200 rounded-full"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>

              {/* Surat Pernyataan Wali */}
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Typography className="font-medium text-gray-800 text-sm">
                    Surat Pernyataan Orang Tua/Wali
                  </Typography>
                  <label className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md cursor-pointer hover:bg-blue-100">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, "institusi")}
                    />
                    <Upload className="w-4 h-4 mr-2" />
                    <span className="text-sm">Upload PDF</span>
                  </label>
                </div>
                {institusiFile && (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <Typography className="text-xs text-gray-500 truncate max-w-[200px]">
                      {institusiFile.name}
                    </Typography>
                    <button
                      onClick={() => setInstitusiFile(null)}
                      className="p-1 hover:bg-gray-200 rounded-full"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>

              {/* Buku Tabungan */}
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Typography className="font-medium text-gray-800 text-sm">
                    Fotocopy Buku Tabungan
                  </Typography>
                  <label className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md cursor-pointer hover:bg-blue-100">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, "tabungan")}
                    />
                    <Upload className="w-4 h-4 mr-2" />
                    <span className="text-sm">Upload PDF</span>
                  </label>
                </div>
                {tabunganFile && (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <Typography className="text-xs text-gray-500 truncate max-w-[200px]">
                      {tabunganFile.name}
                    </Typography>
                    <button
                      onClick={() => setTabunganFile(null)}
                      className="p-1 hover:bg-gray-200 rounded-full"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                )}
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan Nomor Rekening"
                  value={nomorRekening}
                  onChange={(e) => setNomorRekening(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <Button
                onClick={() => setUploadStep(0)}
                variant="outlined"
                className="flex items-center gap-2 px-4 py-2"
                color="red"
              >
                Kembali
              </Button>
              <Button
                onClick={handleSendDocuments}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600"
                color="blue"
              >
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
              Surat Balasan
            </Typography>

            {/* Cari dokumen dengan tipe "Surat Pengantar" */}
            {applicationStatus.data.dokumen.find(
              (dokumen) => dokumen.tipe === "Surat Balasan"
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
                        (dokumen) => dokumen.tipe === "Surat Balasan"
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
                        (dokumen) => dokumen.tipe === "Surat Balasan"
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
      {applicationStatus?.data?.status.id == 2 &&
        applicationStatus?.data?.statusState == "completed" && (
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
        )}

      {/* Accept Dialog */}
      <Dialog
        open={showAcceptDialog}
        onOpenChange={() => setShowAcceptDialog(false)}
        className="max-w-md mx-auto"
      >
        <DialogHeader className="bg-green-50 p-4 rounded-t-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              Konfirmasi Penerimaan
            </h2>
          </div>
        </DialogHeader>

        <DialogBody className="p-6">{renderUploadStep()}</DialogBody>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={showRejectDialog}
        onOpenChange={() => setShowRejectDialog(false)}
        className="max-w-md mx-auto"
      >
        <DialogHeader className="bg-red-50 p-4 rounded-t-lg">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              Konfirmasi Penolakan
            </h2>
          </div>
        </DialogHeader>

        <DialogBody className="p-6">
          <div className="text-center space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <p className="text-gray-600">
              Apakah Anda yakin ingin menolak tawaran magang ini?
              <br />
              <span className="text-sm text-red-500 font-medium">
                Tindakan ini tidak dapat dibatalkan.
              </span>
            </p>
          </div>
        </DialogBody>

        <DialogFooter className="p-4 bg-gray-50 rounded-b-lg space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowRejectDialog(false)}
            className="w-full sm:w-auto"
            color="blue"
          >
            Batalkan
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setShowRejectDialog(false);
              handleReject();
            }}
            className="w-full sm:w-auto"
            color="red"
          >
            Ya, Tolak Tawaran
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default DiterimaCard;
