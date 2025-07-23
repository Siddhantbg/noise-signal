import React, { useState } from 'react';
import BackgroundSettings from './BackgroundSettings';
import ThemeSwitcher from './ThemeSwitcher';

const Settings = ({ 
  onClose, 
  countdownTarget, 
  updateCountdownTarget, 
  isDarkMode,
  toggleDarkMode,
  currentTheme,
  setCurrentTheme
}) => {
  const [dateTimeValue, setDateTimeValue] = useState(
    countdownTarget ? formatDateTimeForInput(countdownTarget) : ''
  );
  
  // Format date for datetime-local input
  function formatDateTimeForInput(date) {
    const d = new Date(date);
    // Format: YYYY-MM-DDThh:mm
    return `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}T${padZero(d.getHours())}:${padZero(d.getMinutes())}`;
  }
  
  // Add leading zero if needed
  function padZero(num) {
    return num.toString().padStart(2, '0');
  }
  
  // Handle countdown time change
  const handleCountdownChange = (e) => {
    setDateTimeValue(e.target.value);
  };
  
  // Save countdown changes
  const saveCountdown = () => {
    if (dateTimeValue) {
      const newTarget = new Date(dateTimeValue);
      updateCountdownTarget(newTarget);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="settings-panel w-full max-w-md max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/20 dark:border-gray-700/30">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            <h2 className="text-xl font-semibold dark:text-white">Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className="theme-toggle"
            aria-label="Close Settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Settings content */}
        <div className="p-6 space-y-8">
          {/* Countdown settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Countdown Timer</h3>
            </div>
            <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 space-y-3 border border-white/20 dark:border-gray-700/20">
              <div>
                <label htmlFor="countdown-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="countdown-time"
                  className="input-field"
                  value={dateTimeValue}
                  onChange={handleCountdownChange}
                />
              </div>
              <button 
                onClick={saveCountdown}
                className="btn btn-primary w-full"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Update Countdown
              </button>
            </div>
          </div>
          
          {/* Background settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Background</h3>
            </div>
            <BackgroundSettings />
          </div>
        
          {/* Theme settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Appearance</h3>
            </div>
            <ThemeSwitcher 
              currentTheme={currentTheme} 
              setCurrentTheme={setCurrentTheme}
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;