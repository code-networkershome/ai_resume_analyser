# AI Resume Analyser: The Executive Technical Report

**Project Name:** AI Resume Analyser Platform  
**Document Version:** 1.0.0 (Release Candidate)  
**Date:** January 30, 2026  
**Audience:** Founders, Investors, Chief Technology Officers (CTO)  
**Confidentiality:** Internal / Strictly Confidential  

---

# Table of Contents

1.  **Executive Summary**
    *   1.1 Vision & Mission
    *   1.2 Business Value Proposition
    *   1.3 Key Differentiators
2.  **Product Architecture Overview**
    *   2.1 High-Level System Design
    *   2.2 The "Serverless" Philosophy
    *   2.3 Global Edge Distribution
3.  **Detailed Technology Stack**
    *   3.1 Frontend Engineering (Next.js 14)
    *   3.2 Backend Infrastructure (Node.js & Edge)
    *   3.3 Database Layer (Supabase & Prisma)
    *   3.4 AI Orchestration Integration
4.  **Core Feature Deep Dive**
    *   4.1 The 15-Point Semantic Audit
    *   4.2 Advanced PDF Parsing & Extraction
    *   4.3 Dynamic Score Calculation Algorithm
5.  **User Experience (UX) & Interface Design**
    *   5.1 "Clean Blue" Design System
    *   5.2 Interactive Data Visualization
    *   5.3 Print-Perfect PDF Generation Engine
6.  **Security, Compliance & Privacy**
    *   6.1 Role-Based Access Control (RBAC)
    *   6.2 Data Sanitization & Protection
    *   6.3 API Security & Rate Limiting
7.  **Performance & Scalability Strategy**
    *   7.1 Core Web Vitals Optimization
    *   7.2 Database Query Optimization
    *   7.3 AI Latency Managment
8.  **DevOps, Deployment & Operations**
    *   8.1 CI/CD Pipeline
    *   8.2 Environment Management
    *   8.3 Monitoring & Logging
9.  **Future Strategic Roadmap**
10. **Conclusion**

---

# 1. Executive Summary

## 1.1 Vision & Mission
In a recruitment landscape dominated by algorithmic gatekeepers (ATS), the **AI Resume Analyser** is designed to re-empower candidates. Our mission is to democratize "Executive-Level Career Coaching." We believe that every candidate deserves not just to be "screened" but to be "coached" on how to pass that screen. By leveraging state-of-the-art Large Language Models (LLMs), our platform provides instant, actionable, and deep feedback that was previously accessible only via expensive human consultants.

## 1.2 Business Value Proposition
*   **Scalability:** The platform operates on a "Scale-to-Zero" architecture. Costs are incurred *only* when an analysis is run. There is no idle server cost.
*   **Market Fit:** With 75% of resumes rejected by ATS, the market demand for "ATS compatibility tools" is exploding.
*   **Operational Efficiency:** The AI handles the heavy lifting of critique, allowing the platform to serve thousands of concurrent users with zero human intervention.

## 1.3 Key Differentiators
| Feature | Competitor A (Standard ATS Tool) | **AI Resume Analyser (Our Solution)** |
| :--- | :--- | :--- |
| **Analysis Depth** | Keyword Counting Only | **Semantic Understanding & Context** |
| **Feedback** | Generic ("Add Python") | **Specific** ("Rewrite this bullet to show Impact") |
| **UI/UX** | Cluttered, Text-Heavy | **Visual, Interactive Dashboards** |
| **Cost Basis** | High (Server-Heavy) | **Low (Serverless Edge)** |
| **Parsing** | Often fails on columns | **Enterprise-Grade PDF Parsing** |

---

# 2. Product Architecture Overview

## 2.1 High-Level System Design
The application is architected as a **Modern Monolithic Web Application** using the **Next.js 14 App Router**. This choice provides the best balance of development velocity, type safety, and deployment simplicity.

*   **Client Layer:** A React-based Single Page Application (SPA) that hydrates on the client for interactivity.
*   **Edge Layer:** Vercel Edge Middleware intercepts requests for authentication and routing (sub-millisecond latency).
*   **Server Layer:** Serverless Node.js functions handle the heavy computation (PDF parsing, Database writes).
*   **AI Layer:** A decoupled Inference Gateway calls external LLM providers (Google/DeepSeek) via secure APIs.

## 2.2 The "Serverless" Philosophy
We have eliminated "Always-On" infrastructure.
*   **Compute:** AWS Lambda (via Vercel) handles API routes.
*   **Database:** Supabase (PostgreSQL) handles state.
*   **Storage:** S3-compatible object storage holds raw assets.
**Benefit:** Zero maintenance for OS updates, patching, or scaling groups.

## 2.3 Global Edge Distribution
Static assets (CSS, JS, Images) are cached on the **Global Edge Network** (CDN). Dynamic content is computed in the region closest to the user, ensuring low latency whether the user is in New York or Mumbai.

---

# 3. Detailed Technology Stack

## 3.1 Frontend Engineering (Next.js 14)
*   **Framework:** Next.js 14 with **React Server Components (RSC)**. This allows us to fetch data *on the server* before sending HTML to the client, solving the "Loading Spinner Hell" typical of SPAs.
*   **Language:** **TypeScript 5.0**. Strict typing is enforced. Interfaces like `ResumeData` and `AnalysisResult` are shared across frontend and backend, preventing "undefined is not a function" errors.
*   **State Management:** URL-based state (search params) combined with React Context for user sessions.

## 3.2 Backend Infrastructure (Node.js & Edge)
*   **Runtime:** Node.js 20.x for parsing; Vercel Edge Runtime for Middleware.
*   **API Routes:** Located in `app/api/*`. These strict REST endpoints handle JSON payloads and enforce Zod schema validation on every request.

## 3.3 Database Layer (Supabase & Prisma)
*   **Database:** **Supabase**. A fully managed PostgreSQL instance.
*   **ORM:** **Prisma Client**.
    *   *Schema:* Defined in `schema.prisma`.
    *   *Migrations:* Automated via `prisma migrate`.
    *   *Why Prisma?* It generates a type-safe client based on our schema. If we change a database column, the frontend code fails to compile immediately, catching bugs at build time, not runtime.

## 3.4 AI Orchestration Integration
*   **Provider:** **OpenRouter**.
*   **Models:**
    *   *Primary:* **Google Gemini 2.0 Flash**. Chosen for its massive context window (1M tokens) and incredibly low cost.
    *   *Fallback:* **DeepSeek R1**. Used for complex reasoning tasks if Gemini fails or is rate-limited.
*   **Library:** OpenAI SDK (standardized interface).

---

# 4. Core Feature Deep Dive

## 4.1 The 15-Point Semantic Audit
This is the "Secret Sauce" of the platform. We do not just ask the AI "Is this good?". We construct a massive, structured prompt (chained thinking) that forces the AI to evaluate 15 specific dimensions:

1.  **Executive Summary:** Impact & Clarity.
2.  **Performance Metrics:** Quantification of achievements (%).
3.  **ATS Essentials:** File format, font readibility.
4.  **Keyword Analysis:** Industry-standard term density.
5.  **Critical Risks:** Employment gaps, job hopping.
6.  **Role Fit:** Semantic distance to the target Job Description.
7.  **Career Trajectory:** Promotion history specific analysis.
8.  **Skills (Hard):** Technical competencies.
9.  **Skills (Soft):** Leadership & Communication.
10. **Hidden Skills:** Skills implied by experience but not listed.
11. **Tone & Voice:** Active vs Passive voice detection.
12. **Formatting:** White space, bullet point length.
13. **High-Impact Optimizations:** Specific rewrite suggestions.
14. **Learning Roadmap:** Suggested certifications.
15. **Implementation Plan:** A step-by-step fix list.

## 4.2 Advanced PDF Parsing & Extraction
We use `pdf-parse` (based on Mozilla's PDF.js) to extract text.
*   **Challenge:** PDFs are visual formats, not structural.
*   **Solution:** We implemented a post-processing heuristic that:
    *   Merges broken lines (e.g., "Manag-\ning").
    *   Removes header/footer artifacts.
    *   Detects and warns about "Invisible Text" (resume stuffing).

## 4.3 Dynamic Score Calculation Algorithm
The "ATS Score" is deterministic, not random.
`FinalScore = (ContentScore * 0.4) + (ImpactScore * 0.3) + (ATSCompat * 0.2) + (SkillsMatch * 0.1)`
This weighted average ensures that a resume with great keywords but zero impact (numbers) will still receive a mediocre score, encouraging quality over quantity.

---

# 5. User Experience (UX) & Interface Design

## 5.1 "Clean Blue" Design System
Psychologically, Blue represents Trust (`#2563eb`). We prioritized white space and clean typography (Inter font) to reduce cognitive load. The UI mimics "Financial/Enterprise" software rather than a "Gaming" app.

## 5.2 Interactive Data Visualization
We use **Recharts** to verify the data.
*   **Radar Charts:** Show the balance of the candidate (e.g., "High Skills, Low Impact").
*   **Radial Bars:** Show the overall progress.
*   **Animations:** Components utilize **Framer Motion** for "staggered entry." When the reports load, cards cascade in one by one, creating a feeling of "processing" and "sophistication."

## 5.3 Print-Perfect PDF Generation Engine
A custom CSS layer (`@media print`) transforms the dashboard.
*   **Hidden Elements:** Navbars, Buttons, and Chat widgets are hidden (`display: none`).
*   **Layout Shift:** The CSS Grid changes from 3-column (Web) to 1-column (Print).
*   **Result:** The user can "Download Report" and get a PDF that looks like it was manually typeset by a designer.

---

# 6. Security, Compliance & Privacy

## 6.1 Role-Based Access Control (RBAC)
We utilize `middleware.ts` to inspect the JWT (JSON Web Token) on every request.
*   **Logic:**
    *   Is path `/admin/*`? -> Check if `user.role === 'ADMIN'`.
    *   Is path `/dashboard/*`? -> Check if `session` exists.
*   **Result:** Unauthorized access is blocked at the Edge, never reaching the database.

## 6.2 Data Sanitization & Protection
*   **XSS Protection:** React automatically escapes output.
*   **SQL Injection:** Prisma ORM uses parameterized queries.
*   **PII:** We intentionally do *not* train our models on user data. We use the API in "Zero Retention" mode where available.

## 6.3 API Security & Rate Limiting
To prevent abuse (and huge AI bills), we implement:
*   **Rate Limits:** 5 analyses per user per hour.
*   **Payload Limits:** Max file size 5MB.
*   **Timeout Handling:** 60-second execution cap to prevent hung processes.

---

# 7. Performance & Scalability Strategy

## 7.1 Core Web Vitals Optimization
*   **LCP (Largest Contentful Paint):** Optimized by using Next.js Image component for the Hero image.
*   **CLS (Cumulative Layout Shift):** Minimized by defining explicit aspect ratios for all containers.

## 7.2 Database Query Optimization
*   **Indexing:** We added indices on `AuditLog.userId` and `AnalysisReport.userId` to ensure the dashboard loads instantly even if a user has 100 historical reports.
*   **Connection Pooling:** Enabled via Supabase Transaction Mode to handle spikes in traffic (e.g., if a university batch signs up at once).

## 7.3 AI Latency Management
AI analysis takes time (10-20 seconds). To prevent the browser from timing out:
1.  We use **Streaming UI** where possible.
2.  We show a "feature-rich loader" (progress bar with "Analyzing Skills...", "Checking Grammar...") to keep the user engaged while waiting.

---

# 8. DevOps, Deployment & Operations

## 8.1 CI/CD Pipeline
*   **Source:** GitHub (`main` branch).
*   **Build:** Vercel automatically detects pushes.
*   **Steps:**
    1.  `npm install`
    2.  `npx prisma generate` (Sync DB schema)
    3.  `npm run build` (Compile TypeScript)
    4.  `Deploy` (Push to Edge)

## 8.2 Environment Management
*   Secrets (API Keys, DB URLs) are stored in **Vercel Project Settings**, encrypted at rest. They are injected into the runtime only during execution.
*   Local development uses `.env` files which are strictly git-ignored.

## 8.3 Monitoring & Logging
*   **Runtime:** Vercel Analytics.
*   **Application:** Our custom `AuditLog` table tracks business metrics (Who analyzed what).

---

# 9. Future Strategic Roadmap

## Phase 1: Deep Integration (Q2 2026)
*   **LinkedIn Chrome Extension:** Analyze profiles while browsing.
*   **Job Description Matcher:** Paste a JD, get a % match score.

## Phase 2: User Success (Q3 2026)
*   **AI Cover Letter Writer:** Button to generate a cover letter matching the analyzed resume.
*   **Coaching Mode:** A Chat interface to "Talk" to the resume analyzer ("How do I fix the leadership skills?").

## Phase 3: B2B Enterprise (Q4 2026)
*   **Agency Dashboard:** Multi-tenant mode for recruitment agencies to manage candidates.

---

# 10. Conclusion

The **AI Resume Analyser** is not just a tool; it is a scalable platform architecture. By combining the speed of the Vercel Edge with the intelligence of Gemini/DeepSeek models, we have created a product that delivers immense value with minimal operational overhead. It is secure, fast, beautifully designed, and ready for enterprise-scale adoption.

---

**Report Prepared By:**
*Harshith B N & The Engineering Team*
*Networkers Home*
