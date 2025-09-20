import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, darkMode }) => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isOnboarding = location.pathname.startsWith('/onboarding');
  
  const showNavigation = !isLanding && !isOnboarding;
  
  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <main className={`${showNavigation ? 'pb-20' : ''}`}>
        {children}
      </main>
      {showNavigation && <BottomNavigation darkMode={darkMode} />}
    </div>
  );
};

export default Layout;