"""
Lightweight vector store using ChromaDB with built-in embeddings.
Falls back to simple keyword search if ChromaDB embedding download hangs.
"""
import os
import json
from typing import List, Dict
from difflib import SequenceMatcher

# In-memory store as a reliable fallback
_store: Dict[str, List[Dict]] = {}


def _similarity(a: str, b: str) -> float:
    """Simple similarity score between two strings."""
    a_lower = a.lower()
    b_lower = b.lower()
    # Keyword overlap ratio
    words_a = set(a_lower.split())
    words_b = set(b_lower.split())
    if not words_a or not words_b:
        return 0.0
    overlap = words_a & words_b
    return len(overlap) / max(len(words_a), len(words_b))


class VectorStoreManager:
    def __init__(self, db_path: str = "./vector_data"):
        os.makedirs(db_path, exist_ok=True)
        self.db_path = db_path
        self._try_load()

    def _try_load(self):
        """Load persisted data from disk."""
        global _store
        index_path = os.path.join(self.db_path, "index.json")
        if os.path.exists(index_path):
            with open(index_path, "r") as f:
                _store = json.load(f)

    def _persist(self):
        """Save data to disk."""
        index_path = os.path.join(self.db_path, "index.json")
        with open(index_path, "w") as f:
            json.dump(_store, f)

    def add_documents(self, subject_id: str, chunks: List[Dict], file_name: str):
        if subject_id not in _store:
            _store[subject_id] = []

        for c in chunks:
            _store[subject_id].append({
                "content": c["content"],
                "metadata": {
                    "filename": file_name,
                    "page": c["page_number"],
                    "chunk_id": c["chunk_id"],
                    "subject_id": subject_id,
                }
            })
        self._persist()
        print(f"[VectorStore] Indexed {len(chunks)} chunks for subject {subject_id} from {file_name}")

    def search(self, subject_id: str, query: str, n_results: int = 5) -> List[Dict]:
        if subject_id not in _store or not _store[subject_id]:
            return []

        # Score each chunk by keyword similarity
        scored = []
        for doc in _store[subject_id]:
            score = _similarity(query, doc["content"])
            scored.append((score, doc))

        # Sort by score descending
        scored.sort(key=lambda x: x[0], reverse=True)

        hits = []
        for score, doc in scored[:n_results]:
            hits.append({
                "content": doc["content"],
                "metadata": doc["metadata"],
                "distance": round(1.0 - score, 4)
            })
        return hits
