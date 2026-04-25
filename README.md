# HH Project

## Overview

This workspace contains a full-stack starter project with:
- `Next.js` frontend in `frontend/`
- `Express` backend in `backend/`
- `MySQL` database integration
- `Vercel` deployment path for the frontend
- `Railway` deployment path for the backend and database

## Frontend Setup

1. Open `frontend/`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Preview locally at `http://localhost:3000`

## Backend Setup

1. Open `backend/`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env`
4. Set your MySQL connection values in `.env`
5. Start development server: `npm run dev`
6. Preview backend at `http://localhost:4000`

## Deployment Notes

- Frontend: Deploy `frontend/` to Vercel.
- Backend: Deploy `backend/` to Railway.
- Database: Use Railway MySQL add-on and wire the connection string to the backend.
- Hostinger: Use Hostinger for any final static site or DNS hosting needs at the end of the project.

## VS Code Tasks

Use the tasks in `.vscode/tasks.json` to run frontend and backend from the workspace.

## Important

This scaffold assumes Node.js is installed on the local machine. Install Node.js before running the commands.
