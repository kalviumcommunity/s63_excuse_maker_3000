// src/App.js
import React from 'react';
import Excuse from './components/Excuse'; // Import the Excuse component

function App() {
  const dummyExcuse = {
    category: "Work",
    text: "Sorry I'm late, my cat decided my laptop charger was a chew toy and I had to deal with that."
  };

  return (
    <div className="App">
      <h1>Excuse Maker 3000</h1>
      <Excuse category={dummyExcuse.category} text={dummyExcuse.text} />
    </div>
  );
}

export default App;