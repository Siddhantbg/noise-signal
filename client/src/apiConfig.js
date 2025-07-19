const production = process.env.NODE_ENV === 'production';

export const serverUrl = production
  ? 'https://noise-signal.vercel.app' // Replace with your deployed server URL
  : 'http://localhost:5000';