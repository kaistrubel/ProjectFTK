import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="bubble">
        Welcome to <strong>Project FTK.</strong>
      </div>
      <a
        className="bubble bubble--highlight"
        href="https://projectftk.com/Home/Index"
        target="_blank"
        rel="noopener noreferrer"
      >
        Login via Backend
      </a>
    </div>
  );
}

export default App;
