import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { loadData, saveData } from './utils/storage';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import OnboardingStart from './pages/OnboardingStart';
import OnboardingAssessment from './pages/OnboardingAssessment';
import OnboardingComplete from './pages/OnboardingComplete';
import Dashboard from './pages/Dashboard';
import EveningCheckin from './pages/EveningCheckin';
import MorningReflection from './pages/MorningReflection';
import Chat from './pages/Chat';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import Diary from './pages/Diary';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load settings on app start
    const data = loadData();
    setDarkMode(data.settings.darkMode);
    setIsLoading(false);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    saveData({ 
      settings: { 
        ...loadData().settings, 
        darkMode: newDarkMode 
      } 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SleepSense AI...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className={darkMode ? 'dark' : ''}>
        <Layout darkMode={darkMode}>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<Landing />} />
            
            {/* Onboarding Flow */}
            <Route path="/onboarding" element={<OnboardingStart />} />
            <Route path="/onboarding/assessment" element={<OnboardingAssessment />} />
            <Route path="/onboarding/complete" element={<OnboardingComplete />} />
            
            {/* Main App */}
            <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />
            <Route path="/diary" element={<Diary darkMode={darkMode} />} />
            <Route path="/diary/evening" element={<EveningCheckin darkMode={darkMode} />} />
            <Route path="/diary/morning" element={<MorningReflection darkMode={darkMode} />} />
            <Route path="/chat" element={<Chat darkMode={darkMode} />} />
            <Route path="/insights" element={<Insights darkMode={darkMode} />} />
            <Route path="/settings" element={<Settings darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
