const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define the Excuse Schema
const excuseSchema = new mongoose.Schema({
    text: String,
    category: String,
    createdAt: { type: Date, default: Date.now }
});

const Excuse = mongoose.model('Excuse', excuseSchema);

// **CRUD Operations**

// Create an excuse
router.post('/excuses', async (req, res) => {
    try {
        const { text, category } = req.body;
        const newExcuse = new Excuse({ text, category });
        await newExcuse.save();
        res.status(201).json(newExcuse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read all excuses
router.get('/excuses', async (req, res) => {
    try {
        const excuses = await Excuse.find();
        res.status(200).json(excuses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read a single excuse by ID
router.get('/excuses/:id', async (req, res) => {
    try {
        const excuse = await Excuse.findById(req.params.id);
        if (!excuse) return res.status(404).json({ message: 'Excuse not found' });
        res.status(200).json(excuse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an excuse by ID
router.put('/excuses/:id', async (req, res) => {
    try {
        const updatedExcuse = await Excuse.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedExcuse) return res.status(404).json({ message: 'Excuse not found' });
        res.status(200).json(updatedExcuse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an excuse by ID
router.delete('/excuses/:id', async (req, res) => {
    try {
        const deletedExcuse = await Excuse.findByIdAndDelete(req.params.id);
        if (!deletedExcuse) return res.status(404).json({ message: 'Excuse not found' });
        res.status(200).json({ message: 'Excuse deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
