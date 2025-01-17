import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthLayout from './layout/AuthLayout';
import CustomAlert from './components/CustomAlert';
import Home from './pages/HomePage';
import ApplicationFormSiswa from "./pages/FormSiswaPage";
import ApplicationFormMahasiswa from "./pages/FormMahasiswaPage";
import ApplicationStatus from "./pages/MagangPage";
import DashboardLayout from "./layout/DashboardLayout";
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './context/AuthContext';
import { GuestRoute, ProtectedRoute } from './routes/ProtectedRoutes';
import './index.css';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
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

            {/* Protected Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/home" element={<Home />} />
              <Route path="/application/siswa" element={<ApplicationFormSiswa />} />
              <Route path="/application/mahasiswa" element={<ApplicationFormMahasiswa />} />
              <Route path="/status" element={<ApplicationStatus />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Catch-all route for 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <CustomAlert />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;