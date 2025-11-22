import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create/open database
const db = new Database(join(__dirname, 'flashcards.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables
export function initializeDatabase() {
  // Create flashcard sets table
  db.exec(`
    CREATE TABLE IF NOT EXISTS flashcard_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create flashcards table
  db.exec(`
    CREATE TABLE IF NOT EXISTS flashcards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      set_id INTEGER NOT NULL,
      term TEXT NOT NULL,
      definition TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (set_id) REFERENCES flashcard_sets(id) ON DELETE CASCADE
    )
  `);

  console.log('Database initialized successfully');
}

// Flashcard Set operations
export const flashcardSetDB = {
  create: (title) => {
    const stmt = db.prepare('INSERT INTO flashcard_sets (title) VALUES (?)');
    const result = stmt.run(title);
    return result.lastInsertRowid;
  },

  getAll: () => {
    const stmt = db.prepare(`
      SELECT 
        fs.*,
        COUNT(f.id) as card_count
      FROM flashcard_sets fs
      LEFT JOIN flashcards f ON fs.id = f.set_id
      GROUP BY fs.id
      ORDER BY fs.created_at DESC
    `);
    return stmt.all();
  },

  getById: (id) => {
    const stmt = db.prepare('SELECT * FROM flashcard_sets WHERE id = ?');
    return stmt.get(id);
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM flashcard_sets WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  update: (id, title) => {
    const stmt = db.prepare(`
      UPDATE flashcard_sets 
      SET title = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    const result = stmt.run(title, id);
    return result.changes > 0;
  }
};

// Flashcard operations
export const flashcardDB = {
  createMany: (setId, flashcards) => {
    const stmt = db.prepare(`
      INSERT INTO flashcards (set_id, term, definition) 
      VALUES (?, ?, ?)
    `);

    const insertMany = db.transaction((cards) => {
      for (const card of cards) {
        stmt.run(setId, card.term, card.definition);
      }
    });

    insertMany(flashcards);
  },

  getBySetId: (setId) => {
    const stmt = db.prepare('SELECT * FROM flashcards WHERE set_id = ? ORDER BY id');
    return stmt.all(setId);
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM flashcards WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  update: (id, term, definition) => {
    const stmt = db.prepare(`
      UPDATE flashcards 
      SET term = ?, definition = ? 
      WHERE id = ?
    `);
    const result = stmt.run(term, definition, id);
    return result.changes > 0;
  }
};

export default db;