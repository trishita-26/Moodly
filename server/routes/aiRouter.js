// File: routes/aiRouter.js
import express from 'express';
import { generateImage } from '../controller/aiController.js'; // Make sure this path is correct

const aiRouter = express.Router();

// Add some logging to debug
aiRouter.use((req, res, next) => {
  console.log(`🤖 AI Router: ${req.method} ${req.originalUrl}`);
  next();
});

aiRouter.post('/generate', generateImage);

// Test route to verify router is working
aiRouter.get('/test', (req, res) => {
  res.json({ message: 'AI router is working!' });
});

export default aiRouter;