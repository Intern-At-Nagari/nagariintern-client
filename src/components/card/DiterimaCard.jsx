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
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DiterimaCard = ({ applicationStatus }) => {
  const [siswaFile, setSiswaFile] = useState(null);
  const [tabunganFile, setTabunganFile] = useState(null);
  const [institusiFile, setInstitusiFile] = useState(null);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  const [nomorRekening, setNomorRekening] = useState("");
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
    const url = `${API_BASE_URL}/uploads/${fileUrl}`;
    const a = document.createElement("a");
        a.href = url;
        a.download = fileUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
  };

  const handleDownloadTemplate = async (fileUrl) => {
    const fileName = fileUrl.split("/").pop();
    const aTag = document.createElement("a");
    aTag.href = `${API_BASE_URL}/template/${fileUrl}`;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  const handleReject = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/my-intern/reject`, {
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
          `${API_BASE_URL}/intern/send-surat-pernyataan`,
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
    <div className="space-y-4 md:space-y-6 p-2 md:p-4">
      <div className="border-b border-gray-100 pb-4">
        <Typography variant="h4" className="font-bold text-gray-800 text-xl md:text-2xl">
          Tawaran Magang
        </Typography>
        <Typography className="text-gray-600 mt-1 text-sm md:text-base">
          Silakan tinjau penawaran magang yang diberikan
        </Typography>
      </div>

      <div className="bg-blue-50 rounded-lg p-3 md:p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Typography className="text-xs md:text-sm text-gray-600">
              Unit Kerja Ditempatkan
            </Typography>
            <Typography className="font-medium text-sm md:text-base">
              {applicationStatus.data.penempatan}
            </Typography>
          </div>
          <Building className="w-5 h-5 text-blue-500" />
        </div>
      </div>

      <div className="p-3 md:p-4 border border-gray-200 rounded-lg">
        <Typography className="font-medium text-gray-800 text-sm md:text-base mb-2">
          Surat Balasan
        </Typography>
        {applicationStatus.data.dokumen.find(
          (dokumen) => dokumen.tipe === "Surat Balasan"
        ) ? (
          <div className="border rounded-lg p-3 md:p-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
            <Typography variant="small" color="gray" className="text-xs md:text-sm break-all">
              {applicationStatus.data.dokumen.find(
                (dokumen) => dokumen.tipe === "Surat Balasan"
              ).url}
            </Typography>
            <Button
              size="sm"
              variant="outlined"
              color="blue"
              className="flex items-center gap-2 w-full md:w-auto justify-center"
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
          <Typography variant="small" color="gray" className="mt-2 text-xs md:text-sm">
            Dokumen Surat Pengantar tidak tersedia.
          </Typography>
        )}
      </div>

      <div className="p-3 md:p-4 border border-gray-200 rounded-lg">
        <Typography className="font-medium text-gray-800 text-sm md:text-base mb-2">
          Template Surat Pernyataan
        </Typography>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <Button
            size="sm"
            variant="outlined"
            color="blue"
            className="flex items-center gap-2 w-full md:w-auto justify-center"
            onClick={() => handleDownloadTemplate("template_surat_pernyataan_siswa.docx")}
          >
            <Download size={16} /> Surat Pernyataan Siswa/Mahasiswa
          </Button>
          <Button
            size="sm"
            variant="outlined"
            color="blue"
            className="flex items-center gap-2 w-full md:w-auto justify-center"
            onClick={() => handleDownloadTemplate("template_surat_pernyataan_institusi.docx")}
          >
            <Download size={16} /> Surat Pernyataan Orang tua/wali
          </Button>
        </div>
      </div>

      {applicationStatus?.data?.status.id == 2 &&
        applicationStatus?.data?.statusState == "completed" && (
          <div className="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-4 pt-4">
            <Button
              onClick={handleRejectClick}
              color="red"
              className="flex items-center justify-center space-x-2 w-full md:w-auto"
            >
              <XCircle className="w-5 h-5" />
              <span>Tolak Tawaran</span>
            </Button>

            <Button
              onClick={handleAcceptClick}
              color="blue"
              className="flex items-center justify-center space-x-2 w-full md:w-auto"
            >
              <Check className="w-5 h-5" />
              <span>Terima Tawaran</span>
            </Button>
          </div>
        )}

      {/* Dialogs */}
      <Dialog
        open={showAcceptDialog}
        onOpenChange={() => setShowAcceptDialog(false)}
        className="max-w-md mx-auto w-11/12 md:w-full"
      >
        <DialogHeader className="bg-green-50 p-3 md:p-4 rounded-t-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              Konfirmasi Penerimaan
            </h2>
          </div>
        </DialogHeader>

        <DialogBody className="p-4 md:p-6">{renderUploadStep()}</DialogBody>
      </Dialog>

      <Dialog
        open={showRejectDialog}
        onOpenChange={() => setShowRejectDialog(false)}
        className="max-w-md mx-auto w-11/12 md:w-full"
      >
        <DialogHeader className="bg-red-50 p-3 md:p-4 rounded-t-lg">
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              Konfirmasi Penolakan
            </h2>
          </div>
        </DialogHeader>

        <DialogBody className="p-4 md:p-6">
          <div className="text-center space-y-4">
            <XCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto" />
            <p className="text-gray-600 text-sm md:text-base">
              Apakah Anda yakin ingin menolak tawaran magang ini?
              <br />
              <span className="text-sm text-red-500 font-medium">
                Tindakan ini tidak dapat dibatalkan.
              </span>
            </p>
          </div>
        </DialogBody>

        <DialogFooter className="p-3 md:p-4 bg-gray-50 rounded-b-lg space-y-2 md:space-y-0 md:space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowRejectDialog(false)}
            className="w-full md:w-auto"
            color="blue"
          >
            Batalkan
          </Button>
          <Button
            variant="outlined"
            onClick={handleReject}
            className="w-full md:w-auto"
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
