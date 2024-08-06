import React from 'react';
import './App.css';
import Timer from './Timer';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>20-20-20 App</h1>
        <Timer initialTime={1200} /> {/* 20 minutes in seconds */}
      </header>
    </div>
  );
}

export default App;