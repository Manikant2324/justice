const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedData = require('./seed/seed');

dotenv.config();

const app = express();

// Connect Database
connectDB().then(async () => {
  await seedData();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads folder for serving media & document attachments
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/cases', require('./routes/messageRoutes'));
app.use('/api/cases', require('./routes/documentRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/cases', require('./routes/noteRoutes'));

// Root welcome & health endpoints (Public - No Token Required)
app.get('/', (req, res) => {
  res.json({ status: 'active', message: 'JusticeHub Legal Case Management REST API Server Live' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', message: 'JusticeHub REST API Active' });
});

// Dedicated Public Ping & Database Status Endpoint (No Token Required)
app.get('/api/ping', (req, res) => {
  const mongoose = require('mongoose');
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    databaseStatus: states[dbState] || 'unknown',
    authenticationRequired: false,
    message: 'JusticeHub backend API is fully operational and publicly reachable!'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[JusticeHub Server Error]:', err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`  JUSTICEHUB REST API Server running on port ${PORT}`);
      console.log(`  Client & Lawyer Portal API endpoint: http://localhost:${PORT}/api`);
      console.log(`  Management Director API endpoint: http://localhost:${PORT}/api/admin`);
    });
  });
} else {
  connectDB();
}

module.exports = app;

