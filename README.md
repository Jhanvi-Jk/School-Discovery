# SchoolFinder Bengaluru

School discovery and comparison platform for Bengaluru parents.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| Hosting | Vercel |
| State | Zustand (filters + compare) |
| Data Fetching | TanStack React Query |
| Forms | React Hook Form + Zod |

## Getting Started

### 1. Clone and install

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env.local` and fill in your keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
3. In the Supabase SQL editor, run the migration:
   - `supabase/migrations/001_initial.sql`
4. Optionally run the seed data:
   - `supabase/seed.sql`

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

## Project Structure

```
app/
  page.tsx                  # Landing page
  schools/
    page.tsx                # School listing + filters
    [slug]/page.tsx         # School profile
  compare/page.tsx          # Side-by-side comparison
  dashboard/
    page.tsx                # User dashboard
    saved/page.tsx          # Saved schools
  login/page.tsx
  register/page.tsx
  api/v1/
    schools/route.ts        # GET schools with filters
    schools/[slug]/route.ts # GET school detail
    compare/route.ts        # POST compare
    search/route.ts         # GET search suggestions

components/
  layout/Header.tsx
  layout/Footer.tsx
  schools/
    FilterPanel.tsx         # Full filter panel + mobile sheet
    SchoolCard.tsx          # Grid & list view card
    CompareTray.tsx         # Sticky bottom compare bar
    ActiveFilters.tsx       # Active filter chips
    SortBar.tsx             # Sort + view toggle
    EnquiryForm.tsx         # Enquiry modal
    SchoolActionsSidebar.tsx

lib/
  supabase/client.ts        # Browser Supabase client
  supabase/server.ts        # Server Supabase client
  types/index.ts            # Shared TypeScript types
  types/database.ts         # Supabase DB types
  utils.ts                  # Formatting utilities

store/
  filterStore.ts            # Zustand filter state
  compareStore.ts           # Zustand compare state (persisted)

supabase/
  migrations/001_initial.sql
  seed.sql
```

## Filter System

The filter panel supports:
- **Location** — multi-select Bengaluru areas with search
- **Curriculum** — CBSE / ICSE / IB / IGCSE / State Board / Cambridge
- **School Type** — Private / Government / Aided / International
- **Gender** — Co-ed / Boys / Girls
- **Grades** — Nursery through Grade 12
- **Annual Fees** — range slider with quick presets (₹1L / ₹2L / ₹5L)
- **Admissions** — open now toggle / mid-year toggle
- **Transport** — boolean toggle
- **Sports** — searchable multi-select (15 options)
- **Extracurriculars** — searchable multi-select (15 options)
- **Languages** — searchable multi-select
- Active filter chips with individual remove
- "Clear all" one-click reset
- Mobile: bottom sheet with handle

## Supabase Auth

- Email/password sign-up with email confirmation
- Google OAuth
- Row Level Security (RLS) on all tables
- Auto-creates `users` row on sign-up via DB trigger

## Roadmap

- [ ] Phase 2: Reviews, comparison PDF export, quiz matching
- [ ] Phase 3: Q&A, application tracker, email alerts
- [ ] Phase 4: LLM natural language search, React Native app
