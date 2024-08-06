import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface TimerProps {
  initialTime: number;
}

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CircularProgress = styled.div<{ progress: number }>`
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #4caf50 ${props => props.progress * 360}deg,
    #e0e0e0 ${props => props.progress * 360}deg 360deg
  );
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const InnerCircle = styled.div`
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background-color: #e8f5e9;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TimerDisplay = styled.h1`
  font-size: 3rem;
  color: #2c3e50;
  font-weight: 300;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: transparent;
  color: #2c3e50;
  border: 2px solid #2c3e50;

  &:hover {
    background-color: #2c3e50;
    color: #e8f5e9;
  }
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

  const progress = 1 - time / initialTime;

  return (
    <TimerContainer>
      <CircularProgress progress={progress}>
        <InnerCircle>
          <TimerDisplay>{formatTime(time)}</TimerDisplay>
        </InnerCircle>
      </CircularProgress>
      <ButtonContainer>
        <Button onClick={toggleTimer}>
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={resetTimer}>Reset</Button>
      </ButtonContainer>
    </TimerContainer>
  );
};

export default Timer;