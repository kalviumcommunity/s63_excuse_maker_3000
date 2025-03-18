import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center mt-6">
    <div className="w-8 h-8 border-4 border-blue-600 border-dashed rounded-full animate-spin"></div>
  </div>
);

const ExcuseCard = () => {
  const [excuses, setExcuses] = useState([]);
  const [currentExcuse, setCurrentExcuse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch excuses from backend
  useEffect(() => {
    axios.get("http://localhost:3000/api/excuses")
      .then(response => {
        setExcuses(response.data);
        setCurrentExcuse(response.data[0]); // Set first excuse
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching excuses:", error);
        setLoading(false);
      });
  }, []);

  // Function to get a random excuse
  const generateNewExcuse = () => {
    if (excuses.length > 0) {
      const randomExcuse = excuses[Math.floor(Math.random() * excuses.length)];
      setCurrentExcuse(randomExcuse);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!currentExcuse) return <p className="text-center text-gray-600">No excuses available.</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white bg-opacity-30 backdrop-blur-lg p-6 rounded-xl shadow-lg w-96 text-center border border-gray-300 transition-all hover:shadow-2xl"
    >
      <SparklesIcon className="w-10 h-10 text-yellow-400 mx-auto" />
      <motion.h3
        className="text-2xl font-semibold text-gray-900 mt-2"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.3 }}
      >
        {currentExcuse.category}
      </motion.h3>
      <p className="text-gray-700 mt-2 text-lg italic">"{currentExcuse.text}"</p>
      <p className="text-sm text-gray-500 mt-4">
        Created: {new Date(currentExcuse.createdAt).toLocaleDateString()}
      </p>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg shadow-md hover:opacity-90 transition-all"
        onClick={generateNewExcuse}
      >
        Generate New Excuse
      </motion.button>
    </motion.div>
  );
};

export default ExcuseCard;
