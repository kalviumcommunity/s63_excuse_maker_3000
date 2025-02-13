require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./connectDB"); // Import connectDB
const logsRoutes = require('./routes.js')

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
connectDB();

app.get("/", (req, res) => {
    res.send("Welcome to the Excuse Maker 3000");
  });


  app.use("/api", postRoutes); // All routes are prefixed with /api

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
