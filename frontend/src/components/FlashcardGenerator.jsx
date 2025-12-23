import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';

export default function FlashcardGenerator({ loadedSet, onClearLoaded }) {
  const [activeTab, setActiveTab] = useState('describe');
  const [inputText, setInputText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load flashcards when a set is loaded from saved sets
  useEffect(() => {
    if (loadedSet) {
      setFlashcards(loadedSet.flashcards);
      setInputText(loadedSet.title);
      setFlippedCards({});
    }
  }, [loadedSet]);

  const parseFlashcards = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const cards = [];
    
    lines.forEach(line => {
      const separators = ['-->', '->', ':'];
      let separator = separators.find(sep => line.includes(sep));
      
      if (separator) {
        const [term, definition] = line.split(separator).map(s => s.trim());
        if (term && definition) {
          cards.push({ term, definition, id: Date.now() + Math.random() });
        }
      }
    });
    
    return cards;
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    
    setError('');
    setLoading(true);

    try {
      if (activeTab === 'describe') {
        // Call backend API to generate flashcards from topic description
        const response = await axios.post('http://localhost:5001/api/flashcards/generate', {
          topic: inputText
        });
        setFlashcards(response.data.flashcards);
      } else {
        // Parse manually entered flashcards
        const newCards = parseFlashcards(inputText);
        if (newCards.length === 0) {
          setError('No valid flashcards found. Use format: "term --> definition"');
        } else {
          setFlashcards(newCards);
        }
      }
      setFlippedCards({});
      if (onClearLoaded) onClearLoaded();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate flashcards');
      console.error('Error generating flashcards:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFlip = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const resetCards = () => {
    setFlashcards([]);
    setInputText('');
    setFlippedCards({});
    setError('');
    if (onClearLoaded) onClearLoaded();
  };

  const saveFlashcardSet = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/flashcards/save', {
        title: inputText.slice(0, 50) || 'Untitled Set',
        flashcards
      });
      alert('Flashcard set saved successfully!');
    } catch (err) {
      alert('Failed to save flashcard set');
      console.error('Error saving flashcards:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-8">
      <div className="max-w-4xl mx-auto">
        {flashcards.length === 0 ? (
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-white text-center mb-12">
              Create flashcards
            </h1>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setActiveTab('paste')}
                className={`px-8 py-3 rounded-full text-lg font-medium transition-all ${
                  activeTab === 'paste'
                    ? 'bg-white/30 text-white backdrop-blur-sm'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Paste text
              </button>
              <button
                onClick={() => setActiveTab('describe')}
                className={`px-8 py-3 rounded-full text-lg font-medium transition-all ${
                  activeTab === 'describe'
                    ? 'bg-white text-gray-800 shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Describe topic
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  activeTab === 'describe'
                    ? "Describe a topic and Claude will generate flashcards...\n\ne.g., Capitals of European countries\ne.g., Key concepts in photosynthesis\ne.g., Spanish vocabulary for food"
                    : "Paste your flashcards:\nUSA --> United States of America\nUK --> United Kingdom\nEU --> European Union"
                }
                className="w-full h-64 text-gray-600 text-lg resize-none focus:outline-none placeholder-gray-400"
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white text-xl font-semibold py-5 rounded-full shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate flashcards'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">
                Your Flashcards ({flashcards.length})
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={saveFlashcardSet}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full transition-all"
                >
                  Save Set
                </button>
                <button
                  onClick={resetCards}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full transition-all backdrop-blur-sm"
                >
                  <Plus className="w-5 h-5" />
                  New Set
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {flashcards.map((card) => (
                <div
                  key={card.id}
                  className="h-64 cursor-pointer"
                  style={{ perspective: '1000px' }}
                  onClick={() => toggleFlip(card.id)}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.5s',
                      transform: flippedCards[card.id] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                  >
                    <div
                      className="absolute w-full h-full bg-white rounded-2xl shadow-xl p-8 flex items-center justify-center"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="text-center">
                        <p className="text-3xl font-bold text-gray-800">
                          {card.term}
                        </p>
                        <p className="text-sm text-gray-400 mt-4">Click to flip</p>
                      </div>
                    </div>

                    <div
                      className="absolute w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 flex items-center justify-center"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-white">
                          {card.definition}
                        </p>
                        <p className="text-sm text-white/70 mt-4">Click to flip back</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}