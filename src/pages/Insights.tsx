import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Moon, 
  Heart, 
  Calendar,
  BarChart3,
  Award,
  Target,
  Lightbulb,
  Clock,
  Brain,
  Zap,
  Star,
  Activity
} from 'lucide-react';
import { loadData } from '../utils/storage';

interface InsightData {
  entries?: Array<{
    id: string;
    type: string;
    date: string;
    anxietyLevel?: number;
    sleepQuality?: number;
    energyLevel?: number;
    bedtime?: string;
    wakeTime?: string;
    triggers?: string[];
    notes?: string;
  }>;
  user?: {
    name: string;
  };
}

const Insights: React.FC = () => {
  const [data, setData] = useState<InsightData>({});
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    const loadInsights = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const insightData = loadData();
      setData(insightData);
      setIsLoading(false);
      
      setTimeout(() => setAnimateStats(true), 500);
    };

    loadInsights();
  }, []);

  const getFilteredEntries = () => {
    const entries = data.entries || [];
    const now = new Date();
    const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return entries.filter(entry => new Date(entry.date) >= cutoffDate);
  };

  const calculateStats = () => {
    const entries = getFilteredEntries();
    if (entries.length === 0) return null;

    const avgSleep = entries.reduce((sum, entry) => sum + (entry.sleepQuality || 0), 0) / entries.length;
    const avgAnxiety = entries.reduce((sum, entry) => sum + (entry.anxietyLevel || 0), 0) / entries.length;
    const avgEnergy = entries.reduce((sum, entry) => sum + (entry.energyLevel || 0), 0) / entries.length;

    // Calculate trends (compare first half vs second half)
    const midpoint = Math.floor(entries.length / 2);
    const firstHalf = entries.slice(0, midpoint);
    const secondHalf = entries.slice(midpoint);

    const firstHalfSleep = firstHalf.reduce((sum, entry) => sum + (entry.sleepQuality || 0), 0) / firstHalf.length || 0;
    const secondHalfSleep = secondHalf.reduce((sum, entry) => sum + (entry.sleepQuality || 0), 0) / secondHalf.length || 0;
    const sleepTrend = secondHalfSleep - firstHalfSleep;

    const firstHalfAnxiety = firstHalf.reduce((sum, entry) => sum + (entry.anxietyLevel || 0), 0) / firstHalf.length || 0;
    const secondHalfAnxiety = secondHalf.reduce((sum, entry) => sum + (entry.anxietyLevel || 0), 0) / secondHalf.length || 0;
    const anxietyTrend = firstHalfAnxiety - secondHalfAnxiety; // Lower anxiety is better

    return {
      avgSleep,
      avgAnxiety,
      avgEnergy,
      sleepTrend,
      anxietyTrend,
      totalEntries: entries.length
    };
  };

  const getMostCommonTriggers = () => {
    const entries = getFilteredEntries();
    const triggerCounts: { [key: string]: number } = {};
    
    entries.forEach(entry => {
      entry.triggers?.forEach(trigger => {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
      });
    });

    return Object.entries(triggerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([trigger, count]) => ({ trigger, count }));
  };

  const getPersonalizedInsights = () => {
    const stats = calculateStats();
    const triggers = getMostCommonTriggers();
    const insights = [];

    if (!stats) return ["Start tracking your sleep to unlock personalized insights!"];

    // Sleep quality insights
    if (stats.avgSleep >= 7) {
      insights.push("🌟 Excellent! Your sleep quality is consistently good. Keep up the great work!");
    } else if (stats.avgSleep >= 5) {
      insights.push("📈 Your sleep quality is moderate. Let's work on some improvements together.");
    } else {
      insights.push("💙 I see you're struggling with sleep quality. Remember, every small step counts.");
    }

    // Sleep trend insights
    if (stats.sleepTrend > 0.5) {
      insights.push("🚀 Amazing progress! Your sleep quality has been improving over time.");
    } else if (stats.sleepTrend < -0.5) {
      insights.push("🤗 Your sleep has been challenging lately. Let's focus on what might help.");
    }

    // Anxiety insights
    if (stats.avgAnxiety <= 3) {
      insights.push("✨ Great job managing your anxiety levels! Your hard work is paying off.");
    } else if (stats.anxietyTrend > 0.5) {
      insights.push("💪 I notice your anxiety levels have been decreasing. That's wonderful progress!");
    }

    // Trigger insights
    if (triggers.length > 0) {
      const topTrigger = triggers[0];
      insights.push(`🔍 Your most common anxiety trigger is "${topTrigger.trigger}". Let's work on strategies for this.`);
    }

    // Consistency insights
    if (stats.totalEntries >= 7) {
      insights.push("🎯 You're building an excellent tracking habit! Consistency is key to better sleep.");
    }

    return insights.length > 0 ? insights : ["Keep tracking your sleep to unlock more insights!"];
  };

  const stats = calculateStats();
  const insights = getPersonalizedInsights();
  const commonTriggers = getMostCommonTriggers();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Analyzing your sleep patterns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 animate-fade-in-down">
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="p-3 hover:bg-white/20 dark:hover:bg-slate-800/20 rounded-xl transition-all duration-300 hover:scale-110 group"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-1 flex items-center space-x-2">
                <BarChart3 className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                <span>Sleep Insights</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">Discover patterns and improve your sleep</p>
            </div>
          </div>
          
          {/* Time Period Selector */}
          <div className="flex items-center space-x-2 mt-4 lg:mt-0">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 mr-3">Time Period:</span>
            {[
              { value: '7d', label: '7 Days' },
              { value: '30d', label: '30 Days' },
              { value: '90d', label: '90 Days' }
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedPeriod === period.value
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {stats ? (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              {/* Sleep Quality Card */}
              <div className={`card-gradient bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-500 ${animateStats ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Moon className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-sm font-medium">Avg Sleep Quality</p>
                    <p className="text-3xl font-bold">{stats.avgSleep.toFixed(1)}/10</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {stats.sleepTrend > 0.2 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-300" />
                  ) : stats.sleepTrend < -0.2 ? (
                    <TrendingDown className="w-4 h-4 text-red-300" />
                  ) : (
                    <Activity className="w-4 h-4 text-blue-200" />
                  )}
                  <span className="text-blue-100 text-sm">
                    {Math.abs(stats.sleepTrend).toFixed(1)} trend
                  </span>
                </div>
              </div>

              {/* Anxiety Level Card */}
              <div className={`card-gradient bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-500 ${animateStats ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Heart className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <p className="text-purple-100 text-sm font-medium">Avg Anxiety Level</p>
                    <p className="text-3xl font-bold">{stats.avgAnxiety.toFixed(1)}/10</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {stats.anxietyTrend > 0.2 ? (
                    <TrendingDown className="w-4 h-4 text-emerald-300" />
                  ) : stats.anxietyTrend < -0.2 ? (
                    <TrendingUp className="w-4 h-4 text-red-300" />
                  ) : (
                    <Activity className="w-4 h-4 text-purple-200" />
                  )}
                  <span className="text-purple-100 text-sm">
                    {stats.anxietyTrend > 0 ? 'Improving' : stats.anxietyTrend < 0 ? 'Needs attention' : 'Stable'}
                  </span>
                </div>
              </div>

              {/* Energy Level Card */}
              <div className={`card-gradient bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-500 ${animateStats ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Zap className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <p className="text-orange-100 text-sm font-medium">Avg Energy Level</p>
                    <p className="text-3xl font-bold">{stats.avgEnergy.toFixed(1)}/10</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-orange-200" />
                  <span className="text-orange-100 text-sm">
                    {stats.avgEnergy > 6 ? 'High energy' : stats.avgEnergy > 4 ? 'Moderate' : 'Low energy'}
                  </span>
                </div>
              </div>

              {/* Total Entries Card */}
              <div className={`card-gradient bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-500 ${animateStats ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-100 text-sm font-medium">Total Entries</p>
                    <p className="text-3xl font-bold">{stats.totalEntries}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-emerald-200" />
                  <span className="text-emerald-100 text-sm">
                    {selectedPeriod === '7d' ? 'Last 7 days' : selectedPeriod === '30d' ? 'Last 30 days' : 'Last 90 days'}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Personal Insights */}
              <div className="card rounded-2xl p-6 animate-fade-in-left">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Personal Insights</h2>
                </div>
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 animate-fade-in-up"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <p className="text-purple-800 dark:text-purple-200 leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Triggers */}
              <div className="card rounded-2xl p-6 animate-fade-in-right">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Common Anxiety Triggers</h2>
                </div>
                {commonTriggers.length > 0 ? (
                  <div className="space-y-3">
                    {commonTriggers.map((trigger, index) => (
                      <div
                        key={trigger.trigger}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors animate-fade-in-up"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <span className="font-medium text-slate-800 dark:text-white capitalize">
                          {trigger.trigger.replace('_', ' ')}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {trigger.count} times
                          </span>
                          <div 
                            className="w-16 h-2 bg-red-200 dark:bg-red-800 rounded-full"
                          >
                            <div 
                              className="h-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-full transition-all duration-1000"
                              style={{ 
                                width: `${(trigger.count / Math.max(...commonTriggers.map(t => t.count))) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400">
                      No anxiety triggers recorded yet. Keep tracking to identify patterns!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Achievement Section */}
            <div className="mt-8 card rounded-2xl p-6 animate-fade-in-up">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Your Achievements</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tracking Streak */}
                <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-emerald-800 dark:text-emerald-200 mb-1">
                    {stats.totalEntries} Days Tracked
                  </h3>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">Building consistency!</p>
                </div>

                {/* Sleep Quality Badge */}
                {stats.avgSleep >= 7 && (
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-1">Sleep Master</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Excellent sleep quality!</p>
                  </div>
                )}

                {/* Anxiety Management Badge */}
                {stats.anxietyTrend > 0.5 && (
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-purple-800 dark:text-purple-200 mb-1">Calm Mind</h3>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Anxiety improving!</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* No Data State */
          <div className="text-center py-16 animate-fade-in-up">
            <div className="max-w-md mx-auto">
              <BarChart3 className="w-24 h-24 text-slate-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
                No Data Yet
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Start tracking your sleep to unlock personalized insights and see your progress over time.
              </p>
              <div className="space-y-4">
                <Link
                  to="/evening-checkin"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Moon className="w-5 h-5" />
                  <span>Start Evening Check-in</span>
                </Link>
                <div className="text-center">
                  <span className="text-slate-500 dark:text-slate-400">or</span>
                </div>
                <Link
                  to="/morning-reflection"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Zap className="w-5 h-5" />
                  <span>Start Morning Reflection</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;