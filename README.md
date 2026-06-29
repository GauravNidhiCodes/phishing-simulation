# Pinkman Protects

A phishing simulation and security awareness platform built for Indian organizations. Teams can run safe phishing tests, deliver short lessons the moment someone slips, and track human risk across departments and branches.

Passwords entered during a simulation are never stored — they are discarded in the browser.

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion
- **Charts:** Recharts
- **Database:** SQLite via Prisma 7 (`better-sqlite3` adapter)

## Prerequisites

- Node.js 18.18 or later
- npm

## Getting Started

1. Install dependencies (this also generates the Prisma client):

   ```bash
   npm install
   ```

2. Prepare the database schema:

   ```bash
   npx prisma db push
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Accounts

Use these credentials on the login page to explore each role:

| Role           | Email                  | Password         |
| -------------- | ---------------------- | ---------------- |
| Super admin    | superadmin@company.in  | Superadmin123!   |
| Security admin | admin@company.in       | Admin123!        |
| HR manager     | hr@company.in          | HrManager123!    |
| Team member    | rahul@company.in       | password123      |

## Available Scripts

| Command         | Description                                      |
| --------------- | ------------------------------------------------ |
| `npm run dev`   | Start the development server                      |
| `npm run build` | Generate the Prisma client and build for production |
| `npm run start` | Run the production build                          |
| `npm run lint`  | Run ESLint                                        |

## Project Structure

```
src/
  app/         Pages, layouts, and API routes (App Router)
  components/  Reusable UI, layout, and landing-page components
  lib/         Database client and shared utilities
prisma/        Database schema and local SQLite database
```

## Deployment

The project builds on Vercel. Note that the default setup uses file-based SQLite, which is read-only on serverless platforms. For a fully writable production deployment, migrate to a hosted database (for example PostgreSQL).
