# Food Finder Full-Stack Application - Agent Guidelines

Welcome to the **Food Finder** project. This repository is a production-grade full-stack application for searching packaged food products via Open Food Facts, supporting internationalization (EN, NL, DE, FR), MySQL search tracking via Prisma, and gated nutritional data via Stripe Subscriptions.

## Project Structure
- `backend/`: Express.js + TypeScript + Prisma ORM + MySQL.
- `frontend/`: Next.js (React 19 / App Router) + TypeScript + Tailwind CSS.
- `.agents/`: Project agent skills, runbooks, and behavioral rules.
- `docker-compose.yml`: Quick-start MySQL container.
- `README.md`: System documentation, architecture rationale, and setup guides.

## Core Rules & Invariants
1. **TypeScript Strictness**: Keep types clean and explicit without using `any` unless strictly justified.
2. **Environment Variables**: Never hardcode secrets or URLs. Keep them in `.env` and provide defaults in `.env.example`.
3. **Resilient Third-Party API Handling**: The Open Food Facts API can return nulls, missing language keys, or incomplete nutrition fields. Always sanitize data through fallback adapters (`product_name_{lang}` -> `product_name_en` -> `product_name` -> `"Unknown Product"`).
4. **Subscription Gatekeeping**: Detailed nutritional fields (`nutriments`) must NEVER be sent to unsubscribed demo users. The backend is the source of truth for access enforcement.
5. **Language Support**: All UI elements and product text must support English (`en`), Dutch (`nl`), German (`de`), and French (`fr`).
6. **Documentation & Testing**: Any new backend route or service feature must have corresponding unit or integration tests in `backend/__tests__/`.
