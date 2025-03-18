require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { body, validationResult, param } = require('express-validator');

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

// 🔹 Middleware to handle validation errors
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// ✅ API Route to Fetch All Excuses
app.get('/api/excuses', async (req, res) => {
    try {
        const excuses = await Excuse.find();
        res.json(excuses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ API Route to Fetch a Single Excuse by ID (with Validation)
app.get('/api/excuses/:id', 
    param('id').isMongoId().withMessage('Invalid excuse ID format'),
    validateRequest,
    async (req, res) => {
        try {
            const excuse = await Excuse.findById(req.params.id);
            if (!excuse) return res.status(404).json({ message: "Excuse not found" });
            res.json(excuse);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
});

// ✅ API Route to Add a New Excuse (with Validation)
app.post('/api/excuses',
    [
        body('text').notEmpty().withMessage('Text is required').isLength({ min: 5 }).withMessage('Text must be at least 5 characters long'),
        body('category').notEmpty().withMessage('Category is required').isAlpha().withMessage('Category must contain only letters')
    ],
    validateRequest,
    async (req, res) => {
        try {
            const { text, category } = req.body;
            const newExcuse = new Excuse({ text, category });
            await newExcuse.save();
            res.status(201).json(newExcuse);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// ✅ API Route to Update an Excuse (with Validation)
app.put('/api/excuses/:id',
    [
        param('id').isMongoId().withMessage('Invalid excuse ID format'),
        body('text').optional().isLength({ min: 5 }).withMessage('Text must be at least 5 characters long'),
        body('category').optional().isAlpha().withMessage('Category must contain only letters')
    ],
    validateRequest,
    async (req, res) => {
        try {
            const { text, category } = req.body;
            const updatedExcuse = await Excuse.findByIdAndUpdate(
                req.params.id,
                { text, category },
                { new: true }
            );
            if (!updatedExcuse) return res.status(404).json({ message: "Excuse not found" });
            res.json(updatedExcuse);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// ✅ API Route to Delete an Excuse (with Validation)
app.delete('/api/excuses/:id',
    param('id').isMongoId().withMessage('Invalid excuse ID format'),
    validateRequest,
    async (req, res) => {
        try {
            const deletedExcuse = await Excuse.findByIdAndDelete(req.params.id);
            if (!deletedExcuse) return res.status(404).json({ message: "Excuse not found" });
            res.json({ message: "Excuse deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
