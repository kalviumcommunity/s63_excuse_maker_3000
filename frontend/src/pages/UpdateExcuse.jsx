import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateExcuse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [excuseExists, setExcuseExists] = useState(true);

  // Predefined categories
  const categories = [
    "Work", "School", "Family", "Social", "Personal", 
    "Health", "Technical", "Traffic", "Weather", "Outlandish"
  ];

  // Fetch users from the backend
  useEffect(() => {
    axios.get("http://localhost:3001/api/users")
      .then(response => setUsers(response.data))
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  // Fetch the current excuse data
  useEffect(() => {
    const fetchExcuse = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/excuses/${id}`);
        setText(response.data.text);
        setCategory(response.data.category);
        setCreatedBy(response.data.created_by || "");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching excuse:", error);
        setExcuseExists(false);
        setLoading(false);
      }
    };
    
    fetchExcuse();
  }, [id]);

  // Handle Form Submission for Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!text || !category || !createdBy) {
      return alert("All fields are required!");
    }
    
    try {
      setSubmitting(true);
      await axios.put(`http://localhost:3001/api/excuses/${id}`, {
        text, 
        category,
        created_by: createdBy 
      });
      setSubmitting(false);
      navigate("/"); // Redirect to the home page
    } catch (error) {
      console.error("Error updating excuse:", error);
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

  if (!excuseExists) {
    return (
      <div className="glass-effect text-center p-8 max-w-md mx-auto animate-fade-in">
        <h2 className="text-2xl font-bold mb-4">Excuse Not Found</h2>
        <p className="mb-6">The excuse you're trying to update doesn't exist or has been deleted.</p>
        <button 
          onClick={() => navigate("/")} 
          className="btn-primary"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-center">Update Excuse</h2>

      <form onSubmit={handleUpdate} className="glass-effect">
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

        <div className="flex space-x-4">
          <button 
            type="button" 
            className="btn-primary bg-gray-600 hover:bg-gray-700 flex-1"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
          
          <button 
            type="submit" 
            className="btn-primary flex-1"
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            ) : "Update Excuse"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateExcuse;