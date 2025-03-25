import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import AddExcuse from "./pages/AddExcuse";
import UpdateExcuse from "./pages/UpdateExcuse";
import ExcuseCard from "./components/ExcuseCard";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-indigo-600 to-cyan-500 text-white p-6">
        <header className="w-full max-w-4xl mb-8">
          <h1 className="text-4xl font-bold text-center mb-8 animate-fade-in">
            Excuse Maker <span className="text-orange-400">3000</span>
          </h1>
          
          <nav className="glass-effect flex justify-center space-x-6 p-4 rounded-xl">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/add-excuse" className="nav-link">Add Excuse</Link>
          </nav>
        </header>
        
        <main className="w-full max-w-4xl flex-grow animate-fade-in">
          <Routes>
            <Route path="/" element={<ExcuseCard />} />
            <Route path="/add-excuse" element={<AddExcuse />} />
            <Route path="/update-excuse/:id" element={<UpdateExcuse />} />
          </Routes>
        </main>
        
        <footer className="mt-12 text-center text-sm opacity-80 w-full">
          <p>© {new Date().getFullYear()} Excuse Maker 3000. All excuses guaranteed to be somewhat believable.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;