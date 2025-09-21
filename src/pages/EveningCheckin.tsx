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
  Check,
  Mic,
  MicOff,
  Sparkles,
  Shield
} from 'lucide-react';
import { loadData, saveData } from '../utils/storage';

interface FormData {
  anxietyLevel: number;
  bedtime: string;
  triggers: string[];
  notes: string;
  voiceNote: string;
}

const EveningCheckin: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    anxietyLevel: 5,
    bedtime: '22:00',
    triggers: [],
    notes: '',
    voiceNote: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const anxietyEmojis = ['😴', '😊', '😐', '😟', '😰', '😨', '😱', '🆘', '💔', '🔥'];
  
  const triggerOptions = [
    { id: 'academic', label: 'Academic Stress', icon: BookOpen, color: 'from-blue-500 to-blue-600', description: 'Exams, assignments, grades' },
    { id: 'work', label: 'Work Pressure', icon: Briefcase, color: 'from-purple-500 to-purple-600', description: 'Deadlines, meetings, projects' },
    { id: 'relationships', label: 'Relationships', icon: Users, color: 'from-pink-500 to-pink-600', description: 'Family, friends, romantic' },
    { id: 'health', label: 'Health Worries', icon: Heart, color: 'from-red-500 to-red-600', description: 'Physical or mental health concerns' },
    { id: 'financial', label: 'Financial Stress', icon: DollarSign, color: 'from-green-500 to-green-600', description: 'Money, bills, future security' },
    { id: 'social_media', label: 'Social Media/News', icon: Smartphone, color: 'from-indigo-500 to-indigo-600', description: 'Overwhelming information, FOMO' },
    { id: 'overthinking', label: 'Overthinking', icon: Brain, color: 'from-orange-500 to-orange-600', description: 'Racing thoughts, rumination' },
    { id: 'sleep_fear', label: 'Fear of Not Sleeping', icon: Bed, color: 'from-slate-500 to-slate-600', description: 'Anxiety about sleep itself' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const entry = {
      id: Date.now().toString(),
      type: 'evening',
      date: new Date().toISOString().split('T')[0],
      anxietyLevel: formData.anxietyLevel,
      bedtime: formData.bedtime,
      triggers: formData.triggers,
      notes: formData.notes,
      voiceNote: formData.voiceNote,
      timestamp: new Date().toISOString()
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
        setFormData(prev => ({ ...prev, notes: prev.notes + ' ' + transcript }));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    }
  };

  const getAnxietyMessage = (level: number) => {
    if (level <= 2) return { text: "You're feeling quite calm tonight! 😌", color: "text-emerald-200" };
    if (level <= 4) return { text: "A bit of worry is normal 💙", color: "text-blue-200" };
    if (level <= 6) return { text: "Moderate anxiety - let's work through this 🫂", color: "text-amber-200" };
    if (level <= 8) return { text: "High anxiety - you're not alone in this 💜", color: "text-purple-200" };
    return { text: "Very high anxiety - let's focus on immediate comfort 🤗", color: "text-pink-200" };
  };

  const getAnxietyColor = (level: number) => {
    if (level <= 2) return 'from-emerald-500 to-green-600';
    if (level <= 4) return 'from-blue-500 to-cyan-600';
    if (level <= 6) return 'from-amber-500 to-orange-600';
    if (level <= 8) return 'from-orange-500 to-red-600';
    return 'from-red-500 to-pink-600';
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.anxietyLevel > 0;
      case 2: return formData.bedtime !== '';
      case 3: return true; // Triggers are optional
      case 4: return true; // Notes are optional
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">How anxious are you about sleeping tonight?</h2>
              <p className="text-indigo-200">Be honest - there are no wrong answers</p>
            </div>

            <div className="space-y-6">
              {/* Anxiety Level Display */}
              <div className="text-center">
                <div className={`inline-flex items-center space-x-4 bg-gradient-to-r ${getAnxietyColor(formData.anxietyLevel)} rounded-2xl px-8 py-6 shadow-lg animate-bounce-gentle`}>
                  <span className="text-4xl">{anxietyEmojis[formData.anxietyLevel - 1] || '😐'}</span>
                  <div>
                    <div className="text-3xl font-bold text-white">{formData.anxietyLevel}/10</div>
                    <div className={`text-sm font-medium ${getAnxietyMessage(formData.anxietyLevel).color}`}>
                      {getAnxietyMessage(formData.anxietyLevel).text}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Anxiety Slider */}
              <div className="px-6">
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.anxietyLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, anxietyLevel: parseInt(e.target.value) }))}
                    className="slider w-full"
                    style={{
                      background: `linear-gradient(to right, ${getAnxietyColor(formData.anxietyLevel).replace('from-', '').replace(' to-', ', ')} 0%, ${getAnxietyColor(formData.anxietyLevel).replace('from-', '').replace(' to-', ', ')} ${(formData.anxietyLevel / 10) * 100}%, rgba(255,255,255,0.2) ${(formData.anxietyLevel / 10) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm text-indigo-200 mt-3">
                  <span className="flex items-center space-x-1">
                    <span>😴</span>
                    <span>Very Calm</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>😰</span>
                    <span>Very Anxious</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
                <Moon className="w-8 h-8 text-purple-400" />
                <span>When do you plan to go to bed?</span>
              </h2>
              <p className="text-indigo-200">Set a realistic bedtime goal for tonight</p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="time"
                  value={formData.bedtime}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedtime: e.target.value }))}
                  className="form-control text-center text-2xl font-bold bg-white/20 border-white/30 text-white"
                />
                <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse"></div>
              </div>
              
              {/* Bedtime Suggestions */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {['21:30', '22:00', '22:30', '23:00', '23:30', '00:00'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, bedtime: time }))}
                    className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                      formData.bedtime === time
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white/10 text-indigo-200 hover:bg-white/20'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">What's making you anxious tonight?</h2>
              <p className="text-indigo-200">Select all that apply - it's okay to choose multiple things</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {triggerOptions.map((trigger) => {
                const Icon = trigger.icon;
                const isSelected = formData.triggers.includes(trigger.id);
                
                return (
                  <button
                    key={trigger.id}
                    type="button"
                    onClick={() => toggleTrigger(trigger.id)}
                    className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 text-left ${
                      isSelected
                        ? `bg-gradient-to-r ${trigger.color} border-white/50 shadow-lg`
                        : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl ${
                        isSelected ? 'bg-white/20' : 'bg-white/10'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          isSelected ? 'text-white' : 'text-indigo-200'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-1 ${
                          isSelected ? 'text-white' : 'text-indigo-100'
                        }`}>
                          {trigger.label}
                        </h3>
                        <p className={`text-sm ${
                          isSelected ? 'text-white/80' : 'text-indigo-300'
                        }`}>
                          {trigger.description}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center animate-scale-in shadow-lg">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {formData.triggers.length > 0 && (
              <div className="text-center animate-fade-in">
                <p className="text-indigo-200 text-sm">
                  Selected {formData.triggers.length} trigger{formData.triggers.length !== 1 ? 's' : ''} - you're being very self-aware! 💙
                </p>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Anything else on your mind?</h2>
              <p className="text-indigo-200">Share whatever feels important - this is your safe space</p>
            </div>
            
            <div className="relative">
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="I'm feeling anxious because... (optional)"
                rows={6}
                className="form-control resize-none bg-white/20 border-white/30 text-white placeholder-indigo-300"
              />
              
              {/* Enhanced Voice Input Button */}
              <button
                type="button"
                onClick={startVoiceRecording}
                disabled={isListening}
                className={`absolute bottom-6 right-6 p-3 rounded-xl transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse shadow-lg' 
                    : 'bg-white/20 text-indigo-200 hover:bg-white/30 hover:text-white hover:scale-110'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
            
            {isListening && (
              <div className="text-center animate-fade-in">
                <div className="inline-flex items-center space-x-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">🎤 Listening... Speak your thoughts</span>
                </div>
              </div>
            )}

            {formData.notes && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 animate-fade-in">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-200">Your thoughts are safe here</span>
                </div>
                <p className="text-xs text-indigo-300">
                  Thank you for sharing. Remember, acknowledging your feelings is the first step to managing them.
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full blur-3xl animate-float animation-delay-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-500 rounded-full blur-3xl animate-float animation-delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-72 h-72 bg-pink-500 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-4xl min-h-screen flex flex-col">
        
        {/* Enhanced Header */}
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
              <p className="text-indigo-200">Step {currentStep} of 4 - Take your time</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Clock className="w-4 h-4 text-indigo-300" />
              <span className="text-indigo-200 text-sm font-medium">
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3 py-2 rounded-full text-sm">
              <Shield className="w-3 h-3" />
              <span>🔒 Private</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-indigo-200">Progress</span>
            <span className="text-sm font-medium text-indigo-200">{Math.round((currentStep / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-2xl glass-card rounded-3xl p-8 animate-fade-in-up border border-white/20">
            <form onSubmit={handleSubmit}>
              {renderStep()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/20">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`btn btn--secondary ${
                    currentStep === 1 ? 'btn:disabled' : ''
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className={`btn btn--primary ${
                      !isStepValid() ? 'btn:disabled' : ''
                    }`}
                  >
                    <span>Continue</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn--primary btn--lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Saving your check-in...</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span>Complete Check-in</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EveningCheckin;