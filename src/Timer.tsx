import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface TimerProps {
  initialTime: number;
}

const breatheAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BreathingCircle = styled.div<{ isBreathing: boolean }>`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background-color: #4caf50;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${props => props.isBreathing ? breatheAnimation : 'none'} 5s infinite ease-in-out;
`;

const InnerCircle = styled.div`
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background-color: #e8f5e9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TimerDisplay = styled.h1`
  font-size: 3rem;
  color: #2c3e50;
  font-weight: 300;
  margin-bottom: 0.5rem;
`;

const BreathText = styled.p`
  font-size: 1.2rem;
  color: #2c3e50;
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
  const [breathPhase, setBreathPhase] = useState('Breathe In');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let breathInterval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      breathInterval = setInterval(() => {
        setBreathPhase((prev) => prev === 'Breathe In' ? 'Breathe Out' : 'Breathe In');
      }, 5000);
    } else if (time === 0) {
      setIsActive(false);
      if (interval) clearInterval(interval);
      if (breathInterval) clearInterval(breathInterval);
      // TODO: Trigger notification
    }

    return () => {
      if (interval) clearInterval(interval);
      if (breathInterval) clearInterval(breathInterval);
    };
  }, [isActive, time]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTime(initialTime);
    setIsActive(false);
    setBreathPhase('Breathe In');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TimerContainer>
      <BreathingCircle isBreathing={isActive}>
        <InnerCircle>
          <TimerDisplay>{formatTime(time)}</TimerDisplay>
          <BreathText>{isActive ? breathPhase : 'Ready'}</BreathText>
        </InnerCircle>
      </BreathingCircle>
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