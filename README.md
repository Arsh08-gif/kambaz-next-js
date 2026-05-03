# Kambaz LMS

A full-stack Learning Management System inspired by Canvas. Supports course management, quizzes, assignments, and role-based access for Faculty and Students.

**Live Demo:** [kambaz-next-js-black-two.vercel.app](https://kambaz-next-js-git-project-arsh08-gifs-projects.vercel.app/Account/Signin)

---

## Overview

Kambaz is a full-stack LMS where Faculty can create courses, build multi-type quizzes, and manage assignments, while Students can enroll, take quizzes, and view graded results.

The frontend uses **Next.js + Redux + TypeScript** with file-based routing and centralized state management. The backend is a **Node.js + Express** REST API following a route → controller → DAO → model pattern, connected to **MongoDB Atlas** via Mongoose.

The core technical feature is a **server-side grading engine** that handles three question types (Multiple Choice, True/False, Fill in the Blank), calculates per-question scores, tracks attempt numbers per user, and returns fully graded results to the frontend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Next.js, Redux Toolkit, TypeScript |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| HTTP Client | Axios |
| UI Library | React Bootstrap |
| Deployment | Vercel (frontend), Render (backend) |

---

## Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account

---

## Installation

### 1. Clone the repositories

```bash
# Frontend
git clone https://github.com/your-username/kambaz-next-js
cd kambaz-next-js

# Backend
git clone https://github.com/your-username/kambaz-node-server
cd kambaz-node-server
```

### 2. Install dependencies

```bash
# Frontend
cd kambaz-next-js
npm install

# Backend
cd kambaz-node-server
npm install
```

### 3. Set up environment variables

**Frontend** — create `.env.local` in the frontend root:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Backend** — create `.env` in the backend root:
```
DATABASE_CONNECTION_STRING=mongodb+srv://<user>:<password>@cluster.mongodb.net/Kambaz
PORT=4000
```

### 4. Run the application

```bash
# Start backend (from kambaz-node-server)
node index.js

# Start frontend (from kambaz-next-js)
npm run dev
```

Frontend runs on `http://localhost:3000`
Backend runs on `http://localhost:4000`

---

## File Structure

### Frontend
```
kambaz-next-js/
├── app/
│   └── Kambaz/
│       ├── Account/               # Login, signup, profile
│       │   ├── reducer.ts         # Redux slice for auth + enrollment
│       │   └── client.ts          # Account API calls
│       ├── Courses/
│       │   ├── [cid]/             # Dynamic route per course
│       │   │   ├── Assignments/   # Assignment management
│       │   │   ├── Modules/       # Course modules
│       │   │   ├── Quizzes/
│       │   │   │   ├── [qid]/     # Dynamic route per quiz
│       │   │   │   │   ├── Questions/     # Question editor
│       │   │   │   │   ├── QuizResults/   # Results page
│       │   │   │   │   └── page.tsx       # Quiz detail
│       │   │   │   └── page.tsx           # Quiz list
│       │   │   └── People/        # Enrollment management
│       │   └── reducer.ts         # Redux slice for courses
│       ├── store.ts               # Redux store
│       └── client.ts              # Centralized Axios API layer
```

### Backend
```
kambaz-node-server/
├── Courses/
│   └── routes.js                  # Course endpoints
├── Quizzes/
│   ├── routes.js                  # Quiz endpoints
│   ├── dao.js                     # Quiz DB queries
│   └── model.js                   # Mongoose schema
├── Attempts/
│   ├── routes.js                  # Attempt + grading endpoints
│   ├── dao.js                     # Attempt DB queries
│   └── model.js                   # Mongoose schema
├── Users/
│   ├── routes.js                  # Auth endpoints
│   ├── dao.js                     # User DB queries
│   └── model.js                   # Mongoose schema
└── index.js                       # Express app entry point
```

---

## Deployment Notes

- Frontend auto-deploys to **Vercel** on push to main
- Backend deployed on **Render** — free tier spins down after inactivity, first request may take ~30 seconds to wake up
- CORS configured on the backend to allow both the Vercel production URL and `localhost:3000`

---

## Known Limitations

- Render free tier causes cold start delays on first request
- No real-time notifications or collaboration features

---

## Future Improvements

- **Calendar Feature** — a personal calendar for students and faculty to track assignment due dates, quiz deadlines, and course events in one place
- **LLM Chatbot Integration** — an AI assistant that parses natural language input to automatically create calendar events and set reminders (e.g. "Remind me about the algorithms quiz on Friday at 9am")