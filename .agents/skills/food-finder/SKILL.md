---
name: food-finder
description: >-
  Operational runbook for the Food Finder full-stack app. Use to understand how
  to run database migrations, start the Express backend and Next.js frontend, execute tests,
  and verify Stripe webhook simulation.
---

# Food Finder Operational Runbook

This skill provides step-by-step guidance on developing, testing, and running the Food Finder application.

## Quick Reference Commands

### 1. Database & Migrations
```bash
# Start MySQL container (if using Docker)
docker compose up -d

# Run Prisma migrations (inside backend/)
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

### 2. Backend Server
```bash
cd backend
npm install
npm run dev     # Runs on http://localhost:4000
```

### 3. Frontend Client
```bash
cd frontend
npm install
npm run dev     # Runs on http://localhost:3000
```

### 4. Running Automated Tests
```bash
cd backend
npm test        # Runs Jest test suite
```

## Stripe Integration & Evaluation
- Stripe Checkout creates a session for the demo user (`demo@example.com`).
- Webhook endpoint: `POST /api/stripe/webhook` (expects raw body).
- For local manual testing without a Stripe CLI webhook tunnel, use the demo evaluation toggle:
  `POST /api/demo/toggle-subscription`
