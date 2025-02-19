import React, { useState } from 'react';
import Excuse from './Excuse';

const ExcuseMaker = () => {
  const [category, setCategory] = useState('home'); // Default category

  // Define excuses for each category
  const excuses = {
    work: [
      {
        title: "Work Excuse #1",
        text: "I have a last-minute meeting that I cannot miss."
      },
      {
        title: "Work Excuse #2",
        text: "I am experiencing technical difficulties with my computer."
      },
    ],
    educational: [
      {
        title: "Educational Excuse #1",
        text: "I have an important exam that I need to prepare for."
      },
      {
        title: "Educational Excuse #2",
        text: "I need to attend a workshop that conflicts with the schedule."
      },
    ],
    home: [
      {
        title: "Home Excuse #1",
        text: "I need to take care of a family member who is unwell."
      },
      {
        title: "Home Excuse #2",
        text: "I have a home repair that requires my immediate attention."
      },
    ],
  };


  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };


  const resetCategory = () => {
    setCategory('home');
  };

  return (
    <div style={styles.container}>
      <h1>Excuse Maker</h1>
      <div style={styles.buttonContainer}>
        <button 
          style={category === 'work' ? styles.activeButton : styles.button} 
          onClick={() => handleCategoryChange('work')}
        >
          Work Excuses
        </button>
        <button 
          style={category === 'educational' ? styles.activeButton : styles.button} 
          onClick={() => handleCategoryChange('educational')}
        >
          Educational Excuses
        </button>
        <button 
          style={category === 'home' ? styles.activeButton : styles.button} 
          onClick={() => handleCategoryChange('home')}
        >
          Home Excuses
        </button>
        <button style={styles.resetButton} onClick={resetCategory}>
          Reset to Home
        </button>
      </div>
      <div>
        {excuses[category].map((excuse, index) => (
          <Excuse key={index} title={excuse.title} text={excuse.text} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: '20px',
  },
  button: {
    margin: '0 10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  activeButton: {
    margin: '0 10px',
  }
};