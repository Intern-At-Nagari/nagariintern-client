import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./utils/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoutes";
import PublicRoute from "./routes/PublicRoute"; // New component
import LandingPage from "./pages/LandingPage";
import AuthLayout from "./layout/AuthLayout";
import Home from "./pages/HomePage";
import ApplicationFormSiswa from "./pages/FormSiswaPage";
import ApplicationFormMahasiswa from "./pages/FormMahasiswaPage";
import ApplicationStatus from "./pages/MagangPage";
import ProfilePage from "./pages/ProfilePage";
import AdminProfilePage from "./pages/admin/ProfilePage";
import DashboardLayout from "./layout/DashboardLayout";
import CustomAlert from "./components/CustomAlert";
import "./index.css";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import PesertaMagang from "./pages/admin/PesertaMagangPage";
import DetailPesertaMagang from "./pages/admin/DetailPesertaMagangPage";
import RekapAbsen from "./pages/admin/RekapAbsenPage";
import AdminRoute from "./routes/AdminRoute";
import DetailAbsensiPage from "./pages/admin/DetailAbsensiPage";
import CompleteProfilePage from "./pages/admin/CompleteProfilePage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <CustomAlert />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/auth/*" element={<AuthLayout />} />

          {/* Protected User routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/form-siswa" element={<ApplicationFormSiswa />} />
              <Route path="/form-mahasiswa" element={<ApplicationFormMahasiswa />} />
              <Route path="/magang" element={<ApplicationStatus />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Protected Admin routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/peserta-magang" element={<PesertaMagang />} />
            <Route path="/admin/peserta-magang/:id" element={<DetailPesertaMagang />} />
            <Route path="/admin/rekapitulasi" element={<RekapAbsen />} />
            <Route path="/admin/absensi/:bulan/:tahun" element={<DetailAbsensiPage />} />
            <Route path="/admin/profil" element={<AdminProfilePage />} />
            <Route path="/admin/firstlogin" element={<CompleteProfilePage />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;