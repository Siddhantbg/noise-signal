require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const countdownRoutes = require('./routes/countdownRoutes');
const backgroundRoutes = require('./routes/backgroundRoutes');
const listRoutes = require('./routes/listRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

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


// Routes
app.use('/api/countdown', countdownRoutes);
app.use('/api/backgrounds', require('./routes/backgroundsRoutes'));
app.use('/api/user/background', require('./routes/userSettingsRoutes'));
app.use('/api/background', backgroundRoutes);
app.use('/api/lists', listRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});