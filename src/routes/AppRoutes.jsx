import { Routes, Route } from "react-router-dom";
import { GuestRoute, ProtectedRoute } from "./ProtectedRoutes";
import AdminRoute from "./AdminRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Guest Routes */}
      <Route
        path="/"
        element={
          <GuestRoute>
            <LandingPage />
          </GuestRoute>
        }
      />
      <Route
        path="/auth"
        element={
          <GuestRoute>
            <AuthLayout />
          </GuestRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <GuestRoute>
            <AuthLayout />
          </GuestRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/application">
          <Route path="siswa" element={<ApplicationFormSiswa />} />
          <Route path="mahasiswa" element={<ApplicationFormMahasiswa />} />
        </Route>
        <Route path="/status" element={<ApplicationStatus />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        element={
          <AdminRoute>
            <DashboardLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      {/* Catch-all route for 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
