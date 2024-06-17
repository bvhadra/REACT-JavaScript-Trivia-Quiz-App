import React, { useState, useEffect } from 'react';

const Timer = ({ isRunning, onTimeUp }) => {
  const [time, setTime] = useState(30);

  useEffect(() => {
    if (!isRunning) return;

    if (time === 0) {
      onTimeUp();
      return;
    }
    const timer = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(timer);
  }, [time, isRunning, onTimeUp]);

  useEffect(() => {
    setTime(30); // reset timer on mount and key change
  }, []);

  return (
    <div id="timer-container">
      <div id="timer">Time remaining: <span id="timer-value">{time}</span> seconds</div>
      <div id="timer-bar">
        <div id="timer-progress" style={{ width: `${(time / 30) * 100}%` }}></div>
      </div>
    </div>
  );
};

export default Timer;
