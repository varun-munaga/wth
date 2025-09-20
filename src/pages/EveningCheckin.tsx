import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { saveData, loadData } from '../utils/storage';
import { SleepEntry } from '../types';
import { format } from 'date-fns';
import AnxietySlider from '../components/AnxietySlider';
import TriggerCheckboxes from '../components/TriggerCheckboxes';
import VoiceRecorder from '../components/VoiceRecorder';

interface EveningCheckinProps {
  darkMode: boolean;
}

const EveningCheckin: React.FC<EveningCheckinProps> = ({ darkMode }) => {
  const [anxietyLevel, setAnxietyLevel] = useState(5);
  const [bedtime, setBedtime] = useState('22:30');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [thoughts, setThoughts] = useState('');
  const [voiceNote, setVoiceNote] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const data = loadData();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const entry: SleepEntry = {
      id: `evening-${today}`,
      date: today,
      type: 'evening',
      anxietyLevel,
      bedtime,
      triggers,
      thoughts: thoughts.trim() || undefined,
      voiceNote: voiceNote ? URL.createObjectURL(voiceNote) : undefined
    };
    
    // Remove any existing evening entry for today
    const updatedEntries = data.sleepEntries.filter(
      e => !(e.date === today && e.type === 'evening')
    );
    updatedEntries.push(entry);
    
    saveData({ sleepEntries: updatedEntries });
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    navigate('/dashboard');
  };
  
  const getEncouragement = () => {
    if (anxietyLevel <= 3) return "You're feeling quite peaceful tonight. That's wonderful! 😌";
    if (anxietyLevel <= 6) return "Some anxiety is normal. Let's work together to ease your mind. 🤗";
    return "I can see you're really struggling tonight. You're not alone in this. 💙";
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
              Evening Check-in
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {format(new Date(), 'EEEE, MMMM d')}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Anxiety Level */}
          <div className={`p-6 rounded-2xl ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border shadow-sm`}>
            <AnxietySlider
              value={anxietyLevel}
              onChange={setAnxietyLevel}
              label="How anxious are you about sleeping tonight?"
              darkMode={darkMode}
            />
            
            <div className={`mt-4 p-4 rounded-xl ${
              anxietyLevel <= 3 
                ? 'bg-green-900/20 border-green-700/50' 
                : anxietyLevel <= 6
                  ? 'bg-yellow-900/20 border-yellow-700/50'
                  : 'bg-red-900/20 border-red-700/50'
            } border`}>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {getEncouragement()}
              </p>
            </div>
          </div>
          
          {/* Bedtime */}
          <div className={`p-6 rounded-2xl ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border shadow-sm`}>
            <label className={`block text-lg font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              What time do you plan to go to bed?
            </label>
            <input
              type="time"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              className={`w-full p-4 rounded-xl border text-lg text-center ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-200 text-gray-800'
              }`}
            />
          </div>
          
          {/* Triggers */}
          <div className={`p-6 rounded-2xl ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border shadow-sm`}>
            <TriggerCheckboxes
              selectedTriggers={triggers}
              onChange={setTriggers}
              darkMode={darkMode}
            />
          </div>
          
          {/* Voice Note */}
          <div className={`p-6 rounded-2xl ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border shadow-sm`}>
            <VoiceRecorder
              onRecordingComplete={setVoiceNote}
              darkMode={darkMode}
            />
          </div>
          
          {/* Thoughts */}
          <div className={`p-6 rounded-2xl ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border shadow-sm`}>
            <label className={`block text-lg font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Any other thoughts on your mind?
            </label>
            <textarea
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              placeholder="What's on your mind tonight? (Optional)"
              rows={4}
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
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
            }`}
          >
            <Save size={20} />
            <span>{isSubmitting ? 'Saving...' : 'Ready for peaceful sleep'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default EveningCheckin;