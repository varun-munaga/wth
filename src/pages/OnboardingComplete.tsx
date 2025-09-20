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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Moon className="text-orange-400" size={40} />
              <h1 className="text-3xl font-bold">SleepSense AI</h1>
            </div>
            
            <div className="mb-6">
              <CheckCircle className="mx-auto text-green-400 mb-4" size={64} />
              <h2 className="text-3xl font-bold mb-2">You're all set!</h2>
              <p className="text-xl text-gray-300">
                Let's reduce your sleep anxiety together, {userData.user?.name}
              </p>
            </div>
          </div>
          
          {/* Features Preview */}
          <div className="space-y-4 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-left">
              <div className="flex items-center space-x-3">
                <Shield className="text-green-400 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold">100% Private AI Processing</h3>
                  <p className="text-sm text-gray-300">All your data stays on your device</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-left">
              <div className="flex items-center space-x-3">
                <Brain className="text-purple-400 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold">Personalized CBT-I Techniques</h3>
                  <p className="text-sm text-gray-300">Evidence-based anxiety reduction</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-left">
              <div className="flex items-center space-x-3">
                <Heart className="text-pink-400 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold">Gentle, Judgment-Free Support</h3>
                  <p className="text-sm text-gray-300">Focus on progress, not perfection</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="space-y-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200"
            >
              Start Your Journey
            </button>
            
            <p className="text-sm text-gray-400">
              Redirecting automatically in a few seconds...
            </p>
          </div>
          
          {/* Encouragement */}
          <div className="mt-8 p-4 bg-purple-900/30 rounded-xl">
            <p className="text-sm text-gray-300">
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