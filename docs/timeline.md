# Project Timeline
(/docs/timeline.md)
**Project:** Crafting Our Legacy: Living Archive
**Team:** Solo development (first 4 months), community engagement (months 5-10)
**Launch Target:** Beginning of Month 5
**Community Size:** 5-20 participants initially


## Week 1 — Foundation

[ ] Set up Next.js project, Supabase, Prisma
[ ] Write the database schema (Character, Relationship, Event, Location, AgeStage)
[ ] Connect Prisma to Supabase PostgreSQL
[ ] Basic file upload working (test with one audio file and one .glb)

## Week 2 — API

[ ] Write all API routes (locations, characters, events, stories, relationships)
[ ] Custom logic (location requires physical structure, story layering not overwriting)
[ ] Test every endpoint
[ ] File upload endpoints for audio, .glb, .bvh mocap files

## Week 3 — Frontend core

[ ] Location browser (map or grid view)
[ ] 3D model viewer with React Three Fiber
[ ] Audio playback attached to locations/characters
[ ] Basic story display — layered, not linear

## Week 4 — User submission + polish

[ ] Form for users to submit structures (photo/.glb + story + audio)
[ ] AgeStage and relationship display
[ ] Atmospheric styling (your aesthetic from Tenderness in the Chaos)
[ ] Deploy to Vercel, share link at Brooklyn event
