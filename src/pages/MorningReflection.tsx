import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sun, 
  Moon,
  Heart, 
  Coffee,
  Zap,
  Battery,
  Award,
  Sparkles,
  Frown,
  ThumbsUp
} from 'lucide-react';
import { loadData, saveData } from '../utils/storage';
import { SleepEntry } from '../types';

interface MorningData {
  sleepQuality: number;
  wakeTime: string;
  nightAnxiety: boolean;
  nightAnxietyDetails: string;
  energyLevel: number;
  gratitudeNote: string;
  dreamQuality: number;
  sleepDuration: string;
}

const MorningReflection: React.FC = () => {
  const [formData, setFormData] = useState<MorningData>({
    sleepQuality: 5,
    wakeTime: '07:00',
    nightAnxiety: false,
    nightAnxietyDetails: '',
    energyLevel: 5,
    gratitudeNote: '',
    dreamQuality: 5,
    sleepDuration: '8'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const sleepQualityEmojis = ['😴', '😕', '😐', '🙂', '😊', '😌', '😎', '🤩', '✨', '🌟'];
  const energyEmojis = ['🪫', '🔋', '🔋', '🔋', '🔋', '⚡', '⚡', '⚡', '⚡', '🚀'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const entry: SleepEntry = {
      id: Date.now().toString(),
      type: 'morning' as const,
      date: new Date().toISOString().split('T')[0],
      sleepQuality: formData.sleepQuality,
      wakeTime: formData.wakeTime,
      nightAnxiety: formData.nightAnxiety,
      nightAnxietyDetails: formData.nightAnxietyDetails,
      energyLevel: formData.energyLevel,
      gratitude: formData.gratitudeNote
    };

    const data = loadData();
    data.entries = [...(data.entries || []), entry];
    saveData(data);

    navigate('/dashboard');
  };

  const getSleepQualityMessage = (quality: number) => {
    if (quality <= 2) return { text: "That was a rough night 💙", color: "text-blue-200", bg: "from-blue-500 to-blue-600" };
    if (quality <= 4) return { text: "Not the best sleep, but you made it through", color: "text-amber-200", bg: "from-amber-500 to-orange-600" };
    if (quality <= 6) return { text: "A decent night's rest 👌", color: "text-green-200", bg: "from-green-500 to-emerald-600" };
    if (quality <= 8) return { text: "Good sleep quality! 😊", color: "text-emerald-200", bg: "from-emerald-500 to-teal-600" };
    return { text: "Amazing sleep! You're glowing ✨", color: "text-purple-200", bg: "from-purple-500 to-pink-600" };
  };

  const getEnergyMessage = (energy: number) => {
    if (energy <= 2) return "Feeling pretty drained";
    if (energy <= 4) return "Low energy but hanging in there";
    if (energy <= 6) return "Moderate energy levels";
    if (energy <= 8) return "Feeling pretty good!";
    return "Fully charged and ready to go!";
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.sleepQuality > 0;
      case 2: return formData.wakeTime !== '';
      case 3: return formData.energyLevel > 0;
      case 4: return true; // Gratitude is optional
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
                <Moon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">How did you sleep last night?</h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg">This is about comfort, not performance</p>
            </div>

            <div className="space-y-8">
              {/* Sleep Quality Display */}
              <div className="text-center">
                <div className={`inline-flex items-center space-x-6 bg-gradient-to-r ${getSleepQualityMessage(formData.sleepQuality).bg} rounded-3xl px-10 py-8 shadow-2xl animate-bounce-gentle border border-white/20`}>
                  <span className="text-5xl drop-shadow-lg">{sleepQualityEmojis[formData.sleepQuality - 1] || '😐'}</span>
                  <div>
                    <div className="text-4xl font-bold text-white drop-shadow-lg">{formData.sleepQuality}/10</div>
                    <div className={`text-base font-semibold ${getSleepQualityMessage(formData.sleepQuality).color} drop-shadow-sm`}>
                      {getSleepQualityMessage(formData.sleepQuality).text}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sleep Quality Slider */}
              <div className="px-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.sleepQuality}
                    onChange={(e) => setFormData(prev => ({ ...prev, sleepQuality: parseInt(e.target.value) }))}
                    className="slider w-full h-3"
                  />
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mt-4 font-medium">
                    <span className="flex items-center space-x-2">
                      <Frown className="w-4 h-4" />
                      <span>Restless</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Refreshing</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg mb-4">
                <Sun className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">What time did you wake up?</h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg">Let's see how your sleep schedule is going</p>
            </div>
            
            <div className="max-w-lg mx-auto space-y-8">
              <div className="relative">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                  <input
                    type="time"
                    value={formData.wakeTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, wakeTime: e.target.value }))}
                    className="form-control text-center text-3xl font-bold bg-transparent border-0 focus:ring-0"
                  />
                </div>
              </div>
              
              {/* Wake Time Suggestions */}
              <div className="grid grid-cols-3 gap-3">
                {['06:00', '06:30', '07:00', '07:30', '08:00', '08:30'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, wakeTime: time }))}
                    className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 font-semibold ${
                      formData.wakeTime === time
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg border-2 border-amber-400'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>

              {/* Night Anxiety Question */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-white mb-6 text-lg">Did you experience anxiety during the night?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, nightAnxiety: false, nightAnxietyDetails: '' }))}
                    className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 border-2 ${
                      !formData.nightAnxiety
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg border-emerald-400'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <ThumbsUp className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-semibold">No, I slept peacefully</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, nightAnxiety: true }))}
                    className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 border-2 ${
                      formData.nightAnxiety
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg border-blue-400'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <Heart className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-semibold">Yes, I had some anxiety</span>
                  </button>
                </div>
                
                {formData.nightAnxiety && (
                  <div className="mt-6 animate-fade-in">
                    <textarea
                      value={formData.nightAnxietyDetails}
                      onChange={(e) => setFormData(prev => ({ ...prev, nightAnxietyDetails: e.target.value }))}
                      placeholder="What was on your mind? (optional)"
                      rows={3}
                      className="form-control resize-none bg-white/80 dark:bg-slate-700/80 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">How's your energy level this morning?</h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg">Rate how you're feeling right now</p>
            </div>

            <div className="space-y-8">
              {/* Energy Level Display */}
              <div className="text-center">
                <div className="inline-flex items-center space-x-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl px-10 py-8 shadow-2xl animate-bounce-gentle border border-white/20">
                  <span className="text-5xl drop-shadow-lg">{energyEmojis[formData.energyLevel - 1] || '🔋'}</span>
                  <div>
                    <div className="text-4xl font-bold text-white drop-shadow-lg">{formData.energyLevel}/10</div>
                    <div className="text-base font-semibold text-amber-100 drop-shadow-sm">
                      {getEnergyMessage(formData.energyLevel)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Energy Level Slider */}
              <div className="px-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.energyLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, energyLevel: parseInt(e.target.value) }))}
                    className="slider w-full h-3"
                  />
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mt-4 font-medium">
                    <span className="flex items-center space-x-2">
                      <Battery className="w-4 h-4" />
                      <span>Drained</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <Zap className="w-4 h-4" />
                      <span>Energized</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Sleep Duration */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-white mb-6 text-lg">How many hours did you sleep?</h3>
                <div className="grid grid-cols-4 gap-3">
                  {['5', '6', '7', '8', '9', '10', '11', '12'].map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, sleepDuration: hours }))}
                      className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 font-semibold border-2 ${
                        formData.sleepDuration === hours
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg border-blue-400'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      {hours}h
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">What are you grateful for today?</h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg">End on a positive note - even small things count</p>
            </div>
            
            <div className="space-y-8">
              <div className="relative">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                  <textarea
                    value={formData.gratitudeNote}
                    onChange={(e) => setFormData(prev => ({ ...prev, gratitudeNote: e.target.value }))}
                    placeholder="I'm grateful for... (optional but recommended)"
                    rows={5}
                    className="form-control resize-none bg-transparent border-0 focus:ring-0 text-lg"
                  />
                </div>
              </div>
              
              {/* Gratitude Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Someone who made me smile",
                  "A moment of peace I had",
                  "My body for getting me through",
                  "A lesson I learned yesterday",
                  "Something beautiful I noticed",
                  "A challenge I overcame"
                ].map((prompt, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      gratitudeNote: prev.gratitudeNote ? `${prev.gratitudeNote}\n\n${prompt}: ` : `${prompt}: `
                    }))}
                    className="text-left p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-800/50 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300 hover:scale-105 shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">{prompt}</span>
                    </div>
                  </button>
                ))}
              </div>

              {formData.gratitudeNote && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-800/50 animate-fade-in shadow-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <span className="font-bold text-purple-800 dark:text-purple-200 text-lg">Beautiful reflection!</span>
                  </div>
                  <p className="text-purple-700 dark:text-purple-300">
                    Gratitude practice has been shown to improve sleep quality and reduce anxiety. You're building a powerful habit! ✨
                  </p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-5xl min-h-screen flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-down">
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="p-3 hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-300 hover:scale-105 group shadow-sm border border-slate-200/50 dark:border-slate-700/50"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-1 flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <span>Morning Reflection</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">Step {currentStep} of 4 - How did you sleep?</p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-medium shadow-sm border border-amber-200/50 dark:border-amber-800/50">
            <Coffee className="w-4 h-4" />
            <span>Good morning!</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Progress</span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{Math.round((currentStep / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-200/60 dark:bg-slate-700/60 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/20 dark:border-slate-700/20 animate-fade-in-up">
            <form onSubmit={handleSubmit}>
              {renderStep()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-10 pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    currentStep === 1 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 hover:scale-105 shadow-sm'
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      !isStepValid() 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:scale-105 shadow-lg'
                    }`}
                  >
                    <span>Continue</span>
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Saving reflection...</span>
                      </>
                    ) : (
                      <>
                        <Sun className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                        <span>Complete Reflection</span>
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

export default MorningReflection;