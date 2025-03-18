import React, { useState } from "react";

const excuses = [
  { text: "My WiFi stopped working.", category: "Work", createdAt: "2025-03-18T10:15:00Z" },
  { text: "My dog ate my homework.", category: "School", createdAt: "2025-03-17T14:30:00Z" },
  { text: "I was abducted by aliens.", category: "Crazy", createdAt: "2025-03-16T18:45:00Z" },
  { text: "I overslept because my alarm didn't ring.", category: "Late", createdAt: "2025-03-15T07:00:00Z" },
];

const ExcuseCard = () => {
  const [excuse, setExcuse] = useState(excuses[0]);

  const generateNewExcuse = () => {
    const randomExcuse = excuses[Math.floor(Math.random() * excuses.length)];
    setExcuse(randomExcuse);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center">
      <h3 className="text-xl font-bold text-gray-800">{excuse.category}</h3>
      <p className="text-gray-600 mt-2">"{excuse.text}"</p>
      <p className="text-sm text-gray-500 mt-4">Created: {new Date(excuse.createdAt).toLocaleDateString()}</p>
      <button
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        onClick={generateNewExcuse}
      >
        Generate New Excuse
      </button>
    </div>
  );
};

export default ExcuseCard;
