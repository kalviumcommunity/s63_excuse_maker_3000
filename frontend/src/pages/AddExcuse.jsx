import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddExcuse = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Predefined categories
  const categories = [
    "Work", "School", "Family", "Social", "Personal", 
    "Health", "Technical", "Traffic", "Weather", "Outlandish"
  ];

  // Fetch users from the backend
  useEffect(() => {
    axios.get("http://localhost:3001/api/users")
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  // Handle form submission to add a new excuse
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text || !category || !createdBy) {
      return alert("All fields are required!");
    }
    
    try {
      setSubmitting(true);
      await axios.post("http://localhost:3001/api/excuses", {
        text, 
        category, 
        created_by: createdBy 
      });
      
      // Reset form
      setText("");
      setCategory("");
      setCreatedBy("");
      setSubmitting(false);
      
      // Navigate to home page
      navigate("/");
    } catch (error) {
      console.error("Error adding excuse:", error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-center">Add a New Excuse</h2>

      <form onSubmit={handleSubmit} className="glass-effect">
        <div className="mb-6">
          <label htmlFor="excuse-text" className="block text-white mb-2 font-medium">
            Excuse Text
          </label>
          <textarea
            id="excuse-text"
            placeholder="Enter your excuse here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="form-input min-h-[100px]"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="category" className="block text-white mb-2 font-medium">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
            required
          >
            <option value="">Select a Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label htmlFor="created-by" className="block text-white mb-2 font-medium">
            Created By
          </label>
          <select
            id="created-by"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            className="form-select"
            required
          >
            <option value="">Select a User</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          className="btn-primary w-full"
          disabled={submitting}
        >
          {submitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : "Add Excuse"}
        </button>
      </form>
    </div>
  );
};

export default AddExcuse;