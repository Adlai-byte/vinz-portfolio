---
title: "the DOrSU_RAG_Research_Blog"
slug: "the-dorsu-rag-research-blog"
excerpt: "A locally deployed Retrieval-Augmented Generation (RAG) system designed for querying the Davao Oriental State University (DOrSU) Student Handbook 2025."
type: "blog"
tags: ["RAG", "AI", "DOrSU", "Student Handbook", "NLP"]
published: true
date: "2026-03-11"
---

# A Locally Deployed Retrieval-Augmented Generation System for Institutional Student Handbook Inquiry: A Case Study at Davao Oriental State University

---

## Abstract

This study presents the design, implementation, and evaluation of a fully local Retrieval-Augmented Generation (RAG) system that enables students and staff of Davao Oriental State University (DOrSU) to query the Student Handbook 2025 using natural language. The system parses the 138-page handbook PDF, segments it into semantically coherent chunks, embeds them in a vector database, and retrieves relevant context to generate accurate answers through a locally hosted large language model (LLM). Key innovations include section-aware document chunking, cross-encoder re-ranking for improved retrieval precision, real-time streaming responses, conversational memory, and automatic Tagalog/Taglish language detection with query translation. All components run locally without external API dependencies, ensuring data privacy and zero operational cost. Experimental results demonstrate that the re-ranking pipeline eliminates irrelevant retrieval results, reducing noise in generated answers, while the query translation layer enables Filipino-language users to interact with the English-language handbook seamlessly. The system is deployed as a web-based chat interface using Streamlit, accessible to both students and administrative staff.

**Keywords:** Retrieval-Augmented Generation, RAG, Student Handbook, Natural Language Processing, Large Language Models, ChromaDB, Cross-Encoder Re-ranking, Tagalog NLP, Local LLM, Streamlit

---

## 1. Introduction

### 1.1 Background

Student handbooks serve as comprehensive reference documents outlining institutional policies, academic regulations, codes of conduct, and administrative procedures. At Davao Oriental State University (DOrSU), the Student Handbook 2025 spans 138 pages covering topics from admission requirements and dress code policies to disciplinary procedures and student rights. Despite its importance, students and staff often struggle to locate specific information quickly due to the document's length and the absence of a searchable digital interface.

Traditional approaches to making such documents accessible include keyword-based search engines and FAQ pages. However, these methods require exact keyword matching and fail to handle natural language queries, paraphrased questions, or queries in languages other than the document's original language. The emergence of Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG) offers a fundamentally different approach: users can ask questions in natural language, and the system retrieves relevant document sections and generates coherent, contextually grounded answers.

### 1.2 Problem Statement

The specific challenges addressed by this study are:

1. **Information Accessibility:** Students must manually search through a 138-page PDF to find answers to policy-related questions, which is time-consuming and inefficient.
2. **Language Barrier:** The handbook is written in English, but many DOrSU students are more comfortable communicating in Tagalog or Taglish (mixed Tagalog-English), creating a barrier to comprehension.
3. **Privacy and Cost Concerns:** Cloud-based AI solutions (e.g., OpenAI API, Google Gemini) require sending institutional documents to external servers and incur per-query costs, raising privacy and budgetary concerns.
4. **Retrieval Precision:** Naive vector similarity search often retrieves tangentially related content, leading to answers polluted by irrelevant context.

### 1.3 Objectives

This study aims to:

1. Design and implement a fully local RAG system that answers natural language questions about the DOrSU Student Handbook 2025.
2. Improve retrieval precision through section-aware document chunking and cross-encoder re-ranking.
3. Enable bilingual interaction (English and Tagalog/Taglish) through automatic language detection and query translation.
4. Provide a user-friendly web-based chat interface with streaming responses, conversational memory, and administrative tools.
5. Evaluate the system's accuracy, response time, and language handling capabilities.

### 1.4 Significance of the Study

This research contributes to the growing body of work on locally deployed AI systems for institutional knowledge management. By demonstrating that a fully functional RAG system can run on consumer hardware without external API dependencies, it provides a replicable model for other Philippine higher education institutions seeking to make their institutional documents more accessible. The bilingual (English-Tagalog) capability addresses a practical need specific to the Philippine educational context.

### 1.5 Scope and Limitations

The system is designed specifically for the DOrSU Student Handbook 2025. It uses a small language model (Qwen 3.5 0.8B parameters) constrained by available hardware, which limits response sophistication compared to larger models. Bisaya (Cebuano) language support was considered but excluded due to insufficient model capability. The system does not support multi-document querying in its current version.

---

## 2. Review of Related Literature

### 2.1 Retrieval-Augmented Generation

Retrieval-Augmented Generation (RAG) was introduced by Lewis et al. (2020) as a method to combine the parametric knowledge of language models with non-parametric retrieval from external knowledge bases. Unlike pure generative models that may hallucinate facts, RAG systems ground their responses in retrieved documents, significantly improving factual accuracy. The RAG framework has since been widely adopted for question-answering systems over domain-specific corpora (Gao et al., 2023).

### 2.2 Vector Databases and Embedding Models

Modern RAG systems rely on dense vector representations (embeddings) to capture semantic meaning. Sentence-BERT (Reimers & Gurevych, 2019) and its derivative models such as all-MiniLM-L6-v2 produce fixed-size embeddings that enable efficient semantic similarity search. Vector databases such as ChromaDB, Pinecone, and FAISS provide infrastructure for storing, indexing, and querying these embeddings at scale (Chroma, 2023).

### 2.3 Cross-Encoder Re-ranking

Bi-encoder models (used for initial retrieval) encode queries and documents independently, which enables fast search but sacrifices accuracy. Cross-encoder models (Nogueira & Cho, 2019) jointly encode query-document pairs, producing more accurate relevance scores at the cost of speed. A common strategy is to use bi-encoders for initial retrieval (over-fetching) and cross-encoders for re-ranking the top candidates, combining speed with precision (Thakur et al., 2021).

### 2.4 Document Chunking Strategies

The quality of RAG systems depends heavily on how source documents are segmented into chunks. Fixed-size chunking (e.g., 500 characters) is simple but often splits content mid-sentence or mid-section, losing semantic coherence. Recursive character splitting with custom separators allows chunks to respect document structure (e.g., section headings, paragraph boundaries), producing more coherent retrieval units (LangChain, 2023).

### 2.5 Local LLM Deployment

The release of open-weight models (LLaMA, Mistral, Qwen) and inference frameworks (Ollama, llama.cpp) has made it feasible to run language models on consumer hardware. Ollama provides a simple interface for downloading, running, and querying models locally, eliminating the need for cloud-based API services (Ollama, 2024). This is particularly relevant for privacy-sensitive applications in educational institutions.

### 2.6 Multilingual NLP in the Philippine Context

Filipino language NLP remains an under-resourced area. While large language models trained on multilingual corpora (e.g., mBERT, XLM-R) demonstrate some Tagalog capability, performance is significantly lower than English (Cruz & Cheng, 2020). Code-switching between Tagalog and English (Taglish) is prevalent in Philippine communication, presenting additional challenges for NLP systems that expect monolingual input.

---

## 3. Methodology

### 3.1 System Architecture

The system follows a modular pipeline architecture consisting of four stages: (1) document ingestion, (2) query processing, (3) retrieval and re-ranking, and (4) response generation and delivery. Figure 1 illustrates the overall data flow.

```
                    +------------------+
                    | STUDENT-HANDBOOK |
                    |   -2025.pdf      |
                    +--------+---------+
                             |
                    [1. INGESTION PIPELINE]
                             |
                    +--------v---------+
                    |   PDF Parsing    |
                    |   (PyPDFLoader)  |
                    +--------+---------+
                             |
                    +--------v---------+
                    | Section-Aware    |
                    | Chunking (1000   |
                    | chars, 150       |
                    | overlap)         |
                    +--------+---------+
                             |
                    +--------v---------+
                    | Embedding        |
                    | (all-MiniLM-     |
                    |  L6-v2)          |
                    +--------+---------+
                             |
                    +--------v---------+
                    |   ChromaDB       |
                    |  (325 chunks)    |
                    +--------+---------+
                             |
              ===============|================
                             |
                    [2. QUERY PIPELINE]
                             |
                    +--------v---------+
                    | User Query       |
                    | (EN/TL/Taglish)  |
                    +--------+---------+
                             |
                    +--------v---------+
                    | Query Translation|
                    | to English       |
                    | (Ollama)         |
                    +--------+---------+
                             |
                    +--------v---------+
                    | Vector Retrieval |
                    | (Top 10 chunks)  |
                    +--------+---------+
                             |
                    +--------v---------+
                    | Cross-Encoder    |
                    | Re-ranking       |
                    | (ms-marco-       |
                    |  MiniLM-L-6-v2)  |
                    +--------+---------+
                             |
                    +--------v---------+
                    | Score Filtering  |
                    | (>= -5.0) +      |
                    | Top 5 Selection  |
                    +--------+---------+
                             |
                    +--------v---------+
                    | LLM Generation   |
                    | (Qwen 3.5 0.8B   |
                    |  via Ollama)     |
                    +--------+---------+
                             |
                    +--------v---------+
                    | Streaming Output |
                    | + Source Display  |
                    | (Streamlit UI)   |
                    +------------------+
```

*Figure 1. System architecture diagram showing the ingestion pipeline and query pipeline.*

### 3.2 Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Language Model | Qwen 3.5 (0.8B parameters) via Ollama | Answer generation, query translation |
| Embedding Model | all-MiniLM-L6-v2 (22.7M parameters) | Semantic vector representations |
| Re-ranking Model | ms-marco-MiniLM-L-6-v2 (22.7M parameters) | Cross-encoder relevance scoring |
| Vector Database | ChromaDB | Persistent vector storage and retrieval |
| PDF Parser | PyPDFLoader (LangChain) | PDF text extraction |
| Text Splitter | RecursiveCharacterTextSplitter (LangChain) | Section-aware document chunking |
| Web Framework | Streamlit | Chat-based user interface |
| LLM Runtime | Ollama | Local model serving and inference |
| Language | Python 3.13 | Implementation language |

*Table 1. Technology stack components and their roles.*

### 3.3 Document Ingestion Pipeline

#### 3.3.1 PDF Parsing

The Student Handbook 2025 PDF (138 pages) is loaded using LangChain's PyPDFLoader, which extracts text content page by page while preserving page number metadata. Each page is represented as a Document object containing the extracted text and associated metadata (page number, source file).

#### 3.3.2 Section-Aware Chunking

Rather than using fixed-size character splitting, the system employs a recursive character text splitter configured with custom separators that prioritize splitting at structural boundaries found in the handbook:

```
Priority 1: "\nARTICLE "  (Article boundaries)
Priority 2: "\nSECTION "  (Section boundaries)
Priority 3: "\nCHAPTER "  (Chapter boundaries)
Priority 4: "\nPART "     (Part boundaries)
Priority 5: "\n\n"        (Paragraph boundaries)
Priority 6: "\n"          (Line boundaries)
Priority 7: " "           (Word boundaries - last resort)
```

The splitter attempts to split at the highest-priority separator that keeps chunks within the configured size limit (1000 characters) with an overlap of 150 characters for context continuity.

#### 3.3.3 Metadata Enrichment

After chunking, a regex-based post-processing step scans each chunk for section headings matching patterns such as "ARTICLE I", "SECTION 1", or "CHAPTER III". When detected, the section title is added to the chunk's metadata, enabling source attribution in the user interface.

#### 3.3.4 Embedding and Storage

Each chunk is embedded using the all-MiniLM-L6-v2 sentence transformer model, producing 384-dimensional dense vectors. These embeddings are stored in ChromaDB with persistence to disk, enabling the vector store to survive application restarts without re-ingestion. The ingestion of the full handbook produces 325 chunks.

### 3.4 Query Processing Pipeline

#### 3.4.1 Language Detection and Query Translation

To support Tagalog and Taglish queries against the English-language handbook, the system employs a query translation strategy. Before retrieval, the user's question is sent to the Ollama LLM with a translation prompt that instructs it to produce a pure English translation. This translated query is then used for both vector retrieval and cross-encoder re-ranking, ensuring that the English embeddings and cross-encoder can effectively match the query against English-language chunks.

The original (untranslated) query is preserved and passed to the generation stage, where the system prompt instructs the LLM to respond in the user's original language, quoting handbook text in English with explanations in the user's language.

#### 3.4.2 Two-Stage Retrieval

**Stage 1 — Bi-Encoder Retrieval:** The translated English query is embedded using all-MiniLM-L6-v2 and compared against all 325 stored chunk embeddings via cosine similarity. The top 10 chunks (RETRIEVAL_K = 10) are retrieved as initial candidates.

**Stage 2 — Cross-Encoder Re-ranking:** The 10 candidate chunks are re-scored using the ms-marco-MiniLM-L-6-v2 cross-encoder, which jointly encodes each (query, chunk) pair for more accurate relevance assessment. Chunks scoring below the minimum relevance threshold (-5.0) are filtered out, and the remaining chunks are sorted by score in descending order. The top 5 (TOP_K = 5) are selected for context.

#### 3.4.3 Response Generation

The selected chunks are concatenated into a context string and combined with the user's original question and conversation history into a message sequence for the LLM. The system prompt instructs the model to:

- Answer only from the provided context
- Ask clarifying questions for vague queries
- Quote handbook text in quotation marks
- Detect and mirror the user's language
- Keep handbook quotes in English when responding in Tagalog

#### 3.4.4 Streaming Output

Responses are streamed token-by-token from Ollama to the Streamlit interface, providing immediate visual feedback. The user sees text appearing progressively rather than waiting for the complete response, significantly improving perceived responsiveness.

#### 3.4.5 Conversational Memory

The system maintains a session-based conversation history, passing the last 6 messages (3 user-assistant exchange pairs) as context to the LLM. This enables follow-up questions such as "Can you tell me more about that?" without the user needing to restate the topic. The retrieval step uses only the current question (not the full history) to avoid diluting search relevance.

### 3.5 User Interface

The web interface is built with Streamlit and consists of two components:

**Main Chat Area:** A conversational interface where users type questions and receive streamed responses. Each response includes an expandable "Sources" section displaying the retrieved chunks with page numbers, section titles, and relevance scores.

**Admin Sidebar:** A panel displaying system configuration (model names, chunk count, retrieval settings) and providing administrative actions (PDF re-ingestion, chat history clearing).

---

## 4. Results and Discussion

### 4.1 Ingestion Results

The 138-page Student Handbook PDF was successfully parsed and segmented into 325 chunks using section-aware splitting with a chunk size of 1000 characters and 150-character overlap. This represents a 44.4% reduction from the 585 chunks produced by the baseline configuration (500-character chunks with 50-character overlap), while producing more semantically coherent units that respect document structure.

| Configuration | Chunk Size | Overlap | Chunks Produced |
|--------------|-----------|---------|----------------|
| Baseline | 500 | 50 | 585 |
| Optimized | 1000 | 150 | 325 |

*Table 2. Comparison of chunking configurations.*

### 4.2 Retrieval Accuracy

#### 4.2.1 Re-ranking Effectiveness

The impact of cross-encoder re-ranking was evaluated using a diagnostic query: "School Anthem." Under the baseline system (cosine similarity only, 500-character chunks), the top 5 retrieved chunks included:

- 2 chunks related to the University Hymn (relevant)
- 1 chunk about campus traffic/parking rules (irrelevant)
- 1 chunk about student privileges (irrelevant)
- 1 chunk about campus vehicle regulations (irrelevant)

The irrelevant chunks polluted the LLM's context, causing the generated answer to include unrelated information about parking policies.

Under the optimized system (section-aware chunking + cross-encoder re-ranking), the re-ranker assigned the following scores:

| Chunk Content | Page | Cross-Encoder Score | Included? |
|--------------|------|-------------------|-----------|
| University Hymn lyrics and title | 134 | -3.482 | Yes |
| University Hymn second verse/chorus | 134 | -4.037 | Yes |
| Student awards information | 118 | -8.896 | No (filtered) |
| Campus parking/traffic rules | 90 | -9.220 | No (filtered) |
| Student privileges | 66 | -10.498 | No (filtered) |

*Table 3. Cross-encoder scores for "School Anthem" query. Threshold: -5.0.*

The re-ranking stage successfully filtered all irrelevant chunks, retaining only the two hymn-related chunks. The generated answer correctly identified the "University Hymn" as the school anthem and provided accurate lyrics.

#### 4.2.2 Out-of-Context Query Handling

When queried with "What is quantum physics?" (a topic not covered in the handbook), the system correctly returned zero chunks after re-ranking (all candidates scored below -5.0) and responded with: "I couldn't find any relevant information in the Student Handbook." This demonstrates the system's ability to avoid hallucination on out-of-scope queries.

### 4.3 Response Time Analysis

Response times were measured across three query types with the optimized pipeline:

| Query | Type | Response Time |
|-------|------|--------------|
| "What are the school rules?" | English, in-context | 56.36s |
| "Ano ang mga patakaran sa uniform?" | Tagalog, in-context | 71.84s |
| "Ano yung rules sa admission?" | Taglish, in-context | 51.70s |
| "What is quantum physics?" | English, out-of-context | 0.23s |
| "School Anthem" | English, in-context | 35.73s |

*Table 4. Response time measurements.*

The response time breakdown consists of:

1. **Query translation** (~2-5s): Translating non-English queries to English via Ollama.
2. **Vector retrieval** (~0.5s): Embedding the query and searching ChromaDB.
3. **Re-ranking** (~0.3s): Cross-encoder scoring of 10 candidate chunks.
4. **LLM generation** (~30-65s): Token-by-token response generation by Qwen 3.5 0.8B.

LLM generation is the dominant bottleneck, accounting for approximately 85-90% of total response time. This is a hardware-dependent constraint that would improve significantly with GPU acceleration or a more capable machine. Notably, the streaming interface mitigates the perceived wait time by displaying tokens as they are generated, with the first token appearing within 1-2 seconds.

Out-of-context queries return almost instantly (0.23s) because all chunks are filtered by the re-ranker and no LLM generation is required.

### 4.4 Language Support Evaluation

The query translation approach was tested across three language modes:

| Input Language | Sample Query | Translation Output | Response Language |
|---------------|-------------|-------------------|------------------|
| English | "What are the school rules?" | "What are the school rules?" (unchanged) | English |
| Tagalog | "Ano ang mga patakaran sa uniform?" | "What are the uniforms?" | Tagalog |
| Taglish | "Ano yung rules sa admission?" | "What are the admission rules?" | Taglish |

*Table 5. Language detection and translation results.*

The system successfully:

- Preserved English queries without modification
- Translated pure Tagalog queries to English for retrieval
- Handled code-switched Taglish queries by translating all non-English words
- Responded in the user's original language, keeping handbook quotes in English

Limitations were observed in Tagalog translation accuracy. The translation "What are the uniforms?" for "Ano ang mga patakaran sa uniform?" loses the nuance of "patakaran" (rules/regulations), though the retrieval still returned relevant uniform policy chunks due to the keyword "uniform" being preserved.

### 4.5 Conversational Memory

The conversation memory feature was tested with sequential queries:

- **Query 1:** "What are the admission requirements?"
- **Query 2:** "Can you tell me more about the test mentioned?"

The system correctly interpreted "the test mentioned" as referring to the State University Aptitude and Scholarship Test (SUAST) discussed in the first response, demonstrating functional conversational context. The memory window of 6 messages (3 exchange pairs) provides sufficient context for typical follow-up interactions without overwhelming the small model's context window.

---

## 5. Conclusion

This study successfully designed, implemented, and evaluated a fully local Retrieval-Augmented Generation system for the DOrSU Student Handbook 2025. The key findings are:

1. **Section-aware chunking** with custom separators reduced the chunk count by 44.4% while producing more semantically coherent retrieval units that respect document structure.

2. **Cross-encoder re-ranking** effectively eliminates irrelevant retrieval results. In the diagnostic "School Anthem" test, irrelevant chunks about parking rules (score: -9.22) were filtered out while relevant hymn content (score: -3.48) was retained.

3. **Query translation** enables Tagalog and Taglish users to interact with the English-language handbook, with the LLM automatically responding in the user's language while preserving English handbook quotes.

4. **Streaming responses** reduce perceived latency by displaying tokens as they are generated, with first-token appearance in 1-2 seconds despite total generation times of 35-72 seconds.

5. **Full local deployment** ensures data privacy, zero operational cost, and independence from external API services, making the system suitable for resource-constrained educational institutions.

### 5.1 Recommendations for Future Work

1. **Model Upgrade:** Deploying a larger model (e.g., Qwen 3.5 3B or Mistral 7B) with GPU acceleration would significantly improve response quality, speed, and Tagalog fluency.

2. **Bisaya Language Support:** Training or fine-tuning a model with Cebuano/Bisaya data would serve the Davao Oriental student population more effectively.

3. **Multi-Document Support:** Extending the system to query multiple institutional documents (e.g., faculty manual, course catalogs) would increase its utility.

4. **Evaluation Framework:** Implementing systematic evaluation metrics (e.g., RAGAS framework for RAG evaluation) with a ground-truth question-answer dataset would enable quantitative accuracy measurement.

5. **User Study:** Conducting a formal user study with DOrSU students and staff would provide insights into real-world usability, satisfaction, and information retrieval effectiveness.

6. **Hybrid Chunking:** Combining structural splitting with semantic chunking (using embedding similarity to detect topic boundaries) could further improve retrieval quality.

---

## References

Chroma. (2023). ChromaDB: The AI-native open-source embedding database. https://www.trychroma.com/

Cruz, J. C. B., & Cheng, C. (2020). Establishing baselines for text classification in low-resource languages. *arXiv preprint arXiv:2005.02068*.

Gao, Y., Xiong, Y., Jain, S., et al. (2023). Retrieval-augmented generation for large language models: A survey. *arXiv preprint arXiv:2312.10997*.

LangChain. (2023). LangChain: Building applications with LLMs through composability. https://www.langchain.com/

Lewis, P., Perez, E., Piktus, A., et al. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks. *Advances in Neural Information Processing Systems, 33*, 9459-9474.

Nogueira, R., & Cho, K. (2019). Passage re-ranking with BERT. *arXiv preprint arXiv:1901.04085*.

Ollama. (2024). Ollama: Get up and running with large language models locally. https://ollama.com/

Reimers, N., & Gurevych, I. (2019). Sentence-BERT: Sentence embeddings using Siamese BERT-networks. *Proceedings of the 2019 Conference on Empirical Methods in Natural Language Processing (EMNLP)*.

Thakur, N., Reimers, N., Ruckle, A., Srivastava, A., & Gurevych, I. (2021). BEIR: A heterogeneous benchmark for zero-shot evaluation of information retrieval models. *Proceedings of the Neural Information Processing Systems Track on Datasets and Benchmarks*.

---

## Appendix A: Project Structure

```
TATA/
├── STUDENT-HANDBOOK-2025.pdf    # Source document (138 pages)
├── requirements.txt             # Python dependencies
├── config.py                    # Configuration constants
├── ingest.py                    # PDF parsing, chunking, embedding
├── rag_engine.py                # Query translation, retrieval, re-ranking, generation
├── app.py                       # Streamlit chat UI with admin sidebar
├── chroma_db/                   # Persisted vector store (325 chunks)
└── docs/plans/                  # Design and implementation documents
```

## Appendix B: Configuration Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| CHUNK_SIZE | 1000 | Maximum characters per chunk |
| CHUNK_OVERLAP | 150 | Overlapping characters between chunks |
| EMBEDDING_MODEL | all-MiniLM-L6-v2 | Sentence embedding model |
| RERANK_MODEL | ms-marco-MiniLM-L-6-v2 | Cross-encoder re-ranking model |
| OLLAMA_MODEL | qwen3.5:0.8b | Local LLM for generation |
| RETRIEVAL_K | 10 | Initial chunks retrieved |
| TOP_K | 5 | Chunks retained after re-ranking |
| MIN_RELEVANCE_SCORE | -5.0 | Minimum cross-encoder score threshold |
| MAX_HISTORY | 6 | Conversation messages retained |

## Appendix C: Installation and Usage

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Ensure Ollama is running with the model
ollama pull qwen3.5:0.8b

# 3. Ingest the handbook PDF
python ingest.py

# 4. Launch the web interface
streamlit run app.py
```

The application will be available at `http://localhost:8501`.