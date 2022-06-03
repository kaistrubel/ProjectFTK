import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Yo yo yo, we got some react in this bitch. If I knew any front end, I would've hooked up google auth here lol
        </p>
        <a
          className="App-link"
          href="https://projectftk.com/Home/Index"
          target="_blank"
          rel="noopener noreferrer"
        >
          Try logging in here with my sick backend UI!!
        </a>
      </header>
    </div>
  );
}

export default App;
