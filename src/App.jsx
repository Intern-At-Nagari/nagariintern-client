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
import AdminDashboard from "./pages/admin/AdminDashboardPage";
import ApplicationFormSiswa from "./pages/FormSiswaPage";
import ApplicationFormMahasiswa from "./pages/FormMahasiswaPage";
import ApplicationStatus from "./pages/MagangPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardLayout from "./layout/DashboardLayout";
import CustomAlert from "./components/CustomAlert";
import "./index.css";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminRoute from "./routes/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <CustomAlert />
        <Routes>
          {/* Public routes - only accessible when NOT authenticated */}
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/auth/*" element={<AuthLayout />} />
            </Route>
          </Route>

          {/* Protected routes - only accessible when authenticated */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/form-siswa" element={<ApplicationFormSiswa />} />
              <Route
                path="/form-mahasiswa"
                element={<ApplicationFormMahasiswa />}
              />
              <Route path="/magang" element={<ApplicationStatus />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Landing page - accessible to all */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
