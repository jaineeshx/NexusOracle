import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Target, Swords, Trophy, Zap, Clock, Send } from 'lucide-react';

const API_URL = '/api';

export default function Dashboard({ userDNA }) {
  const [quests, setQuests] = useState([]);
  const [oracleWar, setOracleWar] = useState(null);
  const [predictionValue, setPredictionValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchQuests();
    fetchOracleWar();

    // Poll for Oracle War updates
    const interval = setInterval(fetchOracleWar, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchQuests = async () => {
    try {
      const res = await axios.get(`${API_URL}/quests/user123`);
      setQuests(res.data);
    } catch (error) {
      console.error("Error fetching quests", error);
    }
  };

  const fetchOracleWar = async () => {
    try {
      const res = await axios.get(`${API_URL}/oracle-war`);
      setOracleWar(res.data);
    } catch (error) {
      console.error("Error fetching oracle war stats", error);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!predictionValue) return;
    
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/predict`, {
        user_id: "user123",
        match_id: "match_cyber_neon",
        prediction_type: "next_goal",
        value: predictionValue
      });
      setPredictionValue('');
      // Simulate success feedback
      setTimeout(() => setIsSubmitting(false), 500);
    } catch (error) {
      console.error("Prediction error", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Quests & DNA */}
      <div className="space-y-6">
        <div className="bg-surface border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">Adaptive Quests</h2>
          </div>
          <p className="text-sm text-gray-400 mb-6">Gemini curated these missions based on your {userDNA.dna_type} profile.</p>
          
          <div className="space-y-4">
            {quests.map((quest) => (
              <div key={quest.id} className="bg-background border border-gray-800 p-4 rounded-xl hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{quest.title}</h3>
                  <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded">{quest.reward_xp} XP</span>
                </div>
                <p className="text-xs text-gray-400">{quest.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-surface to-background border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>
          <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-1">Your Rival</h3>
          <p className="text-xl font-bold text-white mb-2">{userDNA.ai_rival_name}</p>
          <p className="text-xs text-gray-500">This AI mirrors your exact prediction history. Beat it to earn bonus multiplier.</p>
        </div>
      </div>

      {/* Middle Column: Oracle War (Main Event) */}
      <div className="lg:col-span-2 space-y-6">
        {oracleWar && (
          <div className="bg-surface border border-gray-800 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-2">
                <Swords className="text-red-500 w-6 h-6" />
                <h2 className="text-2xl font-black uppercase tracking-wider">Live Oracle War</h2>
              </div>
              <div className="flex items-center gap-2 text-red-500 text-sm font-bold bg-red-500/10 px-3 py-1 rounded-full animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> LIVE
              </div>
            </div>

            <div className="grid grid-cols-3 items-center gap-4 relative z-10">
              {/* Team A */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-primary mb-2">{oracleWar.team_a_name} Oracle</h3>
                <div className="text-5xl font-black mb-2">{oracleWar.team_a_oracle_score.toFixed(1)}%</div>
                <p className="text-xs text-primary/70 uppercase tracking-widest">Accuracy</p>
              </div>

              {/* VS */}
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-background border border-gray-700 flex items-center justify-center font-black text-gray-500">
                  VS
                </div>
              </div>

              {/* Team B */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-secondary mb-2">{oracleWar.team_b_name} Oracle</h3>
                <div className="text-5xl font-black mb-2">{oracleWar.team_b_oracle_score.toFixed(1)}%</div>
                <p className="text-xs text-secondary/70 uppercase tracking-widest">Accuracy</p>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-800 relative z-10">
              <p className="text-xs text-center text-gray-400 mb-4 uppercase tracking-widest">Top Contributors to the Collective Brain</p>
              <div className="flex justify-center gap-6">
                {oracleWar.top_contributors.map((contributor, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Trophy className={`w-4 h-4 ${i === 0 ? 'text-yellow-500' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium">{contributor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Prediction Input */}
        <div className="bg-surface border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="text-primary w-5 h-5" /> Feed the Oracle
          </h3>
          <form onSubmit={handlePredict} className="flex gap-4">
            <input 
              type="text"
              value={predictionValue}
              onChange={(e) => setPredictionValue(e.target.value)}
              placeholder="E.g. Next goal by Cyber Knights in 15m..."
              className="flex-1 bg-background border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
            />
            <button 
              type="submit"
              disabled={isSubmitting || !predictionValue}
              className="bg-primary hover:bg-primary/80 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Feeding...' : 'Predict'} <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-3 text-center">Every prediction trains your team's Vertex AI model in real-time.</p>
        </div>
      </div>
    </div>
  );
}
