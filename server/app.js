require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const countdownRoutes = require('./routes/countdownRoutes');
const backgroundRoutes = require('./routes/backgroundRoutes');
const listRoutes = require('./routes/listRoutes');

const app = express();

// Debug logging
console.log('Environment:', process.env.NODE_ENV);
console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'https://noise-signal.vercel.app',
];

// Add debugging to CORS
app.use(cors({
  origin: function (origin, callback) {
    console.log('CORS Origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      console.log('CORS: Origin allowed');
      callback(null, true);
    } else {
      console.log('CORS: Origin not allowed');
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add a preflight handler for all routes
app.options('*', cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Add a basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Get the MongoDB URI from the environment variables
const mongoURI = process.env.MONGODB_URI;

// Check if the MongoDB URI is set
if (!mongoURI) {
  console.error('MongoDB connection error: MONGODB_URI is not set in your .env file');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Successfully connected to MongoDB!'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  console.log('\n--- Please check your MongoDB connection string in the .env file ---');
  console.log('It should look like this: MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority');
  console.log('For local MongoDB: MONGODB_URI=mongodb://localhost:27017/<database-name>');
  console.log('---------------------------------------------------------------------\n');
});

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
  next();
});

// Routes
app.use('/api/countdown', countdownRoutes);
app.use('/api/backgrounds', require('./routes/backgroundsRoutes'));
app.use('/api/user/background', require('./routes/userSettingsRoutes'));
app.use('/api/background', backgroundRoutes);
app.use('/api/lists', listRoutes);

// Add a catch-all route to see what's being requested
app.use('*', (req, res) => {
  console.log(`Unhandled route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
  console.log('Allowed origins:', allowedOrigins);
});