// src/App.js
import React, { useState, useEffect } from 'react';
import Excuse from './components/Excuse';
import './App.css'; // Keep if you have it

function App() {
  const [excuses, setExcuses] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null);     // Add error state

  useEffect(() => {
    const fetchExcuses = async () => {
      setLoading(true); // Start loading
      setError(null);    // Reset error

      try {
        const response = await fetch('http://localhost:5000/excuses'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setExcuses(data);
      } catch (e) {
        setError(e);
        console.error("Error fetching excuses:", e);
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchExcuses();
  }, []); // Empty dependency array means this effect runs only once on component mount

  if (loading) {
    return <p>Loading excuses...</p>; // Simple loading indicator
  }

  if (error) {
    return <p>Error fetching excuses: {error.message}</p>; // Simple error message
  }

  return (
    <div className="App">
      <h1>Excuse Maker 3000</h1>
      {excuses.map((excuse, index) => (
        <Excuse
          key={index} // Important to add a key when rendering lists in React
          category={excuse.category} // Assuming your backend sends 'category'
          text={excuse.text}         // Assuming your backend sends 'text'
        />
      ))}
    </div>
  );
}

export default App;