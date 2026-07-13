# Wood Products CMS

Full-stack CMS + public website: Next.js (App Router) frontend, NestJS backend, PostgreSQL via Prisma. Built to match the Pixel38 Figma reference (colors, typography, logo, layout untouched).

## Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, React Query, Zustand, React Hook Form + Zod, Axios
- **Backend**: NestJS 11, Prisma ORM, PostgreSQL (Neon), Passport JWT + Refresh Tokens, Swagger, Multer
- **Auth**: Access token (15m, header) + Refresh token (7d, httpOnly cookie, rotated on every refresh)

## Monorepo layout
```
wood-products-cms/
├── apps/
│   ├── backend/     # NestJS API
│   └── frontend/    # Next.js app
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## 1. Setup

```bash
pnpm install
```

## 2. Environment variables

Copy the examples and fill in real values:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

**Backend (`apps/backend/.env`)**
| Var | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `PORT` | API port (default 3001) |
| `BACKEND_URL` | Public URL of the API (used to build uploaded-file URLs) |
| `FRONTEND_URL` | Frontend origin, for CORS |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Long random strings |
| `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | Token lifetimes |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Credentials created by the seed script |

**Frontend (`apps/frontend/.env`)**
| Var | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend, e.g. `http://localhost:3001` |

## 3. Database setup

Paste your Neon connection string into `apps/backend/.env` as `DATABASE_URL`, then:

```bash
cd apps/backend
pnpm prisma:migrate      # creates tables from prisma/schema.prisma
pnpm prisma:seed         # creates the admin user + starter content
```

Admin login after seeding: `admin@pixel38.com` / `Admin123!` (or whatever you set in `SEED_ADMIN_*`).

## 4. Run

```bash
# from repo root — runs both apps via Turborepo
pnpm dev
```
- Frontend: http://localhost:3000
- Backend: http://localhost:3001/api
- Swagger: http://localhost:3001/api/docs

## 5. Build

```bash
pnpm build
```

## 6. Architecture overview

**Backend** — modular NestJS app: `auth` (JWT + refresh, bcrypt hashing, rotation + revocation stored in `refresh_tokens`), `homepage` (singleton CMS row), `products` (CRUD + images + drag-drop reorder), `services`, `gallery`, `price-list`, `contact`, `upload` (disk storage, served at `/uploads`), all behind `JwtAuthGuard` except read-only public GET endpoints. Global `ValidationPipe` + `HttpExceptionFilter` for consistent error shapes. Swagger auto-generated from decorators at `/api/docs`.

**Frontend** — App Router pages fetch public content server-side (`fetch` with `revalidate`) for SEO; the `/admin` area is a client-rendered CMS behind a Zustand-backed auth guard, using Axios with an interceptor that auto-refreshes the access token via the httpOnly cookie on a 401.

**Database** — see `apps/backend/prisma/schema.prisma`. Key models: `User`, `RefreshToken`, `Homepage` (+ `Banner`), `Product` (+ `ProductImage`), `Service`, `GalleryImage`, `PriceListItem`, `ContactSubmission`.

## 7. Design tokens

The color palette and type scale in `apps/frontend/src/app/globals.css` are approximated from the palette screenshot you provided. **Replace the hex values with the exact ones from Figma's Inspect panel**, and drop the real "KyivType Sans" font files into `apps/frontend/public/fonts/` (wired up via `--font-title`) for a pixel-exact match — the custom font isn't on Google Fonts so it can't be fetched automatically. The logo at `apps/frontend/public/logo.svg` is a placeholder; swap in the exported asset from Figma.

## 8. AI tools used
Built with Claude (Anthropic) — architecture, backend modules, frontend pages, and CMS screens generated and reviewed interactively.

## 9. Time spent
_Fill in before submission._

## 10. What's included vs. what needs finishing before submission
✅ Prisma schema, migrations-ready, seed script
✅ Auth: login/refresh/logout, JWT + rotating refresh tokens, bcrypt, guards
✅ REST APIs for homepage, products (+images+reorder), services, gallery, price list, contact — all documented in Swagger
✅ Public pages: Home, Gallery, Prices, About, Contact, 404
✅ Admin CMS: login, protected dashboard, homepage editor, products/services/gallery/price-list CRUD

Still worth polishing before you submit:
- Swap in exact hex palette + real logo + KyivType Sans font files (see §7)
- Drag-and-drop reordering UI (`@dnd-kit` is installed; the reorder API endpoints already exist — wire up the sortable list in the products/gallery admin screens)
- Loading skeletons / error boundaries polish pass
- Deploy: frontend → Vercel, backend → Railway/Render, DB → Neon (add the deployed URL + these same admin credentials to your submission)
