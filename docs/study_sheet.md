# Living Archive — Study Sheet

## Stack
| Layer | Tool | Why |
|---|---|---|
| Frontend | Next.js + React Three Fiber | App framework + 3D rendering |
| API | Next.js API routes | Hand-written, full control over logic |
| ORM | Prisma | Type-safe DB queries, schema management |
| Database | PostgreSQL (via Supabase) | Relational data, clear relationships |
| File Storage | Supabase Storage | Audio, .glb, .bvh, photos |
| 3D Display | Three.js | Renders .glb models |
| 3D Scanning | Polycam | Exports .glb files |
| Hosting | Vercel + Supabase | Frontend + DB/storage |

---

## Database Concepts

### Relational vs NoSQL
SQL (PostgreSQL) stores data in tables with defined relationships. Good when your
data has clear structure — characters have relationships, events happen at lots,
stories reference events. Firestore (NoSQL) is more flexible but your schema was
already well-defined from the C++ sketches, so SQL made more sense.

### Foreign Keys
A column that points to the `id` of another table.
```prisma
model Lot {
  neighborhoodId Int?
  neighborhood   Neighborhood? @relation(fields: [neighborhoodId], references: [id])
}
```
`neighborhoodId` is the real database column. `neighborhood` is a Prisma relation
field — not a real column, just lets you navigate in code: `lot.neighborhood`.

### One-to-Many
One neighborhood has many lots. One event has many stories.
```
Neighborhood → Lot → Event → Story
```
The "many" side holds the foreign key.

### Many-to-Many
A story references many events. An event appears in many stories.
Requires a junction table:
```prisma
model StoryEvent {
  storyId Int
  eventId Int
  story   Story @relation(fields: [storyId], references: [id])
  event   Event @relation(fields: [eventId], references: [id])

  @@id([storyId, eventId])
}
```
`@@id([storyId, eventId])` is a composite primary key — the combination of both
columns must be unique, preventing duplicate links.

### Junction Table
A table that only exists to link two other tables in a many-to-many relationship.
Holds pairs of IDs. No junction table = one side "owns" the other (one-to-many).

### Polymorphic Relationship
One table that can belong to multiple different parent types.
Instead of separate `locationId`, `neighborhoodId`, `storyId` columns (lots of nulls),
use `mediaOwner` + `ownerId`:
```prisma
model MediaAttachment {
  mediaId    Int
  mediaOwner MediaOwner  // Location, Neighborhood, or Story
  ownerId    Int         // id of whichever parent owns it

  @@unique([mediaId, mediaOwner, ownerId])
}
```
Tradeoff: Prisma can't enforce foreign key constraints on `ownerId` since it points
to three different tables. You handle that validation in your API routes.

### Null columns vs Junction tables
Optional columns (`String?`) store `null` when empty — cheap in PostgreSQL.
But if a file could belong to multiple parents, or most rows would be null,
a junction table is cleaner. Rule of thumb:
- One parent, always set → column on the model
- One parent, often empty → optional column (`?`)
- Multiple possible parents → junction table

### Enums
Fixed set of allowed values. Enforced at the database level.
```prisma
enum AgeStage {
  Infant
  Toddler
  Child
  Teen
  Adult
  Elder
}

enum MediaType {
  Audio
  Photo
  Structure3D
  Mocap
}

enum MediaOwner {
  Location
  Neighborhood
  Story
}
```

### `@updatedAt`
Prisma automatically updates this field whenever the row changes.
Used on `Relationship` to track how relationships evolve over time.
```prisma
updatedAt DateTime @updatedAt
```

---

## Prisma Concepts

### ORM (Object Relational Mapper)
Translates between your code and SQL. Instead of:
```sql
INSERT INTO characters (name, backstory) VALUES ('Amara', 'Elder of...')
```
You write:
```ts
await prisma.character.create({
  data: { name: 'Amara', backstory: 'Elder of...' }
})
```

### ORM vs REST API
```
Frontend
  ↕  (REST API — HTTP requests between frontend and backend)
Backend (Next.js API routes)
  ↕  (ORM — translates code to SQL queries)
Database (PostgreSQL)
```
They operate at different layers. REST API is how your frontend talks to your
backend. ORM is how your backend talks to your database.

### `prisma db push`
Pushes your schema to the database without creating migration files.
Good for early development when the schema is still changing.

### `prisma generate`
Reads your schema and generates the TypeScript client in `app/generated/prisma/`.
Must be run after every schema change.

### Prisma Client (Prisma 7)
Prisma 7 requires a database adapter instead of a connection string directly.
```ts
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({ adapter });
```

### Global Prisma Pattern
Prevents Next.js from creating a new Prisma client on every hot reload in development.
```ts
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```
`??` is the nullish coalescing operator — returns the right side only if the left
is `null` or `undefined`. Reuses the existing client if it exists.

### Nested writes
Create related records in one Prisma operation:
```ts
await prisma.media.create({
  data: {
    url,
    type,
    attachments: {
      create: { mediaOwner, ownerId }
    }
  },
  include: { attachments: true }
})
```
`include` tells Prisma to return the related records in the response.

---

## Next.js API Routes

### Route handlers (App Router)
Lives at `app/api/[resource]/route.ts`. Named exports per HTTP method:
```ts
export async function GET(request: NextRequest) {
  return Response.json({ data: [] })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  return Response.json({ data: body }, { status: 201 })
}
```
Not the old Pages Router style (`req, res`).

### FormData vs JSON
Use `request.formData()` when the request includes files.
Use `request.json()` when it's just data.
```ts
const formData = await request.formData();
const file = formData.get("file") as File;
const type = formData.get("type") as string;
```

### HTTP status codes used
| Code | Meaning |
|---|---|
| 200 | OK (default GET) |
| 201 | Created (POST success) |
| 400 | Bad request (missing fields) |
| 500 | Server error |

---

## JavaScript / TypeScript Concepts

### Spread operator (`...`)
Spreads an object's properties into another object:
```ts
const a = { name: "Amara" }
const b = { ...a, age: 30 }
// b = { name: "Amara", age: 30 }
```

### Conditional spread with `&&`
`&&` evaluates left to right, returns the last truthy value or the first falsy one.
Used to conditionally add properties to an object:
```ts
...(mediaOwner && ownerId && { attachments: { create: { mediaOwner, ownerId } } })
```
- Both truthy → spreads `{ attachments: ... }` into the object
- Either falsy → spreads `false` → spreads nothing

Equivalent if/else version:
```ts
let data = { url, type };
if (mediaOwner && ownerId) {
  data.attachments = { create: { mediaOwner, ownerId } };
}
```

### `process.env`
`process` is a global Node.js object, always available, never imported.
`process.env` holds environment variables from your `.env` file.
`process.env.NODE_ENV` is set automatically by Next.js:
- `development` when running `npm run dev`
- `production` when deployed to Vercel

### Non-null assertion (`!`)
Tells TypeScript "trust me, this is not null":
```ts
process.env.DATABASE_URL!
```
Use when you know the value exists but TypeScript can't verify it.

### `crypto.randomUUID()`
Built into Node.js. Generates a unique ID like `a3f2c1d4-...`.
Used to give uploaded files unique names so nothing gets overwritten:
```ts
const fileName = `${crypto.randomUUID()}.${fileExt}`;
```

---

## Supabase

### What Supabase provides in this project
- PostgreSQL database (connected via Prisma)
- File storage (`archive-media` bucket)
- NOT using: auto-generated REST API, Auth (yet)

### Why Data API is off
You're writing your own API routes. Supabase's auto-generated API would
duplicate that work and bypass your custom business logic.

### Why RLS is on
Row Level Security locks tables by default. Nothing is publicly readable or
writable unless explicitly allowed. Important since users will be submitting
content to the archive.

### Upload flow
```
Browser → POST /api/media (FormData with file)
  → uploadFile() in app/api/utils.ts
    → supabase.storage.from("archive-media").upload()
      → returns public URL
  → prisma.media.create({ url, type })
    → optionally creates MediaAttachment
```

### Storage vs Database
Supabase Storage holds the actual files. The database holds the URL pointing to
the file. Never store files in the database itself.

---

## Project Structure

```
living_archive
├── .env                          ← environment variables, never commit
├── prisma.config.ts              ← Prisma config, datasource URL
├── prisma/
│   └── schema.prisma             ← all your models and enums
├── app/
│   ├── generated/prisma/         ← auto-generated by `prisma generate`
│   └── api/
│       ├── utils.ts              ← uploadFile() helper
│       └── media/
│           └── route.ts          ← POST /api/media
└── lib/
    ├── prisma.ts                 ← Prisma client singleton
    └── supabase.ts               ← Supabase client + uploadFile
```

---

## Schema (current)

```prisma
enum AgeStage   { Infant, Toddler, Child, Teen, Adult, Elder }
enum MediaType  { Audio, Photo, Structure3D, Mocap }
enum MediaOwner { Location, Neighborhood, Story }

Neighborhood  → has many Lot
Lot           → belongs to Neighborhood, has many Event
Character     → has many Event, has many Relationship
Event         → belongs to Lot, belongs to Character, linked to Story via StoryEvent
Story         → linked to Event via StoryEvent
StoryEvent    → junction table (Story ↔ Event)
Media         → has many MediaAttachment
MediaAttachment → polymorphic (owns Media for a Lot, Neighborhood, or Story)
Relationship  → links two Characters with type + strength (-100 to +100)
```
