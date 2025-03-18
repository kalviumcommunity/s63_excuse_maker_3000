import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import AddExcuse from "./pages/AddExcuse";
import ExcuseCard from "./components/ExcuseCard";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
        <nav className="mb-6">
          <Link to="/" className="mr-4 text-lg underline">Home</Link>
          <Link to="/add-excuse" className="text-lg underline">Add Excuse</Link>
        </nav>
        <Routes>
          <Route path="/" element={<ExcuseCard />} />
          <Route path="/add-excuse" element={<AddExcuse />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
