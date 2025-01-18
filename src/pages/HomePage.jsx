import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardBody,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  BookOpenIcon,
  InformationCircleIcon,
  CalendarIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user, 'user>>>>>');
    setUserData(user);
  }, []);


  return (
    <div className="mb-8">
      {/* Welcome Section */}
      <Typography variant="h3" color="blue-gray">
      </Typography>
      <Typography color="gray" className="mt-1">
        Kelola pengajuan magang Anda di sini
      </Typography>

      {/* Internship Guidelines Section */}
      <Card className="mt-8">
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-4">
            Panduan Magang
          </Typography>
          <List className="space-y-4">
            <ListItem>
              <ListItemPrefix>
                <BookOpenIcon className="w-6 h-6 text-blue-500" />
              </ListItemPrefix>
              <div>
                <Typography variant="h6">Persyaratan Magang</Typography>
                <Typography variant="small" color="gray">
                  Pelajari dokumen yang diperlukan untuk pengajuan, seperti CV, surat pengantar dari institusi, dan sebagainya.
                </Typography>
              </div>
            </ListItem>

            <ListItem>
              <ListItemPrefix>
                <InformationCircleIcon className="w-6 h-6 text-green-500" />
              </ListItemPrefix>
              <div>
                <Typography variant="h6">Prosedur Pengajuan</Typography>
                <Typography variant="small" color="gray">
                  Ajukan magang melalui menu "Ajukan Magang" dan pastikan data yang diunggah lengkap serta sesuai.
                </Typography>
              </div>
            </ListItem>

            <ListItem>
              <ListItemPrefix>
                <CalendarIcon className="w-6 h-6 text-orange-500" />
              </ListItemPrefix>
              <div>
                <Typography variant="h6">Durasi dan Jadwal</Typography>
                <Typography variant="small" color="gray">
                  Magang tersedia dengan pilihan durasi mulai dari 1 hingga 6 bulan. Periksa jadwal sesuai kebutuhan Anda.
                </Typography>
              </div>
            </ListItem>

            <ListItem>
              <ListItemPrefix>
                <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-purple-500" />
              </ListItemPrefix>
              <div>
                <Typography variant="h6">Bantuan dan Kontak</Typography>
                <Typography variant="small" color="gray">
                  Hubungi tim kami jika Anda memerlukan bantuan selama proses pengajuan atau pelaksanaan magang.
                </Typography>
              </div>
            </ListItem>
          </List>
        </CardBody>
      </Card>

      {/* Administrative Requirements Section */}
      <Card className="mt-8">
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-4">
            Persyaratan Administrasi & Permohonan Magang Bank Nagari
          </Typography>
          <Typography color="gray" className="mb-4">
            Berikut adalah dokumen yang perlu disiapkan untuk mengajukan magang:
          </Typography>
          <Typography variant="h6" color="blue-gray" className="mt-4">
            A. Surat Pengantar dari Kampus
          </Typography>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Keterangan data mahasiswa</li>
            <li>Durasi dan periode magang</li>
            <li>Fotokopi transkrip nilai semester terakhir</li>
          </ul>
          <Typography variant="h6" color="blue-gray" className="mt-4">
            B. Proposal Individu
          </Typography>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Data diri lengkap (CV)</li>
            <li>Fotokopi KTP</li>
            <li>Fotokopi tabungan Bank Nagari atas nama yang bersangkutan</li>
          </ul>
        </CardBody>
      </Card>

      {/* Additional Information Section */}
      <Card className="mt-8">
        <CardBody>
          <Typography variant="h5" color="blue-gray" className="mb-4">
            Informasi Penting
          </Typography>
          <Typography variant="small" color="gray" className="mb-4">
            Pastikan Anda mematuhi semua peraturan dan pedoman selama magang berlangsung. Informasi tambahan dapat dilihat
            di bawah ini:
          </Typography>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Jam kerja magang adalah pukul 08:00 - 17:00, Senin hingga Jumat.</li>
            <li>
              Mahasiswa wajib melaporkan kehadiran harian melalui aplikasi ini atau langsung ke supervisor.
            </li>
            <li>
              Surat keterangan selesai magang akan diberikan setelah menyelesaikan seluruh tugas dengan baik.
            </li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
};

export default Home;
