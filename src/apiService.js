import axios from "axios";

// Base URL API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Buat instance Axios
const API = axios.create({
  baseURL: API_BASE_URL,
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Ambil jadwal saat ini
 * @returns {Promise} - Data jadwal
 */
export const getCurrentSchedule = async () => {
  return API.get("/jadwal-curent");
};

/**
 * Cari universitas berdasarkan nama
 * @param {string} query - Nama universitas
 * @returns {Promise} - Hasil pencarian universitas
 */
export const searchUniversity = async (query) => {
  return API.get(`/universitas?name=${encodeURIComponent(query)}`);
};

/**
 * Kirim data magang mahasiswa
 * @param {Object} formDataToSend - Data mahasiswa dalam format form-data
 * @returns {Promise} - Respons dari server
 */
export const submitInternData = async (formDataToSend) => {
  return API.post("/intern/mahasiswa", formDataToSend, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Ambil data absensi admin
 * @returns {Promise} - Data absensi
 */
export const getAdminAttendance = async () => {
  return API.get("/admin/absensi");
};

/**
 * Generate & download laporan absensi dalam bentuk PDF
 * @param {string} bulan - Bulan absensi
 * @param {string} tahun - Tahun absensi
 * @param {Object} printForm - Data absensi yang akan dicetak
 * @returns {Promise} - File PDF dalam bentuk array buffer
 */
export const printAttendanceReport = async (bulan, tahun, printForm) => {
  return API.post(`/admin/absensi/${bulan}/${tahun}/print`, printForm, {
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "arraybuffer",
  });
};

/**
 * Ambil daftar mahasiswa magang
 * @returns {Promise} - Data mahasiswa magang
 */
export const getInterns = async () => {
  return API.get("/admin/intern");
};

/**
 * Ambil detail mahasiswa magang berdasarkan ID
 * @param {string} id - ID mahasiswa magang
 * @returns {Promise} - Detail mahasiswa magang
 */
export const getInternById = async (id) => {
  return API.get(`/admin/intern/${id}`);
};

/**
 * Ambil data absensi berdasarkan bulan dan tahun
 * @param {string} bulan - Bulan absensi
 * @param {string} tahun - Tahun absensi
 * @returns {Promise} - Data absensi
 */
export const getAttendanceByMonth = async (bulan, tahun) => {
  return API.get(`/admin/absensi/${bulan}/${tahun}`);
};

/**
 * Upload file absensi
 * @param {Object} formData - Data absensi dalam format form-data
 * @param {string} bulan - Bulan absensi
 * @param {string} tahun - Tahun absensi
 * @returns {Promise} - Respons dari server
 */
export const uploadAttendanceFile = async (bulan, tahun, formData) => {
  return API.post(`/admin/absensi/${bulan}/${tahun}/upload`, formData);
};

/**
 * Update kehadiran mahasiswa
 * @param {string} attendanceId - ID absensi
 * @param {number} newAttendance - Status kehadiran baru
 * @returns {Promise} - Respons dari server
 */
export const updateAttendance = async (attendanceId, newAttendance) => {
  return API.patch(`/admin/absensi/${attendanceId}`, { kehadiran: newAttendance });
};

/**
 * Ambil URL untuk dokumen yang diunggah
 * @param {string} docUrl - Path dokumen di server
 * @returns {string} - URL lengkap file
 */
export const getUploadUrl = (docUrl) => `${API_BASE_URL}/uploads/${docUrl}`;

/**
 * Buka PDF rekap absensi
 * @param {string} pdfUrl - Path file PDF
 */
export const viewRekapPdf = (pdfUrl) => {
  window.open(`${API_BASE_URL}/public/${pdfUrl}`, "_blank");
};

/**
 * Login pengguna
 * @param {Object} formData - Data login (email & password)
 * @returns {Promise} - Respons dari server
 */
export const loginUser = async (formData) => {
  return API.post("/auth/login", formData);
};
