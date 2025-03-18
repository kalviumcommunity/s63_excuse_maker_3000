require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Use Routes
app.use('/api', routes);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
