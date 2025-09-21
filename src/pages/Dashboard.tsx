import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  TrendingUp, 
  Moon, 
  MessageCircle, 
  Calendar,
  BarChart3,
  Heart,
  Zap,
  Clock
} from 'lucide-react';
import { loadData } from '../utils/storage';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setData(loadData());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div>Loading...</div>;

  const recentEntries = data.entries?.slice(-7) || [];
  const avgAnxiety = recentEntries.length > 0 
    ? recentEntries.reduce((sum: number, entry: any) => sum + (entry.anxietyLevel || 0), 0) / recentEntries.length
    : 0;
  const avgSleep = recentEntries.length > 0
    ? recentEntries.reduce((sum: number, entry: any) => sum + (entry.sleepQuality || 0), 0) / recentEntries.length
    : 0;

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
              {getGreeting()}, {data.user?.name || 'there'}! 👋
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Sleep Quality Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-100">
            <div className="flex items-center justify-between mb-4">
              <Moon className="w-8 h-8" />
              <div className="text-right">
                <p className="text-blue-100 text-sm">Sleep Quality</p>
                <p className="text-3xl font-bold">{avgSleep.toFixed(1)}/10</p>
              </div>
            </div>
            <div className="w-full bg-blue-400 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(avgSleep / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Anxiety Level Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-200">
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-8 h-8" />
              <div className="text-right">
                <p className="text-purple-100 text-sm">Anxiety Level</p>
                <p className="text-3xl font-bold">{avgAnxiety.toFixed(1)}/10</p>
              </div>
            </div>
            <div className="w-full bg-purple-400 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(10 - avgAnxiety) * 10}%` }}
              ></div>
            </div>
          </div>

          {/* Total Entries Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-300">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8" />
              <div className="text-right">
                <p className="text-emerald-100 text-sm">Sleep Entries</p>
                <p className="text-3xl font-bold">{recentEntries.length}</p>
              </div>
            </div>
            <p className="text-emerald-100 text-sm">Last 7 days</p>
          </div>

          {/* AI Chats Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-400">
            <div className="flex items-center justify-between mb-4">
              <MessageCircle className="w-8 h-8" />
              <div className="text-right">
                <p className="text-orange-100 text-sm">AI Conversations</p>
                <p className="text-3xl font-bold">{data.chatHistory?.length || 0}</p>
              </div>
            </div>
            <p className="text-orange-100 text-sm">Total messages</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 animate-fade-in-left">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Quick Actions</h2>
              <div className="space-y-4">
                
                <Link 
                  to="/evening-checkin" 
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Moon className="w-6 h-6" />
                    <div>
                      <p className="font-semibold">Evening Check-in</p>
                      <p className="text-xs text-indigo-100">Rate your anxiety & set bedtime</p>
                    </div>
                  </div>
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </Link>

                <Link 
                  to="/morning-reflection"
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Zap className="w-6 h-6" />
                    <div>
                      <p className="font-semibold">Morning Reflection</p>
                      <p className="text-xs text-orange-100">How did you sleep?</p>
                    </div>
                  </div>
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </Link>

                <Link 
                  to="/chat"
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-6 h-6" />
                    <div>
                      <p className="font-semibold">Chat with AI Coach</p>
                      <p className="text-xs text-emerald-100">Get personalized support</p>
                    </div>
                  </div>
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Recent Insight */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-rose-200 dark:border-rose-800 animate-fade-in-left animation-delay-200">
              <h3 className="text-lg font-bold text-rose-800 dark:text-rose-200 mb-3">💡 Today's Insight</h3>
              <p className="text-rose-700 dark:text-rose-300 text-sm leading-relaxed">
                {recentEntries.length > 3 
                  ? "You're building great sleep habits! Your consistency is paying off."
                  : "Start by tracking your sleep for a few days to identify patterns."
                }
              </p>
            </div>
          </div>

          {/* Right Column - Charts and Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Sleep Trend Chart Placeholder */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 animate-fade-in-right">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Sleep & Anxiety Trends</h2>
                <Link 
                  to="/insights" 
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors group"
                >
                  <span className="text-sm font-medium">View all insights</span>
                  <BarChart3 className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              {recentEntries.length > 0 ? (
                <div className="h-64 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-300">
                      Chart visualization will appear here
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {recentEntries.length} entries recorded
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-64 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600">
                  <div className="text-center">
                    <Moon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-300">No sleep data yet</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Start tracking your sleep to see trends</p>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 animate-fade-in-right animation-delay-200">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Recent Activity</h2>
              
              {recentEntries.length > 0 ? (
                <div className="space-y-3">
                  {recentEntries.slice(-3).reverse().map((entry: any, index: number) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                          <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-white">
                            {entry.type === 'evening' ? 'Evening Check-in' : 'Morning Reflection'}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {new Date(entry.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Sleep: {entry.sleepQuality || 'N/A'}/10
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Anxiety: {entry.anxietyLevel || 'N/A'}/10
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-300">No recent activity</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Complete your first check-in to see activity here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style >{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animate-fade-in-left {
          animation: fade-in-left 0.6s ease-out forwards;
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.6s ease-out forwards;
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;