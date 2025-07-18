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
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">Settings</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Settings content */}
        <div className="p-4">
          {/* Countdown settings */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Countdown Timer</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="countdown-time" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                  Target Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="countdown-time"
                  className="input-field dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  value={dateTimeValue}
                  onChange={handleCountdownChange}
                />
              </div>
              <button 
                onClick={saveCountdown}
                className="btn btn-primary w-full dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Update Countdown
              </button>
            </div>
          </div>
          
          {/* Background settings */}
        <BackgroundSettings />
        
        {/* Theme settings */}
        <ThemeSwitcher
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
        </div>
      </div>
    </div>
  );
};

export default Settings;