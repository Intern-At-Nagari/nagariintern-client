import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import axios from "axios";

const ApplicationForm = () => {
  const navigate = useNavigate();
  const { userData } = useOutletContext();
  const [role, setRole] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    tipePemohon: "",
    institusi: "",
    jurusan: "",
    alamat: "",
    noHp:"",
    tanggalMulai: "",
    tanggalSelesai: "",
    departemen: "", // Added departemen to formData
  });

  const [duration, setDuration] = useState({
    months: 0,
    days: 0,
  });

  const [files, setFiles] = useState({
    fileCv: null,
    fileTranskrip: null,
    fileKtp: null,
    fileSuratPengantar: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formData.tanggalMulai && formData.tanggalSelesai) {
      const startDate = new Date(formData.tanggalMulai);
      const endDate = new Date(formData.tanggalSelesai);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const months = Math.floor(diffDays / 30);
      const days = diffDays % 30;
      setDuration({ months, days });
    }
  }, [formData.tanggalMulai, formData.tanggalSelesai]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: uploadedFiles[0],
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          formDataToSend.append(key, files[key]);
        }
      });

      await axios.post("http://localhost:3000/intern", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Permintaan magang berhasil diajukan!");
      navigate("/status");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <Card className="mb-8">
          <CardBody className="p-6">
            <Typography variant="h4" color="blue-gray" className="mb-8 text-center">
              Form Pengajuan Magang
            </Typography>

            {/* Personal Information Section */}
            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Informasi Pribadi
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Select
                      label="Status Pendaftar"
                      size="lg"
                      value={formData.tipePemohon}
                      onChange={(value) => {
                        handleSelectChange("tipePemohon", value);
                        setRole(value);
                      }}
                      required
                      className="bg-white"
                    >
                      <Option value="mahasiswa">Mahasiswa</Option>
                      <Option value="siswa">Siswa</Option>
                    </Select>
                    <Input
                      type="text"
                      name="noHp"
                      label="Nomor Hp"
                      size="lg"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      required
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-4">
                  <Input
                      type="text"
                      label="Nama Lengkap"
                      size="lg"
                      value={userData.nama}
                      disabled
                      className="bg-white"
                    />
                  
                    <Input
                      type="text"
                      name="alamat"
                      label="Alamat"
                      size="lg"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      required
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Educational Information Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Informasi Pendidikan
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    type="text"
                    name="institusi"
                    label="Institusi Pendidikan"
                    size="lg"
                    value={formData.institusi}
                    onChange={handleInputChange}
                    required
                    className="bg-white"
                  />
                  {role && (
                    <Input
                      type="text"
                      name="jurusan"
                      label={role === "mahasiswa" ? "Fakultas/Jurusan" : "Jurusan"}
                      size="lg"
                      value={formData.jurusan}
                      onChange={handleInputChange}
                      required
                      className="bg-white"
                    />
                  )}
                </div>
              </div>

              {/* Internship Details Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Detail Magang
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    name="departemen"
                    label="Departemen Yang Dituju"
                    size="lg"
                    value={formData.departemen}
                    onChange={(value) => handleSelectChange("departemen", value)}
                    required
                    className="bg-white"
                  >
                    <Option value="it">IT Development</Option>
                    <Option value="hr">Human Resources</Option>
                    <Option value="finance">Finance</Option>
                    <Option value="marketing">Marketing</Option>
                  </Select>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="date"
                      name="tanggalMulai"
                      label="Tanggal Mulai"
                      size="lg"
                      value={formData.tanggalMulai}
                      onChange={handleInputChange}
                      required
                      className="bg-white"
                    />
                    <Input
                      type="date"
                      name="tanggalSelesai"
                      label="Tanggal Selesai"
                      size="lg"
                      value={formData.tanggalSelesai}
                      onChange={handleInputChange}
                      required
                      className="bg-white"
                    />
                  </div>
                </div>
                {duration.months > 0 || duration.days > 0 ? (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
                    <Typography variant="small" color="blue" className="font-medium">
                      Durasi Magang: {duration.months} bulan {duration.days} hari
                    </Typography>
                  </div>
                ) : null}
              </div>

              {/* Documents Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Dokumen Pendukung
                </Typography>
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { name: "fileCv", label: "Upload CV (PDF)" },
                    { name: "fileTranskrip", label: "Transkrip Nilai Semester Terakhir" },
                    { name: "fileKtp", label: "Kartu Tanda Penduduk" },
                    { name: "fileSuratPengantar", label: "Surat Pengantar dari Institusi (PDF)" }
                  ].map((doc) => (
                    <div key={doc.name} className="space-y-2">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        {doc.label}
                      </Typography>
                      <Input
                        type="file"
                        name={doc.name}
                        accept=".pdf"
                        size="lg"
                        onChange={handleFileChange}
                        required
                        className="bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                color="blue"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mengirim..." : "Submit Pengajuan"}
              </Button>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
};

export default ApplicationForm;