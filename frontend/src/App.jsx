import React from "react";
import ExcuseCard from "./components/ExcuseCard";
import { motion } from "framer-motion";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      <motion.h1
        className="text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Excuse Maker 3000
      </motion.h1>
      <ExcuseCard />
    </div>
  );
};

export default App;
