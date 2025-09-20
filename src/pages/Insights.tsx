import React, { useEffect, useState } from 'react';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
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
  Legend,
  ArcElement
);

interface InsightsProps {
  darkMode: boolean;
}

const Insights: React.FC<InsightsProps> = ({ darkMode }) => {
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
  
  // Process data for charts
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), 13 - i);
    return format(date, 'yyyy-MM-dd');
  });
  
  const anxietyData = last14Days.map(date => {
    const entry = data.sleepEntries.find(e => e.date === date && e.type === 'evening');
    return entry?.anxietyLevel || null;
  });
  
  const sleepQualityData = last14Days.map(date => {
    const entry = data.sleepEntries.find(e => e.date === date && e.type === 'morning');
    return entry?.sleepQuality || null;
  });
  
  // Calculate statistics
  const validAnxietyData = anxietyData.filter(val => val !== null) as number[];
  const validSleepData = sleepQualityData.filter(val => val !== null) as number[];
  
  const avgAnxiety = validAnxietyData.length > 0 
    ? Math.round((validAnxietyData.reduce((sum, val) => sum + val, 0) / validAnxietyData.length) * 10) / 10
    : null;
    
  const avgSleepQuality = validSleepData.length > 0 
    ? Math.round((validSleepData.reduce((sum, val) => sum + val, 0) / validSleepData.length) * 10) / 10
    : null;
  
  // Calculate improvement
  const firstWeekAnxiety = validAnxietyData.slice(0, 7);
  const secondWeekAnxiety = validAnxietyData.slice(7);
  const anxietyImprovement = firstWeekAnxiety.length > 0 && secondWeekAnxiety.length > 0
    ? Math.round(((firstWeekAnxiety.reduce((sum, val) => sum + val, 0) / firstWeekAnxiety.length) - 
                 (secondWeekAnxiety.reduce((sum, val) => sum + val, 0) / secondWeekAnxiety.length)) * 10) / 10
    : null;
  
  // Trigger frequency data
  const allTriggers = data.sleepEntries
    .filter(entry => entry.type === 'evening' && entry.triggers)
    .flatMap(entry => entry.triggers || []);
    
  const triggerCounts = allTriggers.reduce((acc, trigger) => {
    acc[trigger] = (acc[trigger] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
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
    labels: last14Days.map(date => format(new Date(date), 'M/d')),
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
  
  const doughnutData = {
    labels: Object.keys(triggerCounts),
    datasets: [
      {
        data: Object.values(triggerCounts),
        backgroundColor: [
          '#8B5CF6', '#F59E0B', '#EF4444', '#10B981',
          '#3B82F6', '#F97316', '#6366F1', '#84CC16'
        ],
        borderWidth: 0
      }
    ]
  };
  
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: darkMode ? '#F9FAFB' : '#374151',
          padding: 20,
          usePointStyle: true
        }
      }
    }
  };
  
  if (data.sleepEntries.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
        <div className="container mx-auto px-4 py-6 max-w-2xl lg:max-w-4xl">
          <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Insights & Trends
          </h1>
          
          <div className={`p-8 rounded-2xl text-center ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border`}>
            <TrendingUp className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} size={48} />
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Start Your Journey
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Complete a few check-ins to see your personalized insights and progress trends.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
      <div className="container mx-auto px-4 py-6 max-w-2xl lg:max-w-4xl">
        {/* Header */}
        <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Insights & Trends
        </h1>
        
  {/* Statistics Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`p-6 rounded-2xl text-center ${
            darkMode ? 'bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-700/50' : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'
          } border`}>
            <div className={`text-2xl font-bold mb-1 ${
              avgAnxiety !== null && avgAnxiety <= 4 ? 'text-green-500' : 
              avgAnxiety !== null && avgAnxiety <= 7 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {avgAnxiety || '--'}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Avg Anxiety
            </div>
          </div>
          
          <div className={`p-6 rounded-2xl text-center ${
            darkMode ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-700/50' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
          } border`}>
            <div className={`text-2xl font-bold mb-1 ${
              avgSleepQuality !== null && avgSleepQuality >= 7 ? 'text-green-500' : 
              avgSleepQuality !== null && avgSleepQuality >= 4 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {avgSleepQuality || '--'}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Avg Sleep Quality
            </div>
          </div>
        </div>
        
        {/* Progress Celebration */}
        {anxietyImprovement !== null && anxietyImprovement > 0 && (
          <div className={`p-6 rounded-2xl mb-8 text-center ${
            darkMode ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-700/50' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
          } border md:max-w-lg mx-auto`}>
            <Award className={`mx-auto mb-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`} size={40} />
            <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Amazing Progress! 🎉
            </h3>
            <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Your anxiety decreased by {anxietyImprovement} points this week!
            </p>
          </div>
        )}
        
        {/* Trends Chart */}
        <div className={`p-6 rounded-2xl mb-8 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border shadow-sm md:max-w-2xl mx-auto`}>
          <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            14-Day Trends
          </h3>
          <div style={{ height: '280px' }}>
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>
        
        {/* Trigger Analysis */}
        {Object.keys(triggerCounts).length > 0 && (
          <div className={`p-6 rounded-2xl mb-8 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border shadow-sm md:max-w-lg mx-auto`}>
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Anxiety Triggers
            </h3>
            <div style={{ height: '220px' }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        )}
        
        {/* Insights */}
        <div className={`p-6 rounded-2xl mb-8 ${
          darkMode ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-indigo-700/50' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'
        } border md:max-w-2xl mx-auto`}>
          <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Personal Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.settings.demoMode ? (
              <>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-white/50'}`}>
                  <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    📱 <strong>Social Media Impact:</strong> You sleep 2.3 points better on nights when you avoid social media after 9 PM.
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-white/50'}`}>
                  <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    🧠 <strong>Overthinking Pattern:</strong> Your anxiety peaks on Sunday nights. Consider creating a calming Sunday evening routine.
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-white/50'}`}>
                  <p className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    📚 <strong>Academic Stress:</strong> You're making great progress managing exam anxiety. Your sleep quality improved 40% this week!
                  </p>
                </div>
              </>
            ) : (
              <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-white/5' : 'bg-white/50'}`}>
                <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Keep tracking for more personalized insights! I'll identify patterns unique to your sleep journey.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;