// Entry point for backend server
// TODO: Initialize Express app, connect to MongoDB, and set up middleware/routes 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/user', userRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Notes App Backend is running');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/notes_app', {
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
}); 