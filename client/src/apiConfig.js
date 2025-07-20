export const serverUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Log the current environment and API URL for debugging
console.log('Current environment:', process.env.NODE_ENV);
console.log('API URL:', serverUrl);