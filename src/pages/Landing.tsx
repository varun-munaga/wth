import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Shield, TrendingUp, Heart } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <Moon className="text-orange-400" size={32} />
              <h1 className="text-2xl font-bold">SleepSense AI</h1>
            </div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Finally, a sleep app that{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-400">
              reduces anxiety
            </span>{' '}
            instead of causing it
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Your intimate sleep data never leaves your device - 100% privacy guaranteed
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-12 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <TrendingUp className="text-red-400" size={24} />
              <span className="text-lg font-semibold">Gen Z Sleep Crisis</span>
            </div>
            <p className="text-2xl font-bold text-orange-400">
              40% of Gen Z experiences sleep anxiety 3+ times weekly
            </p>
            <p className="text-gray-300 mt-2">
              Traditional sleep apps focus on performance, creating more pressure. We focus on reducing anxiety.
            </p>
          </div>
          
          <Link
            to="/onboarding"
            className="inline-block bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white text-xl font-bold py-4 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Start Sleeping Better Tonight
          </Link>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center">
            <Shield className="mx-auto text-green-400 mb-4" size={48} />
            <h3 className="text-xl font-bold mb-3">100% Private</h3>
            <p className="text-gray-300">
              All AI processing happens on your device. Your sleep data never leaves your phone.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center">
            <Heart className="mx-auto text-pink-400 mb-4" size={48} />
            <h3 className="text-xl font-bold mb-3">Anxiety-Focused</h3>
            <p className="text-gray-300">
              Built specifically for sleep anxiety, not sleep optimization. We reduce pressure, not add it.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center">
            <Moon className="mx-auto text-purple-400 mb-4" size={48} />
            <h3 className="text-xl font-bold mb-3">AI Sleep Coach</h3>
            <p className="text-gray-300">
              Personalized CBT-I techniques and gentle guidance based on your unique patterns.
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-purple-600/20 to-orange-500/20 backdrop-blur-sm rounded-3xl p-12 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">Ready to break the anxiety cycle?</h3>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands who've found peace with their sleep through privacy-first AI coaching.
          </p>
          <Link
            to="/onboarding"
            className="inline-block bg-white text-purple-900 text-lg font-bold py-3 px-10 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get Started - It's Free
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center border-t border-white/10">
        <p className="text-gray-400">
          Built with ❤️ for better sleep and mental health. No tracking, no data collection, just support.
        </p>
      </footer>
    </div>
  );
};

export default Landing;