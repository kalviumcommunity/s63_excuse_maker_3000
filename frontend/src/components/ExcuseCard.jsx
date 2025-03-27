import React, { useState, useEffect } from "react";
import axios from "axios";

const ExcuseCard = () => {
  const [excuses, setExcuses] = useState([]);
  const [currentExcuse, setCurrentExcuse] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(true);

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

  // Fetch excuses based on selected user or all excuses if no user is selected
  useEffect(() => {
    const fetchExcuses = async () => {
      try {
        setLoading(true);
        let url = "http://localhost:3001/api/excuses";
        
        // If a user is selected, fetch excuses for that user
        if (selectedUser) {
          url = `http://localhost:3001/api/excuses/by-user/${selectedUser}`;
        }
        
        const response = await axios.get(url);
        setExcuses(response.data);
        
        // Set the first excuse as current if available
        if (response.data.length > 0) {
          setCurrentExcuse(response.data[0]);
        } else {
          setCurrentExcuse(null);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching excuses:", error);
        setLoading(false);
      }
    };
    
    fetchExcuses();
  }, [selectedUser]);

  // Function to get a random excuse
  const generateNewExcuse = () => {
    if (excuses.length > 0) {
      const randomExcuse = excuses[Math.floor(Math.random() * excuses.length)];
      setCurrentExcuse(randomExcuse);
    }
  };

  // Handle user selection change
  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center animate-fade-in">
      {/* User Selection Dropdown */}
      <div className="glass-effect w-full max-w-md mb-8">
        <label htmlFor="user-select" className="block text-white mb-2 font-medium">
          Filter excuses by user:
        </label>
        <select
          id="user-select"
          value={selectedUser}
          onChange={handleUserChange}
          className="form-select"
        >
          <option value="">All Users</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* Excuse Card */}
      {currentExcuse ? (
        <div className="excuse-card w-full max-w-md text-center">
          <div className="mb-2 flex justify-between items-center">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {currentExcuse.category}
            </span>
            {currentExcuse.User && (
              <span className="bg-cyan-100 text-cyan-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                By: {currentExcuse.User.name}
              </span>
            )}
          </div>
          
          <p className="text-gray-900 text-xl font-medium mt-4 mb-6">"{currentExcuse.text}"</p>
          
          <div className="text-sm text-gray-500 mb-6">
            Created: {new Date(currentExcuse.createdAt).toLocaleDateString()}
          </div>
          
          <button
            className="btn-primary w-full"
            onClick={generateNewExcuse}
          >
            Generate New Excuse
          </button>
        </div>
      ) : (
        <div className="glass-effect text-center p-8">
          <p className="text-xl">No excuses found for the selected user.</p>
          <p className="mt-4">Try selecting a different user or add some new excuses!</p>
        </div>
      )}
    </div>
  );
};

export default ExcuseCard;