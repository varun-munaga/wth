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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 mb-6">
              <ArrowLeft size={20} />
              <span>Back</span>
            </Link>
            
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Moon className="text-orange-400" size={32} />
              <h1 className="text-2xl font-bold">SleepSense AI</h1>
            </div>
            
            <h2 className="text-3xl font-bold mb-2">Welcome!</h2>
            <p className="text-gray-300">
              Let's start your journey to better sleep and less anxiety.
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">What's your name?</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                placeholder="Enter your first name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">How old are you?</label>
              <input
                type="number"
                required
                min="13"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                placeholder="Age"
              />
            </div>
            
            <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/30">
              <h3 className="font-semibold mb-2 flex items-center">
                🔒 Privacy First
              </h3>
              <p className="text-sm text-gray-300">
                Your information stays completely private. All AI processing happens on your device - we never see your sleep data.
              </p>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStart;