# AskMyNotes — Subject-Scoped Study Copilot

An AI-powered study assistant that lets students upload notes, ask questions, and get grounded answers with citations.

## Features

- **3 Subject Limit** — Create exactly 3 subjects to organize your study material
- **PDF & TXT Upload** — Extract text, chunk, and index your notes automatically
- **RAG-Powered Chat** — Ask questions and get AI answers grounded in your uploaded notes
- **Citations & Confidence** — Every answer includes source references and confidence levels
- **Study Mode** — Generate MCQs and short-answer questions from your notes
- **Strict Grounding** — If the answer isn't in your notes, it says so

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + TailwindCSS + Shadcn UI |
| Backend | FastAPI (Python) |
| AI | OpenRouter (Llama 3.3 70B) |
| Vector Store | Custom TF-IDF search engine |
| File Processing | pdfplumber |

## Setup

### Frontend
```bash
npm install
npm run dev -- --port 8081
```

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 seed_data.py          # Optional: seed Physics sample data
uvicorn main:app --port 8000
```

### Environment
Create `backend/.env`:
```
AI_API_KEY=your-openrouter-api-key
```

## Project Structure

```
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── contexts/           # State management
│   └── pages/              # Page layouts
├── backend/                # FastAPI backend
│   ├── main.py             # API server
│   ├── rag/
│   │   ├── processor.py    # PDF/TXT extraction & chunking
│   │   ├── vector_store.py # TF-IDF search engine
│   │   └── llm.py          # OpenRouter AI integration
│   └── seed_data.py        # Sample data seeder
```

## License

MIT
