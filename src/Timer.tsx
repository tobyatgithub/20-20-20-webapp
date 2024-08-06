import React, { useState, useEffect, useRef } from 'react';
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
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TimerDisplay = styled.h1<{ $isFinished: boolean }>`
  font-size: 3rem;
  color: ${props => props.$isFinished ? '#4caf50' : '#2c3e50'};
  font-weight: 300;
  transition: color 0.3s ease;
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
    color: #fff;
  }
`;

const Timer: React.FC<TimerProps> = ({ initialTime }) => {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const alertShownRef = useRef(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0 && !alertShownRef.current) {
      setIsActive(false);
      if (interval) clearInterval(interval);
      triggerNotification();
      alertShownRef.current = true;
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  useEffect(() => {
    setNotificationPermission(Notification.permission);
  }, []);

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive) {
      alertShownRef.current = false;
    }
  };

  const resetTimer = () => {
    setTime(initialTime);
    setIsActive(false);
    alertShownRef.current = false;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const requestNotificationPermission = async () => {
    console.log("Requesting notification permission...");
    try {
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);
      setNotificationPermission(permission);
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  const triggerNotification = () => {
    console.log("Attempting to trigger notification...");
    console.log("Current notification permission:", notificationPermission);
  
    if (notificationPermission === 'granted') {
      try {
        new Notification('20-20-20 Timer', {
          body: 'Time to take a 20-second break! Look at something 20 feet away.',
          icon: '/public/logo192.png'
        });
        console.log("Notification sent successfully.");
      } catch (error) {
        console.error("Error sending notification:", error);
        alert("Time's up! Take a 20-second break and look at something 20 feet away.");
      }
    } else {
      console.log("Notification permission not granted");
      alert("Time's up! Take a 20-second break and look at something 20 feet away.");
    }
  };

  const progress = 1 - time / initialTime;

  return (
    <TimerContainer>
      <CircularProgress progress={progress}>
        <InnerCircle>
          <TimerDisplay $isFinished={time === 0}>{formatTime(time)}</TimerDisplay>
        </InnerCircle>
      </CircularProgress>
      <ButtonContainer>
        <Button onClick={toggleTimer}>
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={resetTimer}>Reset</Button>
        {notificationPermission !== 'granted' && (
          <Button onClick={requestNotificationPermission}>Enable Notifications</Button>
        )}
      </ButtonContainer>
    </TimerContainer>
  );
};

export default Timer;