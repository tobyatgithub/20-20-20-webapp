import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface TimerProps {
  initialTime: number;
}

const growLeaves = keyframes`
  0% { transform: scale(0); }
  100% { transform: scale(1); }
`;

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TreeContainer = styled.div`
  position: relative;
  width: 300px;
  height: 400px;
`;

const TreeTrunk = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 200px;
  background-color: #8B4513;
  border-radius: 0 0 20px 20px;
`;

const TreeLeaf = styled.div<{ delay: number }>`
  position: absolute;
  width: 80px;
  height: 80px;
  background-color: #4CAF50;
  border-radius: 50% 0 50% 50%;
  transform: rotate(45deg) scale(0);
  animation: ${growLeaves} 20s ease-out forwards;
  animation-delay: ${props => props.delay}s;
`;

const TimerDisplay = styled.h1`
  font-size: 3rem;
  color: #2c3e50;
  font-weight: 300;
  margin-top: 2rem;
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

  const leafPositions = [
    { top: 50, left: 100 },
    { top: 100, left: 50 },
    { top: 100, left: 150 },
    { top: 150, left: 0 },
    { top: 150, left: 200 },
    { top: 200, left: 50 },
    { top: 200, left: 150 },
  ];

  return (
    <TimerContainer>
      <TreeContainer>
        <TreeTrunk />
        {leafPositions.map((pos, index) => (
          <TreeLeaf
            key={index}
            style={{ top: pos.top, left: pos.left }}
            delay={index * (initialTime / leafPositions.length)}
          />
        ))}
      </TreeContainer>
      <TimerDisplay>{formatTime(time)}</TimerDisplay>
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