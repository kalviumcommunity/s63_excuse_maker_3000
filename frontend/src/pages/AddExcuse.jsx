import React, { useState, useEffect } from "react";
import axios from "axios";

const AddExcuse = () => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [excuses, setExcuses] = useState([]);

  // Fetch excuses from the backend
  useEffect(() => {
    axios.get("http://localhost:3000/api/excuses")
      .then(response => setExcuses(response.data))
      .catch(error => console.error("Error fetching excuses:", error));
  }, []);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text || !category) return alert("Please enter both fields!");

    try {
      const response = await axios.post("http://localhost:3000/api/excuses", {
        text,
        category,
      });
      
      // Update the list immediately
      setExcuses([...excuses, response.data]);

      // Clear input fields
      setText("");
      setCategory("");
    } catch (error) {
      console.error("Error adding excuse:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Add a New Excuse</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96">
        <input
          type="text"
          placeholder="Excuse text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <input
          type="text"
          placeholder="Category..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Excuse
        </button>
      </form>

      <h2 className="text-xl font-bold mt-8">Excuses List</h2>
      <ul className="mt-4">
        {excuses.map((excuse) => (
          <li key={excuse._id} className="p-2 bg-white shadow-md rounded mb-2 w-80 text-center">
            <strong>{excuse.category}</strong>: {excuse.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddExcuse;
