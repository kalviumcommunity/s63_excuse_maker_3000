import React from "react";
import ExcuseCard from "./components/ExcuseCard";

const App = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Excuse Maker 3000</h1>
      <ExcuseCard />
    </div>
  );
};

export default App;
