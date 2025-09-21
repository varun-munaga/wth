import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Trash2, Moon, Sun, User, Shield, HelpCircle, Palette, Bell, Volume2, Eye, Smartphone, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Settings {
  darkMode: boolean;
  notifications: boolean;
  fontSize: 'small' | 'medium' | 'large';
  language: string;
  soundEnabled: boolean;
  animations: boolean;
  privacy: boolean;
}

interface UserData {
  entries: any[];
  chatHistory: any[];
  settings: Settings;
  user?: {
    name: string;
    email: string;
    age: number;
  };
}

const loadData = (): UserData => {
  try {
    const data = localStorage.getItem('sleepsense_data');
    return data ? JSON.parse(data) : { 
      entries: [], 
      chatHistory: [], 
      settings: { 
        darkMode: false, 
        notifications: true, 
        fontSize: 'medium', 
        language: 'en',
        soundEnabled: true,
        animations: true,
        privacy: true
      } 
    };
  } catch (error) {
    return { 
      entries: [], 
      chatHistory: [], 
      settings: { 
        darkMode: false, 
        notifications: true, 
        fontSize: 'medium', 
        language: 'en',
        soundEnabled: true,
        animations: true,
        privacy: true
      } 
    };
  }
};

const saveData = (data: UserData) => {
  localStorage.setItem('sleepsense_data', JSON.stringify(data));
};

export default function Settings() {
  const [data, setData] = useState<UserData>(loadData());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (data.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [data.settings.darkMode]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedData = {
      ...data,
      settings: { ...data.settings, ...newSettings }
    };
    setData(updatedData);
    saveData(updatedData);
  };

  const handleExportJSON = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sleepsense-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const handleExportCSV = async () => {
    if (data.entries.length === 0) {
      alert('No data to export');
      return;
    }

    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const headers = ['Date', 'Anxiety Level', 'Sleep Quality', 'Bedtime', 'Wake Time', 'Triggers', 'Notes'];
    const csvData = [
      headers.join(','),
      ...data.entries.map(entry => [
        entry.date || '',
        entry.anxietyLevel || '',
        entry.sleepQuality || '',
        entry.bedtime || '',
        entry.wakeTime || '',
        (entry.triggers || []).join('; '),
        (entry.notes || '').replace(/,/g, ';')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sleepsense-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const handleDeleteAllData = async () => {
    localStorage.removeItem('sleepsense_data');
    setData({ 
      entries: [], 
      chatHistory: [], 
      settings: { 
        darkMode: false, 
        notifications: true, 
        fontSize: 'medium', 
        language: 'en',
        soundEnabled: true,
        animations: true,
        privacy: true
      } 
    });
    setShowDeleteConfirm(false);
    // Show success animation
    const alertDiv = document.createElement('div');
    alertDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
    alertDiv.textContent = 'All data has been deleted successfully!';
    document.body.appendChild(alertDiv);
    setTimeout(() => document.body.removeChild(alertDiv), 3000);
  };

  const totalEntries = data.entries.length;
  const totalChats = data.chatHistory.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8 animate-fade-in-down">
          <Link 
            to="/dashboard" 
            className="p-3 hover:bg-white/20 dark:hover:bg-slate-800/20 rounded-xl transition-all duration-300 hover:scale-110 group"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Settings</h1>
            <p className="text-slate-600 dark:text-slate-300">Customize your SleepSense AI experience</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column */}
          <div className="space-y-6">
            
            {/* User Profile Section */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Profile</h2>
              </div>
              <div className="space-y-4">
                <div className="group p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Name</label>
                  <p className="text-lg font-semibold text-slate-800 dark:text-white">{data.user?.name || 'Not set'}</p>
                </div>
                <div className="group p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email</label>
                  <p className="text-lg font-semibold text-slate-800 dark:text-white">{data.user?.email || 'Not set'}</p>
                </div>
                <div className="group p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Age</label>
                  <p className="text-lg font-semibold text-slate-800 dark:text-white">{data.user?.age || 'Not set'}</p>
                </div>
              </div>
            </div>

            {/* Appearance Settings */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up animation-delay-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Appearance</h2>
              </div>
              <div className="space-y-6">
                
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                  <div className="flex items-center space-x-3">
                    {data.settings.darkMode ? 
                      <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> : 
                      <Sun className="w-5 h-5 text-amber-500" />
                    }
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-200">Dark Mode</span>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Easier on the eyes for evening use</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings({ darkMode: !data.settings.darkMode })}
                    className={`relative w-14 h-7 rounded-full transition-all duration-300 hover:scale-110 ${
                      data.settings.darkMode ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                      data.settings.darkMode ? 'translate-x-7' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Font Size */}
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Eye className="w-5 h-5 text-blue-600" />
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-200">Font Size</span>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Adjust text readability</p>
                      </div>
                    </div>
                    <select
                      value={data.settings.fontSize}
                      onChange={(e) => updateSettings({ fontSize: e.target.value as 'small' | 'medium' | 'large' })}
                      className="bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:bg-slate-50 dark:hover:bg-slate-500"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>

                {/* Animations */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-200">Animations</span>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Smooth transitions and effects</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings({ animations: !data.settings.animations })}
                    className={`relative w-14 h-7 rounded-full transition-all duration-300 hover:scale-110 ${
                      data.settings.animations ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                      data.settings.animations ? 'translate-x-7' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Notifications & Sound */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up animation-delay-400">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Notifications & Sound</h2>
              </div>
              <div className="space-y-6">
                
                {/* Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-200">Evening Reminders</span>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Gentle check-in notifications</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings({ notifications: !data.settings.notifications })}
                    className={`relative w-14 h-7 rounded-full transition-all duration-300 hover:scale-110 ${
                      data.settings.notifications ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                      data.settings.notifications ? 'translate-x-7' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Sound Effects */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-5 h-5 text-purple-600" />
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-200">Sound Effects</span>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Audio feedback and alerts</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings({ soundEnabled: !data.settings.soundEnabled })}
                    className={`relative w-14 h-7 rounded-full transition-all duration-300 hover:scale-110 ${
                      data.settings.soundEnabled ? 'bg-gradient-to-r from-purple-500 to-pink-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                      data.settings.soundEnabled ? 'translate-x-7' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-200 dark:border-emerald-800 animate-fade-in-up animation-delay-600">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-200">Privacy Promise</h2>
              </div>
              <div className="space-y-4 text-emerald-700 dark:text-emerald-300">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm leading-relaxed"><strong>100% Local Processing:</strong> All AI analysis happens on your device</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm leading-relaxed"><strong>No Data Collection:</strong> We never see your sleep data or conversations</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm leading-relaxed"><strong>Full Control:</strong> Export or delete your data anytime</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm leading-relaxed"><strong>Offline Ready:</strong> Works completely without internet</p>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up animation-delay-800">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Data Management</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalEntries}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Sleep Entries</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalChats}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">AI Conversations</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={handleExportJSON}
                    disabled={isExporting}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-50 shadow-lg hover:shadow-xl group"
                  >
                    {isExporting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 group-hover:animate-bounce" />
                        <span>Export All Data (JSON)</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleExportCSV}
                    disabled={isExporting}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-50 shadow-lg hover:shadow-xl group"
                  >
                    {isExporting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 group-hover:animate-bounce" />
                        <span>Export Sleep Data (CSV)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-red-200 dark:border-red-800 animate-fade-in-up animation-delay-1000">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl">
                  <Trash2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-red-800 dark:text-red-200">Danger Zone</h2>
              </div>
              <p className="text-red-600 dark:text-red-300 mb-6 leading-relaxed">
                This will permanently delete all your sleep entries, chat history, and settings. This action cannot be undone.
              </p>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group"
                >
                  <Trash2 className="w-4 h-4 group-hover:animate-pulse" />
                  <span>Delete All Data</span>
                </button>
              ) : (
                <div className="space-y-4 animate-scale-in">
                  <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-xl border border-red-300 dark:border-red-700">
                    <p className="font-bold text-red-800 dark:text-red-200 mb-2">⚠️ Are you absolutely sure?</p>
                    <p className="text-red-700 dark:text-red-300 text-sm">This will delete all {totalEntries} sleep entries and {totalChats} chat messages permanently.</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleDeleteAllData}
                      className="flex-1 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      Yes, Delete Everything
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200 py-3 rounded-xl hover:bg-slate-400 dark:hover:bg-slate-500 transition-all duration-300 hover:scale-105"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style >{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in-down { animation: fade-in-down 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.5s ease-out forwards; }
        
        .animation-delay-200 { animation-delay: 0.2s; opacity: 0; }
        .animation-delay-400 { animation-delay: 0.4s; opacity: 0; }
        .animation-delay-600 { animation-delay: 0.6s; opacity: 0; }
        .animation-delay-800 { animation-delay: 0.8s; opacity: 0; }
        .animation-delay-1000 { animation-delay: 1s; opacity: 0; }
      `}</style>
    </div>
  );
}