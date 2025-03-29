require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { body, validationResult, param } = require('express-validator');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

// Connect to SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

// Test the connection
sequelize.authenticate()
  .then(() => console.log('Connected to SQLite database'))
  .catch(err => console.error('SQLite connection error:', err));

// Define User Model
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true // Making it nullable for existing users
  }
});

// Define Excuse Model
const Excuse = sequelize.define('Excuse', {
  text: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Define Relationships
User.hasMany(Excuse, { foreignKey: 'created_by' });
Excuse.belongsTo(User, { foreignKey: 'created_by' });

// 🔹 Middleware to handle validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// 🔹 JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.jwt;
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Sync models with database and seed data
const initializeDatabase = async () => {
  try {
    // Sync models with database (force: true will drop tables if they exist)
    await sequelize.sync({ force: true });
    console.log('Database synchronized');

    // Seed Users
    const users = await User.bulkCreate([
      { name: 'John Doe', email: 'john@example.com', password: 'password123' },
      { name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
      { name: 'Bob Johnson', email: 'bob@example.com', password: 'password123' }
    ]);
    console.log('Users seeded successfully');

    // Seed Excuses
    await Excuse.bulkCreate([
      { text: 'My dog ate my homework', category: 'School', created_by: users[0].id },
      { text: 'Traffic was terrible this morning', category: 'Work', created_by: users[0].id },
      { text: 'I had a family emergency', category: 'Personal', created_by: users[1].id },
      { text: 'My alarm didn\'t go off', category: 'Work', created_by: users[1].id },
      { text: 'I was abducted by aliens', category: 'Outlandish', created_by: users[2].id },
      { text: 'My internet was down', category: 'Work', created_by: users[2].id }
    ]);
    console.log('Excuses seeded successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Initialize the database
initializeDatabase();

// ✅ API to Fetch All Excuses
app.get('/api/excuses', async (req, res) => {
  try {
    const excuses = await Excuse.findAll({
      include: [{ model: User, attributes: ['id', 'name'] }]
    });
    res.json(excuses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ API to Fetch a Single Excuse by ID
app.get('/api/excuses/:id', async (req, res) => {
  try {
    const excuse = await Excuse.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'name'] }]
    });
    if (!excuse) return res.status(404).json({ message: 'Excuse not found' });
    res.json(excuse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ API to Update an Excuse
app.put('/api/excuses/:id', async (req, res) => {
  try {
    const excuse = await Excuse.findByPk(req.params.id);
    if (!excuse) return res.status(404).json({ message: 'Excuse not found' });
    
    await excuse.update(req.body);
    res.json(excuse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ API to Delete an Excuse
app.delete('/api/excuses/:id', async (req, res) => {
  try {
    const excuse = await Excuse.findByPk(req.params.id);
    if (!excuse) return res.status(404).json({ message: 'Excuse not found' });
    
    await excuse.destroy();
    res.json({ message: 'Excuse deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ API to Fetch All Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ API to Fetch Excuses by User
app.get('/api/excuses/by-user/:userId', async (req, res) => {
  try {
    const excuses = await Excuse.findAll({
      where: { created_by: req.params.userId },
      include: [{ model: User, attributes: ['id', 'name'] }]
    });
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
      const newExcuse = await Excuse.create({ text, category, created_by });
      
      // Fetch the created excuse with user information
      const excuseWithUser = await Excuse.findByPk(newExcuse.id, {
        include: [{ model: User, attributes: ['id', 'name'] }]
      });
      
      res.status(201).json(excuseWithUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ✅ API for Authentication

// Register endpoint
app.post('/api/auth/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      
      // Create new user
      const newUser = await User.create({ name, email, password });
      
      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, name: newUser.name, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      
      // Set JWT in cookie
      res.cookie('jwt', token, { 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });
      
      res.status(201).json({ 
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Login endpoint
app.post('/api/auth/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed. User not found.' });
      }
      
      // Verify password (in a real app, you would hash passwords)
      if (user.password !== password) {
        return res.status(401).json({ message: 'Authentication failed. Invalid password.' });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      
      // Set JWT in cookie
      res.cookie('jwt', token, { 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });
      
      res.json({ 
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get current user endpoint
app.get('/api/auth/me', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  // Clear the JWT cookie with the same options as when setting it
  res.clearCookie('jwt', { 
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
  res.json({ message: 'Logout successful' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});