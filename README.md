# Med-Net Digital Health Collaborative — Official Website

The official website and content platform of **Med-Net Digital Health Collaborative**, an emerging
civil society organization based in Ethiopia that connects people, knowledge, technology and
innovation to advance healthcare.

A complete, database-backed platform: a polished public website **and** a full administrative
dashboard that lets the Med-Net team manage all content without touching code.

---

## Technology Stack

| Layer      | Choice                                               |
| ---------- | ---------------------------------------------------- |
| Framework  | Next.js 15 (App Router, React 19, TypeScript)        |
| Styling    | Tailwind CSS v4 + custom design tokens               |
| Database   | PostgreSQL via Prisma ORM                            |
| Auth       | Custom JWT sessions (jose) + bcrypt password hashing |
| Validation | Zod                                                  |
| Content    | Markdown rendering (react-markdown + GFM)            |
| Icons      | lucide-react                                         |
| Deployment | Vercel ($0-cost friendly — see deployment section)   |

No paid services and no credit cards are required.

---

## Quick Start (Local Development)

1. **Create `.env`** — copy `.env.example` and fill in the values:
   - `DATABASE_URL` — a PostgreSQL connection string. The easiest free option is
     [Neon](https://neon.tech) (free tier, no credit card): create a project and copy the
     connection string. You can also use any local PostgreSQL instance.
   - `AUTH_SECRET` — generate with `openssl rand -hex 32`.
   - `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` for development.
   - `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD` — the initial administrator account.
     **Choose a strong, unique password (12+ characters).** These values are only read by the
     seed script and are never committed to git. Credentials are not published anywhere in this
     repository — whoever sets up the environment chooses them.

2. **Install and initialize:**
   ```bash
   npm install
   npm run setup     # prisma generate + create tables + seed sample content + create admin
   npm run dev       # http://localhost:3000
   ```

3. **Sign in** at `/admin/login` with the email and password you placed in `.env`.

> Forgot the admin password? Set a new `ADMIN_PASSWORD` in `.env`, delete the user row (or the
> whole database), and re-run `npm run db:seed`. Passwords are bcrypt-hashed and cannot be
> recovered.

### Scripts

| Command             | Purpose                                         |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Start the development server                    |
| `npm run build`     | Prisma generate + production build              |
| `npm start`         | Run the production build                        |
| `npm run setup`     | Generate client, push schema, seed content      |
| `npm run db:push`   | Sync schema changes to the database             |
| `npm run db:seed`   | Seed sample content + admin user (idempotent)   |
| `npm run typecheck` | TypeScript check only                           |

---

## Environment Variables

| Variable               | Required | Description                                                          |
| ---------------------- | -------- | -------------------------------------------------------------------- |
| `DATABASE_URL`         | yes      | PostgreSQL connection string (Neon free tier or any Postgres)        |
| `AUTH_SECRET`          | yes      | Long random string signing admin sessions (`openssl rand -hex 32`)   |
| `NEXT_PUBLIC_SITE_URL` | yes      | Public site URL, used for SEO/sitemap/Open Graph                     |
| `ADMIN_EMAIL`          | seed     | Initial administrator email                                          |
| `ADMIN_NAME`           | seed     | Initial administrator name                                           |
| `ADMIN_PASSWORD`       | seed     | Initial administrator password (min 12 chars, chosen by you)         |

`.env` is git-ignored and must never be committed. `.env.example` documents safe placeholders.

---

## Deployment (Vercel)

The stack is fully compatible with Vercel's serverless architecture because **all persistent
state lives in PostgreSQL, not on the server filesystem** — including uploaded media, which is
stored in the database and served through an API route.

1. **Create a production database** — [Neon](https://neon.tech) free tier works well (no credit
   card). Copy the pooled connection string.
2. **Initialize it once**, from your machine:
   ```bash
   # with DATABASE_URL pointing at the production database
   npx prisma db push
   npx tsx prisma/seed.ts
   ```
3. **Deploy to Vercel** (import the Git repository) and set the environment variables:
   - `DATABASE_URL` — production Postgres connection string (use the *pooled* URL on Neon)
   - `AUTH_SECRET` — a **new** random secret for production (do not reuse your dev secret)
   - `NEXT_PUBLIC_SITE_URL` — e.g. `https://your-domain.vercel.app`
   - `ADMIN_EMAIL` / `ADMIN_NAME` / `ADMIN_PASSWORD` — only needed if seeding from Vercel-side
     tooling; normally not set in production.
4. Build command and framework are auto-detected (`npm run build` runs `prisma generate` first).

**Free-tier notes:** Neon's free tier includes ample storage for a growing organization's text
content and images (media is stored as database bytes). If media volume ever approaches tier
limits, external object storage can be added behind the existing media abstraction without
changing the content model.

---

## Content Management (Admin Dashboard)

Everything on the public website is managed from `/admin`:

| Area              | What you manage                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Dashboard**     | Content stats, foundation checklist, recent activity                                                                |
| **Projects**      | Create/edit/publish/feature projects — cover images, problem/approach/impact, tech stack, team, links               |
| **Research**      | Research initiatives and evidence work with status and authors                                                      |
| **Learning Hub**  | Articles, guides, tutorials and courses (Markdown)                                                                  |
| **Events & News** | Events (dates, location, registration), news, insights, announcements — including scheduled publishing               |
| **Opportunities** | Volunteer roles, ambassador calls, applications                                                                     |
| **Partners**      | Official partners only — the public section shows a placeholder until real partners are added                       |
| **Applications**  | Review membership applications, track status, add private notes                                                     |
| **Messages**      | Contact form inbox with status workflow                                                                             |
| **Media Library** | Upload images (stored in the database), add alt text, reuse across content                                          |
| **Homepage**      | Hero text/CTAs, section visibility, titles, descriptions                                                            |
| **Site Settings** | Organization identity, contact info, social links, footer                                                           |
| **Appearance**    | Default color mode (light/dark/system) and accent color                                                             |
| **Admin Users**   | Manage administrator accounts and roles                                                                             |
| **Activity Log**  | Audit trail of administrative actions                                                                               |

Publishing model: every content type supports **draft → published**, homepage featuring, and
deletion. Changes appear on the public site immediately.

---

## Project Structure

```
prisma/                  Schema (PostgreSQL), seed data
scripts/                 Integration test scripts (database, form actions)
public/brand/            Official Med-Net logo assets (light + dark)
src/
  app/
    (public)/            Public website routes (home, about, projects, research,
                         learn, updates, community, join, contact)
    admin/
      login/             Admin sign-in (public)
      (panel)/           Protected dashboard routes
    api/                 Media serving + authenticated upload/list endpoints
    layout.tsx           Root layout: fonts, theme system, SEO
    error.tsx            Graceful production error boundary
    sitemap.ts           Dynamic sitemap
    robots.ts            Robots configuration
  components/
    ui/                  Shared design primitives (buttons, fields, cards, …)
    public/              Public site components (navbar, hero, cards, forms…)
    admin/               Dashboard components (shell, tables, forms, media picker)
  lib/
    db.ts                Prisma client singleton
    auth.ts              Sessions, password hashing, server-side route guards
    settings.ts          Typed, database-backed site configuration
    rate-limit.ts        Submission rate limiting for public forms
    constants.ts         Navigation, categories, form options
    validators.ts        Zod schemas
    actions/             Server actions (CRUD, settings, submissions, auth)
  middleware.ts          Route protection for /admin
```

---

## Design System

- **Brand anchors** come from the official logo: deep navy + teal.
- Full **light and dark themes**, both intentionally designed; visitor preference is persisted,
  with a configurable default in the dashboard.
- **Accent presets** (teal, ocean, forest, violet) are switchable from the admin Appearance page.
- Typography: **Sora** (display) + **Inter** (body).
- The official logos are used as supplied — light variant in light mode, dark variant in dark
  mode — blended per theme without altering the artwork.

---

## About the Sample Content

The database seed creates **clearly marked demonstration content** (sample projects, research
protocols, learning resources, an event and news items) so the website looks complete from the
first run. Every sample entry states that it is a demonstration. **No achievements, partners,
statistics, publications or endorsements are fabricated.** Replace the samples through the admin
dashboard as real content develops — the partner section deliberately shows an elegant
placeholder state until official partnerships exist.

---

## Security Notes

- `/admin` routes are protected at the middleware layer **and** re-verified server-side on every
  dashboard render and every mutation; disabled admin accounts are locked out immediately.
- All admin server actions independently enforce authentication — API endpoints cannot be called
  directly to mutate content.
- Passwords are bcrypt-hashed; the seed refuses weak passwords and never ships a default one.
- Sessions are signed JWTs in httpOnly cookies; `AUTH_SECRET` must be unique per environment.
- Public forms are rate-limited and protected by a honeypot field; all input is validated
  server-side with Zod and stored via parameterized queries.
- Uploads are restricted by type and size (8 MB, image/PDF types).
- Membership applications and contact submissions are stored privately and never exposed via
  public APIs.
- Secrets live only in environment variables and are excluded from git by `.gitignore`.

---

## Extending the Platform

The architecture is built to grow with Med-Net:

- **New content types** — add a Prisma model, a zod schema, a server-action module, an entity
  config, and admin list/form pages (follow the Projects pattern end-to-end).
- **New public sections** — the homepage reads section config from the database; new sections
  can be added behind the same settings pattern.
- **Future features** — membership accounts, event registration, newsletters and multilingual
  content can be layered onto the existing schema and auth system without a rebuild.

---

**Med-Net Digital Health Collaborative** — *Born in Ethiopia, connected to the world, focused on
healthcare.*
