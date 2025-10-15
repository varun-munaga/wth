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

  const anxietyEmojis = ['😌', '🙂', '😊', '🤔', '😕', '😟', '😥', '😓', '😖', '😣'];
  
  const triggerOptions = [
    { id: 'academic', label: 'Academic Stress', icon: BookOpen, color: 'from-blue-500 to-blue-600', description: 'Exams, assignments, grades' },
    { id: 'work', label: 'Work Pressure', icon: Briefcase, color: 'from-purple-500 to-purple-600', description: 'Deadlines, meetings, projects' },
    { id: 'relationships', label: 'Relationships', icon: Users, color: 'from-pink-500 to-pink-600', description: 'Family, friends, romantic' },
    { id: 'health', label: 'Health Worries', icon: Heart, color: 'from-red-500 to-red-600', description: 'Physical or mental health concerns' },
    { id: 'financial', label: 'Financial Stress', icon: DollarSign, color: 'from-green-500 to-green-600', description: 'Money, bills, expenses' },
    { id: 'technology', label: 'Digital Overload', icon: Smartphone, color: 'from-indigo-500 to-indigo-600', description: 'Social media, screen time' }
  ];

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Create a new entry
    const newEntry = {
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
    
    // Load existing data
    const appData = loadData();
    
    // Ensure sleepEntries array exists
    if (!appData.sleepEntries) {
      appData.sleepEntries = [];
    }
    
    // Add new entry
    appData.sleepEntries = [newEntry, ...appData.sleepEntries];
    
    // Also add to entries for backward compatibility
    if (!appData.entries) {
      appData.entries = [];
    }
    appData.entries = [newEntry, ...appData.entries];
    
    // Save updated data
    saveData(appData);
    
    // Navigate to dashboard
    navigate('/dashboard');
  };
  
  const toggleTrigger = (triggerId: string) => {
    setFormData(prev => {
      if (prev.triggers.includes(triggerId)) {
        return {
          ...prev,
          triggers: prev.triggers.filter(id => id !== triggerId)
        };
      } else {
        return {
          ...prev,
          triggers: [...prev.triggers, triggerId]
        };
      }
    });
  };
  
  const startVoiceRecording = () => {
    if (!isListening) {
      setIsListening(true);
      handleVoiceInput();
    } else {
      setIsListening(false);
    }
  };
  
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser. Try Chrome or Edge.');
      return;
    }
    
    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      
      setFormData(prev => ({
        ...prev,
        voiceNote: transcript
      }));
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };
  
  const getAnxietyMessage = (level: number) => {
    if (level <= 3) return 'Low anxiety - Great job managing stress today!';
    if (level <= 6) return 'Moderate anxiety - Take some deep breaths before bed';
    return 'High anxiety - Consider a calming activity before sleep';
  };
  
  const getAnxietyColor = (level: number) => {
    if (level <= 3) return 'from-green-500 to-teal-500';
    if (level <= 6) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-rose-500';
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
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
                <Brain className="w-8 h-8 text-purple-400" />
                <span>How's your anxiety level tonight?</span>
              </h2>
              <p className="text-indigo-200">Rate your current anxiety level before bed</p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-r rounded-2xl p-6 shadow-lg" style={{backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`}}>
                <div className={`bg-gradient-to-r ${getAnxietyColor(formData.anxietyLevel)}`}>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.anxietyLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, anxietyLevel: parseInt(e.target.value) }))}
                    className="w-full h-4 bg-transparent rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <div className="flex justify-between items-center">
                <span className="text-green-400 font-medium">Low</span>
                <span className="text-yellow-400 font-medium">Medium</span>
                <span className="text-red-400 font-medium">High</span>
              </div>
              
              <div className="mt-6">
                <div className="text-5xl mb-2">{anxietyEmojis[formData.anxietyLevel - 1]}</div>
                <div className="text-xl font-medium text-white">{formData.anxietyLevel}/10</div>
                <div className="text-indigo-200 mt-1">{getAnxietyMessage(formData.anxietyLevel)}</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-4 mt-6">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getAnxietyColor(formData.anxietyLevel)} mr-3 animate-pulse`}></div>
                <p className="text-white text-sm">
                  {formData.anxietyLevel <= 3 ? (
                    "Your anxiety is low tonight. This is a great time to reflect on what's working well for you."
                  ) : formData.anxietyLevel <= 6 ? (
                    "You're experiencing moderate anxiety. Consider some gentle breathing exercises before bed."
                  ) : (
                    "Your anxiety is high tonight. It might help to write down your thoughts or try a guided meditation."
                  )}
                </p>
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
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-4">
                <div className="flex items-start">
                  <Bed className="w-5 h-5 text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm">
                      {parseInt(formData.bedtime.split(':')[0]) < 22 
                        ? "Great choice! Going to bed before 10 PM can help optimize your sleep quality."
                        : parseInt(formData.bedtime.split(':')[0]) < 23 
                          ? "A good bedtime choice. Try to maintain consistency with this time."
                          : "Consider if you can move your bedtime earlier for better sleep quality."}
                    </p>
                    <p className="text-indigo-200 text-xs mt-2">
                      Consistent sleep schedules help regulate your body's internal clock.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
                <Brain className="w-8 h-8 text-purple-400" />
                <span>What triggered your anxiety today?</span>
              </h2>
              <p className="text-indigo-200">Select all that apply (optional)</p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-3">
                {triggerOptions.map((trigger) => {
                  const Icon = trigger.icon;
                  const isSelected = formData.triggers.includes(trigger.id);
                  
                  return (
                    <button
                      key={trigger.id}
                      type="button"
                      onClick={() => toggleTrigger(trigger.id)}
                      className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 text-left ${
                        isSelected 
                          ? `bg-gradient-to-r ${trigger.color} text-white` 
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-white/20' : 'bg-white/10'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="ml-3">
                          <div className="font-medium">{trigger.label}</div>
                          <div className="text-xs opacity-80">{trigger.description}</div>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5 ml-auto" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {formData.triggers.length > 0 && (
                <div className="mt-6 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-4">
                  <div className="flex items-start">
                    <Shield className="w-5 h-5 text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm">
                        You've identified {formData.triggers.length} trigger{formData.triggers.length !== 1 ? 's' : ''}. 
                        Recognizing your triggers is the first step to managing them.
                      </p>
                      <p className="text-indigo-200 text-xs mt-2">
                        Tomorrow, we'll help you develop strategies to address these specific areas.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
                <BookOpen className="w-8 h-8 text-purple-400" />
                <span>Any notes about today?</span>
              </h2>
              <p className="text-indigo-200">Add any thoughts or reflections (optional)</p>
            </div>
            
            <div className="max-w-md mx-auto">
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Write your thoughts here..."
                className="form-control h-32 bg-white/20 border-white/30 text-white"
              ></textarea>
              
              <div className="mt-4">
                <button
                  type="button"
                  onClick={startVoiceRecording}
                  className={`w-full p-4 rounded-xl transition-all duration-300 flex items-center justify-center ${
                    isListening 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-5 h-5 mr-2" />
                      <span>Stop Recording</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" />
                      <span>Record Voice Note</span>
                    </>
                  )}
                </button>
              </div>
              
              {formData.voiceNote && (
                <div className="mt-4 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-4">
                  <div className="flex items-start">
                    <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium mb-1">Your Voice Note:</p>
                      <p className="text-indigo-200 text-sm italic">"{formData.voiceNote}"</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="btn btn--ghost"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Back</span>
          </button>
          
          <div className="text-sm font-medium text-indigo-200">
            Step {currentStep} of 4
          </div>
        </div>
        
        <div className="max-w-md mx-auto">
          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/10 rounded-full mb-8">
            <div 
              className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
          
          {/* Step Content */}
          {renderStep()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              className={`btn btn--ghost ${currentStep === 1 ? 'invisible' : ''}`}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back</span>
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
                type="button"
                onClick={handleSubmit}
                className="btn btn--primary"
              >
                <span>Complete Check-in</span>
                <Check className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EveningCheckin;