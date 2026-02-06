# Cross Talk

https://cross-talk.fly.dev/

A political discussion platform that helps people with opposing views find common ground.

## Overview

Cross Talk is designed to facilitate constructive political conversations by:
- Providing nuanced political surveys across multiple topics
- Creating persistent political profiles for users
- Using AI to find common ground between users with different views

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Redux Toolkit
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite
- **AI**: OpenAI GPT-4

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The API server will start at http://localhost:3001

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at http://localhost:5173

### Environment Variables

Create a `.env` file in the backend directory:

```
OPENAI_API_KEY=your_openai_api_key
```

## Project Structure

```
crosstalk/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── reducers/      # Redux reducers
│   │   ├── actions/       # Redux async thunks
│   │   ├── sources/       # API sources
│   │   ├── interfaces/    # TypeScript types
│   │   └── styles/        # CSS styles
├── backend/           # Express API server
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── db/            # Database setup
│   │   └── types/         # TypeScript types
└── README.md
```

## Features

- **Political Surveys**: Answer nuanced questions about various political topics
- **User Profiles**: Create a persistent political profile with optional blog link
- **Find Common Ground**: Compare your views with others and discover areas of agreement
