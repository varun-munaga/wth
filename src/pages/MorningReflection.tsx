import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Battery } from 'lucide-react';
import { saveData, loadData } from '../utils/storage';
import { SleepEntry } from '../types';
import { format } from 'date-fns';

interface MorningReflectionProps {
  darkMode: boolean;
}

const MorningReflection: React.FC<MorningReflectionProps> = ({ darkMode }) => {
  const [sleepQuality, setSleepQuality] = useState(5);
  const [wakeTime, setWakeTime] = useState('07:00');
  const [nightAnxiety, setNightAnxiety] = useState<boolean | null>(null);
  const [nightAnxietyDetails, setNightAnxietyDetails] = useState('');
  const [energyLevel, setEnergyLevel] = useState(5);
  const [gratitude, setGratitude] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const data = loadData();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const entry: SleepEntry = {
      id: `morning-${today}`,
      date: today,
      type: 'morning',
      sleepQuality,
      wakeTime,
      energyLevel,
      nightAnxiety,
      nightAnxietyDetails: nightAnxiety && nightAnxietyDetails.trim() ? nightAnxietyDetails.trim() : undefined,
      gratitude: gratitude.trim() || undefined
    };
    
    // Remove any existing morning entry for today
    const updatedEntries = data.sleepEntries.filter(
      e => !(e.date === today && e.type === 'morning')
    );
    updatedEntries.push(entry);
    
    saveData({ sleepEntries: updatedEntries });
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    navigate('/dashboard');
  };
  
  const getSleepQualityEmoji = (quality: number) => {
    if (quality <= 3) return '😴';
    if (quality <= 5) return '😐';
    if (quality <= 7) return '🙂';
    return '😊';
  };
  
  const getEnergyEmoji = (level: number) => {
    const batteryLevels = ['🪫', '🪫', '🔋', '🔋', '🔋', '🔋', '🔋', '🔋', '🔋', '🔋'];
    return batteryLevels[level - 1] || '🔋';
  };
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-8`}>
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Morning Reflection
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {format(new Date(), 'EEEE, MMMM d')}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sleep Quality */}
          <div className={`p-6 rounded-2xl ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border shadow-sm`}>
            <label className={`block text-lg font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              How did you sleep? (Comfort, not performance)
            </label>
            
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">
                {getSleepQualityEmoji(sleepQuality)}
              </div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                {sleepQuality}/10
              </div>
            </div>
            
            <input
              type="range"
              min="1"
              max="10"
              value={sleepQuality}
              onChange={(e) => setSleepQuality(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #9B59B6 0%, #9B59B6 ${(sleepQuality - 1) * 11.1}%, #e2e8f0 ${(sleepQuality - 1) * 11.1}%, #e2e8f0 100%)`
              }}
            />
            
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Restless</span>
              <span>Peaceful</span>
            </div>
          </div>
          
          {/* Wake Time */}
          <div className={`p-6 rounded-2xl ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border shadow-sm`}>
            <label className={`block text-lg font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              What time did you wake up?
            </label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className={`w-full p-4 rounded-xl border text-lg text-center ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-200 text-gray-800'
              }`}
            />
          </div>
          
          {/* Night Anxiety */}
          <div className={`p-6 rounded-2xl ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border shadow-sm`}>
            <label className={`block text-lg font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Did you experience anxiety during the night?
            </label>
            
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => setNightAnxiety(false)}
                className={`flex-1 p-3 rounded-xl border-2 transition-colors ${
                  nightAnxiety === false
                    ? darkMode
                      ? 'border-green-500 bg-green-900/30 text-green-200'
                      : 'border-green-500 bg-green-50 text-green-700'
                    : darkMode
                      ? 'border-gray-600 bg-gray-700 text-gray-300'
                      : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                😌 No, slept peacefully
              </button>
              
              <button
                type="button"
                onClick={() => setNightAnxiety(true)}
                className={`flex-1 p-3 rounded-xl border-2 transition-colors ${
                  nightAnxiety === true
                    ? darkMode
                      ? 'border-orange-500 bg-orange-900/30 text-orange-200'
                      : 'border-orange-500 bg-orange-50 text-orange-700'
                    : darkMode
                      ? 'border-gray-600 bg-gray-700 text-gray-300'
                      : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                😰 Yes, had anxiety
              </button>
            </div>
            
            {nightAnxiety === true && (
              <textarea
                value={nightAnxietyDetails}
                onChange={(e) => setNightAnxietyDetails(e.target.value)}
                placeholder="What kind of anxiety did you experience? (Optional)"
                rows={3}
                className={`w-full p-4 rounded-xl border resize-none ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            )}
          </div>
          
          {/* Energy Level */}
          <div className={`p-6 rounded-2xl ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border shadow-sm`}>
            <label className={`block text-lg font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              How's your energy level right now?
            </label>
            
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">
                {getEnergyEmoji(energyLevel)}
              </div>
              <div className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                {energyLevel}/10
              </div>
            </div>
            
            <input
              type="range"
              min="1"
              max="10"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #F97316 0%, #F97316 ${(energyLevel - 1) * 11.1}%, #e2e8f0 ${(energyLevel - 1) * 11.1}%, #e2e8f0 100%)`
              }}
            />
            
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Drained</span>
              <span>Energized</span>
            </div>
          </div>
          
          {/* Gratitude */}
          <div className={`p-6 rounded-2xl ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border shadow-sm`}>
            <label className={`block text-lg font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              One thing you're grateful for today ✨
            </label>
            <textarea
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="What brought you joy or peace today?"
              rows={3}
              className={`w-full p-4 rounded-xl border resize-none ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          
          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
              isSubmitting
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600'
            }`}
          >
            <Save size={20} />
            <span>{isSubmitting ? 'Saving...' : 'Start the day positively'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default MorningReflection;