import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AuthLayout from './components/AuthLayout';
import CustomAlert from './components/CustomAlert';
import Home from './components/Home';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthLayout />} />
          <Route path="/home" element={<Home />} />
        </Routes>
        <CustomAlert />
      </div>
    </Router>
  );
}

export default App;