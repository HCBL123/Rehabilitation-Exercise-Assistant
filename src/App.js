// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Exercise from './pages/Exercise';
import Compare from './pages/Compare';
import Results from './pages/Results';
import About from './pages/About';
import Sotay from './pages/Sotay';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exercises" element={<Exercise />} />
          <Route path="/compare/:exerciseId" element={<Compare />} />
          <Route path="/results/:exerciseId" element={<Results />} />
          <Route path="/about" element={<About />} />
          <Route path="/sotay" element={<Sotay />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
