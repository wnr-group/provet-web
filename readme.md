# Provet — Veterinary Medicine Catalogue Website

A single Next.js (App Router) application: public catalogue site + admin
dashboard + REST API, all in one codebase and one deploy. This replaces an
earlier React (Vite) + Express two-app setup — see [`legacy-react-express/`](legacy-react-express/)
for the archived prior version (kept for reference, not part of this app).

Product catalogue with composition/uses/dosage/applications, category
browsing, search & filters, an enquiry-based contact flow (no shopping cart
— this is a B2B/B2B2C informational catalogue, not e-commerce), and a
secured admin dashboard for managing products, categories, banners, website
content and enquiries.

Brand colors and logo are sampled from the real Provet logo: navy `#393185`
and magenta `#E5097F`.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack), React 19
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Database**: Prisma ORM on **SQLite** (via `@prisma/adapter-better-sqlite3`)
- **Auth**: JWT in an httpOnly cookie (`lib/auth.js`), verified both in
  `proxy.js` (redirects unauthenticated `/admin/*` page visits — a UX
  convenience) and inside every `/api/admin/*` route handler (the actual
  security boundary — see `lib/requireAdmin.js`)
- **File uploads**: native `request.formData()`, saved to `public/uploads/`
  via `lib/storage.js` (swap this one file for S3/Cloudinary later)

### Why SQLite instead of Supabase/Postgres locally

There's no local Supabase instance and no Docker available on this machine.
Moving to Postgres/Supabase later:

1. Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`
2. Swap the adapter in `lib/prisma.js` (e.g. `@prisma/adapter-pg`) and update `DATABASE_URL`
3. Run `npx prisma migrate dev` against it

### Prisma 7 note

Prisma 7 dropped the `url` field from `schema.prisma`'s `datasource` block —
connection info now lives in `prisma.config.js` (for the CLI) and is passed
directly to `PrismaClient` via a driver adapter (for the app, see
`lib/prisma.js`). This is a recent breaking change; don't reintroduce
`datasource.url` if upgrading further.

## Project structure

```
app/
  (public)/        Public site: home, products, product detail, about, contact
                   — Server Components with direct Prisma reads (no client
                   fetch/loading-spinner dance)
  admin/
    login/         Public login form
    (dashboard)/   Auth-gated admin dashboard (separate route group so the
                   login page itself isn't wrapped by the auth check)
  api/             Route Handlers: public read endpoints + /api/admin/* CRUD
  template.js      Entrance-only page transition (see note below)
components/        Shared UI, home sections, admin dashboard, motion helpers
lib/                Prisma client, auth, data access, validators, upload storage
prisma/             schema.prisma, migrations, seed.js
proxy.js            Redirects unauthenticated /admin/* visits to the login page
```

### Rendering notes

- `(public)/page.js` and `(public)/about/page.js` are forced to
  `export const dynamic = "force-dynamic"` — without it Next.js prerenders
  them once at build time (nothing in them reads `searchParams`/`cookies`/etc.
  to trigger dynamic rendering automatically), which would mean admin edits
  to banners/categories/content never show up without a full rebuild.
  `/products`, `/products/[slug]` and `/contact` don't need this: reading
  `searchParams`/`params` already opts them into dynamic rendering.
- `app/template.js` gives page navigations a smooth fade/slide-in. It's
  deliberately **entrance-only** (no exit animation via `AnimatePresence`) —
  an earlier version faded the outgoing page out, then flashed the incoming
  page's own loading spinner before its data arrived, then faded in: a
  visible flicker. Animating only the mount avoids that.

## Getting started

```bash
npm install
npx prisma migrate dev   # creates prisma/dev.db and applies the schema
npm run db:seed          # seeds categories/products/banners/content/admin user
npm run dev              # http://localhost:3000
```

Seed data includes ~6 categories, 19 sample products, banners, homepage/about
content sections, and one admin user:

- **Email**: `admin@provet.in`
- **Password**: `Admin@123`

Public site: http://localhost:3000
Admin dashboard: http://localhost:3000/admin/login

## Content notes

Product copy, category descriptions and "About Us" text in the seed data are
placeholders modeled on the original module requirements doc (generic vet
medicine categories), not Provet's real Avinova (poultry) / Blunova (aqua)
product lines or real "Who We Are" / "Core Values" copy — swap them via the
admin dashboard (Products / Categories / Website Content) once real content is
available. Seed images are generic stock placeholders from Picsum/Unsplash;
the logo (`public/logo-mark.png`, `logo-full.png`) and favicon are the real
assets pulled from provet.in. Contact details in the footer/Contact page
(address, phone, email) are Provet's real public listing.

The current site keeps the simpler nav (Home/Products/About/Contact) rather
than provet.in's full structure (About Us dropdown, Avinova/Blunova product
sub-brands, Resources/Media/Careers) — that was an explicit scope decision to
ship a rebrand + polish pass first; expanding to the full IA is a larger
follow-up (new backend models for news/careers/resources, etc.).
