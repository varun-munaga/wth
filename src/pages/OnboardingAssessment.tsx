import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Moon, 
  Brain, 
  Heart, 
  Clock,
  Zap,
  Target,
  CheckCircle
} from 'lucide-react';
import { loadData, saveData } from '../utils/storage';
import { AnxietyAssessment } from '../types';

interface AssessmentData {
  sleepIssues: string[];
  anxietyTriggers: string[];
  sleepGoals: string[];
  currentBedtime: string;
  avgSleepTime: string;
  stressLevel: number;
}

const OnboardingAssessment: React.FC = () => {
  const [formData, setFormData] = useState<AssessmentData>({
    sleepIssues: [],
    anxietyTriggers: [],
    sleepGoals: [],
    currentBedtime: '22:00',
    avgSleepTime: '6-7',
    stressLevel: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const data = loadData();

  const sleepIssuesOptions = [
    { id: 'falling_asleep', label: 'Difficulty falling asleep', icon: Clock },
    { id: 'staying_asleep', label: 'Waking up frequently', icon: Moon },
    { id: 'early_waking', label: 'Waking up too early', icon: Clock },
    { id: 'restless', label: 'Restless, tossing and turning', icon: Zap },
    { id: 'nightmares', label: 'Bad dreams or nightmares', icon: Brain },
    { id: 'racing_thoughts', label: 'Racing thoughts at bedtime', icon: Brain }
  ];

  const anxietyTriggersOptions = [
    { id: 'work_school', label: 'Work or school stress' },
    { id: 'relationships', label: 'Relationship concerns' },
    { id: 'health', label: 'Health worries' },
    { id: 'finances', label: 'Financial stress' },
    { id: 'future', label: 'Uncertainty about the future' },
    { id: 'social', label: 'Social situations' },
    { id: 'perfectionism', label: 'Perfectionism' },
    { id: 'family', label: 'Family issues' }
  ];

  const sleepGoalsOptions = [
    { id: 'fall_asleep_faster', label: 'Fall asleep more quickly', icon: Clock },
    { id: 'sleep_through', label: 'Sleep through the night', icon: Moon },
    { id: 'wake_refreshed', label: 'Wake up feeling refreshed', icon: Zap },
    { id: 'reduce_anxiety', label: 'Reduce bedtime anxiety', icon: Heart },
    { id: 'better_routine', label: 'Develop a better routine', icon: Target },
    { id: 'manage_stress', label: 'Better stress management', icon: Brain }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const data = loadData();
    data.assessment = {
      ...formData,
      completedAt: new Date().toISOString()
    } as AnxietyAssessment;
    saveData(data);
    
    setIsSubmitting(false);
    // Navigation will now happen only when the user clicks the "Continue to Dashboard" button
  };
  
  const handleContinue = () => {
    navigate('/onboarding/complete');
  };

  const toggleSelection = (category: keyof AssessmentData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[category] as string[];
      const isSelected = currentArray.includes(value);
      
      return {
        ...prev,
        [category]: isSelected 
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      };
    });
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.sleepIssues.length > 0;
      case 2: return formData.anxietyTriggers.length > 0;
      case 3: return formData.sleepGoals.length > 0;
      case 4: return true;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-3">What sleep challenges do you face?</h2>
              <p className="text-indigo-200 text-lg">Select all that apply - be honest, we're here to help</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sleepIssuesOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.sleepIssues.includes(option.id);
                
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleSelection('sleepIssues', option.id)}
                    className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 text-left ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 border-white/50 shadow-lg'
                        : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        isSelected ? 'bg-white/20' : 'bg-white/10'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          isSelected ? 'text-white' : 'text-indigo-200'
                        }`} />
                      </div>
                      <span className={`font-medium text-lg ${
                        isSelected ? 'text-white' : 'text-indigo-100'
                      }`}>
                        {option.label}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center animate-scale-in shadow-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-3">What triggers your anxiety?</h2>
              <p className="text-indigo-200 text-lg">Understanding your triggers helps us provide better support</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {anxietyTriggersOptions.map((option) => {
                const isSelected = formData.anxietyTriggers.includes(option.id);
                
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleSelection('anxietyTriggers', option.id)}
                    className={`group relative p-5 rounded-xl border-2 transition-all duration-300 hover:scale-105 text-left ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-white/50 shadow-lg text-white'
                        : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 text-indigo-100 hover:text-white'
                    }`}
                  >
                    <span className="font-medium">{option.label}</span>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center animate-scale-in">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-3">What are your sleep goals?</h2>
              <p className="text-indigo-200 text-lg">Let's focus on what you want to achieve</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sleepGoalsOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.sleepGoals.includes(option.id);
                
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleSelection('sleepGoals', option.id)}
                    className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 text-left ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-white/50 shadow-lg'
                        : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        isSelected ? 'bg-white/20' : 'bg-white/10'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          isSelected ? 'text-white' : 'text-indigo-200'
                        }`} />
                      </div>
                      <span className={`font-medium text-lg ${
                        isSelected ? 'text-white' : 'text-indigo-100'
                      }`}>
                        {option.label}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center animate-scale-in shadow-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-3">Tell us about your current sleep habits</h2>
              <p className="text-indigo-200 text-lg">This helps us understand your starting point</p>
            </div>

            <div className="space-y-8">
              {/* Current Bedtime */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">What time do you usually go to bed?</h3>
                <div className="grid grid-cols-4 gap-3">
                  {['21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00', '00:30'].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, currentBedtime: time }))}
                      className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                        formData.currentBedtime === time
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                          : 'bg-white/10 text-indigo-200 hover:bg-white/20'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Average Sleep Duration */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">How many hours do you typically sleep?</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['4-5', '5-6', '6-7', '7-8', '8-9', '9+'].map((duration) => (
                    <button
                      key={duration}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avgSleepTime: duration }))}
                      className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                        formData.avgSleepTime === duration
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                          : 'bg-white/10 text-indigo-200 hover:bg-white/20'
                      }`}
                    >
                      {duration} hours
                    </button>
                  ))}
                </div>
              </div>

              {/* Stress Level */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">How would you rate your overall stress level?</h3>
                <div className="px-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.stressLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, stressLevel: parseInt(e.target.value) }))}
                    className="slider w-full"
                  />
                  <div className="flex justify-between text-sm text-indigo-200 mt-2">
                    <span>Very Low (1)</span>
                    <span className="text-white font-semibold text-lg">{formData.stressLevel}/10</span>
                    <span>Very High (10)</span>
                  </div>
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-3xl animate-float animation-delay-1000"></div>
        <div className="absolute top-3/4 right-1/3 w-64 h-64 bg-pink-500 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8 max-w-4xl min-h-screen flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-down">
          <div className="flex items-center space-x-4">
            <Link 
              to="/onboarding/start" 
              className="p-3 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110 group"
            >
              <ArrowLeft className="w-6 h-6 text-indigo-200 group-hover:text-white" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Sleep Assessment</h1>
              <p className="text-indigo-200">Step 2 of 3 - Help us understand you better</p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-indigo-200">Assessment Progress</span>
            <span className="text-sm font-medium text-indigo-200">{Math.round((currentStep / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-indigo-300 text-sm">Onboarding</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-purple-300 text-sm">Assessment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white/30 rounded-full"></div>
              <span className="text-indigo-300 text-sm">Complete</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 animate-fade-in-up">
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
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <>
                    {!data.assessment ? (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn--primary btn--lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Processing assessment...</span>
                          </>
                        ) : (
                          <>
                            <Brain className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span>Complete Assessment</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleContinue}
                        className="btn btn--primary btn--lg"
                      >
                        <span>Continue to Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingAssessment;