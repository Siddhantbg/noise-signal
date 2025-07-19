const production = process.env.NODE_ENV === 'production';

export const serverUrl = production
  ? 'https://noise-signal-server.onrender.com' // Replace with your deployed server URL
  : 'http://localhost:5000';