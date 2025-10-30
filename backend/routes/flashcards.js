import express from 'express';
import { flashcardSets } from '../server.js';

const router = express.Router();

// Generate flashcards from topic description
router.post('/generate', async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // TODO: Integrate with Claude API or OpenAI API to generate flashcards
    // For now, return mock data
    const mockFlashcards = generateMockFlashcards(topic);

    res.json({ flashcards: mockFlashcards });
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

    const newSet = {
      id: Date.now(),
      title,
      flashcards,
      createdAt: new Date()
    };

    flashcardSets.push(newSet);

    res.json({ message: 'Flashcard set saved', set: newSet });
  } catch (error) {
    console.error('Error saving flashcards:', error);
    res.status(500).json({ error: 'Failed to save flashcards' });
  }
});

// Get all flashcard sets
router.get('/sets', (req, res) => {
  res.json({ sets: flashcardSets });
});

// Get specific flashcard set
router.get('/sets/:id', (req, res) => {
  const set = flashcardSets.find(s => s.id === parseInt(req.params.id));
  
  if (!set) {
    return res.status(404).json({ error: 'Flashcard set not found' });
  }

  res.json({ set });
});

// Delete flashcard set
router.delete('/sets/:id', (req, res) => {
  const index = flashcardSets.findIndex(s => s.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Flashcard set not found' });
  }

  flashcardSets.splice(index, 1);
  res.json({ message: 'Flashcard set deleted' });
});

// Mock flashcard generator (replace with AI integration)
function generateMockFlashcards(topic) {
  const templates = {
    'capitals': [
      { term: 'France', definition: 'Paris', id: Date.now() + 1 },
      { term: 'Japan', definition: 'Tokyo', id: Date.now() + 2 },
      { term: 'Brazil', definition: 'Brasília', id: Date.now() + 3 },
      { term: 'Australia', definition: 'Canberra', id: Date.now() + 4 }
    ],
    'default': [
      { term: 'Term 1', definition: `Definition for ${topic} - 1`, id: Date.now() + 1 },
      { term: 'Term 2', definition: `Definition for ${topic} - 2`, id: Date.now() + 2 },
      { term: 'Term 3', definition: `Definition for ${topic} - 3`, id: Date.now() + 3 }
    ]
  };

  if (topic.toLowerCase().includes('capital')) {
    return templates.capitals;
  }

  return templates.default;
}

export default router;