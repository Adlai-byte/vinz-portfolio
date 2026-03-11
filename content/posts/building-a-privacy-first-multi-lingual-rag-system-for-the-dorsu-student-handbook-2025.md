---
title: "Building a Privacy-First Multi-Lingual RAG System for the DOrSU Student Handbook 2025"
slug: "building-a-privacy-first-multi-lingual-rag-system-for-the-dorsu-student-handbook-2025"
excerpt: "A Deep Dive into Local AI Orchestration with Ollama, LangChain, and Streamlit

"
type: "research"
tags: ["RAG", "Ollama", "LangChain", "Streamlit", "NLP", "Local LLM", "EdTech", "Semantic Search", "ChromaDB", "AI"]
published: true
date: "2026-03-11"
---

![image](https://lbfugovmu4nj8jbr.public.blob.vercel-storage.com/blog/bilingual_response_1773145815101-E4iuexxPpJTFwCBmUtbxw8cX7sfHMv.png)As universities increasingly adopt AI to streamline student services, the immediate challenge is often data privacy and cost. Relying on cloud APIs (like OpenAI) for handling potentially sensitive internal documents can be expensive and complex from a compliance standpoint.

Today, we're detailing the implementation of our DOrSU Student Handbook 2025 Q&A System. This project is a Retrieval-Augmented Generation (RAG) agent that runs entirely on local hardware, requiring zero external API calls to operate.

It not only searches through a dense 138-page PDF to answer student queries but also supports Taglish (Tagalog-English), processes cross-references via a lightweight knowledge graph, and visually pinpoints its answers directly inside a PDF viewer.

![image](https://lbfugovmu4nj8jbr.public.blob.vercel-storage.com/blog/initial_state_1773145220217-CzRTZWXYSOaWlBUJgpk9rI14ogckh9.png)

Initial Interface View
Figure 1: The Streamlit interface, showcasing the sidebar administration panel and the chat UI.

The Core Architecture
To achieve a fully local, highly accurate system, we opted for a specialized stack:

LLM Engine: Ollama running the highly efficient qwen3.5:0.8b model [1].
Orchestration: LangChain [2], serving as the connective tissue between the database and the LLM.
Vector Database: ChromaDB [3], handling the persistence of document chunks.
Embeddings: sentence-transformers/all-MiniLM-L6-v2 [4] (via HuggingFace) mapping text to dense vectors.
Reranker: cross-encoder/ms-marco-MiniLM-L-6-v2 [5] for precision scoring.
Frontend: Streamlit [6], coupled with streamlit-pdf-viewer for our interactive document display.
Here is a visual overview of how these components interact:
![image](https://lbfugovmu4nj8jbr.public.blob.vercel-storage.com/blog/flowchart-3jJpMcS2uFnBlPN0UMpjjM7V0wyFIk.png)

Step 1: Intelligent Ingestion & Coordinate Mapping
A standard RAG pipeline blindly chunks text by character count, which often splits critical sentences or separates a policy rule from its exceptions.

Instead of standard chunking, our ETL pipeline (
ingest.py
) is "section-aware." It actively looks for semantic boundaries native to the handbook, such as ARTICLE, SECTION, and CHAPTER markers.

More importantly, it features Coordinate Mapping. As we parse the PDF using langchain_community.document_loaders.PyPDFLoader, we simultaneously cross-reference the text using PyMuPDF (fitz) to extract exact 
(x0, y0, x1, y1)
 bounding box coordinates for each chunk. These coordinates are vital for our frontend interactive PDF viewer.

Step 2: The Two-Stage Advanced Retrieval Pipeline
When a student asks a query, our 
rag_engine.py
 initiates a multi-step retrieval mechanism designed to maximize both Recall and Precision.

Query Expansion & Translation: Students often ask short, vague questions, or use local dialects (Tagalog/Taglish). The local LLM intercepts the query, translates any non-English terms to English (to match the Handbook's language), and expands it into a formal search query.
Hybrid Ensemble Search: We execute an Ensemble Retriever. It pulls candidates from both a dense vector search (semantic meaning via ChromaDB) and a sparse keyword search (BM25 algorithms).
Knowledge Graph Traversal: Our metadata previously tracked cross-references (e.g., "See Article IV"). If a retrieved chunk references another, the system autonomously fetches that secondary chunk to build a complete context window.
Cross-Encoder Reranking: The retrieved chunks are evaluated against the expanded query by a Cross-Encoder. Only the passages scoring above a defined relevance threshold (MIN_RELEVANCE_SCORE) are passed to th

![image](https://lbfugovmu4nj8jbr.public.blob.vercel-storage.com/blog/highlighted_pdf_response_1773145531041-KoX8BsR2gZl5WxJ6ImOCZ6vNxsN27P.png)e final generative step.
Step 3: Generation and Visual Verification
With the highly filtered context injected into the prompt, the local qwen3.5 model streams the answer back to the student.

To foster trust in the AI's output, our prompt explicitly instructs the LLM to provide inline citations (e.g., [1], [2]). In the Streamlit UI, these citations expand into source references.

Because we saved the structural coordinates in Step 1, clicking a source button commands the Streamlit PDF viewer to navigate to that specific page and draw a red bounding box around the exact paragraph the LLM used to formulate its answer.
![image](https://lbfugovmu4nj8jbr.public.blob.vercel-storage.com/blog/highlighted_pdf_response_1773145531041-KoX8BsR2gZl5WxJ6ImOCZ6vNxsN27P.png)

PDF Bounding Box Highlight
Figure 2: The UI mapping an LLM-generated response to the exact coordinate bounding box inside the original PDF document.

Key Implementation Details
Below are critical code snippets that power the core behavior of the system.

Section-Aware Chunking — Instead of splitting blindly, we define handbook-specific separators:

```
# ingest.py
SECTION_SEPARATORS = [
    "\nARTICLE ",
    "\nSECTION ",
    "\nCHAPTER ",
    "\nPART ",
    "\n\n",
    "\n",
    " ",
]
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=150,
    separators=SECTION_SEPARATORS,
)

```
System Prompt — The LLM is explicitly instructed to never use general knowledge:

```
# rag_engine.py
SYSTEM_PROMPT = """You are a handbook assistant.
STRICT RULE: Only use the provided context.
If the answer is not in the context, you MUST say:
"I'm sorry, but that information is not in the Student Handbook."
NEVER use your general knowledge to answer.
RULES:
1. CITATIONS: Use [1], [2], etc. at the end of every sentence that uses context.
2. Only use the provided context.
3. Use "quotes" for direct handbook text."""

```
Multilingual Support in Action
The reality of Philippine campuses is bilingualism. Students frequently mix English and Tagalog (Taglish). Because our pipeline features a pre-translation step combined with a capable LLM, the system can seamlessly accept a Taglish query and generate a contextually accurate response in that identical dialect.

![image](https://lbfugovmu4nj8jbr.public.blob.vercel-storage.com/blog/bilingual_response_1773145815101-E4iuexxPpJTFwCBmUtbxw8cX7sfHMv.png)

Taglish Response
Figure 3: Handling a Taglish query about maintaining grades for scholars, demonstrating the LLM's cross-lingual retrieval and generation capabilities.

Live Demo
Watch the system in action — from asking an English question, viewing PDF highlights, to querying in Taglish:


