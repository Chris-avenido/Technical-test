# 🚀 Food Finder - Complete Step-by-Step Installation & Setup Guide

This guide walks you through setting up the complete Food Finder application from scratch.

---

## 📋 Prerequisites Checklist
- **Node.js**: v18+ (tested with v25.5.0)
- **npm**: v9+ (tested with v11.8.0)
- **MySQL**: 8.0+ (either via Docker or local MySQL/XAMPP)
- **Git**: Installed

---

## Step 1: Clone or Navigate to the Workspace
```bash
# Navigate to the project root
cd Technical-test
```

---

## Step 2: Database Setup (MySQL)

You have two easy options:

### Option A: Using Docker (Recommended, 1-Click)
If you have Docker Desktop running:
```powershell
# From the project root:
docker compose up -d
```
This spins up a clean MySQL 8 container with:
- **Port**: `3306`
- **User**: `root`
- **Password**: `password`
- **Database**: `food_finder`

### Option B: Using Existing Local MySQL (XAMPP / Laragon / Standalone MySQL)
1. Start your local MySQL service.
2. Ensure a database named `food_finder` exists:
   ```sql
   CREATE DATABASE IF NOT EXISTS food_finder;
   ```
3. Update `backend/.env` with your local credentials:
   ```env
   DATABASE_URL="mysql://your_user:your_password@localhost:3306/food_finder"
   ```

---

## Step 3: Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Verify Environment Variables**:
   Check `backend/.env` (pre-created from `.env.example`). Default values:
   ```env
   PORT=4000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   DATABASE_URL="mysql://root:password@localhost:3306/food_finder"
   STRIPE_SECRET_KEY=sk_test_mockKeyForExamTesting51234567890
   STRIPE_WEBHOOK_SECRET=whsec_mockWebhookSecretForExam123456789
   STRIPE_MONTHLY_PRICE_ID=price_monthly_exam_plan
   ```

4. **Generate Prisma Client & Run Migrations**:
   ```powershell
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Seed Demo User**:
   ```powershell
   npx prisma db seed
   ```
   *Creates demo user `demo@example.com` (`demo-user-1`) with default `INACTIVE` subscription.*

6. **Run Automated Tests**:
   ```powershell
   npm test
   ```
   *Executes all test suites (Open Food Facts fallback handling, subscription gatekeeping, Stripe webhooks, search history).*

7. **Start Backend Server**:
   ```powershell
   npm run dev
   ```
   *Backend will run on **http://localhost:4000**.*

---

## Step 4: Frontend Setup

1. **Open a new terminal and navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Verify Frontend Environment Variables**:
   Check `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```

4. **Start Frontend Dev Server**:
   ```powershell
   npm run dev
   ```
   *Frontend will run on **http://localhost:3000**.*

---

## Step 5: Verification & Testing Flows

### 1. Multilingual Search & Fallback
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Use the **Language Selector** in the navbar to switch between **English (EN)**, **Dutch (NL)**, **German (DE)**, and **French (FR)**.
- Search for a product (e.g., `nutella`, `oat milk`, `chocolate`).
- Observe that the UI and product names adapt to the chosen language where available.

### 2. Subscription Gatekeeping (Free vs Pro)
- Click on any product card to open the detail modal.
- As a **Free Demo User**, detailed nutritional fields (`nutriments`) are locked/blurred with an upgrade banner.
- Toggle to **Pro Subscriber** via the interactive **Demo Evaluation Panel** or the **Stripe Checkout** button.
- Re-open the product: all macronutrients, calories, and Nutri-Scores are fully revealed!

### 3. Search History
- Notice the recent searches chip list underneath the search bar.
- Recent queries are automatically saved to MySQL for the demo user.
