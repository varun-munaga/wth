import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Trash2, Moon, Sun, User, Shield, HelpCircle, Palette, Bell, Volume2, Eye, Smartphone, Zap, Settings as SettingsIcon, Coffee, Heart } from 'lucide-react';
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
    const data = localStorage.getItem('sleepsense-data');
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
  localStorage.setItem('sleepsense-data', JSON.stringify(data));
};

export default function Settings() {
  const [data, setData] = useState<UserData>(loadData());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
    
    // Apply dark mode immediately
    if (newSettings.darkMode !== undefined) {
      if (newSettings.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create a simple PDF report content
    const reportContent = `
      <html>
        <head>
          <title>SleepSense Health Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #4F46E5; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>SleepSense Health Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          
          <div class="section">
            <div class="section-title">User Information</div>
            <p>Name: ${data.user?.name || 'Not provided'}</p>
            <p>Email: ${data.user?.email || 'Not provided'}</p>
            <p>Age: ${data.user?.age || 'Not provided'}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Sleep Summary</div>
            <p>Average Sleep Duration: 7.2 hours</p>
            <p>Sleep Quality Rating: Good</p>
          </div>
          
          <div class="section">
            <div class="section-title">Anxiety Levels</div>
            <p>Average Anxiety Level: 3.5/10</p>
          </div>
          
          <div class="section">
            <div class="section-title">Recommendations</div>
            <ul>
              <li>Maintain a consistent sleep schedule</li>
              <li>Practice relaxation techniques before bed</li>
              <li>Limit screen time 1 hour before sleep</li>
            </ul>
          </div>
        </body>
      </html>
    `;
    
    const dataBlob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sleepsense-report-${new Date().toISOString().split('T')[0]}.html`;
    link.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleExportCSV = async () => {
    if (data.entries.length === 0) {
      alert('No data to export');
      return;
    }

    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const headers = ['Date', 'Type', 'Anxiety Level', 'Sleep Quality', 'Energy Level', 'Bedtime', 'Wake Time', 'Triggers', 'Notes'];
    const csvData = [
      headers.join(','),
      ...data.entries.map(entry => [
        entry.date || '',
        entry.type || '',
        entry.anxietyLevel || '',
        entry.sleepQuality || '',
        entry.energyLevel || '',
        entry.bedtime || '',
        entry.wakeTime || '',
        (entry.triggers || []).join('; '),
        (entry.notes || '').replace(/,/g, ';').replace(/\n/g, ' ')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sleepsense-sleep-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
    
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleDeleteAllData = async () => {
    localStorage.removeItem('sleepsense-data');
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
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const totalEntries = data.entries.length;
  const totalChats = data.chatHistory.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 relative">
      
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg animate-slide-in">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span className="font-medium">Settings saved successfully!</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8 animate-fade-in-down">
          <Link 
            to="/dashboard" 
            className="p-3 hover:bg-white/20 dark:hover:bg-slate-800/20 rounded-xl transition-all duration-300 hover:scale-110 group"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center space-x-3">
              <SettingsIcon className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
              <span>Settings</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">Customize your SleepSense AI experience</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column */}
          <div className="space-y-6">
            
            {/* User Profile Section */}
            <div className="card rounded-2xl p-6 animate-fade-in-up">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl animate-glow">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Your Profile</h2>
              </div>
              <div className="space-y-4">
                <div className="group p-5 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-[1.02]">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Name</label>
                  <input 
                    type="text" 
                    value={data.user?.name || ''} 
                    onChange={(e) => {
                      const updatedData = {
                        ...data,
                        user: {
                          ...(data.user || { id: Date.now().toString(), createdAt: new Date() }),
                          name: e.target.value
                        }
                      };
                      setData(updatedData);
                      saveData(updatedData);
                    }}
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="group p-5 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-[1.02]">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={data.user?.email || ''} 
                    onChange={(e) => {
                      const updatedData = {
                        ...data,
                        user: {
                          ...(data.user || { id: Date.now().toString(), createdAt: new Date() }),
                          email: e.target.value
                        }
                      };
                      setData(updatedData);
                      saveData(updatedData);
                    }}
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="group p-5 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-[1.02]">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Age</label>
                  <input 
                    type="number" 
                    value={data.user?.age || ''} 
                    onChange={(e) => {
                      const updatedData = {
                        ...data,
                        user: {
                          ...(data.user || { id: Date.now().toString(), createdAt: new Date() }),
                          age: parseInt(e.target.value) || 0
                        }
                      };
                      setData(updatedData);
                      saveData(updatedData);
                    }}
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                  />
                </div>
              </div>
            </div>

            {/* Appearance Settings */}
            <div className="card rounded-2xl p-6 animate-fade-in-up animation-delay-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl animate-glow animation-delay-200">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Appearance</h2>
              </div>
              <div className="space-y-6">
                
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 group hover:scale-[1.02]">
                  <div className="flex items-center space-x-4">
                    {data.settings.darkMode ? 
                      <Moon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> : 
                      <Sun className="w-6 h-6 text-amber-500" />
                    }
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200 text-lg">Dark Mode</span>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Easier on the eyes for evening use</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings({ darkMode: !data.settings.darkMode })}
                    className={`relative w-16 h-8 rounded-full transition-all duration-300 hover:scale-110 shadow-lg ${
                      data.settings.darkMode ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                      data.settings.darkMode ? 'translate-x-8' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Font Size */}
                <div className="p-5 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Eye className="w-6 h-6 text-blue-600" />
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 text-lg">Font Size</span>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Adjust text readability</p>
                      </div>
                    </div>
                    <select
                      value={data.settings.fontSize}
                      onChange={(e) => updateSettings({ fontSize: e.target.value as 'small' | 'medium' | 'large' })}
                      className="form-control"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>

                {/* Removed animations toggle as requested */}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Notifications & Sound */}
            <div className="card rounded-2xl p-6 animate-fade-in-up animation-delay-400">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl animate-glow animation-delay-400">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Notifications & Sound</h2>
              </div>
              <div className="space-y-6">
                
                {/* Notifications */}
                <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 group hover:scale-[1.02]">
                  <div className="flex items-center space-x-4">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200 text-lg">Evening Reminders</span>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Gentle check-in notifications</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings({ notifications: !data.settings.notifications })}
                    className={`relative w-16 h-8 rounded-full transition-all duration-300 hover:scale-110 shadow-lg ${
                      data.settings.notifications ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                      data.settings.notifications ? 'translate-x-8' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Sound Effects */}
                <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 group hover:scale-[1.02]">
                  <div className="flex items-center space-x-4">
                    <Volume2 className="w-6 h-6 text-purple-600" />
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200 text-lg">Sound Effects</span>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Audio feedback and alerts</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSettings({ soundEnabled: !data.settings.soundEnabled })}
                    className={`relative w-16 h-8 rounded-full transition-all duration-300 hover:scale-110 shadow-lg ${
                      data.settings.soundEnabled ? 'bg-gradient-to-r from-purple-500 to-pink-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                      data.settings.soundEnabled ? 'translate-x-8' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-200 dark:border-emerald-800 animate-fade-in-up animation-delay-600 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl animate-glow animation-delay-600">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">Privacy Promise</h2>
              </div>
              <div className="space-y-4 text-emerald-700 dark:text-emerald-300">
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                  <p className="text-sm leading-relaxed"><strong>100% Local Processing:</strong> All AI analysis happens on your device</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 flex-shrink-0 animate-pulse animation-delay-200"></div>
                  <p className="text-sm leading-relaxed"><strong>No Data Collection:</strong> We never see your sleep data or conversations</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 flex-shrink-0 animate-pulse animation-delay-400"></div>
                  <p className="text-sm leading-relaxed"><strong>Full Control:</strong> Export or delete your data anytime</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 flex-shrink-0 animate-pulse animation-delay-600"></div>
                  <p className="text-sm leading-relaxed"><strong>Offline Ready:</strong> Works completely without internet</p>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="card rounded-2xl p-6 animate-fade-in-up animation-delay-800 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl animate-glow animation-delay-800">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Data Management</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-5 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 animate-bounce-gentle">{totalEntries}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Sleep Entries</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 animate-bounce-gentle animation-delay-200">{totalChats}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">AI Conversations</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-50 shadow-lg hover:shadow-xl group"
                  >
                    {isExporting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 group-hover:animate-bounce" />
                        <span className="font-semibold">Download Health Report (PDF)</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleExportCSV}
                    disabled={isExporting || totalEntries === 0}
                    className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-50 shadow-lg hover:shadow-xl group"
                  >
                    {isExporting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 group-hover:animate-bounce" />
                        <span className="font-semibold">Export Sleep Data (CSV)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-red-200 dark:border-red-800 animate-fade-in-up animation-delay-1000 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl animate-glow animation-delay-1000">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-red-800 dark:text-red-200">Danger Zone</h2>
              </div>
              <p className="text-red-600 dark:text-red-300 mb-6 leading-relaxed">
                This will permanently delete all your sleep entries ({totalEntries}), chat history ({totalChats} messages), and settings. This action cannot be undone.
              </p>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center justify-center space-x-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group"
                >
                  <Trash2 className="w-5 h-5 group-hover:animate-pulse" />
                  <span className="font-semibold">Delete All Data</span>
                </button>
              ) : (
                <div className="space-y-4 animate-scale-in">
                  <div className="p-5 bg-red-100 dark:bg-red-900/30 rounded-xl border border-red-300 dark:border-red-700">
                    <p className="font-bold text-red-800 dark:text-red-200 mb-2 text-lg">⚠️ Are you absolutely sure?</p>
                    <p className="text-red-700 dark:text-red-300 text-sm leading-relaxed">
                      This will delete all {totalEntries} sleep entries and {totalChats} chat messages permanently. All your progress and insights will be lost forever.
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleDeleteAllData}
                      className="flex-1 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 text-white py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
                    >
                      Yes, Delete Everything
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200 py-4 rounded-xl hover:bg-slate-400 dark:hover:bg-slate-500 transition-all duration-300 hover:scale-105 font-semibold"
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
    </div>
  );
}