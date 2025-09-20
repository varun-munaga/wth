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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Moon className="text-orange-400" size={32} />
              <h1 className="text-2xl font-bold">SleepSense AI</h1>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Sleep Anxiety Assessment</h2>
            <p className="text-gray-300">
              Help me understand your sleep anxiety patterns
            </p>
          </div>
          
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Question */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">
              {currentQ.title}
            </h3>
            <h4 className="text-xl font-bold mb-3">
              {currentQ.question}
            </h4>
            <p className="text-gray-300 text-sm mb-6">
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
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Previous</span>
            </button>
            
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-semibold transition-colors"
            >
              <span>{currentQuestion < questions.length - 1 ? 'Next' : 'Complete'}</span>
              <ArrowRight size={20} />
            </button>
          </div>
          
          {/* Encouragement */}
          {userData.user && (
            <div className="text-center mt-8 p-4 bg-purple-900/30 rounded-xl">
              <p className="text-sm text-gray-300">
                You're doing great, {userData.user.name}! These questions help me provide personalized support for your sleep anxiety.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingAssessment;