# 📄 ResumeAI — AI-Powered Resume Builder

A full-stack web application where users can create, edit, preview, and download professional resumes with AI assistance.

---

## 🚀 Live Demo

> Run locally following the setup instructions below.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| React Router DOM | Client-side routing |
| Axios | HTTP requests to backend |
| html2canvas | Captures resume as image for PDF |
| jsPDF | Converts captured image to downloadable PDF |
| react-hot-toast | Toast notifications |
| Google Fonts | Playfair Display + DM Sans typography |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| Mongoose | MongoDB ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| dotenv | Environment variable management |
| nodemon | Auto-restart in development |

### Database & AI
| Technology | Purpose |
|---|---|
| MongoDB (Local) | Primary database — users and resumes |
| OpenRouter API | Free AI gateway |
| openrouter/auto | Auto-selects best available free model |

---

## ✅ Features Implemented

### Authentication
- User registration with bcrypt password hashing
- JWT login with 7-day token expiry
- Protected routes — dashboard, editor, preview require valid JWT
- Persistent sessions via localStorage

### Resume Management
- Create, edit, delete resumes
- Multiple resumes per user
- All data stored in MongoDB (not just localStorage)
- Live side-by-side editor with instant preview

### Resume Sections
- Personal Information (name, email, phone, location, LinkedIn, website)
- Professional Summary
- Work Experience (multiple entries)
- Education (multiple entries)
- Skills (tag-based input)
- Projects (name, tech stack, URL, description)

### Templates
- **Template 1 — Classic Professional** (Free) — centered layout, blue accents
- **Template 2 — Modern Minimal** (Free) — two-column with green sidebar
- **Template 3 — Executive Premium** (Paid) — purple gradient header, locked unless upgraded

### Preview & Download
- Live preview updates in real-time while editing
- Dedicated `/preview/:id` full-page preview route
- Direct PDF download using html2canvas + jsPDF — no print dialog, saves straight to Downloads folder
- Preview accessible from dashboard, editor, and preview page

### AI Assistance
- **Generate Summary** — creates professional summary from user context
- **Improve Experience** — rewrites job descriptions with action verbs
- **Suggest Skills** — returns 10 relevant skill tags with fallback if AI returns empty
- Powered by OpenRouter API (`openrouter/auto`)

---

## 📁 Project Structure
```
resume-builder/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Resume.js            # Resume schema (all sections)
│   ├── routes/
│   │   ├── auth.js              # /register, /login, /upgrade
│   │   ├── resumes.js           # CRUD for resumes
│   │   └── ai.js                # AI content generation
│   ├── server.js                # Express app entry point
│   ├── .env                     # Environment variables (not committed)
│   └── package.json
│
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.js   # Global auth state
        ├── pages/
        │   ├── AuthPage.js      # Login / Register
        │   ├── Dashboard.js     # Resume list
        │   ├── Editor.js        # Resume editor
        │   ├── ResumePreview.js # 3 template renderers
        │   ├── TemplateSelector.js
        │   └── PreviewPage.js   # Full-page preview
        ├── utils/
        │   ├── api.js           # Axios + JWT interceptor
        │   ├── templates.js     # Template metadata
        │   └── downloadPDF.js   # html2canvas + jsPDF logic
        └── App.js               # Routes
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Community Server (local) — [download here](https://www.mongodb.com/try/download/community)
- OpenRouter API Key (free) — [get one here](https://openrouter.ai)

### 1. Clone the Repository
```bash
git clone https://github.com/Yash-Swarup/resume-builder.git
cd resume-builder
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```
MONGO_URI=mongodb://localhost:27017/resumebuilder
JWT_SECRET=mySuperSecretKey123
OPENROUTER_API_KEY=your_openrouter_api_key_here
PORT=5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install --legacy-peer-deps
```

### 4. Start MongoDB
```bash
# On Windows — open PowerShell as Administrator:
net start MongoDB
```

---

## ▶️ Running the Application

Open **two terminal windows**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Expected: 🚀 Server running on port 5000 | ✅ MongoDB connected
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
# Opens http://localhost:3000
```

### URLs
| URL | Description |
|---|---|
| http://localhost:3000 | Login / Register |
| http://localhost:3000/dashboard | Resume dashboard |
| http://localhost:3000/editor/:id | Resume editor |
| http://localhost:3000/preview/:id | Full-page preview |
| http://localhost:5000/api | Backend API |

---

## 🔌 API Endpoints

### Auth — `/api/auth`
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/upgrade` | Upgrade to premium (JWT required) |

### Resumes — `/api/resumes` (JWT required)
| Method | Route | Description |
|---|---|---|
| GET | `/api/resumes` | Get all resumes for user |
| GET | `/api/resumes/:id` | Get single resume |
| POST | `/api/resumes` | Create resume |
| PUT | `/api/resumes/:id` | Update resume |
| DELETE | `/api/resumes/:id` | Delete resume |

### AI — `/api/ai` (JWT required)
| Method | Route | Body | Description |
|---|---|---|---|
| POST | `/api/ai/generate` | `{ type, context }` | Generate AI content |

`type` values: `summary` \| `experience` \| `skills`

---

## 🤖 AI Features

AI is proxied through the backend so the API key is never exposed to the browser.

| Feature | How to trigger | What it does |
|---|---|---|
| Generate Summary | Summary tab → ✨ AI Generate | Creates 3-4 sentence professional summary |
| Improve Experience | Experience entry → ✨ AI Improve | Rewrites with action verbs + achievements |
| Suggest Skills | Skills tab → ✨ AI Suggest | Returns 10 skill tags (fallback list if AI returns empty) |

---

## 🎨 Templates

| Template | Type | Style |
|---|---|---|
| Classic Professional | Free | Centered, serif fonts, blue accents |
| Modern Minimal | Free | Two-column, green sidebar |
| Executive Premium | Paid (simulated) | Purple gradient header, skill chips |

> **Premium simulation:** Clicking "Upgrade" calls `POST /api/auth/upgrade` which sets `isPremium: true` in MongoDB. No real payment needed.

---

## 📝 Assumptions Made

- **PDF Generation** — Uses html2canvas + jsPDF instead of browser print dialog. Resume is captured as a high-quality image and converted directly to a PDF file downloaded to the user's Downloads folder with the resume title as filename
- **Premium Payment** — Simulated; sets `isPremium: true` in MongoDB without a real payment gateway
- **Local MongoDB** — Uses MongoDB Community Server locally instead of Atlas due to network restrictions blocking SRV DNS resolution
- **AI Provider** — Uses OpenRouter (free tier) instead of Anthropic Claude which requires paid credits. Skills generation includes a fallback list if the AI model returns an empty response
- **JWT Storage** — Stored in localStorage for simplicity; production would use httpOnly cookies
- **No Email Verification** — Registration is immediate without email confirmation
- **Legacy Peer Deps** — Frontend uses `--legacy-peer-deps` during install due to React 19 compatibility with some packages

---

## 🏗️ Architecture
```
Browser (React)  →  Express API (Node.js)  →  MongoDB
                          ↓
                    OpenRouter AI API
```

- Frontend never talks to AI or DB directly
- All sensitive keys live in backend `.env`
- JWT middleware protects all resume and AI routes
- Resume data always persisted to MongoDB on save
- PDF generated entirely client-side using html2canvas + jsPDF

---

## 📦 Scripts

### Backend
```bash
npm run dev    # Start with nodemon (auto-restart)
npm start      # Start without nodemon
```

### Frontend
```bash
npm start      # Start development server
npm run build  # Build for production
```
