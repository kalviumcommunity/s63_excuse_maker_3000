require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

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

// API Route to Add a New Excuse
app.post('/api/excuses', async (req, res) => {
    try {
        const { text, category } = req.body;
        const newExcuse = new Excuse({ text, category });
        await newExcuse.save();
        res.status(201).json(newExcuse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API Route to Update an Excuse
app.put('/api/excuses/:id', async (req, res) => {
    try {
        const { text, category } = req.body;
        const updatedExcuse = await Excuse.findByIdAndUpdate(
            req.params.id,
            { text, category },
            { new: true }
        );
        res.json(updatedExcuse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API Route to Delete an Excuse
app.delete('/api/excuses/:id', async (req, res) => {
    try {
        await Excuse.findByIdAndDelete(req.params.id);
        res.json({ message: "Excuse deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
