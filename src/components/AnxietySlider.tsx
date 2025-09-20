import React from 'react';

interface AnxietySliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  darkMode?: boolean;
}

const AnxietySlider: React.FC<AnxietySliderProps> = ({ value, onChange, label, darkMode = false }) => {
  const emojis = ['😴', '😌', '🙂', '😐', '😟', '😰', '😱', '😵', '😖', '😣'];
  
  return (
    <div className="space-y-8">
      {label && (
        <label className={`block text-xl font-medium ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>
          {label}
        </label>
      )}
      
      <div className="text-center">
        <div className="text-8xl mb-6">
          {emojis[value - 1] || '😐'}
        </div>
        <div className={`text-4xl font-bold ${darkMode ? 'text-purple-400' : 'text-indigo-600'}`}>
          {value}/10
        </div>
      </div>
      
      <div className="px-4">
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider hover:opacity-80 transition-opacity"
          style={{
            background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(value - 1) * 11.1}%, #e2e8f0 ${(value - 1) * 11.1}%, #e2e8f0 100%)`
          }}
        />
        
        <div className="flex justify-between text-lg text-slate-500 mt-6">
          <span>Very Calm</span>
          <span>Very Anxious</span>
        </div>
      </div>
    </div>
  );
};

export default AnxietySlider;