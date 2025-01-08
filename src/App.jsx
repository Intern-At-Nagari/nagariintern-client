import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AuthLayout from './components/AuthLayout';
import CustomAlert from './components/CustomAlert';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/auth" element={<AuthLayout />} />
        </Routes>
        <CustomAlert />
      </div>
    </Router>
  );
}

export default App;