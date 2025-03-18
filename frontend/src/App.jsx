import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import AddExcuse from "./pages/AddExcuse";
import UpdateExcuse from "./pages/UpdateExcuse";
import ExcuseCard from "./components/ExcuseCard";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-primary to-secondary text-white">
        <nav className="flex space-x-6 bg-white shadow-md p-4 rounded-lg text-primary">
          <Link to="/" className="font-semibold hover:text-secondary transition">Home</Link>
          <Link to="/add-excuse" className="font-semibold hover:text-secondary transition">Add Excuse</Link>
        </nav>
        <div className="mt-6 w-full max-w-4xl">
          <Routes>
            <Route path="/" element={<ExcuseCard />} />
            <Route path="/add-excuse" element={<AddExcuse />} />
            <Route path="/update-excuse/:id" element={<UpdateExcuse />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
