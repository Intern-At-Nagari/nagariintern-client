import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import { Building, Download, XCircle } from "lucide-react";

const MenolakCard = ({ applicationStatus }) => {
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
      <div className="border-b border-gray-100 pb-4">
        <Typography variant="h4" className="font-bold text-gray-800">
          Tawaran Magang
        </Typography>
        <Typography className="text-gray-600 mt-1">
          Anda telah menolak tawaran magang ini
        </Typography>
      </div>

      <div className="bg-orange-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Typography className="text-sm text-gray-600">
              Status Tawaran
            </Typography>
            <Typography className="font-medium text-orange-600">
              Ditolak oleh Anda
            </Typography>
          </div>
          <XCircle className="w-5 h-5 text-orange-500" />
        </div>
        <Typography className="text-sm text-gray-600">
          Tanggal Penolakan: {new Date(applicationStatus.data.updatedAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </Typography>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Typography className="text-sm text-gray-600">
              Unit Kerja yang Ditawarkan
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

            {applicationStatus.data.dokumen.find(
              (dokumen) => dokumen.tipe === "Surat Balasan"
            ) ? (
              <div className="border rounded-lg p-4 mt-2 flex justify-between items-center">
                <div>
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
                Dokumen Surat Balasan tidak tersedia.
              </Typography>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <Typography className="font-medium text-gray-800 mb-2">
          Catatan
        </Typography>
        <Typography className="text-gray-600">
          Anda telah menolak tawaran magang ini. Keputusan ini sudah final dan tidak dapat diubah. 
          Anda dapat mengajukan lamaran magang kembali untuk periode dan unit kerja lainnya di kesempatan berikutnya.
        </Typography>
      </div>
    </div>
  );
};

export default MenolakCard;