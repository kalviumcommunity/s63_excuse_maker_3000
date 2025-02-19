import React from 'react';
import ExcuseMaker from './components/ExcuseMaker';

const App = () => {
  return (
    <div style={styles.appContainer}>
      <ExcuseMaker />
    </div>
  );
};

const styles = {
  appContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
};

export default App;