# SalaryVault Backend + Frontend Sweep Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add real backend calculation layer, normalize city data contract, and fix UI/SEO/share inconsistencies while preserving Remote ROI + Compare Cities flows.

**Architecture:** Keep static single-page frontend for Netlify, move financial logic to shared backend module, expose serverless API (`/.netlify/functions/calculate`) for deterministic calculations, and have frontend call API with local fallback. Centralize city records in `data/cities.json` to remove duplication.

**Tech Stack:** HTML/CSS/Vanilla JS, Node.js (CommonJS), Netlify Functions.

---

### Task 1: Data and Backend Foundation

**Files:**
- Create: `data/cities.json`
- Create: `backend/calculator.js`
- Create: `netlify/functions/calculate.js`
- Create: `netlify.toml`

- [ ] **Step 1: Create canonical 80-city dataset and normalized fields**
- [ ] **Step 2: Implement shared tax + ROI + city comparison utilities in backend module**
- [ ] **Step 3: Implement API handler for remote and compare modes with validation**
- [ ] **Step 4: Add redirect to expose friendly `/api/calculate` path**

### Task 2: Frontend Integration + Consistency Sweep

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add missing SEO/share metadata (canonical, og image/url, twitter tags, FAQ JSON-LD)**
- [ ] **Step 2: Add missing ad slot and sticky mobile summary container**
- [ ] **Step 3: Replace inline calculator logic with API-backed renderer + fallback path**
- [ ] **Step 4: Fix URL param completeness (`commute`, `misc`), formatting bugs, and mode-switch edge cases**
- [ ] **Step 5: Remove dead comments/placeholders and normalize naming inconsistencies**

### Task 3: Verification + Delivery

**Files:**
- Modify: `index.html`
- Modify: `backend/calculator.js`
- Modify: `netlify/functions/calculate.js`

- [ ] **Step 1: Verify JSON validity and JS syntax (`node --check`)**
- [ ] **Step 2: Run local function unit smoke checks using `node -e`**
- [ ] **Step 3: Review git diff for redundancy/dead-code regressions**
- [ ] **Step 4: Commit with focused message and push branch**
