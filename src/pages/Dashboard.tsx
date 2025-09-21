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
  Clock,
  Target,
  Award,
  Sun,
  Activity
} from 'lucide-react';
import { loadData } from '../utils/storage';

interface DashboardData {
  user?: {
    name: string;
    email: string;
    age: number;
  };
  entries?: Array<{
    id: string;
    type: string;
    date: string;
    anxietyLevel?: number;
    sleepQuality?: number;
    bedtime?: string;
    wakeTime?: string;
    triggers?: string[];
    notes?: string;
  }>;
  chatHistory?: Array<{
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  }>;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      // Simulate loading for smooth animation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dashboardData = loadData();
      setData(dashboardData);
      setIsLoading(false);
      
      // Trigger stats animation
      setTimeout(() => setAnimateStats(true), 600);
    };

    loadDashboardData();
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const recentEntries = data.entries?.slice(-7) || [];
  const avgAnxiety = recentEntries.length > 0 
    ? recentEntries.reduce((sum, entry) => sum + (entry.anxietyLevel || 0), 0) / recentEntries.length
    : 0;
  const avgSleep = recentEntries.length > 0
    ? recentEntries.reduce((sum, entry) => sum + (entry.sleepQuality || 0), 0) / recentEntries.length
    : 0;

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: 'Good morning', icon: Sun, color: 'from-amber-500 to-orange-500' };
    if (hour < 17) return { text: 'Good afternoon', icon: Sun, color: 'from-blue-500 to-indigo-500' };
    if (hour < 21) return { text: 'Good evening', icon: Moon, color: 'from-purple-500 to-pink-500' };
    return { text: 'Good night', icon: Moon, color: 'from-indigo-500 to-purple-500' };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const getInsightMessage = () => {
    if (recentEntries.length === 0) return "Welcome! Start tracking your sleep to unlock personalized insights.";
    if (recentEntries.length < 3) return "Great start! Keep logging for a few more days to see patterns.";
    if (avgSleep > 7) return "Excellent! Your sleep quality is improving consistently.";
    if (avgAnxiety < 4) return "Wonderful! Your anxiety levels are in a healthy range.";
    return "You're making progress! Every small step counts toward better sleep.";
  };

  const getProgressPercentage = () => {
    if (recentEntries.length === 0) return 0;
    return Math.min((recentEntries.length / 7) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 animate-fade-in-down">
          <div className="flex items-center space-x-4">
            <div className={`p-3 bg-gradient-to-r ${greeting.color} rounded-2xl shadow-lg animate-glow`}>
              <GreetingIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-1">
                {greeting.text}, {data.user?.name || 'there'}! 👋
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
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20 dark:border-slate-700/20">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex items-center space-x-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-2 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Sleep Quality Card */}
          <div className={`card-gradient bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group ${animateStats ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors group-hover:scale-110 duration-300">
                <Moon className="w-8 h-8" />
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm font-medium">Sleep Quality</p>
                <p className="text-3xl font-bold">{avgSleep.toFixed(1)}/10</p>
              </div>
            </div>
            <div className="w-full bg-blue-400 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${animateStats ? (avgSleep / 10) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-blue-100 text-xs mt-2">
              {avgSleep > 7 ? '🎉 Excellent!' : avgSleep > 5 ? '👍 Good progress' : '💪 Keep going!'}
            </p>
          </div>

          {/* Anxiety Level Card */}
          <div className={`card-gradient bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group ${animateStats ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors group-hover:scale-110 duration-300">
                <Heart className="w-8 h-8" />
              </div>
              <div className="text-right">
                <p className="text-purple-100 text-sm font-medium">Anxiety Level</p>
                <p className="text-3xl font-bold">{avgAnxiety.toFixed(1)}/10</p>
              </div>
            </div>
            <div className="w-full bg-purple-400 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${animateStats ? (10 - avgAnxiety) * 10 : 0}%` }}
              ></div>
            </div>
            <p className="text-purple-100 text-xs mt-2">
              {avgAnxiety < 4 ? '🌟 Great control!' : avgAnxiety < 7 ? '📈 Improving' : '🤗 We\'re here to help'}
            </p>
          </div>

          {/* Total Entries Card */}
          <div className={`card-gradient bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group ${animateStats ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors group-hover:scale-110 duration-300">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="text-right">
                <p className="text-emerald-100 text-sm font-medium">Sleep Entries</p>
                <p className="text-3xl font-bold">{recentEntries.length}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-emerald-100 text-sm">Last 7 days</p>
              <Target className="w-4 h-4 text-emerald-200" />
            </div>
            <div className="w-full bg-emerald-400 rounded-full h-1 mt-2">
              <div 
                className="bg-white h-1 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${animateStats ? getProgressPercentage() : 0}%` }}
              ></div>
            </div>
          </div>

          {/* AI Conversations Card */}
          <div className={`card-gradient bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group ${animateStats ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors group-hover:scale-110 duration-300">
                <MessageCircle className="w-8 h-8" />
              </div>
              <div className="text-right">
                <p className="text-orange-100 text-sm font-medium">AI Conversations</p>
                <p className="text-3xl font-bold">{data.chatHistory?.length || 0}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-orange-100 text-sm">Total messages</p>
              <Activity className="w-4 h-4 text-orange-200" />
            </div>
            <div className="flex items-center space-x-1 mt-2">
              <div className="w-2 h-2 bg-orange-200 rounded-full animate-pulse"></div>
              <p className="text-orange-100 text-xs">AI ready to help</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Actions */}
            <div className="card rounded-2xl p-6 animate-fade-in-left">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Quick Actions</h2>
              </div>
              <div className="space-y-4">
                
                <Link 
                  to="/evening-checkin" 
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Moon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold">Evening Check-in</p>
                      <p className="text-xs text-indigo-100">Rate your anxiety & set bedtime</p>
                    </div>
                  </div>
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </Link>

                <Link 
                  to="/morning-reflection"
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Sun className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold">Morning Reflection</p>
                      <p className="text-xs text-orange-100">How did you sleep?</p>
                    </div>
                  </div>
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </Link>

                <Link 
                  to="/chat"
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold">Chat with AI Coach</p>
                      <p className="text-xs text-emerald-100">Get personalized support</p>
                    </div>
                  </div>
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </Link>
              </div>
            </div>

            {/* Enhanced Insight Card */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-rose-200 dark:border-rose-800 animate-fade-in-left delay-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-rose-800 dark:text-rose-200">💡 Today's Insight</h3>
              </div>
              <p className="text-rose-700 dark:text-rose-300 text-sm leading-relaxed mb-4">
                {getInsightMessage()}
              </p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-rose-200 dark:bg-rose-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${animateStats ? getProgressPercentage() : 0}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-rose-600 dark:text-rose-300">
                  {Math.round(getProgressPercentage())}%
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Charts and Activity */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Sleep Trend Chart */}
            <div className="card rounded-2xl p-6 animate-fade-in-right">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Sleep & Anxiety Trends</h2>
                <Link 
                  to="/insights" 
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors group"
                >
                  <span className="text-sm font-medium">View all insights</span>
                  <BarChart3 className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
              
              {recentEntries.length > 0 ? (
                <div className="h-64 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                  <div className="text-center">
                    <div className="relative mb-4">
                      <TrendingUp className="w-12 h-12 text-indigo-400 mx-auto" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">
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
                    <p className="text-slate-600 dark:text-slate-300 font-medium">No sleep data yet</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Start tracking your sleep to see trends</p>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="card rounded-2xl p-6 animate-fade-in-right delay-200">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Recent Activity</h2>
              
              {recentEntries.length > 0 ? (
                <div className="space-y-3">
                  {recentEntries.slice(-3).reverse().map((entry, index) => (
                    <div 
                      key={entry.id || index} 
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 cursor-pointer hover:scale-[1.02] group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          entry.type === 'evening' 
                            ? 'bg-indigo-100 dark:bg-indigo-900/50' 
                            : 'bg-amber-100 dark:bg-amber-900/50'
                        }`}>
                          {entry.type === 'evening' ? (
                            <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          ) : (
                            <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          )}
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
                          Sleep: <span className="font-medium">{entry.sleepQuality || 'N/A'}/10</span>
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Anxiety: <span className="font-medium">{entry.anxietyLevel || 'N/A'}/10</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-300 font-medium mb-2">No recent activity</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Complete your first check-in to see activity here
                  </p>
                  <Link
                    to="/evening-checkin"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Start Your First Check-in</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;