import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface TimerProps {
  initialTime: number;
}

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TimerDisplay = styled.h1`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #333;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  margin: 0.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const StartButton = styled(Button)`
  background-color: #4caf50;
  color: white;
`;

const ResetButton = styled(Button)`
  background-color: #f44336;
  color: white;
`;

const Timer: React.FC<TimerProps> = ({ initialTime }) => {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      if (interval) clearInterval(interval);
      // TODO: Trigger notification
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTime(initialTime);
    setIsActive(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TimerContainer>
      <TimerDisplay>{formatTime(time)}</TimerDisplay>
      <div>
        <StartButton onClick={toggleTimer}>
          {isActive ? 'Pause' : 'Start'}
        </StartButton>
        <ResetButton onClick={resetTimer}>Reset</ResetButton>
      </div>
    </TimerContainer>
  );
};

export default Timer;