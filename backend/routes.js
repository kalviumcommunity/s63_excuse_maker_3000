const express = require('express');
const router = express.Router();
const Log = require('./models/logs'); // Import the Log model

// Create a new log entry
router.post('/logs', async (req, res) => {
    try {
        const newLog = new Log(req.body);
        await newLog.save();
        res.status(201).json(newLog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all logs
router.get('/logs', async (req, res) => {
    try {
        const logs = await Log.find();
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single log by ID
router.get('/logs/:id', async (req, res) => {
    try {
        const log = await Log.findById(req.params.id);
        if (!log) return res.status(404).json({ message: 'Log not found' });
        res.status(200).json(log);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a log
router.put('/logs/:id', async (req, res) => {
    try {
        const updatedLog = await Log.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedLog) return res.status(404).json({ message: 'Log not found' });
        res.status(200).json(updatedLog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a log
router.delete('/logs/:id', async (req, res) => {
    try {
        const deletedLog = await Log.findByIdAndDelete(req.params.id);
        if (!deletedLog) return res.status(404).json({ message: 'Log not found' });
        res.status(200).json({ message: 'Log deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
