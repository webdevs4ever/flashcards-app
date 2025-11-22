import React, { useState } from 'react';
import FlashcardGenerator from './components/FlashcardGenerator';
import SavedSets from './components/SavedSets';

function App() {
  const [view, setView] = useState('create'); // 'create' or 'saved'
  const [loadedSet, setLoadedSet] = useState(null);

  const handleLoadSet = (set) => {
    // Convert database flashcards to the format expected by FlashcardGenerator
    const flashcards = set.flashcards.map(card => ({
      id: card.id,
      term: card.term,
      definition: card.definition
    }));
    
    setLoadedSet({ title: set.title, flashcards });
    setView('create');
  };

  return (
    <div className="App">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-8 py-4 flex gap-4">
          <button
            onClick={() => setView('create')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              view === 'create'
                ? 'bg-white text-blue-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Create Flashcards
          </button>
          <button
            onClick={() => setView('saved')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              view === 'saved'
                ? 'bg-white text-blue-600 shadow-lg'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            My Sets
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20">
        {view === 'create' ? (
          <FlashcardGenerator loadedSet={loadedSet} onClearLoaded={() => setLoadedSet(null)} />
        ) : (
          <SavedSets onLoadSet={handleLoadSet} />
        )}
      </div>
    </div>
  );
}

export default App;