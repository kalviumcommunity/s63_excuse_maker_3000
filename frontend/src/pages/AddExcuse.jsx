import React, { useState, useEffect } from "react";
import axios from "axios";

const AddExcuse = () => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [users, setUsers] = useState([]);
  const [excuses, setExcuses] = useState([]);

  // Fetch users & excuses from the backend
  useEffect(() => {
    axios.get("http://localhost:3000/api/users")
      .then(response => setUsers(response.data))
      .catch(error => console.error("Error fetching users:", error));

    axios.get("http://localhost:3000/api/excuses")
      .then(response => setExcuses(response.data))
      .catch(error => console.error("Error fetching excuses:", error));
  }, []);

  // Handle form submission to add a new excuse
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text || !category || !createdBy) return alert("All fields are required!");

    try {
      const response = await axios.post("http://localhost:3000/api/excuses", { text, category, created_by: createdBy });
      setExcuses([...excuses, response.data]);
      setText("");
      setCategory("");
      setCreatedBy("");
    } catch (error) {
      console.error("Error adding excuse:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
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
        
        {/* Dropdown for Selecting User */}
        <select
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Add Excuse
        </button>
      </form>
    </div>
  );
};

export default AddExcuse;
