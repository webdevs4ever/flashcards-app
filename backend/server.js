import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './database.js';
import flashcardRoutes from './routes/flashcards.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// backend/server.js or backend/routes/flashcards.js
// import Anthropic from '@anthropic-ai/sdk';

// const anthropic = new Anthropic({
//  apiKey: process.env.ANTHROPIC_API_KEY
// });

// Use it to generate flashcards
// const message = await anthropic.messages.create({
//   model: 'claude-sonnet-4-5-20250929',
//   max_tokens: 1024,
//   messages: [{
//     role: 'user',
//     content: 'Generate 5 flashcards about photosynthesis'
//   }]
// });

// Initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/flashcards', flashcardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});