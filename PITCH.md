# AskMyNotes — Pitch Deck & Demo Script

## 1. Product Overview
**AskMyNotes** is a subject-scoped AI study copilot designed specifically for students. It solves the problem of generic AI hallucinations by strictly using Retrieval-Augmented Generation (RAG) to answer questions solely based on the user's uploaded class notes.

## 2. Problem Statement
Students waste hours searching through disorganized PDFs, slides, and handwritten notes to find specific answers. When they turn to general AI models (like ChatGPT), the AI often hallucinates or provides generic information that doesn't align with their specific syllabus or professor's terminology.

## 3. The Solution
AskMyNotes ingests a student's exact course materials and creates a closed-loop search engine. When a student asks a question:
1. It searches *only* their uploaded notes.
2. It extracts the exact semantic matches using TF-IDF and Cosine Similarity.
3. It passes the context to a powerful LLM (Llama 3.3 70B) to synthesize a direct answer.
4. It provides the **exact page numbers** and citations for verification.

## 4. Unique Selling Propositions (USPs)
- **Zero Hallucination Guarantee:** The system explicitly states "This information is not explicitly mentioned in the uploaded notes" if it cannot find the answer.
- **Subject-Scoped Context:** Students can organize their workspace into specific subjects (e.g., Physics, History). The AI only pulls from the active subject's files, preventing cross-contamination of contexts.
- **Interactive Study Mode:** Automatically generates Multiple Choice Questions (MCQs) and Short Answer questions based on the uploaded material to test retention.
- **Premium User Experience:** A stunning, modern, dark glassmorphic UI inspired by top-tier Dribbble designs, ensuring it feels like a professional SaaS product rather than a generic AI wrapper.

## 5. Hackathon Demo Script

**[Intro - 30 seconds]**
"Hi everyone, we built AskMyNotes because we were tired of ChatGPT making up answers that our professors never taught us. AskMyNotes is a study copilot that forces AI to *only* read your specific class notes."

**[The Problem - 30 seconds]**
"Normally, if you ask a generic AI about a physics concept, it gives you a Wikipedia summary. But for an exam, you need the exact definition your professor requires."

**[The Demo - 2 minutes]**
1. *(Show the Landing Page)*: "We start with a beautiful, modern UI. Let's head into the dashboard."
2. *(Create a Subject)*: "We organize everything by subject to prevent the AI from mixing up Biology terms with Physics terms. I'll create 'Physics'."
3. *(Upload File)*: "I'm uploading my week 1 lecture slides."
4. *(Ask a Question)*: "I'll ask 'What are the disadvantages of a Platinum Resistance Thermometer?'. Notice how fast it searches the document. It generates an answer, but more importantly, look at the citations at the bottom—it proves exactly which page it got the answer from."
5. *(Ask an Out-of-Scope Question)*: "Now, I'll ask 'What is the capital of France?'. The AI refuses to answer because it is strictly grounded to the physics notes. Zero hallucinations."
6. *(Study Mode)*: "Finally, let's switch to Study Mode. I type in a topic, and it generates custom MCQs and short-answer questions to test my knowledge base. The UI highlights correct and incorrect answers instantly."

**[Outro - 30 seconds]**
"Built with React, Tailwind, FastAPI, and Llama 3.3 70B via OpenRouter, AskMyNotes is the perfect, hallucination-free study companion."
