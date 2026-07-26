import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './database.js';
import apiRouter from './routes.js';
import { initializeAuthSystem } from './controllers/authController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: false }));

// Attach routes
app.use('/api', apiRouter);

// Base Status Route
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'CivicPulse API Core'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.warn(`Invalid JSON payload received for ${req.originalUrl}`);
    return res.status(400).json({ error: 'Invalid JSON payload.' });
  }

  console.error(err.stack || err.message);
  res.status(500).json({ error: 'Something went wrong inside the server.' });
});

// Initialize database then start listening
const startServer = async () => {
  await initDb(process.env.MONGODB_URI);
  await initializeAuthSystem();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`========================================`);
    console.log(`  CIVICPULSE API SERVER RUNNING ON PORT ${PORT}`);
    console.log(`  Access locally at: http://localhost:${PORT}`);
    console.log(`========================================`);
  });
};

startServer();
