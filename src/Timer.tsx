import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface TimerProps {
  initialTime: number;
}

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  transition: all 0.3s ease;
`;

const InnerCircle = styled.div`
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const TimerDisplay = styled.h1<{ $isFinished: boolean }>`
  font-size: 3rem;
  color: ${props => props.$isFinished ? '#4caf50' : '#2c3e50'};
  font-weight: 300;
  transition: color 0.3s ease;
  margin-bottom: 0.5rem;
`;

const TimerStatus = styled.p`
  font-size: 1.2rem;
  color: #2c3e50;
  margin-top: 0;
`;

const MainButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.5rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #4caf50;
  color: #fff;
  margin-top: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #45a049;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const SettingsButton = styled.button`
  background: none;
  border: none;
  color: #2c3e50;
  font-size: 1.2rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: color 0.3s ease;

  &:hover {
    color: #4caf50;
  }
`;

const SettingsModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 300px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const StyledLabel = styled.label`
  font-size: 1rem;
  color: #2c3e50;
  margin-right: 0.5rem;
`;

const StyledInput = styled.input`
  width: 60px;
  padding: 0.5rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  text-align: center;
  &:focus {
    outline: none;
    border-color: #4caf50;
  }
`;

const SaveButton = styled(MainButton)`
  background-color: #4caf50;
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  margin-top: 0;
  &:hover {
    background-color: #45a049;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Timer: React.FC<TimerProps> = ({ initialTime }) => {
    const [time, setTime] = useState(initialTime);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [customTime, setCustomTime] = useState(Math.floor(initialTime / 60)); // Convert to minutes for settings
    const [totalTime, setTotalTime] = useState(initialTime);
    const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
    const alertShownRef = useRef(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
  
    useEffect(() => {
      audioRef.current = new Audio('/notification_sound.mp3');
    }, []);
  
    const playNotificationSound = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(error => console.error('Error playing sound:', error));
      }
    };
  
    useEffect(() => {
      let interval: NodeJS.Timeout | null = null;
  
      if (isActive && !isPaused && time > 0) {
        interval = setInterval(() => {
          setTime((prevTime) => prevTime - 1);
        }, 1000);
      } else if (time === 0 && !alertShownRef.current) {
        setIsActive(false);
        setIsPaused(true);
        if (interval) clearInterval(interval);
        triggerNotification();
        alertShownRef.current = true;
      }
  
      return () => {
        if (interval) clearInterval(interval);
      };
    }, [isActive, isPaused, time]);
  
    useEffect(() => {
      setNotificationPermission(Notification.permission);
    }, []);
  
    const toggleTimer = () => {
      if (time === 0) {
        resetTimer();
      } else if (isPaused) {
        setIsPaused(false);
        setIsActive(true);
      } else {
        setIsActive(!isActive);
      }
      if (!isActive) {
        alertShownRef.current = false;
      }
    };
  
    const resetTimer = () => {
      const newTotalTime = customTime * 60;
      setTime(newTotalTime);
      setTotalTime(newTotalTime);
      setIsActive(false);
      setIsPaused(false);
      alertShownRef.current = false;
    };
  
    const formatTime = (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
  
    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    };
  
    const triggerNotification = () => {
      if (notificationPermission === 'granted') {
        try {
          new Notification('20-20-20 Timer', {
            body: 'Time to take a break! Look at something 20 feet away.',
            icon: '/logo192.png'
          });
          playNotificationSound();
        } catch (error) {
          console.error("Error sending notification:", error);
          alert("Time's up! Take a break and look at something 20 feet away.");
          playNotificationSound();
        }
      } else {
        alert("Time's up! Take a break and look at something 20 feet away.");
        playNotificationSound();
      }
    };
  
    const progress = 1 - time / totalTime; // Calculate progress based on seconds
  
    const handleSettingsClick = () => {
      setShowSettings(true);
    };
  
    const handleSettingsClose = () => {
      setShowSettings(false);
      resetTimer();
    };
  
    const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCustomTime = Number(e.target.value);
        setCustomTime(newCustomTime);
        setTotalTime(newCustomTime * 60);
      };
  
    return (
      <TimerContainer>
        <CircularProgress progress={progress}>
          <InnerCircle>
            <TimerDisplay $isFinished={time === 0}>{formatTime(time)}</TimerDisplay>
            <TimerStatus>
              {isPaused ? 'Paused' : isActive ? 'Focus Time' : 'Ready'}
            </TimerStatus>
          </InnerCircle>
        </CircularProgress>
        <MainButton onClick={toggleTimer}>
          {isPaused ? 'Resume' : isActive ? 'Pause' : 'Start'}
        </MainButton>
        <SettingsButton onClick={handleSettingsClick}>Settings</SettingsButton>
        {notificationPermission !== 'granted' && (
          <SettingsButton onClick={requestNotificationPermission}>Enable Notifications</SettingsButton>
        )}
        {showSettings && (
          <>
            <Overlay onClick={handleSettingsClose} />
            <SettingsModal>
              <ModalTitle>Timer Settings</ModalTitle>
              <InputContainer>
                <StyledLabel htmlFor="focusTime">
                  Focus Time (minutes):
                </StyledLabel>
                <StyledInput
                  id="focusTime"
                  type="number"
                  value={customTime}
                  onChange={handleCustomTimeChange}
                  min="1"
                  max="60"
                />
              </InputContainer>
              <SaveButton onClick={handleSettingsClose}>Save</SaveButton>
            </SettingsModal>
          </>
        )}
      </TimerContainer>
    );
  };
export default Timer;