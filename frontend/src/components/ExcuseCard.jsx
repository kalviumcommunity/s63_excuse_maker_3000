import React, { useState, useEffect } from "react";
import axios from "axios";

const ExcuseCard = () => {
  const [excuses, setExcuses] = useState([]);
  const [currentExcuse, setCurrentExcuse] = useState(null);

  // Fetch excuses from the backend
  useEffect(() => {
    axios.get("http://localhost:3000/api/excuses")
      .then(response => {
        setExcuses(response.data);
        setCurrentExcuse(response.data[0]); // Set the first excuse
      })
      .catch(error => console.error("Error fetching excuses:", error));
  }, []);

  // Function to get a random excuse
  const generateNewExcuse = () => {
    if (excuses.length > 0) {
      const randomExcuse = excuses[Math.floor(Math.random() * excuses.length)];
      setCurrentExcuse(randomExcuse);
    }
  };

  if (!currentExcuse) return <p>Loading excuses...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center">
      <h3 className="text-xl font-bold text-gray-800">{currentExcuse.category}</h3>
      <p className="text-gray-600 mt-2">"{currentExcuse.text}"</p>
      <p className="text-sm text-gray-500 mt-4">Created: {new Date(currentExcuse.createdAt).toLocaleDateString()}</p>
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
