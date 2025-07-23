import React from 'react';

const TabSwitcher = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-8">
      <div className="flex bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-white/30 dark:border-gray-700/20">
        <button
          className={`tab-button flex-1 min-w-0 ${activeTab === 'signal' ? 'tab-button-active' : 'text-gray-600 dark:text-gray-400'}`}
          onClick={() => setActiveTab('signal')}
        >
          <span className="flex items-center justify-center space-x-1 sm:space-x-2 overflow-hidden">
            <span className="text-lg flex-shrink-0">🎯</span>
            <span className="font-semibold truncate">Signal</span>
          </span>
        </button>
        <button
          className={`tab-button flex-1 min-w-0 ${activeTab === 'noise' ? 'tab-button-active' : 'text-gray-600 dark:text-gray-400'}`}
          onClick={() => setActiveTab('noise')}
        >
          <span className="flex items-center justify-center space-x-1 sm:space-x-2 overflow-hidden">
            <span className="text-lg flex-shrink-0">🔊</span>
            <span className="font-semibold truncate">Noise</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default TabSwitcher;