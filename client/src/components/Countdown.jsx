import React, { useState, useEffect, useCallback } from 'react';

const Countdown = ({ targetDate }) => {
    const calculateTimeLeft = useCallback(() => {
    if (!targetDate) return { hours: 0, minutes: 0, seconds: 0 };

    const difference = targetDate - new Date();

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    // Calculate hours, minutes, seconds
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);
  
  // Format time with leading zeros
  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };
  
  return (
    <div className="mb-8 float-animation">
      <div className="countdown-display p-8 text-center glow-animation">
        <div className="flex items-center justify-center mb-4">
          <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Time Remaining</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Hours */}
          <div className="text-center">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30 dark:border-gray-700/30">
              <div className="text-3xl font-bold text-primary countdown-pulse">
                {formatTime(timeLeft.hours)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-1">
                Hours
              </div>
            </div>
          </div>
          
          {/* Minutes */}
          <div className="text-center">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30 dark:border-gray-700/30">
              <div className="text-3xl font-bold text-primary countdown-pulse">
                {formatTime(timeLeft.minutes)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-1">
                Minutes
              </div>
            </div>
          </div>
          
          {/* Seconds */}
          <div className="text-center">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30 dark:border-gray-700/30">
              <div className="text-3xl font-bold text-primary countdown-pulse">
                {formatTime(timeLeft.seconds)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-1">
                Seconds
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2 backdrop-blur-sm">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-1000"
            style={{ width: `${Math.max(0, Math.min(100, (timeLeft.seconds / 60) * 100))}%` }}
          ></div>
        </div>
        
        {timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 && (
          <div className="mt-4 p-3 bg-green-500/20 text-green-700 dark:text-green-300 font-medium rounded-lg backdrop-blur-sm border border-green-500/30">
            ⏰ Time's up!
          </div>
        )}
      </div>
    </div>
  );
};

export default Countdown;