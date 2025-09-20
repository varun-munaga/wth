import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, MessageCircle, BookOpen, TrendingUp, Calendar } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { loadData } from '../utils/storage';
import { generateDemoEntries } from '../utils/demoData';
import { format, subDays } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardProps {
  darkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ darkMode }) => {
  const [data, setData] = useState(loadData());
  
  useEffect(() => {
    const appData = loadData();
    if (appData.settings.demoMode && appData.sleepEntries.length === 0) {
      const demoEntries = generateDemoEntries();
      setData({ ...appData, sleepEntries: demoEntries });
    } else {
      setData(appData);
    }
  }, []);
  
  // Get current anxiety level from latest evening entry
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayEvening = data.sleepEntries.find(entry => 
    entry.date === today && entry.type === 'evening'
  );
  const currentAnxietyLevel = todayEvening?.anxietyLevel || null;
  
  // Get recent sleep quality average
  const recentEntries = data.sleepEntries
    .filter(entry => entry.type === 'morning' && entry.sleepQuality)
    .slice(-7);
  const avgSleepQuality = recentEntries.length > 0 
    ? Math.round(recentEntries.reduce((sum, entry) => sum + (entry.sleepQuality || 0), 0) / recentEntries.length)
    : null;
  
  // Get current time greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const greetingIcon = hour < 18 ? Sun : Moon;
  const GreetingIcon = greetingIcon;

  // Prepare chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return format(date, 'yyyy-MM-dd');
  });
  
  const anxietyData = last7Days.map(date => {
    const entry = data.sleepEntries.find(e => e.date === date && e.type === 'evening');
    return entry?.anxietyLevel || null;
  });
  
  const sleepQualityData = last7Days.map(date => {
    const entry = data.sleepEntries.find(e => e.date === date && e.type === 'morning');
    return entry?.sleepQuality || null;
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        grid: {
          color: darkMode ? '#374151' : '#f3f4f6'
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280'
        }
      },
      x: {
        grid: {
          color: darkMode ? '#374151' : '#f3f4f6'
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#6B7280'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#F9FAFB' : '#374151'
        }
      }
    }
  };

  const lineChartData = {
    labels: last7Days.map(date => format(new Date(date), 'M/d')),
    datasets: [
      {
        label: 'Anxiety Level',
        data: anxietyData,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
        spanGaps: true
      },
      {
        label: 'Sleep Quality',
        data: sleepQualityData,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        spanGaps: true
      }
    ]
  };
  
  // Responsive max width for desktop
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100'}`}>
      <div className="container mx-auto px-4 py-8 max-w-2xl lg:max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <div className={`relative overflow-hidden rounded-3xl shadow-lg border ${darkMode ? 'bg-gradient-to-r from-purple-900 via-gray-900 to-blue-900 border-gray-800' : 'bg-gradient-to-r from-purple-100 via-blue-50 to-blue-200 border-blue-100'}`}> 
            <div className="flex items-center justify-between p-8">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <GreetingIcon className={darkMode ? 'text-orange-400' : 'text-orange-500'} size={32} />
                  <h1 className={`text-2xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}> 
                    {greeting}, {data.user?.name || 'there'}!
                  </h1>
                </div>
                <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}> 
                  {currentAnxietyLevel 
                    ? `Current anxiety level: ${currentAnxietyLevel}/10`
                    : 'How are you feeling today?'
                  }
                </p>
              </div>
              {currentAnxietyLevel && (
                <div className={`text-4xl font-bold ${
                  currentAnxietyLevel <= 3 ? 'text-green-400' :
                  currentAnxietyLevel <= 6 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {currentAnxietyLevel <= 3 ? '😌' : currentAnxietyLevel <= 6 ? '😐' : '😰'}
                </div>
              )}
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <Calendar size={120} />
            </div>
          </div>
        </div>

        {/* Today's Summary */}
        <div className="mb-10">
          <h2 className={`text-xl font-bold mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Today's Summary</h2>
          <div className={`p-7 rounded-3xl border shadow-lg flex flex-col gap-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-blue-100'}`}> 
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className={`text-3xl font-extrabold mb-1 ${
                  currentAnxietyLevel !== null 
                    ? currentAnxietyLevel <= 3 ? 'text-green-400' : currentAnxietyLevel <= 6 ? 'text-yellow-400' : 'text-red-400'
                    : darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {currentAnxietyLevel !== null ? currentAnxietyLevel : '--'}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Anxiety Level</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-extrabold mb-1 ${
                  avgSleepQuality !== null 
                    ? avgSleepQuality >= 7 ? 'text-green-400' : avgSleepQuality >= 4 ? 'text-yellow-400' : 'text-red-400'
                    : darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {avgSleepQuality !== null ? avgSleepQuality : '--'}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sleep Quality</div>
              </div>
            </div>
            <div className={`text-center pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-blue-100'}`}> 
              <div className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>🎯 Bedtime Goal: <span className="font-semibold">10:30 PM</span></div>
              <div className={`text-xs mt-1 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>AI Coach: Ready to help</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className={`text-xl font-bold mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/diary/evening"
              className={`flex flex-col items-center justify-center space-y-2 p-5 rounded-2xl transition-all duration-200 shadow-md border text-center ${
                darkMode 
                  ? 'bg-purple-900/40 hover:bg-purple-900/60 border-purple-700/50' 
                  : 'bg-purple-50 hover:bg-purple-100 border-purple-200'
              }`}
            >
              <Moon className={`${darkMode ? 'text-purple-400' : 'text-purple-600'}`} size={32} />
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Evening Check-in</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>How anxious are you about tonight?</p>
            </Link>
            <Link
              to="/diary/morning"
              className={`flex flex-col items-center justify-center space-y-2 p-5 rounded-2xl transition-all duration-200 shadow-md border text-center ${
                darkMode 
                  ? 'bg-orange-900/40 hover:bg-orange-900/60 border-orange-700/50' 
                  : 'bg-orange-50 hover:bg-orange-100 border-orange-200'
              }`}
            >
              <Sun className={`${darkMode ? 'text-orange-400' : 'text-orange-600'}`} size={32} />
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Morning Reflection</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>How did you sleep?</p>
            </Link>
            <Link
              to="/chat"
              className={`flex flex-col items-center justify-center space-y-2 p-5 rounded-2xl transition-all duration-200 shadow-md border text-center ${
                darkMode 
                  ? 'bg-blue-900/40 hover:bg-blue-900/60 border-blue-700/50' 
                  : 'bg-blue-50 hover:bg-blue-100 border-blue-200'
              }`}
            >
              <MessageCircle className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={32} />
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Chat with AI Coach</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Get personalized support</p>
            </Link>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Weekly Progress</h2>
            <Link 
              to="/insights"
              className={`text-sm font-semibold ${darkMode ? 'text-purple-300' : 'text-purple-700'} hover:underline`}
            >View all insights</Link>
          </div>
          <div className={`p-7 rounded-3xl border shadow-lg ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-blue-100'}`}> 
            {data.sleepEntries.length > 0 ? (
              <div style={{ height: '220px' }}>
                <Line data={lineChartData} options={chartOptions} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <TrendingUp className={`${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-2`} size={32} />
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-base`}>Charts will appear after more entries</p>
              </div>
            )}
          </div>
        </div>

        {/* Insights */}
        <div className="mb-10">
          <h2 className={`text-xl font-bold mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Today's Insight</h2>
          <div className={`p-7 rounded-3xl border shadow-lg ${darkMode ? 'bg-gradient-to-r from-purple-900/60 to-blue-900/60 border-purple-700/50' : 'bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200'}`}> 
            <div className="text-center">
              <div className="text-3xl mb-3">💡</div>
              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Sleep Tip of the Day</p>
              <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Try the 4-7-8 breathing technique tonight: breathe in for 4, hold for 7, out for 8. This naturally activates your body's relaxation response.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;