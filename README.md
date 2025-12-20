# ATS Resume Analyzer SaaS

A role-based ATS resume analyzer built with Next.js, Node.js, and MongoDB.

## Project Structure
- `client`: Next.js frontend (App Router, Tailwind CSS)
- `server`: Node.js Express backend

## Setup & Run

### Prerequisites
- Node.js
- MongoDB (Running locally on default port 27017)

### Backend (Server)
1. Navigate to `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies (if not done):
   ```bash
   npm install
   ```
3. Configure `.env` if needed (Default: mongodb://127.0.0.1:27017/atsresume)
4. Start the server:
   ```bash
   npm start
   ```
   Server runs on http://localhost:5000

### Frontend (Client)
1. Navigate to `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   App runs on http://localhost:3000

## Features
- User Authentication (JWT)
- Resume Upload (PDF/DOCX)
- Role-based Analysis Scoring
- Detailed Report (Keywords, Formatting, Sections)
- Job Description Matcher
- AI Suggestions (Requires OpenAI API Key in server/.env)

## Tech Stack
- **Frontend**: Next.js, TailwindCSS, Framer Motion, Recharts, Lucide Icons
- **Backend**: Express.js, Mongoose, Multer, PDF-Parse
- **Database**: MongoDB
