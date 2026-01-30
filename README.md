# AI Resume Analyser

An intelligent, high-end resume analysis platform designed for modern professionals. Built with a "Classic Professional" aesthetic and a premium "Glassmorphism" UI, this tool provides actionable, AI-driven insights to help candidates optimize their resumes for both ATS (Applicant Tracking Systems) and human recruiters.

## 🚀 Features

### Core Analysis
- **ATS Parsing Simulation**: Real-time feedback on how job portals read your resume (headings, contact info, bullet structure).
- **Keyword Density Analysis**: Visualize current vs. target keyword optimization to ensure you land in the recruiter's shortlist.
- **Performance Radar**: 6-axis visualization of your professional profile across ATS compatibility, role matching, and skill evidence.
- **Critical Risk Analysis**: Immediate identification of "Critical Rejection Risks" that might be holding your application back.

### AI-Powered Insights
- **Score Synthesis**: Complex algorithms combining ATS compatibility, skill gap analysis, and impact scoring.
- **High-Impact Optimizations**: One-click "AI Generate Fix" and comparison cards to instantly upgrade weak bullet points.
- **Implicit Skill Detection**: Identifies skills you possess based on context, even if not explicitly keywords-matched.

### Premium Experience
- **Glassmorphism UI**: A visually stunning interface with gradient cards, blurred backgrounds, and smooth transitions.
- **Interactive Report**: Drill down into specific sections (Format, Skills, Analysis) with detailed feedback.
- **Responsive Design**: Fully optimized for desktop and mobile viewing.

## 🏗️ Architecture

The project is built using a modern Next.js stack focused on performance and developer experience.

### Frontend
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom premium theme.
- **UI Components**: Shadcn UI + Lucide React Icons.
- **Visuals**: Framer Motion & CSS Animations.

### Backend & Data
- **API**: Next.js Server Components & API Routes.
- **Database ORM**: [Prisma](https://www.prisma.io/).
- **AI Engine**: Google Gemini (via `@google/generative-ai`) for semantic analysis.
- **File Parsing**: `pdf-parse` for PDF extraction.

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.x or higher
- Database (PostgreSQL recommended for Prisma)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/code-networkershome/ai_resume_analyser.git
   cd ai_resume_analyser
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/resume_db"
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   GEMINI_API_KEY="your_google_gemini_api_key"
   ```

4. **Initialize Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
