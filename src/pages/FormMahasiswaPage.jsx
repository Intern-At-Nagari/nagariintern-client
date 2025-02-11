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
import { X, Loader2, ChevronDown } from "lucide-react";
import axios from "axios";
import LoadingButton from "../components/LoadingButton";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ApplicationFormMahasiswa = () => {
  const navigate = useNavigate();
  const { userData } = useOutletContext();
  const [role, setRole] = useState("");
  const [schoolQuery, setUniversityQuery] = useState("");
  const [schoolSuggestions, setUniversitySuggestions] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(null);

  useEffect(() => {
    const checkRegistrationPeriod = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/jadwal-curent`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const result = await response.json();
        if (result.data.length > 0) {
          setIsRegistrationOpen(true);
          console.log("Periode pendaftaran dibuka");
        } else {
          setIsRegistrationOpen(false);
          console.log("Periode pendaftaran ditutup");
          navigate("/magang");
        }
      } catch (error) {
        console.error("Error checking registration period:", error);
        setIsRegistrationOpen(false);
        navigate("/magang");
      }
    };

    checkRegistrationPeriod();
  }, [navigate]);
  
  const [formData, setFormData] = useState({
    nama: "",
    nim: "",
    perguruanTinggi: "",
    prodi: "",
    alamat: "",
    noHp: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    unitKerja: "",
    userId: userData?.id,
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

  const [schoolInputProps, setUniversityInputProps] = useState({
    value: "",
    isValid: true,
    errorMessage: "",
    isLocked: false,
  });

  const searchUniversity = async (query) => {
    if (!query || query.length < 3 || schoolInputProps.isLocked) {
      setUniversitySuggestions([]);
      return;
    }

    setIsSearching(true);
    setSearchError("");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/universitas?name=${encodeURIComponent(
          query
        )}`
      );

      if (response.data.dataUniversitas) {
        const universitys = response.data.dataUniversitas;
        setUniversitySuggestions(universitys);
        setShowSuggestions(true);
      } else {
        setUniversitySuggestions([]);
      }
    } catch (error) {
      setSearchError("Terjadi kesalahan saat mencari universitas");
    } finally {
      setIsSearching(false);
    }
  };

  const handleUniversityInputChange = (e) => {
    // If input is locked, don't allow changes
    if (schoolInputProps.isLocked) {
      return;
    }

    const value = e.target.value.toUpperCase();
    setUniversityQuery(value);
    setSelectedUniversity(null);
    setFormData((prev) => ({
      ...prev,
      institusi: "",
    }));

    setUniversityInputProps((prev) => ({
      ...prev,
      value,
      isValid: true,
      errorMessage: "",
    }));

    if (value.length >= 3) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleUniversitySelect = (school) => {
    setSelectedUniversity(school);
    setUniversityQuery(school.name);
    setShowSuggestions(false);
    setUniversitySuggestions([]); // Clear suggestions immediately
    setFormData((prev) => ({
      ...prev,
      perguruanTinggi: school.name,
    }));
    setUniversityInputProps((prev) => ({
      ...prev,
      value: school.name,
      isValid: true,
      errorMessage: "",
      isLocked: true, // Lock the input after selection
    }));
  };

  const handleClearSearch = () => {
    setUniversityQuery("");
    setSelectedUniversity(null);
    setUniversitySuggestions([]);
    setShowSuggestions(false);
    setSearchError("");
    setFormData((prev) => ({
      ...prev,
      institusi: "",
    }));
    setUniversityInputProps({
      value: "",
      isValid: true,
      errorMessage: "",
      isLocked: false, // Unlock the input when clearing
    });
  };

  const validateUniversitySelection = () => {
    if (!selectedUniversity) {
      setUniversityInputProps((prev) => ({
        ...prev,
        isValid: false,
        errorMessage: "Pilih universitas dari daftar yang tersedia",
      }));
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!schoolInputProps.isLocked && schoolQuery) {
      const timeoutId = setTimeout(() => {
        searchUniversity(schoolQuery);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [schoolQuery, schoolInputProps.isLocked]);

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

    // Jika field yang diubah adalah "jurusan", ubah nilai menjadi UPPERCASE
    if (name === "prodi") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.toUpperCase(), // Ubah ke huruf besar
      }));
    } else {
      // Untuk field lainnya, simpan nilai seperti biasa
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: uploadedFiles[0],
    }));
  };

  const handleSelectChange = (name, value) => {
    console.log("Select value:", value); // untuk debugging
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!validateUniversitySelection()) {
      return;
    }
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Append all form data
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Append files
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          formDataToSend.append(key, files[key]);
        }
      });

      const response = await axios.post(
        `${API_BASE_URL}/intern/mahasiswa`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Response:", response.data); // Add logging
      toast.success("Permintaan magang berhasil diajukan!");
      navigate("/magang");
    } catch (error) {
      console.error(
        "Error submitting application:",
        error.response?.data || error
      );
      alert(
        error.response?.data?.error ||
          "Terjadi kesalahan saat mengajukan permintaan"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <Card className="mb-8">
          <CardBody className="p-6">
            <Typography
              variant="h4"
              color="blue-gray"
              className="mb-8 text-center"
            >
              Form Pengajuan Magang Mahasiswa
            </Typography>

            {/* Personal Information Section */}
            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Informasi Pribadi
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Input
                      type="text"
                      name="nama"
                      label="Nama Lengkap"
                      size="lg"
                      value={formData.nama}
                      onChange={handleInputChange}
                      required
                      className="bg-white"
                    />

                    <Input
                      type="text"
                      name="alamat"
                      label="Alamat Domisili"
                      size="lg"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      required
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-4">
                    <Input
                      type="number"
                      name="nim"
                      label="NIM"
                      size="lg"
                      value={formData.nim}
                      onChange={handleInputChange}
                      required
                      className="bg-white"
                    />
                    <Input
                      type="phone"
                      name="noHp"
                      label="Nomor Hp"
                      size="lg"
                      value={formData.noHp}
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
                {/* University Search Section */}
                <div className="space-y-4 mb-6">
                  <div className="relative">
                    <div className="relative">
                      <Input
                        type="text"
                        label="Cari Nama Universitas"
                        value={schoolInputProps.value}
                        onChange={handleUniversityInputChange}
                        className={`bg-white pr-20 ${
                          !schoolInputProps.isValid ? "border-red-500" : ""
                        } 
                  ${schoolInputProps.isLocked ? "bg-gray-50" : ""}`}
                        labelProps={{
                          className: "peer-disabled:text-blue-gray-400",
                        }}
                        error={!schoolInputProps.isValid}
                        icon={<ChevronDown className="h-4 w-4" />}
                        disabled={schoolInputProps.isLocked} // Disable input when locked
                      />
                      <div className="absolute right-2 top-2.5 flex items-center space-x-1">
                        {isSearching && !schoolInputProps.isLocked && (
                          <Loader2 className="h-5 w-5 text-blue-gray-400 animate-spin" />
                        )}
                        {schoolInputProps.value && (
                          <button
                            type="button"
                            onClick={handleClearSearch}
                            className="p-1 hover:bg-blue-gray-50 rounded-full transition-colors"
                          >
                            <X className="h-5 w-5 text-blue-gray-400" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Error Message */}
                    {!schoolInputProps.isValid && (
                      <div className="text-red-500 text-sm mt-1">
                        {schoolInputProps.errorMessage}
                      </div>
                    )}

                    {showSuggestions &&
                      !schoolInputProps.isLocked &&
                      schoolQuery.length >= 3 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                          {isSearching ? (
                            <div className="p-3 text-center text-gray-500">
                              Mencari Universitas...
                            </div>
                          ) : schoolSuggestions.length > 0 ? (
                            schoolSuggestions.map((school) => (
                              <div
                                key={school.id}
                                className="p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                                onClick={() => handleUniversitySelect(school)}
                              >
                                <div className="font-medium">{school.name}</div>
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-center text-gray-500">
                              Tidak ada Universitas yang ditemukan
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                </div>
                <Input
                  type="text"
                  name="prodi"
                  label="Program Studi (Tulis lengkap dan perhatikan penulisan)"
                  size="lg"
                  value={formData.prodi}
                  onChange={handleInputChange}
                  placeholder="Contoh: SISTEM INFORMASI"
                  required
                  className="bg-white"
                />
                <Typography variant="small" color="gray" className="mt-1">
                  *Pastikan nama program studi ditulis dengan lengkap dan benar
                </Typography>
              </div>

              {/* Internship Details Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Detail Magang
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    name="unitKerja"
                    label="Pilih unit kerja"
                    size="lg"
                    value={formData.unitKerja}
                    onChange={(value) => handleSelectChange("unitKerja", value)}
                    required
                    className="bg-white"
                    placeholder="Pilih Unit Kerja"
                  >
                    <Option value="1">CABANG ALAHAN PANJANG</Option>
                    <Option value="2">CABANG BANDUNG</Option>
                    <Option value="3">CABANG BATUSANGKAR</Option>
                    <Option value="4">CABANG BUKITTINGGI</Option>
                    <Option value="5">CABANG JAKARTA</Option>
                    <Option value="6">CABANG KOTO BARU</Option>
                    <Option value="7">CABANG LINTAU</Option>
                    <Option value="8">CABANG LUBUK ALUNG</Option>
                    <Option value="9">CABANG LUBUK BASUNG</Option>
                    <Option value="10">CABANG LUBUK GADANG</Option>
                    <Option value="11">CABANG LUBUK SIKAPING</Option>
                    <Option value="12">CABANG MATRAMAN JAKARTA</Option>
                    <Option value="13">CABANG MENTAWAI</Option>
                    <Option value="14">CABANG MUARA LABUH</Option>
                    <Option value="15">CABANG PADANG PANJANG</Option>
                    <Option value="16">CABANG PAINAN</Option>
                    <Option value="17">CABANG PANGKALAN</Option>
                    <Option value="18">CABANG PARIAMAN</Option>
                    <Option value="19">CABANG PASAR RAYA PADANG</Option>
                    <Option value="20">CABANG PAYAKUMBUH</Option>
                    <Option value="21">CABANG PEKANBARU</Option>
                    <Option value="22">CABANG PULAU PUNJUNG</Option>
                    <Option value="23">CABANG SAWAHLUNTO</Option>
                    <Option value="24">CABANG SIJUNJUNG</Option>
                    <Option value="25">CABANG SIMPANG EMPAT</Option>
                    <Option value="26">CABANG SITEBA</Option>
                    <Option value="27">CABANG SOLOK</Option>
                    <Option value="28">CABANG SYARIAH PADANG</Option>
                    <Option value="29">CABANG SYARIAH PAYAKUMBUH</Option>
                    <Option value="30">CABANG SYARIAH SOLOK</Option>
                    <Option value="31">CABANG TAPAN</Option>
                    <Option value="32">CABANG TAPUS</Option>
                    <Option value="33">CABANG UJUNG GADING</Option>
                    <Option value="34">CABANG UTAMA PADANG</Option>
                    <Option value="35">
                      KANTOR PUSAT-Divisi Dana & Treasury
                    </Option>
                    <Option value="36">
                      KANTOR PUSAT-Divisi Kredit & Mikro Banking
                    </Option>
                    <Option value="37">
                      KANTOR PUSAT-Divisi Penyelamatan Kredit & Pembiayaan
                    </Option>
                    <Option value="38">KANTOR PUSAT-Divisi Pemasaran</Option>
                    <Option value="39">
                      KANTOR PUSAT-Divisi Usaha Syariah
                    </Option>
                    <Option value="40">
                      KANTOR PUSAT-Divisi Audit Internal
                    </Option>
                    <Option value="41">KANTOR PUSAT-Divisi Kepatuhan</Option>
                    <Option value="42">
                      KANTOR PUSAT-Divisi Perencanaan Strategis
                    </Option>
                    <Option value="43">
                      KANTOR PUSAT-Divisi Sekretaris Perusahaan
                    </Option>
                    <Option value="44">
                      KANTOR PUSAT-Divisi Keuangan & Informasi
                    </Option>
                    <Option value="45">
                      KANTOR PUSAT-Divisi Human Capital
                    </Option>
                    <Option value="46">
                      KANTOR PUSAT-Divisi Teknologi & Digitalisasi
                    </Option>
                    <Option value="47">KANTOR PUSAT-Divisi Umum</Option>
                    <Option value="48">
                      KANTOR PUSAT-Divisi Manajemen Resiko
                    </Option>
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
                    <Typography
                      variant="small"
                      color="blue"
                      className="font-medium"
                    >
                      Durasi Magang: {duration.months} bulan {duration.days}{" "}
                      hari
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
                    {
                      name: "fileTranskrip",
                      label: "Transkrip Nilai Semester Terakhir",
                    },
                    { name: "fileKtp", label: "Kartu Tanda Penduduk" },
                    {
                      name: "fileSuratPengantar",
                      label: "Surat Pengantar dari Institusi (PDF)",
                    },
                  ].map((doc) => (
                    <div key={doc.name} className="space-y-2">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-medium"
                      >
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
              <LoadingButton
                type="submit"
                isLoading={isSubmitting}
                className="w-full !bg-blue-500 hover:!bg-blue-600"
              >
                Submit Pengajuan
              </LoadingButton>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
};

export default ApplicationFormMahasiswa;
