import React from 'react';
import PropTypes from 'prop-types';

const Excuse = ({ title, text }) => {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>{title}</h2>
      <p style={styles.excuse}>{text}</p>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    marginBottom: '8px',
  },
  excuse: {
    fontSize: '18px',
    color: '#555',
  },
};

Excuse.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default Excuse;