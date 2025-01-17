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

const ApplicationFormSiswa = () => {
  const navigate = useNavigate();
  const { userData } = useOutletContext();
  const [schoolQuery, setSchoolQuery] = useState("");
  const [schoolSuggestions, setSchoolSuggestions] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    nama: "",
    nisn: "",
    smk: "",
    jurusan: "",
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

  const [schoolInputProps, setSchoolInputProps] = useState({
    value: "",
    isValid: true,
    errorMessage: "",
    isLocked: false,
  });

  const searchSchool = async (query) => {
    if (!query || query.length < 3 || schoolInputProps.isLocked) {
      // Add lock check
      setSchoolSuggestions([]);
      return;
    }

    setIsSearching(true);
    setSearchError("");

    try {
      const response = await axios.get(
        `http://localhost:3000/api/sekolah?sekolah=${encodeURIComponent(query)}`
      );

      console.log("Search response:", response.data); // Add logging
      if (response.data.dataSekolah) {
        const smkSchools = response.data.dataSekolah.filter(
          (school) => school.bentuk === "SMK"
        );
        setSchoolSuggestions(smkSchools);
        setShowSuggestions(true);
      } else {
        setSchoolSuggestions([]);
      }
    } catch (error) {
      console.error("Error searching school:", error);
      setSearchError("Terjadi kesalahan saat mencari sekolah");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSchoolInputChange = (e) => {
    if (schoolInputProps.isLocked) {
      return;
    }

    const value = e.target.value;
    setSchoolQuery(value);
    setSelectedSchool(null);
    setFormData((prev) => ({
      ...prev,
      smk: "",
    }));

    setSchoolInputProps((prev) => ({
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

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school);
    setSchoolQuery(school.sekolah);
    setShowSuggestions(false);
    setSchoolSuggestions([]); // Clear suggestions immediately
    setFormData((prev) => ({
      ...prev,
      smk: school.sekolah,
    }));
    setSchoolInputProps((prev) => ({
      ...prev,
      value: school.sekolah,
      isValid: true,
      errorMessage: "",
      isLocked: true, // Lock the input after selection
    }));
  };

  const handleClearSearch = () => {
    setSchoolQuery("");
    setSelectedSchool(null);
    setSchoolSuggestions([]);
    setShowSuggestions(false);
    setSearchError("");
    setFormData((prev) => ({
      ...prev,
      smk: "",
    }));
    setSchoolInputProps({
      value: "",
      isValid: true,
      errorMessage: "",
      isLocked: false, // Unlock the input when clearing
    });
  };

  const validateSchoolSelection = () => {
    if (!selectedSchool) {
      setSchoolInputProps((prev) => ({
        ...prev,
        isValid: false,
        errorMessage: "Pilih sekolah dari daftar yang tersedia",
      }));
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!schoolInputProps.isLocked && schoolQuery) {
      const timeoutId = setTimeout(() => {
        searchSchool(schoolQuery);
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
    console.log('Select value:', value); // untuk debugging
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!validateSchoolSelection()) {
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
        "http://localhost:3000/intern/siswa",
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
              Form Pengajuan Magang Siswa
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
                      label="Alamat"
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
                      name="nisn"
                      label="NISN"
                      size="lg"
                      value={formData.nisn}
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
                {/* School Search Section */}
                <div className="space-y-4 mb-6">
                  <div className="relative">
                    <div className="relative">
                      <Input
                        type="text"
                        label="Cari Nama SMK"
                        value={schoolInputProps.value}
                        onChange={handleSchoolInputChange}
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
                              Mencari SMK...
                            </div>
                          ) : schoolSuggestions.length > 0 ? (
                            schoolSuggestions.map((school) => (
                              <div
                                key={school.id}
                                className="p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                                onClick={() => handleSchoolSelect(school)}
                              >
                                <div className="font-medium">
                                  {school.sekolah}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {school.alamat_jalan}, {school.kecamatan}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-center text-gray-500">
                              Tidak ada SMK yang ditemukan
                            </div>
                          )}
                        </div>
                      )}
                  </div>

                  {/* Selected School Display */}
                  {selectedSchool && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="font-medium text-lg mb-2">
                        {selectedSchool.sekolah}
                      </div>
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="font-medium">NPSN:</span>{" "}
                          {selectedSchool.npsn}
                        </div>
                        <div>
                          <span className="font-medium">Alamat:</span>{" "}
                          {selectedSchool.alamat_jalan}
                        </div>
                        <div>
                          <span className="font-medium">Kecamatan:</span>{" "}
                          {selectedSchool.kecamatan}
                        </div>
                        <div>
                          <span className="font-medium">Kabupaten/Kota:</span>{" "}
                          {selectedSchool.kabupaten_kota}
                        </div>
                        <div>
                          <span className="font-medium">Provinsi:</span>{" "}
                          {selectedSchool.propinsi}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <Input
                  type="text"
                  name="jurusan"
                  label={"Jurusan "}
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
                    <Option value="35">KANTOR PUSAT</Option>
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

export default ApplicationFormSiswa;
