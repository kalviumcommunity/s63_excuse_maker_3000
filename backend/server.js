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

// Define User Schema (For Demo Purposes)
const userSchema = new mongoose.Schema({
    name: String,
    email: String
});
const User = mongoose.model('User', userSchema);

// Define Excuse Schema
const excuseSchema = new mongoose.Schema({
    text: String,
    category: String,
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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

// ✅ API to Fetch All Users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ API to Fetch Excuses by User
app.get('/api/excuses/by-user/:userId', async (req, res) => {
    try {
        const excuses = await Excuse.find({ created_by: req.params.userId }).populate('created_by', 'name');
        res.json(excuses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ API to Create an Excuse with `created_by`
app.post('/api/excuses',
    [
        body('text').notEmpty().withMessage('Text is required'),
        body('category').notEmpty().withMessage('Category is required'),
        body('created_by').notEmpty().withMessage('Created_by (User ID) is required')
    ],
    validateRequest,
    async (req, res) => {
        try {
            const { text, category, created_by } = req.body;
            const newExcuse = new Excuse({ text, category, created_by });
            await newExcuse.save();
            res.status(201).json(newExcuse);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
