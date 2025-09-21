import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Moon, 
  Sun, 
  Heart, 
  Clock,
  Search,
  Filter,
  ChevronDown,
  Star,
  Zap,
  Brain,
  Plus,
  BookOpen,
  Eye,
  EyeOff,
  Edit3,
  Trash2
} from 'lucide-react';
import { loadData, saveData } from '../utils/storage';

interface DiaryEntry {
  id: string;
  type: 'morning' | 'evening';
  date: string;
  anxietyLevel?: number;
  sleepQuality?: number;
  energyLevel?: number;
  bedtime?: string;
  wakeTime?: string;
  triggers?: string[];
  notes?: string;
  gratitudeNote?: string;
  nightAnxiety?: boolean;
  timestamp: string;
}

interface DiaryData {
  entries?: DiaryEntry[];
  user?: {
    name: string;
  };
}

const Diary: React.FC = () => {
  const [data, setData] = useState<DiaryData>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDiaryData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const diaryData = loadData();
      setData(diaryData);
      setIsLoading(false);
    };

    loadDiaryData();
  }, []);

  const getFilteredAndSortedEntries = () => {
    let entries = data.entries || [];

    // Filter by search term
    if (searchTerm) {
      entries = entries.filter(entry => 
        entry.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.gratitudeNote?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.triggers?.some(trigger => trigger.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by type
    if (selectedFilter !== 'all') {
      entries = entries.filter(entry => entry.type === selectedFilter);
    }

    // Sort entries
    entries.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'anxiety-high':
          return (b.anxietyLevel || 0) - (a.anxietyLevel || 0);
        case 'anxiety-low':
          return (a.anxietyLevel || 0) - (b.anxietyLevel || 0);
        case 'sleep-quality':
          return (b.sleepQuality || 0) - (a.sleepQuality || 0);
        default: // newest
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return entries;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEntryIcon = (entry: DiaryEntry) => {
    return entry.type === 'evening' ? Moon : Sun;
  };

  const getEntryColor = (entry: DiaryEntry) => {
    if (entry.type === 'evening') {
      if ((entry.anxietyLevel || 0) <= 3) return 'from-indigo-500 to-purple-600';
      if ((entry.anxietyLevel || 0) <= 6) return 'from-amber-500 to-orange-600';
      return 'from-red-500 to-pink-600';
    } else {
      if ((entry.sleepQuality || 0) >= 7) return 'from-emerald-500 to-green-600';
      if ((entry.sleepQuality || 0) >= 4) return 'from-blue-500 to-indigo-600';
      return 'from-slate-500 to-slate-600';
    }
  };

  const getAnxietyEmoji = (level?: number) => {
    if (!level) return '😐';
    if (level <= 2) return '😌';
    if (level <= 4) return '🙂';
    if (level <= 6) return '😟';
    if (level <= 8) return '😰';
    return '😱';
  };

  const getSleepEmoji = (quality?: number) => {
    if (!quality) return '😴';
    if (quality <= 2) return '😵';
    if (quality <= 4) return '😕';
    if (quality <= 6) return '😐';
    if (quality <= 8) return '😊';
    return '✨';
  };

  const filteredEntries = getFilteredAndSortedEntries();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading your sleep diary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        
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
                <BookOpen className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                <span>Sleep Diary</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">Your personal sleep journey</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20 dark:border-slate-700/20">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {filteredEntries.length} entries
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card rounded-2xl p-6 mb-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search your entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control pl-10"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="form-control pr-10"
              >
                <option value="all">All Entries</option>
                <option value="evening">Evening Check-ins</option>
                <option value="morning">Morning Reflections</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>

            {/* Sort Options */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-control pr-10"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="anxiety-high">High Anxiety</option>
                <option value="anxiety-low">Low Anxiety</option>
                <option value="sleep-quality">Best Sleep</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Entries List */}
        {filteredEntries.length > 0 ? (
          <div className="space-y-4 animate-fade-in-up">
            {filteredEntries.map((entry, index) => {
              const Icon = getEntryIcon(entry);
              const isExpanded = expandedEntry === entry.id;
              
              return (
                <div
                  key={entry.id}
                  className="card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Entry Header */}
                  <div
                    onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                    className={`bg-gradient-to-r ${getEntryColor(entry)} p-6 cursor-pointer hover:opacity-90 transition-opacity`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {entry.type === 'evening' ? 'Evening Check-in' : 'Morning Reflection'}
                          </h3>
                          <p className="text-white/80">{formatDate(entry.date)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        {/* Quick Stats */}
                        {entry.type === 'evening' && entry.anxietyLevel && (
                          <div className="text-center">
                            <div className="text-2xl mb-1">{getAnxietyEmoji(entry.anxietyLevel)}</div>
                            <div className="text-white/80 text-sm">Anxiety: {entry.anxietyLevel}/10</div>
                          </div>
                        )}
                        
                        {entry.type === 'morning' && entry.sleepQuality && (
                          <div className="text-center">
                            <div className="text-2xl mb-1">{getSleepEmoji(entry.sleepQuality)}</div>
                            <div className="text-white/80 text-sm">Sleep: {entry.sleepQuality}/10</div>
                          </div>
                        )}
                        
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          {isExpanded ? (
                            <EyeOff className="w-5 h-5 text-white" />
                          ) : (
                            <Eye className="w-5 h-5 text-white" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="p-6 animate-fade-in-up">
                      <div className="grid md:grid-cols-2 gap-6">
                        
                        {/* Left Column - Metrics */}
                        <div className="space-y-6">
                          <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Metrics</h4>
                          
                          {entry.type === 'evening' && (
                            <>
                              {entry.anxietyLevel && (
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                  <div className="flex items-center space-x-3">
                                    <Heart className="w-5 h-5 text-red-500" />
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Anxiety Level</span>
                                  </div>
                                  <span className="text-2xl">{entry.anxietyLevel}/10 {getAnxietyEmoji(entry.anxietyLevel)}</span>
                                </div>
                              )}
                              
                              {entry.bedtime && (
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                  <div className="flex items-center space-x-3">
                                    <Clock className="w-5 h-5 text-indigo-500" />
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Planned Bedtime</span>
                                  </div>
                                  <span className="font-semibold text-slate-800 dark:text-white">{entry.bedtime}</span>
                                </div>
                              )}
                            </>
                          )}

                          {entry.type === 'morning' && (
                            <>
                              {entry.sleepQuality && (
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                  <div className="flex items-center space-x-3">
                                    <Moon className="w-5 h-5 text-blue-500" />
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Sleep Quality</span>
                                  </div>
                                  <span className="text-2xl">{entry.sleepQuality}/10 {getSleepEmoji(entry.sleepQuality)}</span>
                                </div>
                              )}
                              
                              {entry.energyLevel && (
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                  <div className="flex items-center space-x-3">
                                    <Zap className="w-5 h-5 text-yellow-500" />
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Energy Level</span>
                                  </div>
                                  <span className="text-2xl">{entry.energyLevel}/10 ⚡</span>
                                </div>
                              )}
                              
                              {entry.wakeTime && (
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                  <div className="flex items-center space-x-3">
                                    <Sun className="w-5 h-5 text-orange-500" />
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Wake Time</span>
                                  </div>
                                  <span className="font-semibold text-slate-800 dark:text-white">{entry.wakeTime}</span>
                                </div>
                              )}
                            </>
                          )}

                          {/* Triggers */}
                          {entry.triggers && entry.triggers.length > 0 && (
                            <div>
                              <h5 className="font-semibold text-slate-800 dark:text-white mb-3">Anxiety Triggers</h5>
                              <div className="flex flex-wrap gap-2">
                                {entry.triggers.map((trigger, triggerIndex) => (
                                  <span
                                    key={triggerIndex}
                                    className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium"
                                  >
                                    {trigger.replace('_', ' ')}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Column - Notes */}
                        <div className="space-y-6">
                          <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Notes</h4>
                          
                          {entry.notes && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                              <div className="flex items-center space-x-2 mb-3">
                                <Edit3 className="w-4 h-4 text-slate-500" />
                                <h5 className="font-medium text-slate-700 dark:text-slate-300">Your Thoughts</h5>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {entry.notes}
                              </p>
                            </div>
                          )}

                          {entry.gratitudeNote && (
                            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                              <div className="flex items-center space-x-2 mb-3">
                                <Star className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                <h5 className="font-medium text-purple-800 dark:text-purple-200">Gratitude</h5>
                              </div>
                              <p className="text-purple-700 dark:text-purple-300 leading-relaxed whitespace-pre-wrap">
                                {entry.gratitudeNote}
                              </p>
                            </div>
                          )}

                          {entry.nightAnxiety && (
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                              <div className="flex items-center space-x-2 mb-2">
                                <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <h5 className="font-medium text-blue-800 dark:text-blue-200">Night Anxiety Noted</h5>
                              </div>
                              <p className="text-blue-700 dark:text-blue-300 text-sm">
                                You experienced some anxiety during the night. This is completely normal and part of your healing journey.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* No Entries State */
          <div className="text-center py-16 animate-fade-in-up">
            <div className="max-w-md mx-auto">
              <BookOpen className="w-24 h-24 text-slate-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
                {searchTerm ? 'No matching entries' : 'Your diary is empty'}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                {searchTerm 
                  ? 'Try adjusting your search terms or filters.'
                  : 'Start your sleep journey by recording your first entry.'
                }
              </p>
              {!searchTerm && (
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
                    <Sun className="w-5 h-5" />
                    <span>Start Morning Reflection</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diary;