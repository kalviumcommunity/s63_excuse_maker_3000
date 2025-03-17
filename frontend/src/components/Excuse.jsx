// src/components/Excuse.js
import React from 'react';

function Excuse({ category, text }) {
  return (
    <div className="excuse-container">
      <h3>Category: {category}</h3>
      <p>Excuse: {text}</p>
    </div>
  );
}

export default Excuse;