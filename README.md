# 🚀 AI Skill Gap Analyzer

> **Intelligent Resume Analysis & Career Advancement Platform built with Next.js App Router, Tailwind CSS, TypeScript, and Google Gemini AI.**

Deploy 100% free on **Vercel** with **zero monthly cost**.

---

## ✨ Features

- 📄 **Multi-Format Resume Support**: Upload PDF, DOCX, DOC, or TXT files, or paste resume text directly.
- 🎯 **AI-Powered Skill Analysis**: Evaluates resume against target job description using Google Gemini.
- 📊 **Visual Score Gauges**: Instant circular gauges for Profile Fit Score (0-100) & Skill Match Percentage.
- ✅ **Matched vs Missing Skills**: Categorized breakdown of skills with priority tags (`High`, `Medium`, `Low`) and specific reasoning.
- 🗺️ **Personalized Learning Roadmap**: Ordered step-by-step path with time estimates and curated free resources (YouTube, freeCodeCamp, docs).
- ✍️ **Resume Improvement Suggestions**: Actionable bullet points to optimize your resume for target ATS and recruiters.
- 📥 **PDF Report Download**: Export full analysis report to PDF in one click.
- 🌓 **Dark & Light Mode**: Built-in system-aware theme switcher.
- 📱 **Fully Responsive**: Optimized UI for mobile, tablet, and desktop screens.
- ⚡ **Zero External Heavy Storage/ML**: Pure Serverless API & Web Standard parsing for instant execution on Vercel Free tier.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **AI Model**: [Google Gemini 2.0 Flash / 1.5 Pro](https://ai.google.dev/) via `@google/generative-ai`
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Resume Parsers**: `pdf-parse` (PDF), `mammoth` (DOCX/DOC), plain text (TXT)
- **Icons & UI Utilities**: `lucide-react`, `sonner` (Toast Notifications)
- **Deployment**: [Vercel](https://vercel.com/) (Zero Config)

---

## 🔑 How to Get a Free Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google Account.
3. Click **Create API key**.
4. Copy your API key. (Free tier includes up to 15 requests per minute with zero credit card required).

---

## 🚀 Quick Start (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/AI-Skill-Gap-Analyzer.git
cd AI-Skill-Gap-Analyzer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory:
```env
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel (3 Simple Steps)

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Import to Vercel
1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New** → **Project**.
3. Select your GitHub repository.

### Step 3: Add Environment Variable & Deploy
1. Under **Environment Variables**, add:
   - `GOOGLE_GEMINI_API_KEY` = *your_gemini_api_key*
2. Click **Deploy**.

Vercel will build and deploy your app in under 60 seconds with a free `.vercel.app` URL!

---

## 📂 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts     # Server API endpoint calling Gemini & parsers
│   │   ├── results/
│   │   │   └── page.tsx         # Results dashboard view
│   │   ├── globals.css          # Tailwind CSS & theme tokens
│   │   ├── layout.tsx           # App root layout with theme provider & header
│   │   └── page.tsx             # Home landing page & file upload form
│   ├── components/
│   │   ├── ui/                  # Reusable UI primitives (Button, Card, Badge, etc.)
│   │   ├── gap-analysis.tsx     # Detailed gap analysis card
│   │   ├── header.tsx           # Navbar header with theme toggle
│   │   ├── learning-roadmap.tsx # Step-by-step roadmap with resource links
│   │   ├── loading-skeleton.tsx # Skeleton loader state
│   │   ├── results-dashboard.tsx# Dashboard layout & PDF export logic
│   │   ├── resume-suggestions.tsx# Resume rewrite tips card
│   │   ├── resume-uploader.tsx  # Drag & drop / text input component
│   │   ├── score-gauge.tsx      # SVG circular score gauge
│   │   └── skill-badges.tsx     # Matched and missing skill badges
│   ├── lib/
│   │   ├── gemini.ts            # Gemini API client with JSON schema enforcement
│   │   ├── prompts.ts           # System instructions & analysis prompt
│   │   ├── resume-parser.ts     # PDF, DOCX, and TXT parsing engine
│   │   └── utils.ts             # Tailwind class merger
│   ├── store/
│   │   └── analysis-store.ts    # Zustand global state store
│   └── types/
│       └── analysis.ts          # TypeScript type definitions
├── .env.example
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).
