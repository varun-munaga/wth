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

  const sleepQualityEmojis = ['😴', '😪', '😔', '😌', '🙂', '😊', '😄', '😁', '🤩', '✨'];
  const energyEmojis = ['🔌', '🪫', '🔋', '📶', '💡', '⚡', '💪', '🔆', '🌞', '🚀'];

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
    
    // Save to entries
    if (!data.entries) {
      data.entries = [];
    }
    data.entries = [entry, ...(data.entries || [])];
    
    // Also save to sleepEntries for consistency
    if (!data.sleepEntries) {
      data.sleepEntries = [];
    }
    data.sleepEntries = [entry, ...(data.sleepEntries || [])];
    
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
      case 4: return true; // Gratitude note is optional
      default: return false;
    }
  };
  
  const renderStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg mb-4">
                <Moon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">How did you sleep last night?</h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg">Rate the quality of your sleep</p>
            </div>

            <div className="space-y-8">
              {/* Sleep Quality Display */}
              <div className="text-center">
                <div className={`inline-flex items-center space-x-6 bg-gradient-to-r ${getSleepQualityMessage(formData.sleepQuality).bg} rounded-3xl px-10 py-8 shadow-2xl animate-bounce-gentle border border-white/20`}>
                  <span className="text-5xl drop-shadow-lg">{sleepQualityEmojis[formData.sleepQuality - 1] || '😴'}</span>
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
                      <span>Poor</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Excellent</span>
                    </span>
                  </div>
                </div>
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

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg mb-4">
                <Sun className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">What time did you wake up?</h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg">Select your wake-up time</p>
            </div>

            <div className="space-y-8">
              {/* Wake Time Input */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex justify-center">
                  <input
                    type="time"
                    value={formData.wakeTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, wakeTime: e.target.value }))}
                    className="form-control text-2xl font-bold text-center bg-white/80 dark:bg-slate-700/80 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 p-4 rounded-xl"
                  />
                </div>
              </div>

              {/* Suggested Times */}
              <div className="px-4">
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4">Suggested times:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30'].map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, wakeTime: time }))}
                      className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                        formData.wakeTime === time
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                      }`}
                    >
                      <span className="text-sm font-semibold">{time}</span>
                    </button>
                  ))}
                </div>
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
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">What are you grateful for today?</h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg">Share something positive (optional)</p>
            </div>

            <div className="space-y-8">
              {/* Gratitude Note */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                <textarea
                  value={formData.gratitudeNote}
                  onChange={(e) => setFormData(prev => ({ ...prev, gratitudeNote: e.target.value }))}
                  placeholder="I'm grateful for..."
                  rows={5}
                  className="form-control resize-none bg-white/80 dark:bg-slate-700/80 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 w-full"
                />
              </div>

              {/* Gratitude Suggestions */}
              <div className="px-4">
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4">Suggestions:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "I'm grateful for the peaceful sleep I had",
                    "I'm grateful for the opportunity to start fresh today",
                    "I'm grateful for my health and well-being",
                    "I'm grateful for the people in my life"
                  ].map(suggestion => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, gratitudeNote: suggestion }))}
                      className="p-3 rounded-xl transition-all duration-300 hover:scale-105 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 text-left"
                    >
                      <span className="text-sm">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link to="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="ml-4 text-xl font-bold text-slate-800 dark:text-white">Morning Reflection</h1>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 pt-6">
        <div className="bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
          <span>Sleep</span>
          <span>Wake Time</span>
          <span>Energy</span>
          <span>Gratitude</span>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          {renderStep(currentStep)}

          {/* Navigation Buttons */}
          <div className="mt-12 flex justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300"
              >
                Previous
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isStepValid()
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isSubmitting
                    ? 'bg-slate-400 dark:bg-slate-700 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Complete Reflection'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MorningReflection;