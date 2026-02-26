"""
Improved vector store with TF-IDF search + stop word filtering + content matching.
"""
import os
import re
import json
import math
from typing import List, Dict
from collections import Counter

_store: Dict[str, List[Dict]] = {}

# Common English stop words to filter out
STOP_WORDS = {
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought',
    'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
    'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then',
    'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each',
    'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
    'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
    'just', 'because', 'but', 'and', 'or', 'if', 'while', 'about',
    'against', 'up', 'down', 'it', 'its', 'this', 'that', 'these', 'those',
    'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'him', 'his',
    'she', 'her', 'they', 'them', 'their', 'what', 'which', 'who', 'whom',
    'instead', 'also', 'like', 'get', 'got', 'give', 'take', 'make',
}


def _tokenize(text: str) -> List[str]:
    """Tokenize text into lowercase words, removing stop words."""
    tokens = re.findall(r'[a-z0-9]+', text.lower())
    return [t for t in tokens if t not in STOP_WORDS and len(t) > 1]


def _compute_idf(all_docs: List[List[str]]) -> Dict[str, float]:
    """Compute IDF scores."""
    n = len(all_docs)
    if n == 0:
        return {}
    df = Counter()
    for tokens in all_docs:
        for t in set(tokens):
            df[t] += 1
    return {term: math.log((n + 1) / (freq + 1)) + 1 for term, freq in df.items()}


def _score(query_tokens: List[str], doc_tokens: List[str], doc_text: str, query_text: str, idf: Dict[str, float]) -> float:
    """Score a document against a query."""
    if not doc_tokens or not query_tokens:
        return 0.0

    doc_tf = Counter(doc_tokens)
    doc_len = len(doc_tokens)
    score = 0.0

    # TF-IDF scoring
    matched_terms = 0
    for qt in query_tokens:
        tf = doc_tf.get(qt, 0) / doc_len
        weight = idf.get(qt, 1.0)
        if tf > 0:
            matched_terms += 1
        score += tf * weight

    # Coverage bonus: what fraction of query terms appear in the document?
    coverage = matched_terms / len(query_tokens) if query_tokens else 0
    score *= (1 + coverage * 2)  # Up to 3x boost for full coverage

    # Exact phrase match bonus
    query_lower = query_text.lower()
    doc_lower = doc_text.lower()

    # Check if all important query words appear in the document
    important_words = [t for t in query_tokens if idf.get(t, 0) > 2.0]
    if important_words:
        all_present = all(w in doc_lower for w in important_words)
        if all_present:
            score *= 3.0  # Big boost when all important words are present

    # Substring/stem matching
    for qt in query_tokens:
        if len(qt) >= 4:
            for dt in set(doc_tokens):
                if len(dt) >= 4 and (qt[:4] == dt[:4]):  # Crude stemming
                    score += 0.5 * idf.get(dt, 1.0)

    return score


class VectorStoreManager:
    def __init__(self, db_path: str = "./vector_data"):
        os.makedirs(db_path, exist_ok=True)
        self.db_path = db_path
        self._try_load()

    def _try_load(self):
        global _store
        index_path = os.path.join(self.db_path, "index.json")
        if os.path.exists(index_path):
            with open(index_path, "r") as f:
                _store = json.load(f)

    def _persist(self):
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

    def search(self, subject_id: str, query: str, n_results: int = 8) -> List[Dict]:
        if subject_id not in _store or not _store[subject_id]:
            return []

        docs = _store[subject_id]
        query_tokens = _tokenize(query)

        if not query_tokens:
            return []

        all_doc_tokens = [_tokenize(doc["content"]) for doc in docs]
        idf = _compute_idf(all_doc_tokens)

        scored = []
        for i, doc in enumerate(docs):
            s = _score(query_tokens, all_doc_tokens[i], doc["content"], query, idf)
            if s > 0:
                scored.append((s, doc))

        scored.sort(key=lambda x: x[0], reverse=True)

        hits = []
        for s, doc in scored[:n_results]:
            hits.append({
                "content": doc["content"],
                "metadata": doc["metadata"],
                "distance": round(1.0 / (1.0 + s), 4)
            })
        return hits
