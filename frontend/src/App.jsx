import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';

function App() {
  const [userDNA, setUserDNA] = useState(null);

  useEffect(() => {
    // Check if user is already onboarded locally
    const savedDna = localStorage.getItem('nexus_fan_dna');
    if (savedDna) {
      setUserDNA(JSON.parse(savedDna));
    }
  }, []);

  const handleOnboardComplete = (dna) => {
    setUserDNA(dna);
    localStorage.setItem('nexus_fan_dna', JSON.stringify(dna));
  };

  return (
    <Router>
      <div className="min-h-screen bg-background text-white font-sans selection:bg-primary/30">
        <nav className="border-b border-surface/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center animate-pulse-glow">
                  <span className="font-bold text-lg">N</span>
                </div>
                <span className="font-bold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">NEXUS ORACLE</span>
              </div>
              {userDNA && (
                <div className="flex items-center gap-4 text-sm font-medium">
                  <span className="text-gray-400">Guild: <span className="text-primary">{userDNA.guild}</span></span>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('nexus_fan_dna');
                      setUserDNA(null);
                    }}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route 
              path="/" 
              element={!userDNA ? <Onboarding onComplete={handleOnboardComplete} /> : <Navigate to="/dashboard" replace />} 
            />
            <Route 
              path="/dashboard" 
              element={userDNA ? <Dashboard userDNA={userDNA} /> : <Navigate to="/" replace />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
