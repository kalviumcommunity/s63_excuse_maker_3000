import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddExcuse = () => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [excuses, setExcuses] = useState([]);
  const navigate = useNavigate();

  // Fetch excuses from the backend
  useEffect(() => {
    axios.get("http://localhost:3000/api/excuses")
      .then(response => setExcuses(response.data))
      .catch(error => console.error("Error fetching excuses:", error));
  }, []);

  // Handle form submission to add a new excuse
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text || !category) return alert("Please enter both fields!");

    try {
      const response = await axios.post("http://localhost:3000/api/excuses", { text, category });
      
      // Update the list immediately
      setExcuses([...excuses, response.data]);

      // Clear input fields
      setText("");
      setCategory("");
    } catch (error) {
      console.error("Error adding excuse:", error);
    }
  };

  // Handle deletion of an excuse
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this excuse?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/excuses/${id}`);
      setExcuses(excuses.filter(excuse => excuse._id !== id));
    } catch (error) {
      console.error("Error deleting excuse:", error);
    }
  };

  // Handle updating an excuse (navigate to UpdateExcuse page)
  const handleUpdate = (id) => {
    navigate(`/update-excuse/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Add a New Excuse</h1>

      {/* Form to add a new excuse */}
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

      {/* Excuse List */}
      <h2 className="text-xl font-bold mt-8">Excuses List</h2>
      <ul className="mt-4 w-full max-w-lg">
        {excuses.map((excuse) => (
          <li key={excuse._id} className="p-4 bg-white shadow-md rounded mb-2 flex justify-between items-center">
            <div>
              <strong className="text-blue-600">{excuse.category}</strong>: {excuse.text}
            </div>
            <div>
              <button 
                onClick={() => handleUpdate(excuse._id)} 
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition mr-2">
                Edit
              </button>
              <button 
                onClick={() => handleDelete(excuse._id)} 
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddExcuse;
