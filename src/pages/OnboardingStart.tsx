import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, ArrowRight, ArrowLeft, Sparkles, Shield, Star, Heart } from 'lucide-react';
import { saveData } from '../utils/storage';
import { User } from '../types';

const OnboardingStart: React.FC = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    age: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1200));
    
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.name.length > 0 && 
                     formData.email.includes('@') && 
                     parseInt(formData.age) >= 13;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob delay-[2000ms]"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400 rounded-full opacity-60 animate-float"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-float delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-pink-400 rounded-full opacity-30 animate-float delay-[1500ms]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-8 py-12 max-w-7xl min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          
          {/* Left Column: Welcome Content */}
          <div className="space-y-8 animate-fade-in-left">
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 text-indigo-300 hover:text-white transition-all duration-300 group mb-8"
            >
              <div className="p-2 rounded-lg group-hover:bg-white/10 transition-all duration-300 group-hover:scale-110">
                <ArrowLeft size={18} />
              </div>
              <span className="font-medium">Back to Home</span>
            </Link>
            
            {/* Brand Section */}
            <div className="space-y-8">
              <div className="flex items-center space-x-4 animate-fade-in-right delay-200">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity animate-glow"></div>
                  <div className="relative p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                    <Moon className="text-white" size={36} />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">SleepSense AI</h1>
                  <div className="w-20 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="animate-fade-in-up delay-500">
                <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                  Welcome to Your
                  <span className="gradient-text block mt-2">
                    Sleep Journey ✨
                  </span>
                </h2>
                <p className="text-xl text-indigo-200 leading-relaxed max-w-lg mb-8">
                  Experience the first sleep anxiety companion that puts your privacy first while delivering personalized, 
                  AI-powered support for better rest.
                </p>
              </div>
            </div>

            {/* Enhanced Features List */}
            <div className="space-y-4 animate-fade-in-up delay-700">
              <div className="flex items-center space-x-3 text-indigo-100 group hover:text-white transition-colors">
                <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                  <Shield className="text-emerald-400 flex-shrink-0" size={20} />
                </div>
                <span className="font-medium">100% Private - All data stays on your device</span>
              </div>
              <div className="flex items-center space-x-3 text-indigo-100 group hover:text-white transition-colors">
                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <Sparkles className="text-purple-400 flex-shrink-0" size={20} />
                </div>
                <span className="font-medium">AI-powered anxiety management techniques</span>
              </div>
              <div className="flex items-center space-x-3 text-indigo-100 group hover:text-white transition-colors">
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <Moon className="text-blue-400 flex-shrink-0" size={20} />
                </div>
                <span className="font-medium">Evidence-based sleep improvement methods</span>
              </div>
              <div className="flex items-center space-x-3 text-indigo-100 group hover:text-white transition-colors">
                <div className="p-2 bg-pink-500/20 rounded-lg group-hover:bg-pink-500/30 transition-colors">
                  <Heart className="text-pink-400 flex-shrink-0" size={20} />
                </div>
                <span className="font-medium">Gentle, supportive approach to sleep wellness</span>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-2 animate-fade-in-up delay-1000">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full border-2 border-white/20 flex items-center justify-center text-white font-bold text-sm">
                    {i}
                  </div>
                ))}
              </div>
              <div className="text-indigo-200 text-sm">
                <span className="text-white font-semibold">1000+</span> users already improving their sleep
              </div>
            </div>
          </div>

          {/* Right Column: Enhanced Form */}
          <div className="flex justify-center lg:justify-end animate-fade-in-right delay-300">
            <div className="w-full max-w-md">
              <div className="glass-card rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-500 border border-white/20">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 mb-4">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <Star className="w-5 h-5 text-yellow-400" />
                      <Star className="w-5 h-5 text-yellow-400" />
                      <Star className="w-5 h-5 text-yellow-400" />
                      <Star className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Get Started</h3>
                    <p className="text-indigo-200">Join thousands who sleep better</p>
                  </div>

                  <div className="space-y-5">
                    {/* Name Field */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-indigo-200 mb-2 transition-colors group-focus-within:text-white">
                        What's your first name? *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Enter your name"
                          className={`form-control bg-white/20 border-white/30 text-white placeholder-indigo-300 ${
                            focusedField === 'name' 
                              ? 'border-indigo-400 shadow-lg shadow-indigo-400/25 scale-105' 
                              : 'hover:border-white/40'
                          }`}
                        />
                        {formData.name && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-indigo-200 mb-2 transition-colors group-focus-within:text-white">
                        Email address *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="you@example.com"
                          className={`form-control bg-white/20 border-white/30 text-white placeholder-indigo-300 ${
                            focusedField === 'email' 
                              ? 'border-indigo-400 shadow-lg shadow-indigo-400/25 scale-105' 
                              : 'hover:border-white/40'
                          }`}
                        />
                        {formData.email.includes('@') && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Age Field */}
                    <div className="group">
                      <label className="block text-sm font-semibold text-indigo-200 mb-2 transition-colors group-focus-within:text-white">
                        Your age *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          required
                          min="13"
                          max="100"
                          value={formData.age}
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          onFocus={() => setFocusedField('age')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="25"
                          className={`form-control bg-white/20 border-white/30 text-white placeholder-indigo-300 ${
                            focusedField === 'age' 
                              ? 'border-indigo-400 shadow-lg shadow-indigo-400/25 scale-105' 
                              : 'hover:border-white/40'
                          }`}
                        />
                        {parseInt(formData.age) >= 13 && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Privacy Notice */}
                  <div className="bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 backdrop-blur-sm rounded-xl p-4 border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg animate-glow">
                        <Shield className="text-white" size={16} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">Privacy Protected</h4>
                        <p className="text-emerald-200 text-xs leading-relaxed">
                          Your information is processed locally and never shared
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className={`btn btn--primary btn--full-width btn--lg ${
                      !isFormValid || isSubmitting ? 'btn:disabled' : ''
                    }`}
                  >
                    {/* Animated background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative flex items-center space-x-3">
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Creating your account...</span>
                        </>
                      ) : (
                        <>
                          <span>Continue Your Journey</span>
                          <ArrowRight 
                            size={20} 
                            className={`transition-transform duration-300 ${
                              isFormValid ? 'group-hover:translate-x-1' : ''
                            }`} 
                          />
                        </>
                      )}
                    </div>
                  </button>

                  {/* Progress indicator */}
                  <div className="flex justify-center space-x-2 mt-6">
                    <div className="w-8 h-2 bg-indigo-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                  </div>
                  <p className="text-center text-indigo-300 text-sm">Step 1 of 3</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStart;