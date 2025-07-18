require('dotenv').config();
const express = require('express');
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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/countdown', countdownRoutes);
app.use('/api/background', backgroundRoutes);
app.use('/api/list', listRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
