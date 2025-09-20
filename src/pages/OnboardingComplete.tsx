import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, CheckCircle, Shield, Brain, Heart } from 'lucide-react';
import { loadData } from '../utils/storage';

const OnboardingComplete: React.FC = () => {
  const navigate = useNavigate();
  const userData = loadData();
  
  useEffect(() => {
    // Auto-navigate to dashboard after 5 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-40 h-40 bg-indigo-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-32 h-32 bg-purple-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-36 h-36 bg-blue-400 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-28 h-28 bg-pink-400 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
      
      <div className="container mx-auto px-6 py-20 max-w-5xl relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Header */}
          <div className="mb-20">
            <div className="flex items-center justify-center space-x-6 mb-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur-lg opacity-30"></div>
                <div className="relative p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl">
                  <Moon className="text-white" size={40} />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white mb-2">SleepSense AI</h1>
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mx-auto"></div>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-lg mb-6">
                <CheckCircle className="text-white" size={40} />
              </div>
              <h2 className="text-6xl font-bold mb-8 text-white leading-tight">You're all set!</h2>
              <p className="text-2xl text-indigo-200 max-w-2xl mx-auto leading-relaxed font-light">
                Let's reduce your sleep anxiety together, {userData.user?.name}
              </p>
            </div>
          </div>
          
          {/* Features Preview */}
          <div className="space-y-6 mb-16">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <Shield className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2 text-white">100% Private AI Processing</h3>
                  <p className="text-indigo-200">All your data stays on your device</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
                  <Brain className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2 text-white">Personalized CBT-I Techniques</h3>
                  <p className="text-indigo-200">Evidence-based anxiety reduction</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl">
                  <Heart className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2 text-white">Gentle, Judgment-Free Support</h3>
                  <p className="text-indigo-200">Focus on progress, not perfection</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="space-y-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold py-6 px-10 rounded-2xl transition-all duration-200 text-xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transform"
            >
              Start Your Journey
            </button>
            
            <p className="text-indigo-300">
              Redirecting automatically in a few seconds...
            </p>
          </div>
          
          {/* Encouragement */}
          <div className="mt-16 p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl">
            <p className="text-lg text-indigo-200 leading-relaxed">
              Remember: You're not broken, and you don't need to be "fixed." 
              You're learning to work with your mind, not against it. 
              Every small step counts. ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingComplete;