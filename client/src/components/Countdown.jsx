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
    <div className="mb-8">
      <div className="card p-6 text-center">
        <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">Time Remaining</h2>
        <div className="text-4xl font-bold countdown-pulse">
          <span className="text-primary">{formatTime(timeLeft.hours)}</span>
          <span className="text-gray-400 dark:text-gray-500 mx-1">:</span>
          <span className="text-primary">{formatTime(timeLeft.minutes)}</span>
          <span className="text-gray-400 dark:text-gray-500 mx-1">:</span>
          <span className="text-primary">{formatTime(timeLeft.seconds)}</span>
        </div>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Hours</span>
          <span className="mx-6">Minutes</span>
          <span>Seconds</span>
        </div>
        {timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 && (
          <div className="mt-4 text-signal font-medium">Time's up!</div>
        )}
      </div>
    </div>
  );
};

export default Countdown;