import React, { useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Chip,
} from "@material-tailwind/react";
import { 
  FileCheck, 
  Download, 
  Calendar, 
  MapPin, 
  UserCheck, 
  ExternalLink,
  Award,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

const SelesaiCard = ({ completionStatus }) => {
  // Extract data from completionStatus
  const { 
    dokumen = [], 
    penempatan = "",
    tanggalMulai = "",
    tanggalSelesai = "",
    statusSuratPernyataan = "belum_diajukan" // Default value
  } = completionStatus || {};
    

  console.log(completionStatus);

  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const sertifikat = dokumen.find(
    (doc) => doc.tipe === "Sertifikat Magang"
  );

  const suratPernyataanSelesai = dokumen.find(
    (doc) => doc.tipe === "Surat Pernyataan Selesai Magang"
  );

  const templatePermohonan = dokumen.find(
    (doc) => doc.tipe === "Template Permohonan Surat Selesai Magang"
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleDownload = async (fileUrl) => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/download/${fileUrl}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = fileUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    // Create FormData object
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("tipe", "Permohonan Surat Selesai Magang");

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload-document`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Handle success
        setOpenUploadModal(false);
        setSelectedFile(null);
        // You might want to trigger a reload of the completion status here
        // or update the state accordingly
        alert("Dokumen berhasil diunggah");
      } else {
        // Handle error
        alert("Gagal mengunggah dokumen");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Terjadi kesalahan saat mengunggah");
    } finally {
      setIsUploading(false);
    }
  };

  const renderSuratPernyataanStatus = () => {
    switch (statusSuratPernyataan) {
      case "belum_diajukan":
        return (
          <Chip
            variant="ghost"
            color="blue-gray"
            value="Belum Diajukan"
            icon={<AlertCircle className="h-4 w-4" />}
          />
        );
      case "diajukan":
        return (
          <Chip
            variant="ghost"
            color="amber"
            value="Dalam Proses"
            icon={<Clock className="h-4 w-4" />}
          />
        );
      case "selesai":
        return (
          <Chip
            variant="ghost"
            color="green"
            value="Selesai"
            icon={<CheckCircle className="h-4 w-4" />}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader
        floated={false}
        shadow={false}
        className="rounded-none border-b border-gray-200"
      >
        <div className="flex items-center gap-4 px-4 pt-4 pb-2">
          <div className="rounded-lg bg-green-50 p-2">
            <Award className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <Typography variant="h5" color="blue-gray">
              Penyelesaian Magang
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Informasi dan dokumen penyelesaian program magang
            </Typography>
          </div>
        </div>
      </CardHeader>

      <CardBody className="px-4 pt-4 pb-6">
        <div className="space-y-6">
          {/* Success Banner */}
          <Card className="bg-green-50 border border-green-200">
            <CardBody className="p-4">
              <div className="flex gap-3">
                <UserCheck className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <Typography variant="h6" color="green">
                    Selamat! Anda Telah Menyelesaikan Program Magang
                  </Typography>
                  <Typography
                    variant="small"
                    color="green"
                    className="font-normal mt-1"
                  >
                    Berikut adalah informasi dan dokumen penting terkait penyelesaian magang Anda
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border border-gray-200 bg-green-50 hover:bg-green-100 transition-colors">
              <CardBody className="p-4">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-green-600" />
                    <div>
                      <Typography variant="h6" color="blue-gray">
                        Sertifikat Magang
                      </Typography>
                      <Typography
                        variant="small"
                        color="gray"
                        className="font-normal"
                      >
                        Bukti penyelesaian program magang
                      </Typography>
                    </div>
                  </div>
                  <Button
                    color="green"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleDownload(sertifikat.url)}
                  >
                    <Download className="h-4 w-4" /> Download Sertifikat
                  </Button>
                </div>
              </CardBody>
            </Card>

          {/* Surat Pernyataan Section */}
          <Card className="border border-gray-200">
            <CardBody className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <Typography variant="h6" color="blue-gray">
                      Surat Pernyataan Selesai Magang
                    </Typography>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      Status: {renderSuratPernyataanStatus()}
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                {/* Template Download */}
                <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-blue-600" />
                    <Typography variant="small" className="font-medium">
                      Template Permohonan
                    </Typography>
                  </div>
                  <Button
                    variant="outlined"
                    color="blue"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleDownload(templatePermohonan.url)}
                  >
                    <Download className="h-3 w-3" /> Download Template
                  </Button>
                </div>

                {/* Conditional Rendering based on status */}
                {statusSuratPernyataan === "belum_diajukan" && (
                  <Button
                    color="blue"
                    size="sm"
                    className="flex items-center gap-2 w-full justify-center"
                    onClick={() => setOpenUploadModal(true)}
                  >
                    <Upload className="h-4 w-4" /> Ajukan Surat Pernyataan
                  </Button>
                )}

                {statusSuratPernyataan === "diajukan" && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <Typography variant="small" className="text-amber-800">
                        Surat pernyataan Anda sedang diproses. Silakan periksa kembali nanti.
                      </Typography>
                    </div>
                  </div>
                )}

                {statusSuratPernyataan === "selesai" && suratPernyataanSelesai && (
                  <Button
                    color="green"
                    size="sm"
                    className="flex items-center gap-2 w-full justify-center"
                    onClick={() => handleDownload(suratPernyataanSelesai.url)}
                  >
                    <Download className="h-4 w-4" /> Download Surat Pernyataan
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Instructions */}
          <Card className="bg-blue-50 border border-blue-200">
            <CardBody className="p-4">
              <div className="flex gap-3">
                <FileCheck className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <Typography
                    variant="h6"
                    color="blue"
                    className="font-medium"
                  >
                    Informasi Tambahan
                  </Typography>
                  <Typography
                    variant="small"
                    className="text-blue-800 mt-2"
                  >
                    Untuk informasi lebih lanjut tentang prosedur penyelesaian magang 
                    atau pertanyaan lainnya, silakan hubungi Divisi Human Capital.
                  </Typography>
                  <a
                    href="https://wa.me/+6282391233317"
                    className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-800 font-medium gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Hubungi via WhatsApp</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </CardBody>

      {/* Upload Modal */}
      <Dialog open={openUploadModal} handler={() => setOpenUploadModal(false)}>
        <DialogHeader>
          <Typography variant="h5">
            Upload Surat Permohonan
          </Typography>
        </DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <Typography variant="small" color="blue-gray">
              Silakan unggah dokumen permohonan Surat Pernyataan Selesai Magang yang telah diisi.
              Pastikan dokumen dalam format PDF dan telah ditandatangani.
            </Typography>

            <div className="border-dashed border-2 border-gray-300 p-6 rounded-lg text-center">
              <input
                type="file"
                id="file-upload"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-8 w-8 text-blue-500" />
                <Typography color="blue-gray" className="font-medium">
                  Klik untuk memilih file
                </Typography>
                <Typography variant="small" color="gray" className="font-normal">
                  atau drag and drop disini
                </Typography>
              </label>
              {selectedFile && (
                <div className="mt-4 p-2 bg-blue-50 rounded flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <Typography variant="small">{selectedFile.name}</Typography>
                </div>
              )}
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button 
            variant="outlined" 
            color="red" 
            onClick={() => setOpenUploadModal(false)}
          >
            Batal
          </Button>
          <Button 
            color="blue" 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Mengunggah..." : "Unggah Dokumen"}
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
};

export default SelesaiCard;