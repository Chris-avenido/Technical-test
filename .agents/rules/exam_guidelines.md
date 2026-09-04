# Exam Guidelines & Standards

These rules apply across all development tasks within this repository:

## 1. Security & Secrets
- Never commit secrets (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `DATABASE_URL`).
- Maintain a strictly synced `.env.example` in both backend and frontend.

## 2. API Design & Error Handling
- Use RESTful endpoints prefixed with `/api`.
- Always return consistent JSON envelopes:
  - Success: `{ success: true, data: ... }`
  - Error: `{ success: false, error: { message: "...", code: "..." } }`
- HTTP status codes:
  - 200 OK, 201 Created
  - 400 Bad Request
  - 401 Unauthorized / 403 Forbidden
  - 404 Not Found
  - 500 Internal Server Error

## 3. Database & Prisma Conventions
- Primary keys: CUID or UUID strings.
- Timestamps: `createdAt` and `updatedAt` for all persistent models.
- Foreign keys with proper referential actions (`onDelete: Cascade` where appropriate).
- Migrations must be committed under `backend/prisma/migrations/`.

## 4. Internationalization (i18n)
- Supported languages: `en` (English), `nl` (Dutch), `de` (German), `fr` (French).
- UI strings must be localized via type-safe dictionary maps.
- Product information must prioritize the selected locale, falling back safely to English, then default attributes.
