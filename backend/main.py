from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import List, Optional
from dotenv import load_dotenv
import os
import shutil

load_dotenv()

from rag.processor import DocumentProcessor
from rag.vector_store import VectorStoreManager
from rag.llm import LLMManager

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
        
        
        if file.filename.endswith(".pdf"):
            pages = processor.extract_text_from_pdf(file_path)
            chunks = processor.chunk_text(pages)
        elif file.filename.endswith(".txt"):
            pages = processor.extract_text_from_txt(file_path)
            chunks = processor.chunk_text(pages)
        else:
            continue
            
        
        vector_store.add_documents(subject_id, chunks, file.filename)
        
        file_info.append({
            "name": file.filename,
            "size": os.path.getsize(file_path),
            "type": file.filename.split(".")[-1]
        })
        
    return {"subject_id": subject_id, "files": file_info, "status": "success"}

@app.delete("/file")
async def delete_file(
    subject_id: str = Form(...),
    file_name: str = Form(...)
):
    try:
        deleted_count = vector_store.delete_file(subject_id, file_name)
        return {
            "status": "success",
            "message": f"Deleted {deleted_count} chunks for {file_name}",
            "chunks_removed": deleted_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(
    subject_id: str = Form(...),
    subject_name: str = Form("this subject"),
    message: str = Form(...),
    conversation_history: str = Form("[]")
):
    import json as _json
    
    try:
        history = _json.loads(conversation_history)
    except:
        history = []
    
    
    context_chunks = vector_store.search(subject_id, message)
    
    
    response = llm.generate_response(message, context_chunks, subject_name, history)
    return response

@app.post("/study")
async def study(
    subject_id: str = Form(...),
    subject_name: str = Form("this subject"),
    topic: str = Form(...)
):
    
    context_chunks = vector_store.search(subject_id, topic, n_results=10)
    
    
    response = llm.generate_study_material(topic, context_chunks, subject_name)
    return response

dist_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dist")
if os.path.exists(dist_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_dir, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = os.path.join(dist_dir, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
