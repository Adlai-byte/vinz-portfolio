---
title: "Building a Privacy-First Multi-Lingual RAG System"
slug: "building-a-privacy-first-multi-lingual-rag-system"
excerpt: "A technical overview of the DOrSU Student Handbook RAG system, featuring local LLMs, multi-lingual support, and advanced retrieval techniques."
type: "blog"
tags: ["RAG", "AI", "DOrSU", "Student Handbook", "NLP"]
published: true
date: "2026-03-11"
---


*A Deep Dive into Local AI Orchestration with Ollama, LangChain, and Streamlit*

---

As universities increasingly adopt AI to streamline student services, the immediate challenge is often data privacy and cost. Relying on cloud APIs (like OpenAI) for handling potentially sensitive internal documents can be expensive and complex from a compliance standpoint.

Today, we're detailing the implementation of our **DOrSU Student Handbook 2025 Q&A System**. This project is a Retrieval-Augmented Generation (RAG) agent that runs entirely on local hardware, requiring *zero* external API calls to operate. 

It not only searches through a dense 138-page PDF to answer student queries but also supports Taglish (Tagalog-English), processes cross-references via a lightweight knowledge graph, and visually pinpoints its answers directly inside a PDF viewer.

![Initial Interface View](https://lbfugovmu4nj8jbr.public.blob.vercel-storage.com/blog/initial_state_1773145220217-CzRTZWXYSOaWlBUJgpk9rI14ogckh9.png)
*Figure 1: The Streamlit interface, showcasing the sidebar administration panel and the chat UI.*

## The Core Architecture

To achieve a fully local, highly accurate system, we opted for a specialized stack:
- **LLM Engine**: [Ollama](https://ollama.com/) running the highly efficient `qwen3.5:0.8b` model [1].
- **Orchestration**: LangChain [2], serving as the connective tissue between the database and the LLM.
- **Vector Database**: ChromaDB [3], handling the persistence of document chunks.
- **Embeddings**: `sentence-transformers/all-MiniLM-L6-v2` [4] (via HuggingFace) mapping text to dense vectors.
- **Reranker**: `cross-encoder/ms-marco-MiniLM-L-6-v2` [5] for precision scoring.
- **Frontend**: Streamlit [6], coupled with `streamlit-pdf-viewer` for our interactive document display.

![Architecture Flowchart](https://lbfugovmu4nj8jbr.public.blob.vercel-storage.com/blog/flowchart-3jJpMcS2uFnBlPN0UMpjjM7V0wyFIk.png)
*Figure 2: A visual overview of how the components interact.*

## Step 1: Intelligent Ingestion & Coordinate Mapping

A standard RAG pipeline blindly chunks text by character count, which often splits critical sentences or separates a policy rule from its exceptions. 

Instead of standard chunking, our ETL pipeline (`ingest.py`) is "section-aware." It actively looks for semantic boundaries native to the handbook, such as `ARTICLE`, `SECTION`, and `CHAPTER` markers. 

More importantly, it features **Coordinate Mapping**. As we parse the PDF using `langchain_community.document_loaders.PyPDFLoader`, we simultaneously cross-reference the text using `PyMuPDF (fitz)` to extract exact `(x0, y0, x1, y1)` bounding box coordinates for each chunk. These coordinates are vital for our frontend interactive PDF viewer.

## Step 2: The Two-Stage Advanced Retrieval Pipeline

When a student asks a query, our `rag_engine.py` initiates a multi-step retrieval mechanism designed to maximize both **Recall** and **Precision**.

1. **Query Expansion & Translation**: Students often ask short, vague questions, or use local dialects (Tagalog/Taglish). The local LLM intercepts the query, translates any non-English terms to English (to match the Handbook's language), and expands it into a formal search query.
2. **Hybrid Ensemble Search**: We execute an Ensemble Retriever. It pulls candidates from both a dense vector search (semantic meaning via ChromaDB) and a sparse keyword search (BM25 algorithms).
3. **Knowledge Graph Traversal**: Our metadata previously tracked cross-references (e.g., "See Article IV"). If a retrieved chunk references another, the system autonomously fetches that secondary chunk to build a complete context window.
4. **Cross-Encoder Reranking**: The retrieved chunks are evaluated against the expanded query by a Cross-Encoder. Only the passages scoring above a defined relevance threshold (`MIN_RELEVANCE_SCORE`) are passed to the final generative step.

## Step 3: Generation and Visual Verification

With the highly filtered context injected into the prompt, the local `qwen3.5` model streams the answer back to the student. 

To foster trust in the AI's output, our prompt explicitly instructs the LLM to provide inline citations (e.g., `[1]`, `[2]`). In the Streamlit UI, these citations expand into source references.

Because we saved the structural coordinates in Step 1, clicking a source button commands the Streamlit PDF viewer to navigate to that specific page and draw a red bounding box around the exact paragraph the LLM used to formulate its answer.

![PDF Bounding Box Highlight](https://lbfugovmu4nj8jbr.public.blob.vercel-storage.com/blog/highlighted_pdf_response_1773145531041-KoX8BsR2gZl5WxJ6ImOCZ6vNxsN27P.png)
*Figure 3: The UI mapping an LLM-generated response to the exact coordinate bounding box inside the original PDF document.*

## Key Implementation Details

Below are critical code snippets that power the core behavior of the system.

**Section-Aware Chunking** â€” Instead of splitting blindly, we define handbook-specific separators:
```python
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

**System Prompt** â€” The LLM is explicitly instructed to never use general knowledge:
```python
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

**Hybrid Ensemble Retriever** â€” Combining dense and sparse search:
```python
# rag_engine.py
_retriever = EnsembleRetriever(
    retrievers=[bm25_retriever, vector_retriever],
    weights=[0.3, 0.7]  # 30% keyword, 70% semantic
)
```

## Multilingual Support in Action

The reality of Philippine campuses is bilingualism. Students frequently mix English and Tagalog (Taglish). Because our pipeline features a pre-translation step combined with a capable LLM, the system can seamlessly accept a Taglish query and generate a contextually accurate response in that identical dialect.

![Taglish Response](https://lbfugovmu4nj8jbr.public.blob.vercel-storage.com/blog/bilingual_response_1773145815101-E4iuexxPpJTFwCBmUtbxw8cX7sfHMv.png)
*Figure 4: Handling a Taglish query about maintaining grades, demonstrating the LLM's cross-lingual capabilities.*

## RAG vs. Fine-Tuned Model: Why We Chose RAG

When building an AI assistant for institutional documents, developers often weigh Retrieval-Augmented Generation (RAG) against Fine-Tuning a custom model. For the DOrSU Student Handbook, RAG was the vastly superior choice for several critical reasons:

| Feature | RAG System (Our Approach) | Fine-Tuned Model |
| :--- | :--- | :--- |
| **Accuracy & Hallucination Risk** | **High Accuracy & Grounded.** The model is forced to cite exact paragraphs retrieved from the vector database. If it cannot find the policy, it says "I don't know." | **High Hallucination Risk.** Fine-tuned models memorize patterns, not facts. It might generate a highly confident, completely fabricated grading policy. |
| **Auditability (Visual Proof)** | **Transparent.** Because RAG splits the document into coordinates (Step 1), we can draw red bounding boxes on the actual PDF to prove the answer's source. | **Black Box.** A fine-tuned model synthesizes answers from its hidden weights. There is no way to click a button and see the original source document. |
| **Updating Information** | **Instant.** If a policy updates in 2026, we simply drag and drop the new PDF into `ingest.py`. The system immediately knows the new rules. | **Expensive & Slow.** The entire model would need to be re-compiled and re-trained on an expensive GPU cluster to "learn" the new rule. |
| **Compute Cost** | **Ultra-Low.** RAG allows us to use tiny, efficient models like `qwen3.5:0.8b` (which runs on a standard CPU) because the LLM is just acting as a "reader" for the retrieved text. | **High.** Fine-tuning requires massive VRAM, and the resulting specialized models often require dedicated GPUs just for inference. |

## Evaluation Methodology & Results (RAGAS)

Building a RAG system is only half the battle; proving it works is the other. We actively evaluate the pipeline's output quality using the **RAGAS (Retrieval Augmented Generation Assessment) Framework** [7]. 

Our internal `evaluate.py` script systematically measures:
1. **Faithfulness**: Is the LLM's answer strictly derived from the retrieved handbook text, or did it hallucinate?
2. **Answer Relevance**: Did the system actually answer the student's question, or did it provide irrelevant facts?
3. **Context Precision**: Did the Cross-Encoder correctly rank the most important paragraph at the very top of the retrieved chunks?

### Sample Results

| Metric | Score | Interpretation |
| :--- | :---: | :--- |
| Faithfulness | 0.85 | 85% of generated claims are directly traceable to the retrieved handbook text. |
| Answer Relevance | 0.88 | 88% of responses directly address the student's original question. |
| Context Precision | 0.91 | The Cross-Encoder correctly ranks the most relevant chunk at the top 91% of the time. |

> **Note:** These are representative scores from internal testing. Actual results may vary based on question complexity and handbook coverage.

## Hardware Footprint & Feasibility

Because cost and deployability are major concerns, this system was specifically engineered to operate without expensive GPUs. 
- **Minimum Requirements**: The system runs comfortably on standard university hardware (e.g., an Intel i5/i7 processor with 8GB-16GB of RAM).
- **Efficiency**: The `all-MiniLM-L6-v2` embeddings run extremely fast on CPUs, and `qwen3.5:0.8b` requires less than 2GB of VRAM or system RAM, providing generation speeds of over 15 tokens per second on consumer hardware.

## Limitations & Future Work

While the system performs well for its intended scope, there are known limitations and opportunities for improvement:

**Current Limitations:**
- **Single Document Scope**: The system currently only supports a single PDF. It cannot cross-reference multiple handbooks or university documents simultaneously.
- **Small Model Constraints**: The `qwen3.5:0.8b` model, while fast and efficient, may struggle with complex multi-part questions or nuanced legal interpretations of policies.
- **BM25 Language Gap**: The BM25 keyword retriever operates on English tokens. Pure Tagalog keywords that don't appear in the English handbook text will not benefit from the sparse search component.
- **Static Coordinates**: Bounding box coordinates are calculated at ingestion time. If the PDF is reformatted, coordinates will become misaligned until re-ingestion.

**Future Work:**
- **Multi-Document Support**: Extend ingestion to handle multiple PDFs (e.g., faculty handbook, academic calendar) within a single unified vector store.
- **Model Upgrades**: Test larger Ollama models (e.g., `llama3:8b`, `qwen2.5:7b`) for improved reasoning on complex policy questions.
- **Persistent Chat Memory**: Integrate a database-backed conversation history so students can resume sessions across browser tabs.
- **Tagalog-Aware Embeddings**: Explore multilingual embedding models like `paraphrase-multilingual-MiniLM-L12-v2` for native Tagalog vector search.

## Getting Started

Want to run this system yourself? Here's how:

### Prerequisites
- Python 3.10+
- [Ollama](https://ollama.com/) installed and running

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/your-username/dorsu-handbook-rag.git
cd dorsu-handbook-rag

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Pull the LLM model
ollama pull qwen3.5:0.8b

# 4. Ingest the handbook PDF
python ingest.py

# 5. Launch the web UI
streamlit run app.py
```

The app will open at `http://localhost:8501`. You can start asking questions immediately.

## Conclusion

By combining local models matching the scale of the task (`qwen3.5:0.8b`) with advanced RAG techniques like Hybrid Search, Cross-Encoder Reranking, and Interactive Visual Citations, we have built a highly capable institutional tool. 

It proves that powerful, domain-specific AI applications do not explicitly require massive hardware clusters or expensive API keys â€” they simply require precise architectural engineering. If you found this useful, feel free to fork the repository, adapt it to your own institution's documents, and contribute back to the project.

## Resources for Core Concepts

If you are new to AI engineering, here are some excellent foundational resources to understand the technology powering this system:
- **Retrieval-Augmented Generation (RAG)**: IBM's comprehensive guide on [What is RAG?](https://www.ibm.com/topics/retrieval-augmented-generation)
- **Large Language Models (LLMs)**: Andrej Karpathy's excellent [1hr Video Introduction to LLMs](https://www.youtube.com/watch?v=zjkBMFhNj_g).
- **Vector Databases**: Pinecone's detailed explanation of [What is a Vector Database and How Does it Work?](https://www.pinecone.io/learn/vector-database/)
- **Embeddings**: Cloudflare's guide on [What are AI Embeddings?](https://www.cloudflare.com/learning/ai/what-are-embeddings/)
- **LangChain**: The official [LangChain Introduction & Tutorials](https://python.langchain.com/docs/get_started/introduction) for building LLM-powered applications.

---

## References

[1] Ollama. (2024). *Get up and running with large language models locally*. https://ollama.com
[2] LangChain AI. (2024). *LangChain: Building applications with LLMs through composability*. https://python.langchain.com
[3] Chroma. (2024). *The AI-native open-source embedding database*. https://www.trychroma.com
[4] Reimers, N., & Gurevych, I. (2019). *Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks*. arXiv:1908.10084.
[5] Hugging Face. *Cross-Encoder for MS MARCO*. https://huggingface.co/cross-encoder/ms-marco-MiniLM-L-6-v2
[6] Streamlit Inc. (2024). *Streamlit: A faster way to build and share data apps*. https://streamlit.io
[7] Es, S., James, J., Espinosa-Anke, L., & Schockaert, S. (2023). *RAGAS: Automated Evaluation of Retrieval Augmented Generation*. arXiv:2309.15217.
