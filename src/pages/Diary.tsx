import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Plus, Calendar, Clock, Heart, Battery } from 'lucide-react';
import { loadData } from '../utils/storage';
import { format, parseISO, isToday, isYesterday } from 'date-fns';

interface DiaryProps {
  darkMode: boolean;
}

const Diary: React.FC<DiaryProps> = ({ darkMode }) => {
  const [entries, setEntries] = useState(loadData().sleepEntries);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const data = loadData();
    setEntries(data.sleepEntries);
  }, []);

  const getDateEntries = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return entries.filter(entry => entry.date === dateStr);
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMM d');
  };

  const getAnxietyEmoji = (level: number) => {
    if (level <= 3) return '😌';
    if (level <= 6) return '😐';
    return '😰';
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

  const dateEntries = getDateEntries(selectedDate);
  const eveningEntry = dateEntries.find(e => e.type === 'evening');
  const morningEntry = dateEntries.find(e => e.type === 'morning');

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
              Sleep Diary
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Track your sleep journey
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div className={`p-4 rounded-2xl mb-6 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border shadow-sm`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}
              className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
            >
              ←
            </button>
            
            <div className="text-center">
              <div className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {getDateLabel(selectedDate)}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {format(selectedDate, 'MMMM d, yyyy')}
              </div>
            </div>
            
            <button
              onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
              className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
            >
              →
            </button>
          </div>
        </div>

        {/* Evening Entry */}
        <div className={`p-6 rounded-2xl mb-6 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Moon className="text-purple-400" size={20} />
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Evening Check-in
              </h3>
            </div>
            {eveningEntry ? (
              <span className={`text-sm px-2 py-1 rounded-full ${
                darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
              }`}>
                Completed
              </span>
            ) : (
              <button
                onClick={() => navigate('/diary/evening')}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                  darkMode 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            )}
          </div>

          {eveningEntry ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl mb-1">
                    {getAnxietyEmoji(eveningEntry.anxietyLevel || 0)}
                  </div>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {eveningEntry.anxietyLevel}/10
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Anxiety Level
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-1">🛏️</div>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {eveningEntry.bedtime}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Bedtime
                  </div>
                </div>
              </div>

              {eveningEntry.triggers && eveningEntry.triggers.length > 0 && (
                <div>
                  <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Triggers:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {eveningEntry.triggers.map((trigger, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs ${
                          darkMode 
                            ? 'bg-purple-900/30 text-purple-300' 
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {eveningEntry.thoughts && (
                <div>
                  <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Thoughts:
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {eveningEntry.thoughts}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Moon className="mx-auto mb-3 text-gray-400" size={32} />
              <p className="text-sm">No evening check-in recorded</p>
            </div>
          )}
        </div>

        {/* Morning Entry */}
        <div className={`p-6 rounded-2xl mb-6 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Sun className="text-orange-400" size={20} />
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Morning Reflection
              </h3>
            </div>
            {morningEntry ? (
              <span className={`text-sm px-2 py-1 rounded-full ${
                darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
              }`}>
                Completed
              </span>
            ) : (
              <button
                onClick={() => navigate('/diary/morning')}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                  darkMode 
                    ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            )}
          </div>

          {morningEntry ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl mb-1">
                    {getSleepQualityEmoji(morningEntry.sleepQuality || 0)}
                  </div>
                  <div className={`text-xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {morningEntry.sleepQuality}/10
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Sleep Quality
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-1">
                    {getEnergyEmoji(morningEntry.energyLevel || 0)}
                  </div>
                  <div className={`text-xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                    {morningEntry.energyLevel}/10
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Energy Level
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-1">⏰</div>
                  <div className={`text-xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {morningEntry.wakeTime}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Wake Time
                  </div>
                </div>
              </div>

              {morningEntry.nightAnxiety && (
                <div className={`p-3 rounded-xl ${
                  darkMode ? 'bg-orange-900/20 border border-orange-700/30' : 'bg-orange-50 border border-orange-200'
                }`}>
                  <div className={`text-sm font-medium mb-1 ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                    Night Anxiety
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-orange-200' : 'text-orange-600'}`}>
                    {morningEntry.nightAnxietyDetails || 'Experienced anxiety during the night'}
                  </p>
                </div>
              )}

              {morningEntry.gratitude && (
                <div>
                  <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Gratitude:
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {morningEntry.gratitude}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Sun className="mx-auto mb-3 text-gray-400" size={32} />
              <p className="text-sm">No morning reflection recorded</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={`p-6 rounded-2xl ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border shadow-sm`}>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/diary/evening')}
              className={`flex items-center justify-center space-x-2 p-4 rounded-xl transition-colors ${
                darkMode 
                  ? 'bg-purple-900/30 hover:bg-purple-900/50 border border-purple-700/50' 
                  : 'bg-purple-50 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <Moon className="text-purple-400" size={20} />
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Evening Check-in
              </span>
            </button>
            
            <button
              onClick={() => navigate('/diary/morning')}
              className={`flex items-center justify-center space-x-2 p-4 rounded-xl transition-colors ${
                darkMode 
                  ? 'bg-orange-900/30 hover:bg-orange-900/50 border border-orange-700/50' 
                  : 'bg-orange-50 hover:bg-orange-100 border border-orange-200'
              }`}
            >
              <Sun className="text-orange-400" size={20} />
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Morning Reflection
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diary;
