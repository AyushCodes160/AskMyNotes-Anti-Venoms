import os
from typing import List, Dict

class LLMManager:
    def __init__(self, api_key: str = None, provider: str = "huggingface"):
        self.api_key = api_key or os.getenv("AI_API_KEY")
        self.provider = provider

    def generate_response(self, query: str, context_chunks: List[Dict], subject_name: str) -> Dict:
        if not context_chunks:
            return {
                "content": f"Not found in your notes for {subject_name}",
                "confidence": "Low",
                "citations": []
            }

        context_text = "\n\n".join([f"Source: {c['metadata']['filename']} (Page {c['metadata']['page']})\nContent: {c['content']}" for c in context_chunks])
        
        prompt = f"""
You are an AI Study Assistant for the subject "{subject_name}".
Answer the user's question STRICTLY using only the provided context snippets.
If the answer is not contained within the context, respond EXACTLY with: "Not found in your notes for {subject_name}"

Context:
{context_text}

Question: {query}

Instructions:
1. Provide a clear, grounded answer.
2. Include citations in the format: FileName.pdf — Page X.
3. Assess your confidence (High/Medium/Low) based on how well the context covers the question.

Output Format (JSON):
{{
  "content": "Your answer...",
  "confidence": "High/Medium/Low",
  "citations": [{{ "fileName": "...", "page": X, "chunk": "...", "evidence": "..." }}]
}}
"""
        # For MVP, if no API key is provided, we return a structured mock that uses the context
        # In a real app, this would call OpenRouter/OpenAI/HuggingFace
        if not self.api_key:
            return {
                "content": f"Based on your {subject_name} notes: {context_chunks[0]['content'][:200]}...",
                "confidence": "Medium",
                "citations": [
                    {
                        "fileName": context_chunks[0]['metadata']['filename'],
                        "page": context_chunks[0]['metadata']['page'],
                        "chunk": "Direct Match",
                        "evidence": context_chunks[0]['content'][:150]
                    }
                ]
            }

        # Placeholder for real API call
        return {"content": "Real AI integration requires API key setup.", "confidence": "Low"}

    def generate_study_material(self, topic: str, context_chunks: List[Dict], subject_name: str) -> Dict:
        if not context_chunks:
            return {
                "topic": topic,
                "explanation": f"No notes found to generate study material for {topic}.",
                "mcqs": [],
                "shortQuestions": [],
                "citations": []
            }

        # Mock generation that uses real context snippets to fulfill the 5/3 requirement
        explanation = f"Based on your {subject_name} notes, {topic} is discussed in several sections. " + \
                      " ".join([c['content'][:100] for c in context_chunks[:3]])

        mcqs = []
        for i in range(5):
            chunk = context_chunks[i % len(context_chunks)]
            mcqs.append({
                "question": f"Based on {chunk['metadata']['filename']}, what is a key concept related to {topic}?",
                "options": [
                    f"Concept from page {chunk['metadata']['page']}",
                    "Incorrect Option B",
                    "Incorrect Option C",
                    "Incorrect Option D"
                ],
                "answer": 0,
                "explanation": f"This is derived from section: {chunk['content'][:50]}...",
                "citation": f"{chunk['metadata']['filename']} — Page {chunk['metadata']['page']}"
            })

        short_questions = []
        for i in range(3):
            chunk = context_chunks[(i+2) % len(context_chunks)]
            short_questions.append({
                "question": f"Explain the importance of {topic} as mentioned in {chunk['metadata']['filename']}.",
                "answer": f"According to the notes: {chunk['content'][:200]}...",
                "citation": f"{chunk['metadata']['filename']} — Page {chunk['metadata']['page']}"
            })

        return {
            "topic": topic,
            "explanation": explanation,
            "mcqs": mcqs,
            "shortQuestions": short_questions,
            "citations": [
                {
                    "fileName": c['metadata']['filename'],
                    "page": c['metadata']['page'],
                    "chunk": f"Snippet {i+1}",
                    "evidence": c['content'][:100]
                } for i, c in enumerate(context_chunks[:5])
            ]
        }
