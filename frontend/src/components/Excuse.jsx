// src/Excuse.js
import React from 'react';

function Excuse(props) {
  return (
    <div className="excuse-card">
      <h3>Category: {props.category}</h3>
      <p>Excuse: {props.text}</p>
    </div>
  );
}

export default Excuse;