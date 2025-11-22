# Flashcard App Setup Instructions
update as of 11.22

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn

## Installation

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend will run on http://localhost:5000

### 2. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:3000

## Usage

1. Open http://localhost:3000 in your browser
2. Choose "Paste text" or "Describe topic"
3. Enter your flashcards or topic
4. Click "Generate flashcards"
5. Click on any card to flip it
6. Save your flashcard sets for later use

## Features

- ✅ Parse manual flashcard input (term --> definition)
- ✅ Flip animation on cards
- ✅ Save flashcard sets
- ✅ Retrieve saved sets
- 🚧 AI-generated flashcards (TODO: Add API integration)

## Next Steps

1. Add database (MongoDB, PostgreSQL, etc.)
2. Integrate Claude API or OpenAI API for AI generation
3. Add user authentication
4. Add study mode with spaced repetition
5. Copy/paste youtube URLs and generate ?s

## API Endpoints

- `POST /api/flashcards/generate` - Generate flashcards from topic
- `POST /api/flashcards/save` - Save flashcard set
- `GET /api/flashcards/sets` - Get all saved sets
- `GET /api/flashcards/sets/:id` - Get specific set
- `DELETE /api/flashcards/sets/:id` - Delete set