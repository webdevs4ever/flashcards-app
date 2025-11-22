import React, { useState, useEffect } from 'react';
import { Trash2, Edit, BookOpen } from 'lucide-react';
import axios from 'axios';

export default function SavedSets({ onLoadSet }) {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSets();
  }, []);

  const fetchSets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/flashcards/sets');
      setSets(response.data.sets);
      setError('');
    } catch (err) {
      setError('Failed to load flashcard sets');
      console.error('Error fetching sets:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSet = async (id) => {
    if (!confirm('Are you sure you want to delete this set?')) return;

    try {
      await axios.delete(`http://localhost:5001/api/flashcards/sets/${id}`);
      fetchSets(); // Refresh the list
    } catch (err) {
      alert('Failed to delete set');
      console.error('Error deleting set:', err);
    }
  };

  const loadSet = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/flashcards/sets/${id}`);
      onLoadSet(response.data.set);
    } catch (err) {
      alert('Failed to load set');
      console.error('Error loading set:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-white text-center mb-12">
          My Flashcard Sets
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {sets.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <p className="text-gray-600 text-xl">No saved flashcard sets yet.</p>
            <p className="text-gray-400 mt-2">Create your first set to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sets.map((set) => (
              <div
                key={set.id}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {set.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {set.card_count} cards
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Created: {new Date(set.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteSet(set.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={() => loadSet(set.id)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  Study This Set
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}