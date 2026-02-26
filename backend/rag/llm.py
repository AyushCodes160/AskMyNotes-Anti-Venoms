import os
import json
from typing import List, Dict
from openai import OpenAI
from dotenv import load_dotenv

# Load .env from the backend directory
_env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(_env_path)

class LLMManager:
    def __init__(self):
        self.api_key = os.getenv("AI_API_KEY", "")
        self.client = None
        if self.api_key:
            self.client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=self.api_key,
            )

    def _call_llm(self, prompt: str) -> str:
        """Call OpenRouter LLM. Returns raw text response."""
        if not self.client:
            return ""

        try:
            response = self.client.chat.completions.create(
                model="meta-llama/llama-3.3-70b-instruct",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=1500,
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            print(f"[LLM Error] {e}")
            return ""

    def generate_response(self, query: str, context_chunks: List[Dict], subject_name: str) -> Dict:
        if not context_chunks:
            return {
                "content": f"Not found in your notes for {subject_name}",
                "confidence": "Low",
                "citations": []
            }

        # Build context from chunks
        context_text = "\n\n".join([
            f"[Source: {c['metadata']['filename']}, Page {c['metadata']['page']}]\n{c['content']}"
            for c in context_chunks
        ])

        prompt = f"""You are a study assistant for the subject "{subject_name}".
Answer the student's question using ONLY the context below. Do NOT use any outside knowledge.

If the answer is NOT found in the context, respond with exactly: "Not found in your notes for {subject_name}"

CONTEXT FROM NOTES:
{context_text}

QUESTION: {query}

Respond in this exact JSON format:
{{
  "answer": "Your detailed answer here, citing sources",
  "confidence": "High" or "Medium" or "Low",
  "citations": [
    {{"fileName": "filename.pdf", "page": 1, "evidence": "exact quote from notes"}}
  ]
}}

Return ONLY valid JSON, nothing else."""

        raw = self._call_llm(prompt)

        # If no API key or LLM failed, use the chunks directly
        if not raw:
            best = context_chunks[0]
            return {
                "content": f"Based on your {subject_name} notes:\n\n{best['content']}",
                "confidence": "Medium",
                "citations": [{
                    "fileName": best['metadata']['filename'],
                    "page": best['metadata']['page'],
                    "chunk": "Direct Match",
                    "evidence": best['content'][:150]
                }]
            }

        # Parse LLM JSON response
        try:
            # Strip markdown code fences if present
            cleaned = raw.strip()
            if cleaned.startswith("```"):
                cleaned = cleaned.split("\n", 1)[1]
                cleaned = cleaned.rsplit("```", 1)[0]
            data = json.loads(cleaned)
            return {
                "content": data.get("answer", raw),
                "confidence": data.get("confidence", "Medium"),
                "citations": [
                    {
                        "fileName": c.get("fileName", "unknown"),
                        "page": c.get("page", 1),
                        "chunk": "AI Extracted",
                        "evidence": c.get("evidence", "")
                    } for c in data.get("citations", [])
                ]
            }
        except json.JSONDecodeError:
            # LLM didn't return valid JSON, return raw text
            return {
                "content": raw,
                "confidence": "Medium",
                "citations": [{
                    "fileName": context_chunks[0]['metadata']['filename'],
                    "page": context_chunks[0]['metadata']['page'],
                    "chunk": "Context Used",
                    "evidence": context_chunks[0]['content'][:150]
                }]
            }

    def generate_study_material(self, topic: str, context_chunks: List[Dict], subject_name: str) -> Dict:
        if not context_chunks:
            return {
                "topic": topic,
                "explanation": f"No notes found to generate study material for {topic}.",
                "mcqs": [], "shortQuestions": [], "citations": []
            }

        context_text = "\n\n".join([
            f"[Source: {c['metadata']['filename']}, Page {c['metadata']['page']}]\n{c['content']}"
            for c in context_chunks
        ])

        prompt = f"""You are a study material generator for "{subject_name}".
Using ONLY the context below, generate study material about "{topic}".

CONTEXT FROM NOTES:
{context_text}

Generate this exact JSON:
{{
  "explanation": "A clear explanation of {topic} based on the notes",
  "mcqs": [
    {{
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "answer": 0,
      "explanation": "Why this is correct, citing the notes"
    }}
  ],
  "shortQuestions": [
    {{
      "question": "Short answer question",
      "answer": "Model answer from the notes"
    }}
  ]
}}

Generate exactly 5 MCQs and 3 short answer questions.
Return ONLY valid JSON, nothing else."""

        raw = self._call_llm(prompt)

        # Fallback if no API key
        if not raw:
            return self._fallback_study(topic, context_chunks, subject_name)

        try:
            cleaned = raw.strip()
            if cleaned.startswith("```"):
                cleaned = cleaned.split("\n", 1)[1]
                cleaned = cleaned.rsplit("```", 1)[0]
            data = json.loads(cleaned)
            return {
                "topic": topic,
                "explanation": data.get("explanation", ""),
                "mcqs": data.get("mcqs", [])[:5],
                "shortQuestions": data.get("shortQuestions", [])[:3],
                "citations": [{
                    "fileName": c['metadata']['filename'],
                    "page": c['metadata']['page'],
                    "chunk": f"Snippet {i+1}",
                    "evidence": c['content'][:100]
                } for i, c in enumerate(context_chunks[:5])]
            }
        except json.JSONDecodeError:
            return self._fallback_study(topic, context_chunks, subject_name)

    def _fallback_study(self, topic, context_chunks, subject_name):
        """Fallback study material using chunks directly."""
        mcqs = []
        for i in range(min(5, len(context_chunks))):
            chunk = context_chunks[i % len(context_chunks)]
            mcqs.append({
                "question": f"Based on your {subject_name} notes, what is discussed about {topic}?",
                "options": [
                    chunk['content'][:60] + "...",
                    "None of the above",
                    "This topic is not covered",
                    "Insufficient information"
                ],
                "answer": 0,
                "explanation": f"From {chunk['metadata']['filename']}, Page {chunk['metadata']['page']}"
            })

        shorts = []
        for i in range(min(3, len(context_chunks))):
            chunk = context_chunks[(i+2) % len(context_chunks)]
            shorts.append({
                "question": f"Explain {topic} as described in your notes.",
                "answer": chunk['content'][:200]
            })

        return {
            "topic": topic,
            "explanation": " ".join([c['content'][:100] for c in context_chunks[:3]]),
            "mcqs": mcqs,
            "shortQuestions": shorts,
            "citations": [{
                "fileName": c['metadata']['filename'],
                "page": c['metadata']['page'],
                "chunk": f"Snippet {i+1}",
                "evidence": c['content'][:100]
            } for i, c in enumerate(context_chunks[:5])]
        }
