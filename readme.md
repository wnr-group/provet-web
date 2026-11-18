# Provet — Veterinary Medicine Catalogue Website

A single Next.js (App Router) application: public catalogue site + admin
dashboard + REST API, all in one codebase and one deploy. This replaces an
earlier React (Vite) + Express two-app setup — see [`legacy-react-express/`](legacy-react-express/)
for the archived prior version (kept for reference, not part of this app).

Product catalogue with composition/uses/dosage/applications, category
browsing, search & filters, an enquiry-based contact flow (no shopping cart
— this is a B2B/B2B2C informational catalogue, not e-commerce), and a
secured admin dashboard for managing products, categories, banners, website
content, social media links and enquiries.

Brand colors and logo are sampled from the real Provet logo: navy `#393185`
and magenta `#E5097F`.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack), React 19
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Database**: Prisma ORM on **Postgres** (Supabase, via `@prisma/adapter-pg`)
- **Auth**: Supabase Auth (email + password) for admins only, with the
  session in httpOnly cookies via `@supabase/ssr`. `proxy.js` refreshes the
  session and redirects signed-out `/admin/*` visits (a UX convenience);
  `lib/requireAdmin.js` — called by every admin page and `/api/admin/*`
  route — is the actual security boundary. See "Admin authentication" below.
- **File uploads**: native `request.formData()`, saved to `public/uploads/`
  via `lib/storage.js` (swap this one file for S3/Cloudinary later)

## Admin authentication

Only administrators sign in; customers never do (the catalogue, enquiries and
the brochure need no account).

- **Who is an admin** is decided by the `AdminUser` table, not by Supabase:
  a Supabase user is an admin only while an active `AdminUser` row points at
  them (`authUserId`) with an allowed role. User metadata, the email address
  and any "role" claim are never trusted. No route writes to the table.
- **Creating an admin** is a server-side script, the only way to do it:
  `node scripts/create-admin.js --email you@provet.in --name "Full Name"`
  (asks for the password hidden; needs `SUPABASE_SERVICE_ROLE_KEY`). It also
  moves a pre-Supabase admin over and clears their old password hash.
- **Every admin request** is checked on the server (`lib/requireAdmin.js`):
  Supabase verifies the session, then the AdminUser row is checked. Cross-site
  POST/PUT/DELETE requests are refused in `proxy.js`.
- **Row Level Security** is on for every table, with no policies, and the
  `anon`/`authenticated` roles have no privileges: the REST API with the
  public key reads and writes nothing. The app connects as the database owner
  and is unaffected. A table added later needs `ENABLE ROW LEVEL SECURITY`
  in its migration.
- **Password reset**: `/admin/forgot-password` emails a link (admins only; the
  reply is the same for every address) that lands on `/auth/confirm`.

### Supabase dashboard settings this relies on

1. **Authentication > Sign In / Providers > Email**: turn **off** "Allow new
   users to sign up" (admins are created with the script). Keep email
   confirmation on.
2. **Authentication > URL Configuration**: Site URL = the production address;
   add `<SITE_URL>/auth/confirm` (and the local one) to Redirect URLs.
3. **Authentication > Email Templates > Reset Password**: link to
   `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery`
   (works when the email is opened on another device).
4. **Authentication > SMTP**: set up a real SMTP provider; the built-in mailer
   is limited to a few emails an hour.
5. **Authentication > Sessions** (and JWT expiry): access tokens last an hour
   and refresh on use; cookies are capped at 7 days. Where the plan allows,
   enable "time-box user sessions" and an inactivity timeout.
6. **Authentication > Rate Limits / Attack Protection**: keep the sign-in
   limits and enable CAPTCHA if the login page is attacked.

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
npm test                 # unit tests (node --test, no extra deps)
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

Social media links are seeded **empty and disabled** — Provet's real profile
URLs weren't available, and seeding invented ones would put dead links on
every public page. Add them under Admin → Social Media; until a platform has
a URL *and* is enabled, it simply doesn't render.

### Feedback form

Three models: `Feedback` (submissions), `FeedbackSetting` (a singleton config
row keyed `"default"`, holding enabled/title/description) and
`FeedbackField` — one row per field on the public form. The form lives at the
bottom of the **Contact** page, kept separate from the enquiry form above it
because an enquiry is a sales lead with a subject, a phone number and a triage
status, while feedback is an unsolicited comment with no workflow.

**The admin builds the form.** Add fields, reorder them, rename them, set
required, enable/disable, delete. Supported types: short text, long text,
email, phone, number, dropdown, single choice, multiple choice, rating (1–5).

`name`, `email` and `message` are **built-in** (`isSystem`): they write to
`Feedback`'s own columns rather than the JSON blob, so they can be relabelled,
reordered and — for name/email — hidden or made optional, but never deleted.
`message` is additionally locked: always shown, always required, since a
feedback form without it would collect nothing.

Answers to custom fields live in `Feedback.answers`, JSON-encoded like
`Product.specifications`. Each entry is `{ key, label, value }` rather than a
plain map: storing the label with the answer means a submission stays readable
after the admin renames or deletes the field that produced it. A field's `key`
is slugified from its label on creation and then frozen, because submitted
answers are keyed by it.

`POST /api/feedback` builds its validator from the **stored, enabled** field
definitions (`buildFeedbackSubmissionSchema` in `lib/feedbackSchema.js`), never
from the request. A crafted request therefore can't skip a required field,
post to a disabled form, store a disabled field, or pick a dropdown value
that isn't in the admin's option list. The form's own `required` attributes
are UX only.

Admin → Feedback has two tabs: **Submissions** (paginated 10/page like
Enquiries, expand for detail including custom answers, delete) and **Form
Settings** (config + the field builder).

Email notification on new feedback is intentionally not implemented.

### Social media links

One `SocialLink` row per platform, with the supported platform list fixed in
`lib/socialSchema.js` (the admin supplies the URL and the enabled flag, not
the platform set). Both the footer and the Contact page read the same config
through `getActiveSocialLinks()` in `lib/data.js` — there is deliberately no
second, Contact-only setting. Two rules are enforced server-side in
`lib/socialSchema.js`: a platform can't be enabled without a URL, and URLs
must be `http(s)` (these strings land in an `href` on every public page, so
allowing arbitrary schemes would make the footer a stored-XSS sink).

Brand glyphs live in `components/ui/SocialIcons.js` as inline SVGs because
lucide-react v1 dropped its brand icons — the footer already did this for
Facebook/Twitter/LinkedIn; that set just moved and grew by two.

The current site keeps the simpler nav (Home/Products/About/Contact) rather
than provet.in's full structure (About Us dropdown, Avinova/Blunova product
sub-brands, Resources/Media/Careers) — that was an explicit scope decision to
ship a rebrand + polish pass first; expanding to the full IA is a larger
follow-up (new backend models for news/careers/resources, etc.).
