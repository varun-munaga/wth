import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, ArrowRight, ArrowLeft, Sparkles, Shield } from 'lucide-react';
import { saveData } from '../utils/storage';
import { User } from '../types';

const OnboardingStart: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', age: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-8 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen">
          
          {/* Left Column: Welcome Content */}
          <div className="space-y-8 animate-fade-in-up">
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 text-indigo-300 hover:text-white transition-all duration-300 group"
            >
              <div className="p-2 rounded-lg group-hover:bg-white/10 transition-all duration-300 group-hover:scale-110">
                <ArrowLeft size={18} />
              </div>
              <span className="font-medium">Back to Home</span>
            </Link>
            
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4 animate-fade-in-right animation-delay-200">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                    <Moon className="text-white" size={32} />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">SleepSense AI</h1>
                  <div className="w-20 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="animate-fade-in-up animation-delay-400">
                <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                  Welcome to Your
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 block">
                    Sleep Journey
                  </span>
                </h2>
                <p className="text-xl text-indigo-200 leading-relaxed max-w-lg">
                  Experience the first sleep anxiety companion that puts your privacy first while delivering personalized, 
                  AI-powered support for better rest.
                </p>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4 animate-fade-in-up animation-delay-600">
              <div className="flex items-center space-x-3 text-indigo-100">
                <Shield className="text-green-400 flex-shrink-0" size={20} />
                <span>100% Private - All data stays on your device</span>
              </div>
              <div className="flex items-center space-x-3 text-indigo-100">
                <Sparkles className="text-purple-400 flex-shrink-0" size={20} />
                <span>AI-powered anxiety management techniques</span>
              </div>
              <div className="flex items-center space-x-3 text-indigo-100">
                <Moon className="text-blue-400 flex-shrink-0" size={20} />
                <span>Evidence-based sleep improvement methods</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="flex justify-center lg:justify-end animate-fade-in-left animation-delay-800">
            <div className="w-full max-w-md">
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-500">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">Get Started</h3>
                    <p className="text-indigo-200">Tell us a bit about yourself</p>
                  </div>

                  <div className="space-y-5">
                    <div className="group">
                      <label className="block text-sm font-semibold text-indigo-200 mb-2 transition-colors group-focus-within:text-white">
                        What's your first name?
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                        className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 transition-all duration-300 hover:bg-white/25 focus:scale-105"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-indigo-200 mb-2 transition-colors group-focus-within:text-white">
                        Email address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 transition-all duration-300 hover:bg-white/25 focus:scale-105"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-indigo-200 mb-2 transition-colors group-focus-within:text-white">
                        Your age
                      </label>
                      <input
                        type="number"
                        required
                        min="13"
                        max="100"
                        value={formData.age}
                        onChange={e => setFormData({ ...formData, age: e.target.value })}
                        placeholder="Enter your age"
                        className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 transition-all duration-300 hover:bg-white/25 focus:scale-105"
                      />
                    </div>
                  </div>

                  {/* Privacy Notice */}
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-xl p-4 border border-green-400/20 hover:border-green-400/40 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                        <Shield className="text-white" size={16} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">Privacy Protected</h4>
                        <p className="text-green-200 text-xs">
                          Your information is processed locally and never shared
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:from-indigo-600 disabled:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl hover:scale-105 transform disabled:scale-100 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Starting your journey...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out forwards;
        }
        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }
        .animation-delay-800 {
          animation-delay: 0.8s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default OnboardingStart;