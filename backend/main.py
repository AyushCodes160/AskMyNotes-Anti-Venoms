from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os
import shutil

from rag.processor import DocumentProcessor
from rag.vector_store import VectorStoreManager
from rag.llm import LLMManager

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG components
vector_store = VectorStoreManager()
llm = LLMManager()
processor = DocumentProcessor()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload")
async def upload_files(
    subject_id: str = Form(...),
    files: List[UploadFile] = File(...)
):
    all_chunks = []
    file_info = []
    
    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process based on extension
        if file.filename.endswith(".pdf"):
            pages = processor.extract_text_from_pdf(file_path)
            chunks = processor.chunk_text(pages)
        elif file.filename.endswith(".txt"):
            pages = processor.extract_text_from_txt(file_path)
            chunks = processor.chunk_text(pages)
        else:
            continue
            
        # Index in Vector DB
        vector_store.add_documents(subject_id, chunks, file.filename)
        
        file_info.append({
            "name": file.filename,
            "size": os.path.getsize(file_path),
            "type": file.filename.split(".")[-1]
        })
        
    return {"subject_id": subject_id, "files": file_info, "status": "success"}

@app.post("/chat")
async def chat(
    subject_id: str = Form(...),
    message: str = Form(...)
):
    # 1. Semantic Search
    context_chunks = vector_store.search(subject_id, message)
    
    # 2. Get Subject Name (could be passed in or stored)
    # For now, we'll assume the client knows it or we'd fetch it from a DB
    subject_name = f"Subject {subject_id}" 
    
    # 3. Generate grounded response
    response = llm.generate_response(message, context_chunks, subject_name)
    return response

@app.post("/study")
async def study(
    subject_id: str = Form(...),
    topic: str = Form(...)
):
    # 1. Semantic Search for the topic
    context_chunks = vector_store.search(subject_id, topic, n_results=10)
    
    # 2. Generate study material
    response = llm.generate_study_material(topic, context_chunks, f"Subject {subject_id}")
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
