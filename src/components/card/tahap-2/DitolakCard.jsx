import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import { Building, Download, XCircle } from "lucide-react";

const DitolakCard = ({ applicationStatus }) => {
  const handleDownload = async (fileUrl) => {
    const fileName = fileUrl.split("/").pop();
    const aTag = document.createElement("a");
    aTag.href = `${API_BASE_URL}/uploads/${fileUrl}`;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <Typography variant="h4" className="font-bold text-gray-800">
          Status Lamaran Magang
        </Typography>
        <Typography className="text-gray-600 mt-1">
          Mohon maaf, lamaran magang Anda tidak dapat kami terima saat ini
        </Typography>
      </div>

      <div className="bg-red-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Typography className="text-sm text-gray-600">
              Keterangan
            </Typography>
            <Typography className="font-medium text-red-600">
              {applicationStatus.data.keterangan}
            </Typography>
          </div>
          <XCircle className="w-5 h-5 text-red-500" />
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Typography className="text-sm text-gray-600">
              Unit Kerja yang Dilamar
            </Typography>
            <Typography className="font-medium">
              {applicationStatus.data.unitKerja}
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
          Anda dapat mengajukan lamaran magang kembali untuk periode berikutnya. 
          Silakan perhatikan persyaratan dan kelengkapan dokumen yang dibutuhkan.
        </Typography>
      </div>
    </div>
  );
};

export default DitolakCard;