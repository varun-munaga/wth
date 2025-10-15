import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, BookOpen, MessageCircle, TrendingUp, Settings } from 'lucide-react';

interface BottomNavigationProps {
  darkMode: boolean;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ darkMode }) => {
  const location = useLocation();
  
  const tabs = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/diary', icon: BookOpen, label: 'Diary' },
    { path: '/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/insights', icon: TrendingUp, label: 'Insights' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];
  
  return (
    <nav className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t px-2 py-2 z-50`}>
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 min-w-[60px] ${
                isActive
                  ? darkMode
                    ? 'text-purple-400 bg-purple-900/30'
                    : 'text-purple-600 bg-purple-50'
                  : darkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;