import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { flashcardSetDB, flashcardDB } from '../database.js';

const router = express.Router();

// Initialize Anthropic client
const anthropic = new Anthropic({
 apiKey: process.env.ANTHROPIC_API_KEY
});



// DEBUG: Log to verify API key is loading
console.log('API Key loaded in routes:', process.env.ANTHROPIC_API_KEY ? 'YES ✓' : 'NO ✗');
console.log('API Key starts with:', process.env.ANTHROPIC_API_KEY?.substring(0, 10));

// Generate flashcards from topic description
router.post('/generate', async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // Use Claude API to generate flashcards
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Generate 10 educational flashcards about: ${topic}

Create flashcards that would help someone learn this topic effectively. Each flashcard should have:
- A clear, concise term or question on the front
- A detailed but focused definition or answer on the back

Format your response as a JSON array like this:
[
  {
    "term": "Front of card",
    "definition": "Back of card"
  }
]

IMPORTANT: Respond ONLY with valid JSON. Do not include any markdown formatting, code blocks, or additional text.`
      }]
    });

    // Parse Claude's response
    let flashcards;
    try {
      const responseText = message.content[0].text.trim();
      // Remove markdown code blocks if present
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsedData = JSON.parse(cleanedText);
      
      // Add IDs to each flashcard
      flashcards = parsedData.map((card, index) => ({
        ...card,
        id: Date.now() + index
      }));
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      console.error('Raw response:', message.content[0].text);
      return res.status(500).json({ error: 'Failed to parse flashcards from AI' });
    }

    res.json({ flashcards });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    res.status(500).json({ error: 'Failed to generate flashcards' });
  }
});

// Save flashcard set
router.post('/save', (req, res) => {
  try {
    const { title, flashcards } = req.body;

    if (!title || !flashcards || !Array.isArray(flashcards)) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    // Create the flashcard set
    const setId = flashcardSetDB.create(title);

    // Add flashcards to the set
    flashcardDB.createMany(setId, flashcards);

    // Get the created set with its cards
    const set = flashcardSetDB.getById(setId);
    const cards = flashcardDB.getBySetId(setId);

    res.json({ 
      message: 'Flashcard set saved successfully', 
      set: {
        ...set,
        flashcards: cards
      }
    });
  } catch (error) {
    console.error('Error saving flashcards:', error);
    res.status(500).json({ error: 'Failed to save flashcards' });
  }
});

// Get all flashcard sets
router.get('/sets', (req, res) => {
  try {
    const sets = flashcardSetDB.getAll();
    res.json({ sets });
  } catch (error) {
    console.error('Error fetching flashcard sets:', error);
    res.status(500).json({ error: 'Failed to fetch flashcard sets' });
  }
});

// Get specific flashcard set with its cards
router.get('/sets/:id', (req, res) => {
  try {
    const setId = parseInt(req.params.id);
    const set = flashcardSetDB.getById(setId);
  
    if (!set) {
      return res.status(404).json({ error: 'Flashcard set not found' });
    }

    const flashcards = flashcardDB.getBySetId(setId);

    res.json({ 
      set: {
        ...set,
        flashcards
      }
    });
  } catch (error) {
    console.error('Error fetching flashcard set:', error);
    res.status(500).json({ error: 'Failed to fetch flashcard set' });
  }
});

// Update flashcard set title
router.put('/sets/:id', (req, res) => {
  try {
    const setId = parseInt(req.params.id);
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const updated = flashcardSetDB.update(setId, title);

    if (!updated) {
      return res.status(404).json({ error: 'Flashcard set not found' });
    }

    res.json({ message: 'Flashcard set updated successfully' });
  } catch (error) {
    console.error('Error updating flashcard set:', error);
    res.status(500).json({ error: 'Failed to update flashcard set' });
  }
});

// Delete flashcard set (and all its cards due to CASCADE)
router.delete('/sets/:id', (req, res) => {
  try {
    const setId = parseInt(req.params.id);
    const deleted = flashcardSetDB.delete(setId);
  
    if (!deleted) {
      return res.status(404).json({ error: 'Flashcard set not found' });
    }

    res.json({ message: 'Flashcard set deleted successfully' });
  } catch (error) {
    console.error('Error deleting flashcard set:', error);
    res.status(500).json({ error: 'Failed to delete flashcard set' });
  }
});

// Update a single flashcard
router.put('/cards/:id', (req, res) => {
  try {
    const cardId = parseInt(req.params.id);
    const { term, definition } = req.body;

    if (!term || !definition) {
      return res.status(400).json({ error: 'Term and definition are required' });
    }

    const updated = flashcardDB.update(cardId, term, definition);

    if (!updated) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }

    res.json({ message: 'Flashcard updated successfully' });
  } catch (error) {
    console.error('Error updating flashcard:', error);
    res.status(500).json({ error: 'Failed to update flashcard' });
  }
});

// Delete a single flashcard
router.delete('/cards/:id', (req, res) => {
  try {
    const cardId = parseInt(req.params.id);
    const deleted = flashcardDB.delete(cardId);

    if (!deleted) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }

    res.json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    res.status(500).json({ error: 'Failed to delete flashcard' });
  }
});

export default router;