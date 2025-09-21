import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Star, 
  Sparkles, 
  Heart, 
  ArrowRight, 
  Award,
  Target,
  Moon,
  Shield,
  Users,
  Zap
} from 'lucide-react';
import { loadData } from '../utils/storage';

interface UserData {
  user?: {
    name: string;
    email: string;
    age: number;
  };
  assessment?: {
    sleepGoals: string[];
    completedAt: string;
  };
}

const OnboardingComplete: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const features = [
    {
      icon: Shield,
      title: "100% Private",
      description: "All your data stays on your device",
      color: "from-emerald-500 to-green-600"
    },
    {
      icon: Moon,
      title: "AI Sleep Coach",
      description: "Personalized guidance whenever you need it",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: Target,
      title: "Track Progress",
      description: "See your sleep improvement over time",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Heart,
      title: "Anxiety Support",
      description: "Gentle techniques to calm your mind",
      color: "from-pink-500 to-rose-600"
    }
  ];

  const tips = [
    "🌙 Start with just 5 minutes of evening reflection",
    "💙 Be patient with yourself - progress takes time",
    "✨ Small consistent steps lead to big changes",
    "🤗 Remember: you're not alone in this journey"
  ];

  useEffect(() => {
    const data = loadData();
    setUserData(data);
    
    // Trigger confetti animation
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    // Stagger the appearance of elements
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 4) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 600);

    return () => clearInterval(timer);
  }, []);

  const getPersonalizedMessage = () => {
    const goals = userData.assessment?.sleepGoals || [];
    const name = userData.user?.name || 'there';
    
    if (goals.includes('fall_asleep_faster')) {
      return `${name}, we'll help you develop techniques to quiet your mind at bedtime`;
    }
    if (goals.includes('reduce_anxiety')) {
      return `${name}, you've taken a brave step toward managing sleep anxiety`;
    }
    if (goals.includes('wake_refreshed')) {
      return `${name}, we're excited to help you wake up feeling amazing`;
    }
    return `${name}, your sleep transformation journey starts now`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"></div>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-500 rounded-full blur-3xl animate-float animation-delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-72 h-72 bg-pink-500 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-4xl min-h-screen flex items-center justify-center">
        <div className="w-full max-w-3xl text-center">
          
          {/* Success Icon */}
          <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full shadow-2xl mb-8 ${
            currentStep >= 1 ? 'animate-scale-in' : 'opacity-0'
          }`}>
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          {/* Main Heading */}
          <div className={`mb-8 ${currentStep >= 2 ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h1 className="text-5xl font-bold text-white mb-4">
              🎉 Welcome to SleepSense AI!
            </h1>
            <p className="text-2xl text-indigo-200 mb-6 leading-relaxed">
              {getPersonalizedMessage()}
            </p>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-lg text-purple-200">
              You've completed your personalized sleep assessment!
            </p>
          </div>

          {/* Features Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 ${
            currentStep >= 3 ? 'animate-fade-in-up' : 'opacity-0'
          }`}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass-card p-6 rounded-2xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-indigo-200">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Tips Section */}
          <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20 ${
            currentStep >= 4 ? 'animate-fade-in-up' : 'opacity-0'
          }`}>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center space-x-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <span>Quick Tips to Get Started</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="text-left p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <p className="text-indigo-100">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What's Next Section */}
          <div className={`bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-purple-300/20 ${
            currentStep >= 4 ? 'animate-fade-in-up animation-delay-200' : 'opacity-0'
          }`}>
            <h2 className="text-2xl font-bold text-white mb-6">What's Next?</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Explore Your Dashboard</h3>
                  <p className="text-purple-200 text-sm">Get familiar with tracking your sleep and anxiety patterns</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Start Evening Check-ins</h3>
                  <p className="text-purple-200 text-sm">Rate your anxiety and set intentions before bed</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Chat with Your AI Coach</h3>
                  <p className="text-purple-200 text-sm">Get personalized support whenever you need it</p>
                </div>
              </div>
            </div>
          </div>

          {/* Community Message */}
          <div className={`bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-emerald-300/20 ${
            currentStep >= 4 ? 'animate-fade-in-up animation-delay-400' : 'opacity-0'
          }`}>
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-emerald-300" />
              <h3 className="text-xl font-semibold text-white">You're Part of Something Special</h3>
            </div>
            <p className="text-emerald-200">
              Join thousands of people who are improving their sleep and managing anxiety with SleepSense AI. 
              Remember, every expert was once a beginner. You've got this! 💪
            </p>
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${
            currentStep >= 4 ? 'animate-fade-in-up animation-delay-600' : 'opacity-0'
          }`}>
            <Link
              to="/dashboard"
              className="group flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl"
            >
              <span>Enter Your Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/chat"
              className="group flex items-center justify-center space-x-3 bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-2xl border border-white/20 hover:border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              <span>Start Chatting with AI</span>
            </Link>
          </div>

          {/* Motivational Quote */}
          <div className={`mt-12 ${currentStep >= 4 ? 'animate-fade-in-up animation-delay-800' : 'opacity-0'}`}>
            <blockquote className="text-lg italic text-indigo-200 border-l-4 border-purple-400 pl-6 max-w-2xl mx-auto">
              "The journey of a thousand miles begins with a single step. You've just taken yours."
            </blockquote>
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Award className="w-5 h-5 text-yellow-400" />
              <p className="text-purple-300">Welcome to your sleep transformation!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingComplete;