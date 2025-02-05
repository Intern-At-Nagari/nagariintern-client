import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { ClipboardDocumentListIcon, CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";

const EmptyState = () => {
  const [periodData, setPeriodData] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  useEffect(() => {
    const fetchPeriodData = async () => {
      try {
        const response = await fetch("http://localhost:3000/jadwal-curent", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await response.json();
        if (result.status === "success" && result.data.length > 0) {
          setPeriodData(result.data[0]);
          // Check if current date is within registration period
          const now = new Date();
          const startDate = new Date(result.data[0].tanggalMulai);
          const endDate = new Date(result.data[0].tanggalTutup);
          setIsRegistrationOpen(now >= startDate && now <= endDate);

          console.log("Period data:", result.data[0]);
        }
      } catch (error) {
        console.error("Error fetching period data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeriodData();
  }, []);

  const calculateCountdown = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const timeDiff = end - now;

    if (timeDiff <= 0) {
      setIsRegistrationOpen(false);
      return "Periode magang telah berakhir.";
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${days} hari ${hours} jam ${minutes} menit ${seconds} detik`;
  };

  useEffect(() => {
    if (periodData) {
      const interval = setInterval(() => {
        setCountdown(calculateCountdown(periodData.tanggalTutup));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [periodData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!periodData ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Tidak ada periode pendaftaran yang tersedia</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg overflow-hidden bg-white">
        <CardBody className="p-8 flex flex-col items-center text-center">
          <div className="mb-6 p-4 bg-blue-100 rounded-full">
            <ClipboardDocumentListIcon className="h-10 w-10 text-blue-500" />
          </div>
          <Typography variant="h4" className="text-blue-gray-900 mb-2">
            Belum Ada Pengajuan Magang
          </Typography>
          <Typography variant="paragraph" className="text-gray-600 mb-6 max-w-lg">
            {isRegistrationOpen 
              ? "Anda belum mengajukan permohonan magang. Mulai perjalanan karir Anda dengan mengajukan permohonan magang sekarang."
              : "Saat ini tidak ada periode pendaftaran yang aktif. Silakan cek kembali pada periode pendaftaran berikutnya."}
          </Typography>
          <div className="w-full bg-gray-50 p-4 rounded-lg shadow-md mb-6">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDaysIcon className="h-5 w-5 text-blue-500" />
              <Typography variant="h6" className="text-blue-gray-800">
                {periodData.nama}
              </Typography>
            </div>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <Typography variant="small" className="text-gray-600">
                  Tanggal Buka
                </Typography>
                <Typography variant="h6" className="text-blue-gray-900">
                  {new Date(periodData.tanggalMulai).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-gray-600">
                  Tanggal Tutup
                </Typography>
                <Typography variant="h6" className="text-blue-gray-900">
                  {new Date(periodData.tanggalTutup).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Typography>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-blue-600 font-medium">
              <ClockIcon className="h-5 w-5" />
              <Typography>{countdown}</Typography>
            </div>
          </div>
          {isRegistrationOpen && (
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <Button size="lg" className="w-full md:w-auto bg-blue-500 hover:bg-blue-600">
                Ajukan Magang untuk Siswa
              </Button>
              <Button size="lg" className="w-full md:w-auto bg-green-500 hover:bg-green-600">
                Ajukan Magang untuk Mahasiswa
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default EmptyState;