import React from 'react';

const TabSwitcher = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-6">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`tab-button flex-1 ${activeTab === 'signal' ? 'tab-button-active' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('signal')}
        >
          <span className="flex items-center justify-center">
            <span className="mr-1">🎯</span> Signal
          </span>
        </button>
        <button
          className={`tab-button flex-1 ${activeTab === 'noise' ? 'tab-button-active' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('noise')}
        >
          <span className="flex items-center justify-center">
            <span className="mr-1">🔊</span> Noise
          </span>
        </button>
      </div>
    </div>
  );
};

export default TabSwitcher;