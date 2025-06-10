const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// ==========================================================
// CHANGE 1: Import the authentication middleware
// Make sure you have created the 'middleware/auth.js' file as described before.
// ==========================================================
const authMiddleware = require('./middleware/auth');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from the root directory (e.g., css, js, assets)
app.use(express.static(__dirname)); 
// Serving static files from a 'public' folder is also a common and good practice.
// If your css/js folders are in the root, the above line is correct.

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vensysco-cloud', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/auth', require('./routes/auth'));
// Note: Ensure your route files are in a 'routes' directory
app.use('/api/cloud-services', require('./routes/cloudServices')); 

// Serve HTML Pages
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Unprotected pages like login and signup are served directly
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});


// ==========================================================
// CHANGE 2: Protect the datacenter and cloud-services routes
// We add 'authMiddleware' before the function that sends the file.
// Express will run our middleware first. If the user is not logged in,
// the middleware will redirect them to the login page.
// ==========================================================
app.get('/datacenter', authMiddleware, (req, res) => {
  res.sendFile(__dirname + '/datacenter.html');
});

app.get('/cloud-services', authMiddleware, (req, res) => {
  res.sendFile(__dirname + '/cloud-services.html');
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + '/404.html'); // Optional: create a 404.html page
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});