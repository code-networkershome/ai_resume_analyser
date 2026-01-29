# AI Resume Analyser

An intelligent, high-end resume analysis platform designed for modern professionals. Built with a "Classic Professional" aesthetic, this tool provides actionable, AI-driven insights to help candidates optimize their resumes for both ATS (Applicant Tracking Systems) and human recruiters.

## ✨ Key Features

- **🎯 ATS Parsing Simulation**: Real-time feedback on how job portals read your resume (headings, contact info, bullet structure).
- **📊 Keyword Density Analysis**: Visualize current vs. target keyword optimization to ensure you land in the recruiter's shortlist.
- **🚀 AI High-Impact Fixes**: One-click "AI Generate Fix" and "Copy Improved Text" actions to instantly upgrade weak bullet points.
- **✨ Premium UI/UX**: Completely redesigned with a modern, glassmorphic aesthetic, "Simple Blue" branding, and intuitive single-page workflows.
- **📈 Performance Radar**: 6-axis visualization of your professional profile across ATS compatibility, role matching, and skill evidence.
- **🛡️ Critical Risk Analysis**: Immediate identification of "Critical Rejection Risks" that might be holding your application back.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Database**: [Supabase](https://supabase.com/) / Prisma
- **Auth**: NextAuth.js

## 🚀 Getting Started

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
   Create a `.env` file in the root:
   ```env
   DATABASE_URL="your_prisma_database_url"
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🌐 Deployment (Vercel)

This project is optimized for deployment on [Vercel](https://vercel.com/).

### Important Vercel Configuration:
- **Framework Preset**: Next.js
- **Environment Variables**: Add all variables from your `.env` to the Vercel project settings.
- **Node.js Version**: 18.x or 20.x

---

Built for **Networkers Home** with ❤️ and AI.
