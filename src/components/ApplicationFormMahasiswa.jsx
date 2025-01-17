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
import LoadingButton from "./LoadingButton";

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

  // Form state
  const [formData, setFormData] = useState({
    tipePemohon: "siswa",
    institusi: "",
    jurusan: "",
    alamat: "",
    noHp: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    divisi: "", 
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
        `http://localhost:3000/api/universitas?name=${encodeURIComponent(
          query
        )}`
      );
      console.log("Response:", response.data);

      if (response.data.dataUniversitas) {
        const universitys = response.data.dataUniversitas;
        setUniversitySuggestions(universitys);
        setShowSuggestions(true);
      } else {
        setUniversitySuggestions([]);
      }
    } catch (error) {
      console.error("Error searching school:", error);
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
      institusi: school.name,
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
        "http://localhost:3000/intern/mahasiswa",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Response:", response.data); // Add logging
      alert("Permintaan magang berhasil diajukan!");
      navigate("/status");
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

                    {/* Updated Suggestions Dropdown - Only show when not locked */}
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
                  name="jurusan"
                  label={"Program Studi "}
                  size="lg"
                  value={formData.jurusan}
                  onChange={handleInputChange}
                  required
                  className="bg-white"
                />
              </div>

              {/* Internship Details Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Detail Magang
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    name="divisi"
                    label="Divisi Yang Dituju"
                    size="lg"
                    value={formData.divisi}
                    onChange={(value) => handleSelectChange("divisi", value)}
                    required
                    className="bg-white"
                  >
                    <Option value="IT_Develompent">IT Development</Option>
                    <Option value="Human_Resource">Human Resources</Option>
                    <Option value="Finance">Finance</Option>
                    <Option value="Marketing">Marketing</Option>
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
