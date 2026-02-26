import pdfplumber
from typing import List, Dict
import os

class DocumentProcessor:
    @staticmethod
    def extract_text_from_pdf(file_path: str) -> List[Dict]:
        pages_content = []
        with pdfplumber.open(file_path) as pdf:
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text:
                    pages_content.append({
                        "page_number": i + 1,
                        "content": text
                    })
        return pages_content

    @staticmethod
    def chunk_text(pages: List[Dict], chunk_size: int = 500, overlap: int = 150) -> List[Dict]:
        chunks = []
        for page in pages:
            text = page["content"]
            
            start = 0
            while start < len(text):
                end = start + chunk_size
                chunk = text[start:end]
                chunks.append({
                    "page_number": page["page_number"],
                    "content": chunk,
                    "chunk_id": f"p{page['page_number']}_c{len(chunks)}"
                })
                start += (chunk_size - overlap)
        return chunks

    @staticmethod
    def extract_text_from_txt(file_path: str) -> List[Dict]:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
            return [{"page_number": 1, "content": text}]
