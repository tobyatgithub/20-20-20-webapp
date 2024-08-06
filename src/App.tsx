import React from 'react';
import styled from 'styled-components';
import Timer from './Timer';

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #e6f3ff;
  font-family: 'Arial', sans-serif;
`;

const App: React.FC = () => {
  return (
    <AppContainer>
      <Timer initialTime={1200} /> {/* 20 minutes in seconds */}
    </AppContainer>
  );
}

export default App;