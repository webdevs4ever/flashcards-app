import express from 'express';
import { flashcardSetDB, flashcardDB } from '../database.js';

const router = express.Router();

// Generate flashcards from topic description
router.post('/generate', async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // TODO: Integrate with Claude API to generate flashcards
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

// Mock flashcard generator (replace with AI integration)
function generateMockFlashcards(topic) {
  const templates = {
    'capitals': [
      { term: 'France', definition: 'Paris', id: Date.now() + 1 },
      { term: 'Japan', definition: 'Tokyo', id: Date.now() + 2 },
      { term: 'Brazil', definition: 'Brasília', id: Date.now() + 3 },
      { term: 'Australia', definition: 'Canberra', id: Date.now() + 4 },
      { term: 'Canada', definition: 'Ottawa', id: Date.now() + 5 }
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