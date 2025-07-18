import React from 'react';

const ThemeSwitcher = ({ currentTheme, setCurrentTheme, isDarkMode, toggleDarkMode }) => {
  // Theme options
  const themes = [
    { id: 'minimal', name: 'Minimal Light', icon: '🌱' },
    { id: 'forest', name: 'Forest', icon: '🌲' },
    { id: 'interstellar', name: 'Interstellar', icon: '🌌' },
    { id: 'cyber', name: 'Cyber Night', icon: '🌃' },
  ];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2 dark:text-gray-300">Appearance</h3>
      
      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between mb-4 p-3 card dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center">
          <span className="mr-2">{isDarkMode ? '🌙' : '☀️'}</span>
          <span className="dark:text-gray-300">Dark Mode</span>
        </div>
        <button 
          onClick={toggleDarkMode}
          className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none"
          style={{ backgroundColor: isDarkMode ? 'var(--color-primary)' : '#CBD5E1' }}
        >
          <span 
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} 
          />
        </button>
      </div>
      
      {/* Theme Selection */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Theme</h4>
        <div className="space-y-2">
          {themes.map((theme) => (
            <div 
              key={theme.id}
              className={`theme-option ${currentTheme === theme.id ? 'theme-option-active' : ''} dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700`}
              onClick={() => setCurrentTheme(theme.id)}
            >
              <span className="text-xl mr-2">{theme.icon}</span>
              <span className="dark:text-gray-300">{theme.name}</span>
              {currentTheme === theme.id && (
                <svg className="ml-auto h-5 w-5 text-primary dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;