# ResumeAI - Resume Builder

A full-stack resume builder with AI assistance, multiple templates, and PDF download.

## Tech Stack
- **Frontend**: React, react-router-dom, react-to-print, react-hot-toast
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Mongoose)
- **AI**: Anthropic Claude API (claude-haiku)
- **Auth**: JWT + bcryptjs

## Features
- ✅ User authentication (register/login)
- ✅ Create, edit, delete resumes
- ✅ 2 Free templates + 1 Premium template (simulated lock)
- ✅ Live resume preview
- ✅ Download as PDF (print-to-PDF)
- ✅ AI: Generate summary, improve experience, suggest skills
- ✅ All data stored in MongoDB

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)
- Anthropic API key

### Backend
```bash
cd backend
npm install
# Create .env with MONGO_URI, JWT_SECRET, ANTHROPIC_API_KEY, PORT=5000
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Assumptions
- Premium upgrade is simulated (no real payment)
- PDF download uses browser print dialog
- AI features require a valid Anthropic API key