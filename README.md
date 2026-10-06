# Gagan Electronics Lab — 3D Printing & Additive Manufacturing Platform

A production-ready website and digital manufacturing platform for **Gagan Electronics Lab**, a precision 3D printing and rapid prototyping facility based in Bengaluru, India.

🌐 **Live Demo:** [https://gaganaits.github.io/gagan-electronics-lab/](https://gaganaits.github.io/gagan-electronics-lab/)  
📁 **Repository:** [https://github.com/gaganaits/gagan-electronics-lab](https://github.com/gaganaits/gagan-electronics-lab)

---

## 🏗️ Highlights & Architecture

- **Visual Design System ("Softly" Aesthetic):**
  - Warm, tactile off-white canvas (`#FDFCF8`), grounded stone typography (`#292524`), calming sage/lavender utility accents, and coral (`#FFB7B2`) focal call-to-actions.
  - Subtle noise/grain overlay for a bespoke studio feel.
  - Authentic industrial copywriting focused on real engineering tolerances, materials, and processes (no generic marketing claims or fabricated statistics).
- **Interactive Quotation Wizard (`/request-quote`):**
  - 4-step guided order workflow: Service selection → CAD/Blueprint file uploads (STL, STEP, PDF, DXF, PNG, JPG) or Google Drive link input → Engineering specifications (Material, Infill %, Layer height, Tolerances) → Contact details & delivery timeline.
  - Instant reference generator (`QT-2026-XXXXXX`) with copy-to-clipboard functionality.
  - Works with full backend APIs and provides dual-mode client persistence for static demo environments.
- **Operations & Admin Portal (`/admin`):**
  - **KPI Dashboard (`/admin`):** Live queue of new requests, CAD inspections in progress, sent quotes, and completed builds.
  - **Quotation Management (`/admin/quotes`):** Filter by status (`NEW`, `UNDER_REVIEW`, `QUOTE_SENT`, `ACCEPTED`, `COMPLETED`), search by customer/reference/material.
  - **Quote Inspector (`/admin/quotes/[id]`):** Geometry review notes, file downloads, real-time pricing updates, and transition logs.
  - **Pricing Engine Simulator (`/admin/pricing`):** Material cost/kg, machine hourly rates, power consumption, labour, post-processing, minimum order fees, and live interactive estimation calculator.
  - **Catalog Manager (`/admin/products`):** Full technical specs, build volumes, layer resolutions, and supported polymers.
  - **Security Audit Logs (`/admin/audit-logs`):** Immutable chronological record of admin access, file downloads, status changes, and pricing revisions.
- **Enterprise Security:**
  - **File Upload Protection:** Magic byte inspection (validates true binary STL and PDF headers), file size limits (50MB), filename sanitization, and random storage path generation.
  - **Google Drive SSRF Defense:** Strict domain validation and private IP address blocklisting.
  - **Rate Limiting:** Sliding-window rate limiter on quotation and contact endpoints.
  - **Authentication:** HMAC SHA-256 signed session tokens with `Timing-Safe` comparison and `HttpOnly`, `SameSite=Lax`, `Secure` cookies.
  - **Database Security:** Supabase PostgreSQL with Row Level Security (RLS) policies and private storage buckets, paired with local dual-mode fallback.

---

## 🔐 Demo Admin Access

For evaluating the administrative operations portal on GitHub Pages or locally:

- **Portal URL:** `/admin/login`
- **Email:** `admin@gaganelectronicslab.com` *(or `gaganaits@gmail.com`)*
- **Password:** `GaganLab2026!` *(or `admin123`)*

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript 5.7 (Strict mode)
- **Styling:** Tailwind CSS with custom editorial design tokens
- **Icons:** Lucide React
- **Validation:** Zod
- **Database / Storage:** Dual-mode architecture:
  - Production: Supabase PostgreSQL + Private Storage Buckets
  - Development / Demo: Atomic JSON persistence & client storage fallback
- **CI/CD:** GitHub Actions workflow deploying static export to GitHub Pages

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18.17+ or 20.x
- npm 9+ or pnpm / yarn

### Installation

1. **Clone repository:**
   ```bash
   git clone https://github.com/gaganaits/gagan-electronics-lab.git
   cd gagan-electronics-lab
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment (Optional for Supabase integration):**
   ```bash
   cp .env.example .env.local
   ```
   *Note: The application automatically falls back to local data persistence if Supabase credentials are not provided.*

4. **Run development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Typecheck & Linting:**
   ```bash
   npm run typecheck
   npm run lint
   ```

6. **Static Export for GitHub Pages:**
   ```bash
   npm run build:export
   ```
   The static distribution will be created in `./out`.

---

## 📦 GitHub Pages Deployment

This repository includes an automated GitHub Actions deployment workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### Enabling GitHub Pages in Repository Settings:
1. Go to **Settings** > **Pages** in the GitHub repository.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Push changes to the `main` branch. The action will build the static export and deploy automatically to:  
   `https://gaganaits.github.io/gagan-electronics-lab/`

---

## 📄 License

Proprietary © 2026 Gagan Electronics Lab. All rights reserved.
