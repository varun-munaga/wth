import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, ArrowRight, ArrowLeft } from 'lucide-react';
import { saveData, loadData } from '../utils/storage';
import { AnxietyAssessment } from '../types';
import AnxietySlider from '../components/AnxietySlider';

const OnboardingAssessment: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([5, 5, 5, 5, 5]);
  const navigate = useNavigate();
  const userData = loadData();
  
  const questions = [
    {
      id: 'sleepAnxietyLevel',
      title: 'Sleep Anxiety Level',
      question: 'How anxious do you typically feel about falling asleep?',
      description: 'This includes worry about not getting enough sleep, lying awake, or sleep-related fears.'
    },
    {
      id: 'anxietyFrequency',
      title: 'Frequency',
      question: 'How often do you experience sleep-related anxiety?',
      description: '1 = Never, 10 = Every single night'
    },
    {
      id: 'sleepQuality',
      title: 'Sleep Quality',
      question: 'How would you rate your overall sleep quality recently?',
      description: 'Focus on how rested you feel, not how long you sleep.'
    },
    {
      id: 'stressLevel',
      title: 'Daily Stress',
      question: 'What\'s your general stress level during the day?',
      description: 'Daily stress often impacts nighttime anxiety about sleep.'
    },
    {
      id: 'previousHelp',
      title: 'Previous Support',
      question: 'How helpful have previous sleep solutions been for you?',
      description: '1 = Made things worse, 5 = No change, 10 = Very helpful'
    }
  ];
  
  const currentQ = questions[currentQuestion];
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Save assessment and complete onboarding
      const assessment: AnxietyAssessment = {
        sleepAnxietyLevel: answers[0],
        anxietyFrequency: answers[1],
        sleepQuality: answers[2],
        stressLevel: answers[3],
        previousHelp: answers[4]
      };
      
      saveData({ assessment });
      navigate('/onboarding/complete');
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      navigate('/onboarding');
    }
  };
  
  const updateAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-40 h-40 bg-indigo-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-32 h-32 bg-purple-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-36 h-36 bg-blue-400 rounded-full blur-2xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-28 h-28 bg-pink-400 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>
      
      <div className="container mx-auto px-6 py-16 max-w-4xl relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-6 mb-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl blur-lg opacity-50"></div>
                <div className="relative p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl">
                  <Moon className="text-white" size={40} />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white mb-2">SleepSense AI</h1>
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mx-auto"></div>
              </div>
            </div>
            <h2 className="text-5xl font-bold mb-8 text-white leading-tight">Sleep Anxiety Assessment</h2>
            <p className="text-xl text-indigo-200 max-w-2xl mx-auto leading-relaxed">
              Help us understand your sleep anxiety patterns so we can provide personalized support.
            </p>
          </div>
          
          {/* Progress */}
          <div className="mb-12">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
              <div className="flex justify-between text-lg text-indigo-200 mb-4">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-indigo-400 to-purple-400 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Question */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 mb-12">
            <h3 className="text-2xl font-semibold text-indigo-300 mb-4">
              {currentQ.title}
            </h3>
            <h4 className="text-3xl font-bold mb-6 text-white">
              {currentQ.question}
            </h4>
            <p className="text-lg text-indigo-200 mb-10 leading-relaxed">
              {currentQ.description}
            </p>
            
            <AnxietySlider
              value={answers[currentQuestion]}
              onChange={updateAnswer}
              label=""
              darkMode={true}
            />
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between gap-8">
            <button
              onClick={handlePrevious}
              className="flex items-center space-x-3 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-indigo-200 transition-all duration-200 text-lg border border-white/30 backdrop-blur-sm"
            >
              <ArrowLeft size={24} />
              <span>Previous</span>
            </button>
            
            <button
              onClick={handleNext}
              className="flex items-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold transition-all duration-200 text-lg shadow-2xl hover:shadow-3xl"
            >
              <span>{currentQuestion < questions.length - 1 ? 'Next' : 'Complete'}</span>
              <ArrowRight size={24} />
            </button>
          </div>
          
          {/* Encouragement */}
          {userData.user && (
            <div className="text-center mt-12 p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl">
              <p className="text-lg text-indigo-200">
                You're doing great, {userData.user.name}! These questions help us provide personalized support for your sleep anxiety.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingAssessment;