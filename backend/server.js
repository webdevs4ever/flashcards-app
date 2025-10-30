import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { default as flashcardRoutes } from './routes/flashcards.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
export const flashcardSets = [];

// Routes
app.use('/api/flashcards', flashcardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});