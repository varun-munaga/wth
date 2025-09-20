import React from 'react';
import { BookOpen, Heart, Activity, DollarSign, Smartphone, Brain, Moon, Plus } from 'lucide-react';

interface TriggerCheckboxesProps {
  selectedTriggers: string[];
  onChange: (triggers: string[]) => void;
  darkMode?: boolean;
}

const TriggerCheckboxes: React.FC<TriggerCheckboxesProps> = ({ selectedTriggers, onChange, darkMode = false }) => {
  const triggers = [
    { id: 'Academic Stress', label: 'Academic Stress', icon: BookOpen, color: 'blue' },
    { id: 'Relationships', label: 'Relationships', icon: Heart, color: 'pink' },
    { id: 'Health', label: 'Health', icon: Activity, color: 'green' },
    { id: 'Financial', label: 'Financial', icon: DollarSign, color: 'yellow' },
    { id: 'Social Media', label: 'Social Media', icon: Smartphone, color: 'purple' },
    { id: 'Overthinking', label: 'Overthinking', icon: Brain, color: 'indigo' },
    { id: 'Fear of Not Sleeping', label: 'Fear of Not Sleeping', icon: Moon, color: 'orange' },
    { id: 'Other', label: 'Other', icon: Plus, color: 'gray' }
  ];
  
  const toggleTrigger = (triggerId: string) => {
    if (selectedTriggers.includes(triggerId)) {
      onChange(selectedTriggers.filter(id => id !== triggerId));
    } else {
      onChange([...selectedTriggers, triggerId]);
    }
  };
  
  return (
    <div className="space-y-3">
      <label className={`block text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        What's making you anxious about sleeping tonight?
      </label>
      
      <div className="grid grid-cols-2 gap-3">
        {triggers.map((trigger) => {
          const isSelected = selectedTriggers.includes(trigger.id);
          const Icon = trigger.icon;
          
          return (
            <button
              key={trigger.id}
              type="button"
              onClick={() => toggleTrigger(trigger.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                isSelected
                  ? darkMode
                    ? 'border-purple-500 bg-purple-900/30 text-purple-200'
                    : 'border-purple-500 bg-purple-50 text-purple-700'
                  : darkMode
                    ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <Icon size={20} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium">{trigger.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TriggerCheckboxes;