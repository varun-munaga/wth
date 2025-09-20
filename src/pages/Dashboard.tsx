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
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="mb-8">
          <div className={`flex items-center justify-between p-6 rounded-2xl ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border shadow-sm`}>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <GreetingIcon className={darkMode ? 'text-orange-400' : 'text-orange-500'} size={24} />
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {greeting}, {data.user?.name || 'there'}!
                </h1>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {currentAnxietyLevel 
                  ? `Current anxiety level: ${currentAnxietyLevel}/10`
                  : 'How are you feeling today?'
                }
              </p>
            </div>
            {currentAnxietyLevel && (
              <div className={`text-3xl font-bold ${
                currentAnxietyLevel <= 3 ? 'text-green-500' :
                currentAnxietyLevel <= 6 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {currentAnxietyLevel <= 3 ? '😌' : currentAnxietyLevel <= 6 ? '😐' : '😰'}
              </div>
            )}
          </div>
        </div>
        
        {/* Today's Summary */}
        <div className="mb-8">
          <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Today's Summary
          </h2>
          
          <div className={`p-6 rounded-2xl ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border shadow-sm`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold mb-1 ${
                  currentAnxietyLevel 
                    ? currentAnxietyLevel <= 3 ? 'text-green-500' : currentAnxietyLevel <= 6 ? 'text-yellow-500' : 'text-red-500'
                    : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {currentAnxietyLevel || '--'}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Anxiety Level
                </div>
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold mb-1 ${
                  avgSleepQuality 
                    ? avgSleepQuality >= 7 ? 'text-green-500' : avgSleepQuality >= 4 ? 'text-yellow-500' : 'text-red-500'
                    : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {avgSleepQuality || '--'}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Sleep Quality
                </div>
              </div>
            </div>
            
            <div className={`text-center mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                🎯 Bedtime Goal: 10:30 PM
              </div>
              <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                AI Coach: Ready to help
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 gap-3">
            <Link
              to="/diary/evening"
              className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'bg-purple-900/30 hover:bg-purple-900/50 border border-purple-700/50' 
                  : 'bg-purple-50 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <Moon className={`${darkMode ? 'text-purple-400' : 'text-purple-600'}`} size={20} />
              <div className="flex-1">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Evening Check-in
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  How anxious are you about tonight?
                </p>
              </div>
            </Link>
            
            <Link
              to="/diary/morning"
              className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'bg-orange-900/30 hover:bg-orange-900/50 border border-orange-700/50' 
                  : 'bg-orange-50 hover:bg-orange-100 border border-orange-200'
              }`}
            >
              <Sun className={`${darkMode ? 'text-orange-400' : 'text-orange-600'}`} size={20} />
              <div className="flex-1">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Morning Reflection
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  How did you sleep?
                </p>
              </div>
            </Link>
            
            <Link
              to="/chat"
              className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700/50' 
                  : 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <MessageCircle className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={20} />
              <div className="flex-1">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Chat with AI Coach
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Get personalized support
                </p>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Weekly Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Weekly Progress
            </h2>
            <Link 
              to="/insights"
              className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-600'} hover:underline`}
            >
              View all insights
            </Link>
          </div>
          
          <div className={`p-6 rounded-2xl ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border shadow-sm`}>
            {data.sleepEntries.length > 0 ? (
              <div style={{ height: '200px' }}>
                <Line data={lineChartData} options={chartOptions} />
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <TrendingUp className={`${darkMode ? 'text-gray-600' : 'text-gray-400'} mr-3`} size={24} />
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Charts will appear after more entries
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Insights */}
        <div className="mb-8">
          <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Today's Insight
          </h2>
          
          <div className={`p-6 rounded-2xl ${
            darkMode ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-700/50' : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200'
          } border`}>
            <div className="text-center">
              <div className="text-2xl mb-3">💡</div>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
                Sleep Tip of the Day
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Try the 4-7-8 breathing technique tonight: breathe in for 4, hold for 7, out for 8. 
                This naturally activates your body's relaxation response.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;