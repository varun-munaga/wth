import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, ArrowRight, ArrowLeft } from 'lucide-react';
import { saveData } from '../utils/storage';
import { User } from '../types';

const OnboardingStart: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: ''
  });
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      age: parseInt(formData.age),
      createdAt: new Date()
    };
    
    saveData({ user });
    navigate('/onboarding/assessment');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-40 h-40 bg-indigo-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-32 h-32 bg-purple-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-36 h-36 bg-blue-400 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-28 h-28 bg-pink-400 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
      
      <div className="container mx-auto px-6 py-20 max-w-4xl relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Link to="/" className="inline-flex items-center space-x-2 text-indigo-300 hover:text-indigo-100 mb-12 transition-all duration-200 group">
              <div className="p-2 rounded-lg group-hover:bg-white/10 transition-colors">
                <ArrowLeft size={18} />
              </div>
              <span className="font-medium">Back to Home</span>
            </Link>
            
            <div className="flex items-center justify-center space-x-6 mb-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl blur-lg opacity-50"></div>
                <div className="relative p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl">
                  <Moon className="text-white" size={40} />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white mb-2">SleepSense AI</h1>
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mx-auto"></div>
              </div>
            </div>
            
            <h2 className="text-6xl font-bold mb-8 text-white leading-tight">Welcome!</h2>
            <p className="text-xl text-indigo-200 max-w-2xl mx-auto leading-relaxed">
              Start your journey to better sleep and less anxiety with our gentle, AI-powered approach.
            </p>
          </div>
          {/* Form */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-1 h-12 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-white">Let's get to know you</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold mb-4 text-indigo-200">What's your name?</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-5 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-400/30 focus:border-indigo-400 text-xl transition-all duration-300 hover:bg-white/30"
                      placeholder="Enter your first name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-lg font-semibold mb-4 text-indigo-200">Email address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-5 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-400/30 focus:border-indigo-400 text-xl transition-all duration-300 hover:bg-white/30"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-lg font-semibold mb-4 text-indigo-200">How old are you?</label>
                    <input
                      type="number"
                      required
                      min="13"
                      max="100"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full p-5 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-indigo-200 focus:outline-none focus:ring-4 focus:ring-indigo-400/30 focus:border-indigo-400 text-xl transition-all duration-300 hover:bg-white/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="Age"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                    <div className="text-white text-2xl">🔒</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white mb-3">
                      Privacy First
                    </h3>
                    <p className="text-indigo-200 leading-relaxed text-lg">
                      Your information stays completely private. All AI processing happens on your device - we never see your sleep data.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6">
                <button
                  type="submit"
                  className="group w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-6 px-10 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-4 text-xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transform"
                >
                  <span>Continue Your Journey</span>
                  <div className="group-hover:translate-x-1 transition-transform duration-300">
                    <ArrowRight size={24} />
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStart;