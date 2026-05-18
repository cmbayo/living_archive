# Architecture & Technical Design

How the system is organized, the tech stack, data flow, and key patterns.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js App (Vercel)                        │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  React Components                         │  │
│  │  LocationBrowser, StoryView, ModelViewer, AudioPlayer,    │  │
│  │  CharacterCard, RelationshipGraph, SubmitStructure        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                             ↓                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │           3D Rendering Layer (R3F + Three.js)             │  │
│  │         .glb model viewer  ·  .bvh mocap playback         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                             ↓                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │            Next.js API Routes (hand-written)              │  │
│  │   /locations  /characters  /events  /stories              │  │
│  │   /relationships  /upload                                 │  │
│  └───────────────────────────────────────────────────────────┘  │
│                             ↓                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      Prisma ORM                           │  │
│  │          Schema · Migrations · Type-safe queries          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                             ↓                                   │
└─────────────────────────────────────────────────────────────────┘
               ↓                                   ↓
┌──────────────────────────┐        ┌─────────────────────────────┐
│   Supabase · PostgreSQL  │        │    Supabase · Storage       │
│                          │        │                             │
│  Location                │        │  .glb   (3D models)         │
│  Character               │        │  .bvh   (mocap)             │
│  Event                   │        │  .mp3   (audio stories)     │
│  Story                   │        │  .jpg   (photos)            │
│  Relationship            │        │                             │
│  AgeStage                │        │  ← uploaded directly        │
│                          │        │    from browser             │
└──────────────────────────┘        └─────────────────────────────┘
```
