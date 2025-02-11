import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { FileCheck, Download, Calendar, MapPin, UserCheck, ExternalLink } from "lucide-react";

const PersetujuanCard = ({ applicationStatus }) => {
  const { dokumen, penempatan, tanggalMulai } = applicationStatus.data;

  const suratPengantarDivisi = dokumen.find(
    (doc) => doc.tipe === "Surat Pengantar Divisi"
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

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader
        floated={false}
        shadow={false}
        className="rounded-none border-b border-gray-200"
      >
        <div className="flex items-center gap-4 px-4 pt-4 pb-2">
          <div className="rounded-lg bg-blue-50 p-2">
            <FileCheck className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <Typography variant="h5" color="blue-gray">
              Status Persetujuan
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Informasi persetujuan dokumen dan penempatan magang
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
                    Selamat! Anda Sudah Bisa Mulai Magang
                  </Typography>
                  <Typography
                    variant="small"
                    color="green"
                    className="font-normal mt-1"
                  >
                    Berikut adalah informasi penting untuk memulai magang Anda
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Info Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-gray-50">
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <div>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      Tanggal Mulai Magang
                    </Typography>
                    <Typography variant="h6" color="blue-gray">
                      {formatDate(tanggalMulai)}
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gray-50">
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <div>
                    <Typography
                      variant="small"
                      color="gray"
                      className="font-normal"
                    >
                      Unit Penempatan
                    </Typography>
                    <Typography variant="h6" color="blue-gray">
                      {penempatan}
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

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
                    Instruksi Masuk Magang
                  </Typography>
                  <Typography
                    variant="small"
                    className="text-blue-800 mt-2"
                  >
                    Peserta magang silahkan mengambil surat pengantar magang di
                    Divisi Human Capital dan sekaligus mengikuti coaching magang.
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

          {/* Document Download */}
          {suratPengantarDivisi ? (
            <Card className="border border-gray-200 hover:bg-gray-50 transition-colors">
              <CardBody className="p-4">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-5 w-5 text-blue-600" />
                    <div>
                      <Typography variant="h6" color="blue-gray">
                        Surat Pengantar Divisi
                      </Typography>
                      <Typography
                        variant="small"
                        color="gray"
                        className="font-normal"
                      >
                        {suratPengantarDivisi.tipe}
                      </Typography>
                    </div>
                  </div>
                  <Button
                    variant="outlined"
                    color="blue"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleDownload(suratPengantarDivisi.url)}
                  >
                    <Download className="h-4 w-4" /> Download
                  </Button>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Typography variant="small" color="gray" className="font-normal">
              Dokumen Surat Pengantar Divisi tidak tersedia.
            </Typography>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default PersetujuanCard;