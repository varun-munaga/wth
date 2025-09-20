import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Type, Bell, Download, Shield, Eye, EyeOff, Trash2 } from 'lucide-react';
import { loadData, saveData, clearData } from '../utils/storage';
import { generateDemoEntries, generateDemoChat } from '../utils/demoData';

interface SettingsProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const Settings: React.FC<SettingsProps> = ({ darkMode, onToggleDarkMode }) => {
  const [settings, setSettings] = useState(loadData().settings);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const navigate = useNavigate();

  const updateSetting = (key: keyof typeof settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveData({ settings: newSettings });
  };

  const handleDemoModeToggle = () => {
    const newDemoMode = !settings.demoMode;
    updateSetting('demoMode', newDemoMode);
    
    if (newDemoMode) {
      // Load demo data
      const demoEntries = generateDemoEntries();
      const demoChat = generateDemoChat();
      saveData({ 
        sleepEntries: demoEntries,
        chatHistory: demoChat
      });
    } else {
      // Clear demo data
      saveData({ 
        sleepEntries: [],
        chatHistory: []
      });
    }
  };

  const handleExportData = () => {
    const data = loadData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sleepsense-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    clearData();
    setShowClearDataModal(false);
    navigate('/');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100'} pb-8`}>
      <div className="container mx-auto px-4 py-8 max-w-2xl lg:max-w-4xl">
        {/* Header */}
  <div className="flex items-center space-x-3 mb-10">
          <button
            onClick={() => navigate('/dashboard')}
            className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Settings
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Customize your experience
            </p>
          </div>
        </div>

  <div className="space-y-8">
          {/* Appearance */}
          <div className={`p-7 rounded-3xl ${
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-blue-100'
          } border shadow-lg`}>
            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Appearance
            </h2>
            
            <div className="space-y-4">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {darkMode ? <Moon className="text-purple-400" size={20} /> : <Sun className="text-orange-400" size={20} />}
                  <div>
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Dark Mode
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {darkMode ? 'Easier on the eyes at night' : 'Better for daytime use'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onToggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Font Size */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Type className={darkMode ? 'text-gray-400' : 'text-gray-600'} size={20} />
                  <div>
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Font Size
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Make text easier to read
                    </div>
                  </div>
                </div>
                <select
                  value={settings.fontSize}
                  onChange={(e) => updateSetting('fontSize', e.target.value as 'small' | 'medium' | 'large')}
                  className={`px-3 py-1 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className={`p-7 rounded-3xl ${
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-blue-100'
          } border shadow-lg`}>
            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Notifications
            </h2>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className={darkMode ? 'text-gray-400' : 'text-gray-600'} size={20} />
                <div>
                  <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Evening Reminders
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Gentle reminders to check in
                  </div>
                </div>
              </div>
              <button
                onClick={() => updateSetting('notifications', !settings.notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Demo Mode */}
          <div className={`p-7 rounded-3xl ${
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-blue-100'
          } border shadow-lg`}>
            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Demo Mode
            </h2>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className={darkMode ? 'text-gray-400' : 'text-gray-600'} size={20} />
                <div>
                  <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Sample Data
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {settings.demoMode ? 'Showing sample entries' : 'Use your real data'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleDemoModeToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.demoMode ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.demoMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Data Management */}
          <div className={`p-7 rounded-3xl ${
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-blue-100'
          } border shadow-lg`}>
            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Data Management
            </h2>
            
            <div className="space-y-3">
              <button
                onClick={handleExportData}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                  darkMode 
                    ? 'bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700/50' 
                    : 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
                }`}
              >
                <Download className={darkMode ? 'text-blue-400' : 'text-blue-600'} size={20} />
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Export My Data
                </span>
              </button>
              
              <button
                onClick={() => setShowClearDataModal(true)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                  darkMode 
                    ? 'bg-red-900/30 hover:bg-red-900/50 border border-red-700/50' 
                    : 'bg-red-50 hover:bg-red-100 border border-red-200'
                }`}
              >
                <Trash2 className={darkMode ? 'text-red-400' : 'text-red-600'} size={20} />
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Clear All Data
                </span>
              </button>
            </div>
          </div>

          {/* Privacy */}
          <div className={`p-7 rounded-3xl ${
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-blue-100'
          } border shadow-lg`}>
            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Privacy & Security
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Shield className="text-green-400" size={20} />
                <div>
                  <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    100% Private
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    All data stays on your device
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowPrivacyModal(true)}
                className={`w-full text-left p-3 rounded-xl transition-colors ${
                  darkMode 
                    ? 'bg-purple-900/30 hover:bg-purple-900/50 border border-purple-700/50' 
                    : 'bg-purple-50 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Privacy Policy
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Learn how we protect your data
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-2xl p-6 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Privacy Policy
            </h3>
            <div className={`text-sm space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>
                <strong>Your data never leaves your device.</strong> All AI processing happens locally using your device's processing power.
              </p>
              <p>
                We don't collect, store, or transmit any of your personal information, sleep data, or conversations.
              </p>
              <p>
                Your data is stored securely in your browser's local storage and can be exported or deleted at any time.
              </p>
              <p>
                This app works completely offline - no internet connection required for core functionality.
              </p>
            </div>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className={`w-full mt-6 py-3 px-4 rounded-xl font-semibold ${
                darkMode 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Clear Data Modal */}
      {showClearDataModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-2xl p-6 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Clear All Data
            </h3>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              This will permanently delete all your sleep entries, chat history, and settings. This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearDataModal(false)}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold ${
                  darkMode 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
