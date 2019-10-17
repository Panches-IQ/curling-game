import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { StartScreen } from './components/StartScreen';

function App() {
  // we can put different routes here
  return <div className="App">
      <StartScreen />
    </div>
}

export default App;
