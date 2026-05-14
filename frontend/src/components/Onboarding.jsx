import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ScanFace, ChevronRight, Zap } from 'lucide-react';

const API_URL = 'https://nexus-oracle-api-265235104456.us-central1.run.app/api';

export default function Onboarding({ onComplete }) {
  const [username, setUsername] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [dnaResult, setDnaResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsScanning(true);
    
    try {
      // Simulate API call delay for dramatic effect
      setTimeout(async () => {
        const response = await axios.post(`${API_URL}/onboard`, {
          username: username,
          fan_history_summary: "Loyal fan, aggressive predictor"
        });
        setDnaResult(response.data);
        setIsScanning(false);
      }, 2500);
    } catch (error) {
      console.error("Error fetching DNA:", error);
      setIsScanning(false);
    }
  };

  if (dnaResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto mt-12 bg-surface border border-primary/30 rounded-2xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <h2 className="text-3xl font-bold mb-2">Fan DNA Authenticated</h2>
        <p className="text-gray-400 mb-8">Welcome to the Nexus Network, Oracle.</p>
        
        <div className="space-y-6">
          <div className="bg-background/50 p-6 rounded-xl border border-gray-800">
            <h3 className="text-sm uppercase tracking-widest text-primary mb-1">Archetype</h3>
            <p className="text-2xl font-bold">{dnaResult.dna_type}</p>
            <p className="text-gray-400 mt-2">{dnaResult.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background/50 p-4 rounded-xl border border-gray-800">
              <h3 className="text-xs uppercase tracking-widest text-secondary mb-1">Assigned Guild</h3>
              <p className="font-semibold">{dnaResult.guild}</p>
            </div>
            <div className="bg-background/50 p-4 rounded-xl border border-gray-800">
              <h3 className="text-xs uppercase tracking-widest text-red-500 mb-1">AI Rival Match</h3>
              <p className="font-semibold">{dnaResult.ai_rival_name}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => onComplete(dnaResult)}
          className="mt-8 w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          Enter the Dashboard <ChevronRight className="w-5 h-5" />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-20">
      <div className="text-center mb-12 animate-slide-up">
        <h1 className="text-5xl font-black mb-4 tracking-tight">
          Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Fan DNA</span>
        </h1>
        <p className="text-xl text-gray-400">
          Our Gemini AI analyzes your prediction history to uncover your unique Oracle archetype.
        </p>
      </div>

      <form onSubmit={handleScan} className="bg-surface p-8 rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden">
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-10 bg-surface/90 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-primary font-bold tracking-widest animate-pulse">ANALYZING FAN HISTORY...</p>
          </motion.div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-background border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="Enter your fan alias..."
            required
          />
        </div>

        <button 
          type="submit"
          disabled={isScanning || !username}
          className="w-full bg-white text-black font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <ScanFace className="w-5 h-5" /> Initiate Neural Scan
        </button>
      </form>
    </div>
  );
}
