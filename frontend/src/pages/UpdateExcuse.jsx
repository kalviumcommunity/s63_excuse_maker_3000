import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateExcuse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");

  // Fetch the current excuse data
  useEffect(() => {
    axios.get(`http://localhost:3000/api/excuses/${id}`)
      .then(response => {
        setText(response.data.text);
        setCategory(response.data.category);
      })
      .catch(error => console.error("Error fetching excuse:", error));
  }, [id]);

  // Handle Form Submission for Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/excuses/${id}`, { text, category });
      navigate("/add-excuse"); // Redirect to the list
    } catch (error) {
      console.error("Error updating excuse:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Update Excuse</h1>
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow-lg w-96">
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
          Update Excuse
        </button>
      </form>
    </div>
  );
};

export default UpdateExcuse;
