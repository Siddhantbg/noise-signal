import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Countdown from './components/Countdown';
import TabSwitcher from './components/TabSwitcher';
import List from './components/List';

import Settings from './components/Settings';
import { useBackground } from './hooks/useBackground';
import { gsap } from 'gsap';

function App() {
  useBackground();
  const [activeTab, setActiveTab] = useState('signal');
  const [countdownTarget, setCountdownTarget] = useState(null);

  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage or system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    // Check system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Check localStorage for saved theme
    return localStorage.getItem('theme') || 'minimal';
  });

  // Apply dark mode and theme changes
  useEffect(() => {
    // Apply dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);
  
  // Apply theme changes
  useEffect(() => {
    // Remove all theme classes first
    document.documentElement.classList.remove('theme-forest', 'theme-interstellar', 'theme-minimal', 'theme-cyber');
    
    // Add current theme class
    if (currentTheme !== 'minimal') {
      document.documentElement.classList.add(`theme-${currentTheme}`);
    }
    
    // Save to localStorage
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  // Fetch countdown and background on initial load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch countdown target
        const countdownRes = await axios.get('/api/countdown');
        if (countdownRes.data && countdownRes.data.targetTime) {
          setCountdownTarget(new Date(countdownRes.data.targetTime));
        } else {
          // Set default countdown to 24 hours from now if not found
          const defaultTarget = new Date();
          defaultTarget.setHours(defaultTarget.getHours() + 24);
          setCountdownTarget(defaultTarget);
        }
        

      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load app data. Please try again.');
        
        // Set default countdown even if fetch fails
        const defaultTarget = new Date();
        defaultTarget.setHours(defaultTarget.getHours() + 24);
        setCountdownTarget(defaultTarget);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  // Update countdown target in the database
  const updateCountdownTarget = async (newTarget) => {
    try {
      setCountdownTarget(newTarget);
      await axios.post('/api/countdown', { targetTime: newTarget.toISOString() });
    } catch (err) {
      console.error('Error updating countdown:', err);
      // Store in local storage as fallback
      localStorage.setItem('countdownTarget', newTarget.toISOString());
      // Register for background sync when online
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-countdown');
      }
    }
  };





  // Toggle settings panel
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };
  
  // Set current theme
  const setTheme = (theme) => {
    setCurrentTheme(theme);
  };

  // Use GSAP for animations
  useEffect(() => {
    if (!isLoading) {
      // Animate countdown on load
      gsap.from('.countdown-pulse', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out'
      });
      

    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Define animation functions outside of render
  const animateTabTransition = (tab) => {
    gsap.fromTo(
      `.${tab}-content`,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  };
  
  // Handle tab change with animation
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Use requestAnimationFrame instead of setTimeout to avoid potential issues
    requestAnimationFrame(() => animateTabTransition(tab));
  };

  return (
    <div className="min-h-screen relative">

      
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* App Header */}
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Noise & Signal</h1>
          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="theme-toggle"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {/* Settings Button */}
            <button 
              onClick={toggleSettings}
              className="theme-toggle"
              aria-label="Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </header>
        
        {/* Countdown Timer */}
        <Countdown targetDate={countdownTarget} />
        
        {/* Tab Switcher */}
        <TabSwitcher activeTab={activeTab} setActiveTab={handleTabChange} />
        
        {/* List Component with animation classes */}
        <div className={activeTab === 'signal' ? 'signal-content' : 'noise-content'}>
          <List type={activeTab} />
        </div>
        
        {/* Settings Panel (conditionally rendered) */}
        {showSettings && (
          <Settings 
            onClose={toggleSettings}
            countdownTarget={countdownTarget}
            updateCountdownTarget={updateCountdownTarget}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            currentTheme={currentTheme}
            setCurrentTheme={setTheme}
          />
        )}
        
        {/* Error message if any */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-900 dark:text-red-200">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 

export default App;