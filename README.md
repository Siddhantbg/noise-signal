# Noise & Signal

A mobile-first, minimalistic productivity web app designed to help users track their time, distractions, and focus. Built with React.js, Tailwind CSS, Node.js, Express, and MongoDB.

## Features

- 📱 Mobile-First Layout with Tailwind CSS
- ⏳ Live Countdown Timer
- 🧠 Noise & Signal Tabs for tracking distractions and productive activities
- 🖼️ Customizable Background
- 🔧 Settings UI for customization
- 🛠️ Progressive Web App (PWA) support for offline use and installation

## Project Structure

```
📁 client/
├── src/
│   ├── App.jsx
│   ├── index.css (Tailwind CSS)
│   └── components/
│       ├── Countdown.jsx
│       ├── TabSwitcher.jsx
│       ├── List.jsx
│       ├── BackgroundUploader.jsx
│       └── Settings.jsx

📁 server/
├── models/
│   ├── Countdown.js
│   ├── TaskList.js
│   └── Background.js
├── routes/
│   ├── countdownRoutes.js
│   ├── listRoutes.js
│   └── backgroundRoutes.js
├── app.js
├── .env
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/noise-signal.git
   cd noise-signal
   ```

2. Install dependencies
   ```bash
   npm run install-all
   ```

3. Configure MongoDB
   - Update the MongoDB connection string in `server/.env`
   - For local MongoDB: `MONGODB_URI=mongodb://localhost:27017/noise-signal`
   - For MongoDB Atlas: `MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/noise-signal?retryWrites=true&w=majority`

4. Start the development server
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Deployment

### Building for Production

```bash
cd client
npm run build
```

This will create a production build in the `client/build` directory that can be served by the Express server.

### Deploying to a Hosting Service

You can deploy this application to services like Heroku, Vercel, or Netlify. Make sure to set up the environment variables for your MongoDB connection.

## PWA Installation

The app can be installed as a Progressive Web App on mobile devices:

1. Open the app in a mobile browser
2. Tap the browser's menu button
3. Select "Add to Home Screen" or "Install"

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React.js](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)