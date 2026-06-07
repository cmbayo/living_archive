# Crafting Our Legacy: A Living Archive

An interactive community archive inspired by the fractal urban design of medieval Benin City. Students and collaborators contribute stories, audio, photos, and 3D scans of physical structures — then explore them on a hex-based world map with in-browser 3D playback.

**Status:** Active development — core flows work; auth and polish in progress.

**Live demo:** _Add your Vercel URL here_

---

## Why this project exists

Traditional archives preserve artifacts. This one preserves **process** — how a community imagines, builds, and retells its own history. Each "lot" holds layered stories, events, and media tied to characters who inhabit the space. The hex grid mirrors the fractal, repeating patterns of Benin City's layout: neighborhoods expand organically, and the city can be reshaped as new contributions arrive.

Built for community workshops (Brooklyn, NYSCA-funded programming) and designed to scale from 5–20 initial participants to a growing public archive.

My first Next.js project — shipped in ~4 weeks while learning the App Router, Prisma, Supabase, and React Three Fiber in parallel.

---

## Features

- **World map** — SVG hex grid of neighborhoods and lots, click-through navigation
- **Lot pages** — 3D structure viewer (`.glb`), mocap character playback (`.fbx`/`.bvh`), audio stories, photo grids, event timelines
- **Community submission** — modals to add characters, events, and layered stories
- **Rich media pipeline** — upload audio, photos, 3D models, and mocap files to Supabase Storage; metadata in PostgreSQL via Prisma
- **Relational data model** — characters with age stages and relationships, many-to-many story ↔ event links, polymorphic media attachments

---

## Tech stack

| Layer | Tool |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| 3D | React Three Fiber, Three.js, `@react-three/drei` |
| API | Next.js Route Handlers (hand-written REST) |
| ORM | Prisma 7 with `@prisma/adapter-pg` |
| Database | PostgreSQL (Supabase) |
| File storage | Supabase Storage (`archive-media` bucket) |
| Hosting | Vercel |

---

## Architecture

```
Browser (React + R3F)
        ↓
Next.js API Routes  (/api/lots, /characters, /events, /stories, /media, …)
        ↓
Prisma ORM
        ↓
Supabase PostgreSQL          Supabase Storage
(relational metadata)        (.glb, .bvh, .mp3, .jpg)
```

**Key design decisions:**

- **PostgreSQL over Firestore** — the domain has clear relationships (neighborhoods → lots → events → stories); a relational schema maps naturally
- **Polymorphic media attachments** — one `MediaAttachment` table links files to lots, neighborhoods, stories, or characters via `mediaOwner` + `ownerId`
- **Hand-written API routes** — Supabase auto-REST is disabled; all business logic lives in Next.js handlers
- **Direct browser uploads** — files go to Supabase Storage; only URLs are stored in the database

See [`docs/architecture.md`](docs/architecture.md) and [`docs/study_sheet.md`](docs/study_sheet.md) for deeper technical notes.

---

## Data model (summary)

```
Neighborhood → Lot → Event → Story (many-to-many via StoryEvent)
Character → Relationship (self-referential)
Media → MediaAttachment (polymorphic: Lot | Neighborhood | Story | Character)
```

Full schema: [`prisma/schema.prisma`](prisma/schema.prisma)

---

## Getting started

### Prerequisites

- Node.js 20+
- A Supabase project with PostgreSQL and a Storage bucket named `archive-media`
- Environment variables (create `.env` in the project root):

```bash
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### Install and run

```bash
npm install
npx prisma generate
npx prisma db push          # sync schema to your database (dev)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

---

## Project structure

```
living_archive/
├── app/
│   ├── api/              # REST route handlers
│   ├── lots/[id]/        # Lot detail page (3D + media)
│   ├── neighborhoods/[id]/ # Neighborhood hex grid
│   └── page.tsx          # World map
├── components/
│   ├── archive/          # Hex grid, modals, audio, events
│   └── three/            # React Three Fiber scenes
├── lib/                  # Prisma, Supabase, media helpers
├── prisma/schema.prisma
├── docs/                 # Architecture, decisions, study notes
└── __tests__/            # Vitest unit tests
```

---

## Testing

Two layers:

**Unit tests (Vitest)** — fast, mocked, no server required:

```bash
npm test              # run once
npm run test:watch    # watch mode
```

**Integration smoke test** — hits a running server with real DB + storage:

```bash
# terminal 1
npm run dev

# terminal 2
MODEL_FILE=/path/to/your/model.glb npm run test:integration
```
TODO: add `BASE_URL`

Optional env vars: `BASE_URL` (defaults to `http://localhost:3000`).

See [`__tests__/`](__tests__/) and [`docs/test.sh`](docs/test.sh).

---

## Roadmap

- [ ] Auth and row-level write permissions
- [ ] Relationship graph visualization for characters
- [ ] Real-time story updates (originally planned with Firestore)
- [ ] Age-stage progression UI
- [x] Unit test coverage for API routes and core utilities

---

## License

Private / grant-funded community project. Update this section if you open-source it.
