# Architecture & Technical Design

How the system is organized, the tech stack, data flow, and key patterns.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Next.js App (Vercel)              │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │         React Components (Pages/UI)          │   │
│  │  - StoryView, CodeEditor, MocapCapture       │   │
│  └──────────────────────────────────────────────┘   │
│                      ↓                              │
│  ┌──────────────────────────────────────────────┐   │
│  │    3D Rendering Layer (R3F + Three.js)       │   │
│  │  - Mocap visualization, Story animation      │   │
│  └──────────────────────────────────────────────┘   │
│                      ↓                              │
│  ┌──────────────────────────────────────────────┐   │
│  │       Integration Layer (Hooks/Utils)        │   │
│  │  - Firebase, CodeMirror, Howler, MediaPipe   │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
           ↓            ↓            ↓
      Firebase      DeepMotion    External
      (Firestore    API           APIs
       + Storage)
```

---

[ ] find a function that writes the tree instead of you doing it manually 

/living_archive
├── /.next
├── /app
├── /docs
├── /node_modules
├── /public
└── [config files]
```

---

## Key Data Flows

### Flow 1: [Name]

---

### Flow 2: [Name]

---

## Technology Deep-Dives

### 1. [Technology Name]

**Why:**

**Key Patterns:**

**Example:**

---

### 2. [Technology Name]

**Why:**

**Key Patterns:**

**Example:**

---

## API Routes Overview

### GET `/api/[endpoint]`
- Purpose:
- Returns:

### POST `/api/[endpoint]`
- Purpose:
- Requires:
- Returns:

---

## Performance Optimization Strategy

---

## Security Considerations

---

## Deployment

---

## Future Considerations