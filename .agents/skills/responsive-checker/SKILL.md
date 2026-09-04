---
name: responsive-checker
description: >-
  Automated agent skill and CLI test runner to audit, detect, and verify web application
  responsiveness across multiple viewports (mobile, tablet, desktop) and all supported
  languages (EN, NL, DE, FR). Use whenever evaluating layout overflow, responsive UI integrity,
  or mobile adaptation in the Food Finder frontend.
---

# Responsive Checker Agent & Runbook

This skill equips the agent to automatically evaluate, audit, and safeguard the responsive layout of the Food Finder web application across mobile, tablet, and desktop viewports.

## Core Responsibilities

1. **Multi-Viewport Layout Auditing**: Validates layout bounds across standard device viewports:
   - **Mobile S (320 × 568px)**: Strict baseline (iPhone SE 1st gen).
   - **Mobile Android (360 × 800px)**: Primary global Android standard.
   - **Mobile M (375 × 667px)**: iPhone SE 2nd/3rd gen, iPhone 8.
   - **Mobile L (414 × 896px)**: Large smartphone viewports (iPhone XR / 11 / Max).
   - **Tablet Portrait (768 × 1024px)**: iPad / Tablet standard.
   - **Tablet Landscape / Laptop (1024 × 768px)**: Small laptop / iPad Landscape.
   - **Desktop Standard (1280 × 800px)**: Standard laptop display.
   - **Desktop Wide (1920 × 1080px)**: FHD desktop monitor.

2. **Multi-Language Responsive Safety**: German (`de`) and Dutch (`nl`) translations frequently feature compound words up to 2.5x longer than English equivalents (e.g., "Lebensmittel-Finder", "Verzadigde vetten", "Upgrade auf Pro (9,99 €/Monat)"). The checker verifies that component containers accommodate these languages without horizontal blowout.

3. **Anti-Pattern & Layout Defect Detection**:
   - Fixed un-responsive widths (`w-[...px]`, `min-w-[...px]`) without responsive modifiers.
   - Un-wrapped flex rows (`flex` without `flex-wrap` or responsive flex direction `flex-col sm:flex-row`).
   - Unconstrained dynamic text strings lacking `truncate`, `line-clamp`, or `break-words`/`break-all`.
   - Missing Viewport meta configuration.
   - Unbounded tables or grid containers.

## Running the Automated Check

To run the automated responsive checker:

```bash
# From within the frontend/ directory:
npm run test:responsive

# Or directly from the project root:
node .agents/skills/responsive-checker/scripts/check-responsiveness.mjs
```

## Remediation Guidelines

If a responsive defect is flagged:
1. **Horizontal Page Blowout**: Verify `overflow-x: hidden` and `max-width: 100vw` on `body`/`html` in `globals.css`.
2. **Navbar Header Overflow**: Ensure the subscribe CTA renders compactly (`Pro` on `< 640px`, full text on `>= 640px`), and brand text includes `truncate` and `min-w-0`.
3. **Modal Dialog Overflow**: Ensure the modal container uses `max-h-[92vh]` with `overflow-y-auto` and barcode strings use `break-all`.
4. **Nutritional Table Overflow**: Ensure value cells have `shrink-0` and label cells have `min-w-0`.
