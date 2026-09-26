# CareerMatch AI — AI Resume Builder & Intelligent Job Matcher

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://careermatch-rouge-phi.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/gopikrishna0709/CareerMatch)
[![License: MIT](https://img.shields.io/badge/License-MIT-plum?style=for-the-badge)](LICENSE)

> **Live Deployment:** [https://careermatch-rouge-phi.vercel.app/](https://careermatch-rouge-phi.vercel.app/)  
> **Source Code Repository:** [https://github.com/gopikrishna0709/CareerMatch](https://github.com/gopikrishna0709/CareerMatch)

A modern, full-stack AI-powered Resume Builder and ATS Job Matcher web application built with **React**, **Tailwind CSS**, **JWT Authentication**, **MongoDB Atlas Cloud**, and **Google Gemini AI**.

---

## 🌐 Quick Links

- 🚀 **Live Production App:** [https://careermatch-rouge-phi.vercel.app/](https://careermatch-rouge-phi.vercel.app/)
- 💻 **GitHub Repository:** [https://github.com/gopikrishna0709/CareerMatch](https://github.com/gopikrishna0709/CareerMatch)
- 📖 **API & Architecture Docs:** See details below

---

## 🌟 Key Features

### 1. 🤖 AI-Powered Resume Builder
- **Real-Time Dual-Pane Workspace**: Edit your resume on the left and see instant high-fidelity rendering on the right.
- **✨ AI Summary Polish**: Generates high-impact, ATS-optimized career summaries tailored to your target role and experience level.
- **✨ AI STAR Bullet Point Generator**: Transforms raw responsibilities into impactful bullet points using the STAR method (*Situation, Task, Action, Result*) with quantifiable metrics.
- **Multi-Template Engine**:
  - **Modern Tech (Silicon)**: High-tech developer format with categorized skill chips and contact badges.
  - **Executive Minimal (Oxford)**: Elegant, serif typography designed for leadership and corporate positions.
  - **Creative Nordic (Slate)**: Contemporary split sidebar design with accent palettes.
  - **Compact ATS (Direct)**: Ultra-dense, black-and-white format engineered for maximum ATS parser scores.
- **Live Theme & Color Palette Customizer**: Switch accent colors (Deep Plum, Warm Terracotta, Golden Amber, Soft Sage, Charcoal Slate, Nordic Forest) and typography on the fly.
- **Crisp PDF Export & Isolated Print**: 1-click A4 PDF generation powered by `html2canvas` and `jsPDF`, with dedicated isolated iframe print architecture for clean A4 printing without website UI artifacts.

---

### 2. 🎯 AI Job Matcher & ATS Compatibility Scanner
- **Target Role Compatibility**: Match any saved resume against curated top-tier tech jobs (Stripe, Airbnb, OpenAI Partner, etc.) or paste any custom Job Description.
- **Comprehensive Score Breakdown**:
  - Overall Compatibility Score (0 - 100%)
  - Estimated ATS Pass Probability
  - Skills Match vs. Experience Depth vs. Academic Fit
- **Keyword Intelligence**:
  - **Matching Keywords**: Visual green tags showing matched core competencies.
  - **Missing Critical Keywords**: Amber warning tags highlighting essential skills found in the JD that are absent from your resume.
- **Strengths & Critical Gap Analysis**: Clear bullet points explaining what recruiters will love and what could hold you back.
- **⚡ 1-Click Auto-Tailor**: Instantly injects missing skills and updates the professional summary into your active resume with one click!

---

### 3. 💼 Live Job Board & Application Tracker
- Explore curated high-growth tech positions with salary ranges, remote indicators, and skill tags.
- Direct **"Match with AI"** action button to evaluate compatibility in seconds.
- **Match History**: Persistent log of all past analyzed applications and scores.

---

### 4. 🧠 Career AI Studio
- **Mock Interview Questions Generator**: Role-tailored behavioral, technical, and situational interview questions with ideal answer guides.
- **90-Day Learning Roadmap Generator**: Strategic weekly learning milestones targeting your missing skills.
- **Cover Letter Generator**: High-conversion cover letter generation referencing your specific projects and achievements.

---

### 5. 🔐 Authentication & Session Security
- Secure JWT-based registration and login with bcrypt password hashing.
- Persistent session storage across page transitions.
- **Instant 1-Click Demo Mode**: Experience all features immediately without entering credentials.

---

## 🏗️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti, jsPDF, html2canvas, Axios
- **Backend**: Node.js, Express, Mongoose, JWT (`jsonwebtoken`), Bcryptjs, Morgan, CORS
- **AI Intelligence**: Google Gemini API (`@google/genai`) with semantic NLP fallback engine
- **Database**: MongoDB Atlas Cloud Database
- **Hosting**:
  - **Frontend**: Vercel ([careermatch-rouge-phi.vercel.app](https://careermatch-rouge-phi.vercel.app/))
  - **Backend**: Render Cloud

---

## 🚀 Running the Project Locally

### 1. Clone the Repository
```bash
git clone https://github.com/gopikrishna0709/CareerMatch.git
cd CareerMatch
```

### 2. Backend Server
```bash
cd server
npm install
npm start
```
*Server runs on `http://localhost:5000` and connects to MongoDB Atlas.*

### 3. Frontend Client
```bash
cd ../client
npm install
npm run dev
```
*Vite frontend runs on `http://localhost:3000` with automated proxy to the backend API.*

---

## 📁 Project Structure

```
├── client/          # Frontend React + Tailwind Application (Deployed to Vercel)
│   ├── src/
│   │   ├── components/
│   │   │   ├── background/
│   │   │   ├── builder/
│   │   │   ├── career/
│   │   │   ├── home/
│   │   │   ├── jobs/
│   │   │   ├── matcher/
│   │   │   └── tools/
│   │   ├── context/
│   │   └── services/
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
└── server/          # Backend Node.js / Express API (Deployed to Render)
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   └── utils/
    └── server.js
```

---

## 👨‍💻 Author & Repository

- **Project:** CareerMatch AI
- **Live Demo:** [https://careermatch-rouge-phi.vercel.app/](https://careermatch-rouge-phi.vercel.app/)
- **GitHub:** [https://github.com/gopikrishna0709/CareerMatch](https://github.com/gopikrishna0709/CareerMatch)

