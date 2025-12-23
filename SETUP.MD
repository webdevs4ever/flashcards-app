# Flashcard Generator with Claude API - Setup Guide

## 🎯 What's New

Your flashcard app now has AI-powered flashcard generation! The "Describe topic" tab uses Claude to automatically create flashcards from any topic you describe.

---

## 📦 Installation

### 1. Install New Dependency

Navigate to your backend folder and install the Anthropic SDK:

```bash
cd backend
npm install @anthropic-ai/sdk
```
### Updated key on 12.22

### 2. Get Your Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign in or create an account
3. Navigate to "API Keys"
4. Click "Create Key"
5. Copy your API key (starts with `sk-ant-...`)

### 3. Create .env File

Create a file named `.env` in your **backend** folder:

```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
PORT=5001
```

Replace `sk-ant-your-actual-key-here` with your actual API key.


---

## 🚀 Running the App

### Start Backend

```bash
cd backend
npm start
```

You should see:
```
Database initialized successfully
Server running on port 5001
Health check: http://localhost:5001/api/health
```

### Start Frontend

In a new terminal:
```bash
cd frontend
npm start
```

---

## 💡 How to Use

### Option 1: AI-Generated Flashcards (New!)

1. Click **"Describe topic"** tab
2. Type a topic description:
   - "Capitals of European countries"
   - "Key terms in cell biology"
   - "Spanish vocabulary for traveling"
3. Click **"Generate flashcards"**
4. Claude AI creates 10 flashcards automatically!

### Option 2: Manual Entry (Original)

1. Click **"Paste text"** tab
2. Enter flashcards in format: `term --> definition`
3. Click **"Generate flashcards"**

---

## 🎓 Example Topics to Try

- "Countries and their capitals in Asia"
- "Important dates in World War II"
- "Periodic table elements 1-20"
- "Common French phrases for beginners"
- "JavaScript array methods"
- "Parts of a cell and their functions"

---

## 💰 API Costs

- Claude Sonnet 4 is very affordable
- Generating 10 flashcards typically costs $0.01-0.03
- Monitor usage at: https://console.anthropic.com/

---

## ⚠️ Troubleshooting

### Error: "Failed to generate flashcards"

**Check 1: Is your API key correct?**
- Open `backend/.env`
- Make sure key starts with `sk-ant-`
- No extra spaces or quotes

**Check 2: Is the backend running?**
- Visit http://localhost:5001/api/health
- Should show: `{"status":"ok","message":"Server is running"}`

**Check 3: Did you restart the server?**
- After creating/editing .env, restart your backend:
  ```bash
  # Stop server (Ctrl+C)
  npm start
  ```

### Error: "Port 5001 already in use"

Change the port in `.env`:
```
PORT=5002
```

Then update frontend to match (in FlashcardGenerator.jsx, change all `http://localhost:5001` to `http://localhost:5002`)

### Backend shows "ANTHROPIC_API_KEY is not set"

- Make sure `.env` file is in the **backend** folder (not frontend)
- File must be named exactly `.env` (not `.env.txt`)
- Restart the server after creating the file

---

## 🔒 Security Notes

- **Never commit your .env file to Git!**
- The `.env` file should already be in your `.gitignore`
- Keep your API key private
- Don't share it in screenshots or public repos

---

## ✨ What Changed

### Fixed Bugs
- ✅ Port now correctly set to 5001
- ✅ Fixed console.log syntax error
- ✅ Frontend and backend ports now match

### New Features
- ✅ Claude API integration
- ✅ AI-generated flashcards from topic descriptions
- ✅ "Describe topic" button (renamed from "Paste URL")
- ✅ Automatic generation of 10 flashcards per topic

### What Stayed the Same
- ✅ Manual flashcard entry still works
- ✅ Card flipping animation
- ✅ Save/load flashcard sets
- ✅ All database functionality
- ✅ Your original UI design

---

## 📊 Technical Details

- **Model Used**: Claude Sonnet 4 (latest)
- **Flashcards per generation**: 10
- **Response format**: JSON
- **Average generation time**: 2-5 seconds

---

## 🎉 You're Ready!

1. Install dependency: `npm install @anthropic-ai/sdk`
2. Create `.env` file with your API key
3. Replace the 4 files
4. Restart both servers
5. Try the "Describe topic" feature!

Enjoy your AI-powered flashcards! 🚀