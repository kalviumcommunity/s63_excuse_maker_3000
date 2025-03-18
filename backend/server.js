require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors()); // Allow frontend requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Excuse Schema
const excuseSchema = new mongoose.Schema({
    text: String,
    category: String,
    createdAt: { type: Date, default: Date.now }
});

const Excuse = mongoose.model('Excuse', excuseSchema);

// API Route to Fetch Excuses
app.get('/api/excuses', async (req, res) => {
    try {
        const excuses = await Excuse.find();
        res.json(excuses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
