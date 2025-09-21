import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Moon, 
  Clock, 
  Heart, 
  BookOpen,
  Smartphone,
  DollarSign,
  Briefcase,
  Users,
  Brain,
  Bed,
  Plus,
  Check,
  Mic,
  MicOff
} from 'lucide-react';
import { loadData, saveData } from '../utils/storage';

const EveningCheckin: React.FC = () => {
  const [formData, setFormData] = useState({
    anxietyLevel: 5,
    bedtime: '22:00',
    triggers: [] as string[],
    notes: '',
    voiceNote: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  const anxietyEmojis = ['😴', '😊', '😐', '😟', '😰', '😨', '😱', '🆘', '💔', '🔥'];
  
  const triggerOptions = [
    { id: 'academic', label: 'Academic Stress', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { id: 'work', label: 'Work Pressure', icon: Briefcase, color: 'from-purple-500 to-purple-600' },
    { id: 'relationships', label: 'Relationships', icon: Users, color: 'from-pink-500 to-pink-600' },
    { id: 'health', label: 'Health Worries', icon: Heart, color: 'from-red-500 to-red-600' },
    { id: 'financial', label: 'Financial Stress', icon: DollarSign, color: 'from-green-500 to-green-600' },
    { id: 'social_media', label: 'Social Media/News', icon: Smartphone, color: 'from-indigo-500 to-indigo-600' },
    { id: 'overthinking', label: 'Overthinking', icon: Brain, color: 'from-orange-500 to-orange-600' },
    { id: 'sleep_fear', label: 'Fear of Not Sleeping', icon: Bed, color: 'from-slate-500 to-slate-600' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const entry = {
      id: Date.now().toString(),
      type: 'evening',
      date: new Date().toISOString().split('T')[0],
      anxietyLevel: formData.anxietyLevel,
      bedtime: formData.bedtime,
      triggers: formData.triggers,
      notes: formData.notes,
      voiceNote: formData.voiceNote,
      timestamp: new Date()
    };

    const data = loadData();
    data.entries = [...(data.entries || []), entry];
    saveData(data);

    navigate('/dashboard');
  };

  const toggleTrigger = (triggerId: string) => {
    setFormData(prev => ({
      ...prev,
      triggers: prev.triggers.includes(triggerId)
        ? prev.triggers.filter(t => t !== triggerId)
        : [...prev.triggers, triggerId]
    }));
  };

  const startVoiceRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setFormData(prev => ({ ...prev, notes: transcript }));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    }
  };

  const getAnxietyMessage = (level: number) => {
    if (level <= 2) return "You're feeling quite calm tonight! 😌";
    if (level <= 4) return "A bit of worry is normal 💙";
    if (level <= 6) return "Moderate anxiety - let's work through this 🫂";
    if (level <= 8) return "High anxiety - you're not alone in this 💜";
    return "Very high anxiety - let's focus on immediate comfort 🤗";
  };

  const getAnxietyColor = (level: number) => {
    if (level <= 2) return 'from-emerald-500 to-green-600';
    if (level <= 4) return 'from-blue-500 to-cyan-600';
    if (level <= 6) return 'from-amber-500 to-orange-600';
    if (level <= 8) return 'from-orange-500 to-red-600';
    return 'from-red-500 to-pink-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse animation-delay-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-4xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-down">
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="p-3 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110 group"
            >
              <ArrowLeft className="w-6 h-6 text-indigo-200 group-hover:text-white" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Evening Check-in</h1>
              <p className="text-indigo-200">How are you feeling about sleep tonight?</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <Clock className="w-4 h-4 text-indigo-300" />
            <span className="text-indigo-200 text-sm font-medium">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Anxiety Level Section */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">How anxious are you about sleeping tonight?</h2>
                <p className="text-indigo-200">Move the slider to express how you're feeling</p>
              </div>

              <div className="space-y-6">
                {/* Anxiety Level Display */}
                <div className="text-center">
                  <div className={`inline-flex items-center space-x-3 bg-gradient-to-r ${getAnxietyColor(formData.anxietyLevel)} rounded-2xl px-6 py-4 shadow-lg animate-bounce-gentle`}>
                    <span className="text-3xl">{anxietyEmojis[formData.anxietyLevel - 1] || '😐'}</span>
                    <div>
                      <div className="text-2xl font-bold text-white">{formData.anxietyLevel}/10</div>
                      <div className="text-white/90 text-sm">{getAnxietyMessage(formData.anxietyLevel)}</div>
                    </div>
                  </div>
                </div>

                {/* Anxiety Slider */}
                <div className="px-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.anxietyLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, anxietyLevel: parseInt(e.target.value) }))}
                    className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider-thumb transition-all duration-300"
                  />
                  <div className="flex justify-between text-xs text-indigo-200 mt-2">
                    <span>Calm 😴</span>
                    <span>Very Anxious 😰</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bedtime Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Moon className="w-6 h-6 text-purple-400" />
                <span>When do you plan to go to bed?</span>
              </h2>
              <div className="relative">
                <input
                  type="time"
                  value={formData.bedtime}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedtime: e.target.value }))}
                  className="w-full p-4 bg-white/20 border border-white/30 rounded-xl text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 hover:bg-white/30"
                />
              </div>
            </div>

            {/* Triggers Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">What's making you anxious tonight?</h2>
              <p className="text-indigo-200 text-sm mb-4">Select all that apply (it's okay if it's multiple things!)</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {triggerOptions.map((trigger) => {
                  const Icon = trigger.icon;
                  const isSelected = formData.triggers.includes(trigger.id);
                  
                  return (
                    <button
                      key={trigger.id}
                      type="button"
                      onClick={() => toggleTrigger(trigger.id)}
                      className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                        isSelected
                          ? `bg-gradient-to-r ${trigger.color} border-white/50 shadow-lg`
                          : 'bg-white/10 border-white/20 hover:bg-white/20'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-indigo-200'}`} />
                        <span className={`text-sm font-medium text-center ${isSelected ? 'text-white' : 'text-indigo-200'}`}>
                          {trigger.label}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center animate-scale-in">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Anything else on your mind?</h2>
              <div className="relative">
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Share what's on your mind... (optional)"
                  rows={4}
                  className="w-full p-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-indigo-300 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 hover:bg-white/30"
                />
                
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={startVoiceRecording}
                  disabled={isListening}
                  className={`absolute bottom-4 right-4 p-2 rounded-lg transition-all duration-300 ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-white/20 text-indigo-200 hover:bg-white/30 hover:text-white'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>
              {isListening && (
                <div className="text-center">
                  <p className="text-indigo-200 text-sm animate-pulse">🎤 Listening... Speak now</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-purple-700 disabled:to-pink-800 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-2xl hover:shadow-3xl flex items-center justify-center space-x-3 group"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving your check-in...</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <span>Complete Evening Check-in</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes scale-in {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fade-in-down { animation: fade-in-down 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-bounce-gentle { animation: bounce-gentle 3s ease-in-out infinite; }
        .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
        
        .animation-delay-0 { animation-delay: 0s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(139, 92, 246, 0.3);
          border: 2px solid white;
          transition: all 0.3s ease;
        }
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 12px rgba(139, 92, 246, 0.4);
        }
        .slider-thumb::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(139, 92, 246, 0.3);
          border: 2px solid white;
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default EveningCheckin;