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
    <div className="space-y-4">
      <label className={`block text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        {label}
      </label>
      
      <div className="text-center">
        <div className="text-6xl mb-2">
          {emojis[value - 1] || '😐'}
        </div>
        <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
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
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #9B59B6 0%, #9B59B6 ${(value - 1) * 11.1}%, #e2e8f0 ${(value - 1) * 11.1}%, #e2e8f0 100%)`
          }}
        />
        
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>Very Calm</span>
          <span>Very Anxious</span>
        </div>
      </div>
    </div>
  );
};

export default AnxietySlider;