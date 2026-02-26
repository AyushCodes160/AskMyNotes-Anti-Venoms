# Technical Architecture

This document outlines the system architecture and data flow for AskMyNotes.

## 1. System Overview

AskMyNotes operates on a decoupled client-server architecture:
- **Frontend:** React SPA built with Vite, TypeScript, and TailwindCSS.
- **Backend:** Python FastAPI server handling document processing, vector search, and LLM communication.

---

## 2. Core Components

### Frontend (React + Vite)
- **State Management:** React Context (`AppContext.tsx`) handles global state (subjects, files, active views, chat history).
- **Styling System:** Tailwind CSS with a custom Dribbble-inspired dark glassmorphism theme (`index.css`).
- **Routing:** React Router DOM managing navigation between Landing, App Dashboard, How to Use, and About pages.
- **Components:** Modular component design (`SubjectSidebar`, `ChatInterface`, `FileManager`, `StudyMode`).

### Backend (FastAPI)
- **API Layer:** `main.py` exposes REST endpoints for file upload, deletion, chat generation, and study mode generation.
- **RAG Pipeline (Retrieval-Augmented Generation):**
  - **Document Processor (`processor.py`):** Uses `pdfplumber` to extract text from PDFs and TXT files. It chunks the text into manageable segments, associating each chunk with metadata (filename, page number).
  - **Vector Store (`vector_store.py`):** Implements a lightweight, local, in-memory search engine using Term Frequency-Inverse Document Frequency (TF-IDF) via scikit-learn. It uses Cosine Similarity to score chunks against user queries.
  - **LLM Integration (`llm.py`):** Connects to OpenRouter's API using the `openai` Python client to access the `meta-llama/Llama-3.3-70B-Instruct` model. It injects the retrieved chunks into a strict system prompt to enforce grounding.

---

## 3. Data Flow: Chat Request

1. **User Input:** User types a question in the `ChatInterface`.
2. **Frontend Validation:** Frontend ensures a subject is selected and sends the query along with the list of files belonging to that subject to the backend `/chat` endpoint.
3. **Retrieval (Backend):**
   - The backend checks its in-memory document store for the requested files.
   - The `VectorStore` builds a TF-IDF matrix for the chunks corresponding to those specific files.
   - It calculates cosine similarity between the query and all chunks.
   - It returns the top 5 most relevant chunks (if their score exceeds a minimum confidence threshold).
4. **Generation (Backend):**
   - The retrieved chunks are formatted into an evidence block.
   - The `llm.generate_response()` function constructs a prompt containing the evidence and the user's question, strictly instructing the LLM to only use the provided evidence.
   - The LLM stream is awaited, and the final response + citations are returned to the frontend.
5. **Display:** The frontend renders the markdown response and displays the citation metadata in the UI.

---

## 4. Directory Structure

```text
/Users/ayushkumar/Desktop/askmynotes-copilot/
├── PITCH.md                      # Hackathon pitch script
├── ARCHITECTURE.md               # Technical structure (This file)
├── README.md                     # Setup instructions
├── index.html                    # Application entry point
├── tailwind.config.ts            # Tailwind CSS configuration
├── package.json                  # Node dependencies
├── public/                       # Static public assets
│   └── logo.jpeg                 # AskMyNotes App Icon / Favicon
├── src/                          # Frontend Source Code
│   ├── App.tsx                   # Main React Router setup
│   ├── main.tsx                  # React DOM rendering
│   ├── index.css                 # Global CSS and Theme variables
│   ├── components/               # Reusable UI components
│   │   ├── ChatInterface.tsx     # Chat UI & message rendering
│   │   ├── FileManager.tsx       # File upload & list
│   │   ├── Navbar.tsx            # Top navigation
│   │   ├── StudyMode.tsx         # MCQ & Short Question generator UI
│   │   ├── SubjectSidebar.tsx    # Left sidebar for subject management
│   │   └── ThemeProvider.tsx     # Theme toggler context wrapper
│   ├── contexts/                 # React Contexts
│   │   └── AppContext.tsx        # Global state (subjects, files, chat history)
│   └── pages/                    # Route pages
│       ├── About.tsx             # Technology explanation page
│       ├── HowToUse.tsx          # Step-by-step guide
│       └── Landing.tsx           # Marketing landing page
└── backend/                      # Python Backend
    ├── main.py                   # FastAPI application & endpoints
    ├── requirements.txt          # Python dependencies
    ├── .env                      # Environment variables (OpenRouter API Key)
    └── rag/                      # Core RAG Logic
        ├── llm.py                # OpenRouter client configuration
        ├── processor.py          # PDF/TXT extraction and chunking
        └── vector_store.py       # TF-IDF search and indexing
```
