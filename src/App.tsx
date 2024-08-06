import React from 'react';
import styled from 'styled-components';
import Timer from './Timer';

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #e8f5e9;
  font-family: 'Arial', sans-serif;
`;

const App: React.FC = () => {
  return (
    <AppContainer>
      <Timer initialTime={120} /> {/* 20 minutes in seconds */}
    </AppContainer>
  );
}

export default App;