import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthLayout from './components/AuthLayout';
import CustomAlert from './components/CustomAlert';
import Home from './components/Home';
import ApplicationForm from "./components/ApplicationForm";
import ApplicationStatus from "./components/ApplicationStatus";
import DashboardLayout from "./components/DashboardLayout";
import ProfilePage from './components/ProfilePage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthLayout />} />
          <Route element={<DashboardLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/application" element={<ApplicationForm />} />
            <Route path="/status" element={<ApplicationStatus />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
        <CustomAlert />
      </div>
    </Router>
  );
}

export default App;