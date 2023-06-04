import React, { useState, useEffect } from 'react';
import './TypingApp.css';

const TypingApp = () => {
  const [nextKey, setNextKey] = useState('');
  const [currentInput, setCurrentInput] = useState('');
  const [keysPressed, setKeysPressed] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timer, setTimer] = useState(300); // 5 minutes (in seconds)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const validKeys = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];

  const examples = {
    a: 'Apple',
    s: 'Sun',
    d: 'Donkey',
    f: 'Fox',
    j: 'Joker',
    k: 'Kettle',
    l: 'Lion',
  };

  useEffect(() => {
    generateNextKey();
  }, []);

  useEffect(() => {
    if (isTimerRunning) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isTimerRunning]);

  useEffect(() => {
    if (timer === 0) {
      setIsTimerRunning(false);
      setIsFinished(true);
    }
  }, [timer]);

  const generateNextKey = () => {
    const nextKeyIndex = Math.floor(Math.random() * validKeys.length);
    const nextKey = validKeys[nextKeyIndex];
    setNextKey(nextKey);
    setCurrentInput('');
  };

  const handleKeyDown = (event) => {
    const { key } = event;
    if (validKeys.includes(key)) {
      setCurrentInput(key);
      setKeysPressed((prevKeysPressed) => prevKeysPressed + 1);

      if (key !== nextKey) {
        setMistakes((prevMistakes) => prevMistakes + 1);
      }

      generateNextKey();
    }
  };

  const calculateAccuracy = () => {
    const totalKeys = keysPressed + mistakes;
    const newAccuracy = ((totalKeys - mistakes) / totalKeys) * 100;
    setAccuracy(newAccuracy.toFixed(2));
  };

  useEffect(() => {
    calculateAccuracy();
  }, [keysPressed, mistakes]);

  const handleStart = () => {
    setIsTimerRunning(true);
  };

  const handleFinish = () => {
    setIsTimerRunning(false);
    setIsFinished(true);
  };

  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="touch-typing-app">
      <h1>Touch Typing Practice</h1>
      <div className="typing-container">
        <p className="next-key">Next Key: {nextKey}</p>
        {nextKey !== ';' && <p className="example-word">Example Word: {examples[nextKey]}</p>}
        <p className="current-input">Current Input: {currentInput}</p>
        <p className="keys-pressed">Keys Pressed: {keysPressed}</p>
        <p className="mistakes">Mistakes: {mistakes}</p>
        <p className="accuracy">Accuracy: {accuracy}%</p>
        {isFinished ? (
          <p className="finished-message">Practice Finished!</p>
        ) : (
          <div className="timer-container">
            <p className="time-remaining">Time Remaining: {formatTime()}</p>
            {!isTimerRunning && (
              <button className="start-button" onClick={handleStart}>Start</button>
            )}
            {isTimerRunning && (
              <button className="finish-button" onClick={handleFinish}>Finish</button>
            )}
          </div>
        )}
      </div>
      <input className="input-box" type="text" onKeyDown={handleKeyDown} disabled={!isTimerRunning || isFinished} />
    </div>
  );
};

export default TypingApp;