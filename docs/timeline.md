# Project Timeline
(/docs/timeline.md)
**Project:** Crafting Our Legacy: Living Archive
**Team:** Solo development (first 4 months), community engagement (months 5-10)
**Launch Target:** Beginning of Month 5
**Community Size:** 5-20 participants initially

## Current Phase: Month 1 - Foundation & Setup
A

---

## Phase 1: Foundation & Setup (Month 1) FEB

**Goal:** Get the basic infrastructure working, understand technical constraints.

### Week 1-2: Environment Setup & Learning
- [X] GitHub repo structure + docs setup (decisions.md, specs.md, architecture.md)
- [X] Next.js + TypeScript
- [ ] Firebase project setup (Firestore, Storage, security rules)
- [ ] Vercel deployment configured

### Week 3-4: Prototype Core Flows
- [ ] **Story Viewing:** Basic page that loads a story from Firestore, displays narrative + text
- [ ] **CodeMirror Integration:** Get editor rendering, can write and submit code (no execution yet)
- [ ] **MediaPipe Test:** Browser camera access, skeleton detection working (no 3D yet)
- [ ] Data model roughed out (Firestore collections, basic security rules)

**Deliverable:** Rough prototype where you can view a hardcoded story, write code, capture skeleton data locally.

**Risk to Watch:** MediaPipe setup or browser permissions—test early.

---

## Phase 2: Core Features (Months 2-3) MAR-APR

**Goal:** Build MVP-ready features. Focus on stability, not polish.

### Month 2: 3D Rendering + Real-time Updates MAR

**Week 1-2: 3D Setup**
- [ ] React Three Fiber + Three.js scaffold
- [ ] Basic 3D scene (lighting, camera)
- [ ] Simple avatar model (can be placeholder)
- [ ] Skeleton data → 3D animation (MediaPipe poses applied to avatar)

**Week 3-4: Real-time Firestore**
- [ ] Firestore real-time listeners for story + contributions
- [ ] Contributions appear in feed in real-time
- [ ] Code contributions saved to Firestore

**Deliverable:** Users can view a story, see live contributions from others, and watch mocap skeleton animate in 3D.

**Risk to Watch:** 3D animation performance on lower-end devices. Test early.

### Month 3: Mocap + Polish APR

**Week 1-2: Full Mocap Pipeline**
- [ ] MediaPipe live capture → local recording → Firebase Storage upload
- [ ] Mocap visualization in story (skeleton animates when viewing contributions)

**Week 3: Countdown + Ephemerality**
- [ ] Story countdown timer (visual, updates in real-time)
- [ ] Auto-cleanup logic (Firestore TTL or Cloud Functions to delete expired stories)
- [ ] Reflection/export feature (user can screenshot or download story before it expires)
- [ ] UX messaging around impermanence
- [ ] Idea that if there aren't any stories it pulls from depricated data of other stories?

**Week 4: Testing + Bug Fixes**
- [ ] Test across browsers (Chrome, Firefox, Safari, mobile)
- [ ] Test mocap on different devices/lighting conditions
- [ ] Test Firestore limits (write conflicts, rate limits)
- [ ] Performance profiling (3D rendering, file uploads)

**Deliverable:** Full MVP ready for small group testing. All core features working.

**Risk to Watch:** DeepMotion API latency, video file sizes, Firestore costs at scale. Have mitigation ready (e.g., file size limits, API rate limiting).

---

## Phase 3: Pre-Launch Testing (Month 4, Weeks 1-2) MAY

**Goal:** Find and fix critical bugs before launch. Invite small group to test.

### Week 1: Beta Testing Setup
- [ ] Invite 3-5 trusted people to test (friends, mentors, educators)
- [ ] Create feedback form (Google Form or simple Notion form)
- [ ] Document known issues and limitations
- [ ] Monitoring setup (error logging, performance tracking)

### Week 2: Bug Fixes + Polish
- [ ] Fix critical bugs from beta feedback
- [ ] Improve UX based on feedback (confusing flows, unclear buttons, etc.)
- [ ] Performance optimization (if any bottlenecks identified)
- [ ] Security review (code injection, file upload safety, etc.)

**Deliverable:** Launch-ready MVP. Minimal known bugs, core features stable.

---

## Phase 4: Launch + First Story (Month 4, Weeks 3-4) MAY

**Goal:** Public launch and first community story event.

### Week 3: Soft Launch
- [ ] Deploy to production on Vercel
- [ ] Create landing page (what is this? how do you participate?)
- [ ] Documentation for first users (onboarding, how to code, how to use mocap)
- [ ] Share with initial 5-20 community members (via email, social, etc.)

### Week 4: First Live Story
- [ ] Create and launch first ephemeral story
- [ ] Facilitate participation (answer questions, guide users, encourage contributions)
- [ ] Gather feedback and reflections
- [ ] Document what went well, what broke, what surprised you

**Deliverable:** First story completed, community engaged, learnings captured.

---

## Phase 5: Community Stories & Iteration (Months 5-6) JUN-JUL

**Goal:** Run 2-4 more stories, gather feedback, iterate.

### Month 5: Stories + Feedback Loop JUN

**Week 1-2: Plan + Facilitate Story 2**
- [ ] Design second story (different theme, maybe different difficulty level)
- [ ] Gather participants
- [ ] Run story with light facilitation
- [ ] Collect feedback (surveys, one-on-ones, reflections)

**Week 3-4: Iterate on Feedback**
- [ ] Fix bugs reported by participants
- [ ] Improve UX based on feedback (e.g., "mocap upload was confusing")
- [ ] Add features based on requests (if small/quick)
- [ ] Document lessons learned

### Month 6: Stories + Community Building JUL

**Week 1-2: Story 3**
- [ ] Run another story
- [ ] Possibly with a guest facilitator or educator
- [ ] Gather reflections

**Week 3-4: Reflect + Plan**
- [ ] Analyze data: Who participated? How many code contributions? Mocap usage?
- [ ] What worked? What didn't?
- [ ] Plan next phase (workshops? different story types? educator partnerships?)

**Deliverable:** 4 total stories run, community feedback collected, roadmap for next phase.

---

## Phase 6: Deepen Engagement (Months 7-8) AUG-SEP

**Goal:** Move beyond individual stories to sustained activities and learning.

### Month 7: Workshops or Guided Sessions AUG

**Option A: Coding Workshops**
- [ ] Host 2-3 workshops (online or in-person) on coding concepts used in stories
- [ ] Participants code together, then create story contributions
- [ ] Build community relationships

**Option B: Educator Partnerships**
- [ ] Reach out to 1-2 educators/teachers
- [ ] Co-design a story for their classroom/group
- [ ] Run story with their students
- [ ] Gather feedback for future education features

**Option C: Artist Collaborations**
- [ ] Partner with an artist or animator
- [ ] Co-create a visually rich story using mocap
- [ ] Showcase the collaboration

**Do all three if energy allows, or focus on one.** The point is deepening connections and exploring different use cases.

### Month 8: Iterate + Build Community Norms SEP

**Week 1-2: Run another story** (maybe larger group, different theme)

**Week 3-4:**
- [ ] Gather community feedback on direction
- [ ] Plan for continuation (is this monthly? seasonal? structured differently?)
- [ ] Make decision on sustainability (do you need funding? volunteers? institutional support?)

**Deliverable:** Stories have audiences, relationships forming, community culture developing.

---

## Phase 7: Reflection & Evolution (Months 9-10) OCT-NOV

**Goal:** Reflect on what's working, plan for long-term sustainability.

### Month 9: Deepen or Pivot OCT

**Week 1-2: Reflect**
- [ ] Review all stories, feedback, data
- [ ] One-on-ones with key community members (What did they love? What was hard?)
- [ ] Review your own experience (What energized you? What drained you?)
- [ ] Revisit your original mission: Are you achieving it?

**Week 3-4: Plan Next Phase**
Based on reflection, choose:
- **Option 1: Scale** — Add more stories, bigger communities, more participants
- **Option 2: Deepen** — Fewer stories but more intentional, build deeper relationships
- **Option 3: Evolve** — Different story types, new features, different participant types (e.g., educators, artists)
- **Option 4: Maintain** — Keep it sustainable at current level (1-2 stories per month, small group)

### Month 10: Execute + Document NOV

**Week 1-2: Run final story(ies) for this cycle**

**Week 3-4: Document + Plan**
- [ ] Write up lessons learned (for yourself, for future collaborators)
- [ ] Document community stories/impacts (testimonials, reflections, data)
- [ ] Update project roadmap for next cycle
- [ ] Plan for months 11+ (budget? team? new features?)

**Deliverable:** Clear understanding of what's working, documented impact, roadmap for future.

---

## Risks & Mitigations

### Technical Risks

|                   Risk               | Likelihood | Impact |                   Mitigation                   |
|--------------------------------------|------------|--------|------------------------------------------------|
| MediaPipe unreliable on some devices | Medium     | High   | Test early, have fallback (upload-only mode)   |
| DeepMotion API expensive/slow        | Medium     | Medium | Set rate limits, cap uploads, test costs early |
| 3D rendering performance issues      | Medium     | High   | Profile early, simplify models, optimize bundle| 
|                                      |            |        |size                                            |
| Firestore costs spiral               | Low        | High   | Monitor usage, set quotas, optimize queries    |
| Browser compatibility issues         | Medium     | Medium | Test on multiple browsers week 1               |

### Other Risks

|              Risk              | Likelihood | Impact |                   Mitigation                   |
|--------------------------------|------------|--------|------------------------------------------------|
| Low participation              | Medium     | High   | Plan ahead, give people a , personally invite  |
|                                |            |        | people, make it easy to join                   |
| Burnout (running stories solo) | Medium     | High   | Set sustainable cadence, recruit volunteer     |
|                                |            |        | facilitators by month 5-6                      |

### Mitigation Strategy
- **Month 1-2:** Test technical unknowns (MediaPipe, DeepMotion, 3D performance)
- **Month 3** Start getting feedback early in the process
- **Month 4:** Get feedback from beta testers before launch
- **Month 5-6:** Observe what resonates with community, adjust
- **Month 7-8:** Deepen engagement to build sustainable community
- **Month 9-10:** Reflect and make conscious choices about next phase

---

## Milestones & Success Criteria

### End of Month 4 (MVP Launch)
- **Success:** MVP deployed, first story run, 5-20 people participated, core features stable
- **Metrics:** 0 critical bugs, < 5 second story load time, > 50% of participants submit at least one contribution

### End of Month 6 (Community Feedback Loop)
- **Success:** 4 stories run, feedback collected, community engaged
- **Metrics:** 2+ repeat participants, > 20 contributions across all stories, clear themes in feedback

### End of Month 8 (Deepened Engagement)
- **Success:** Partnerships formed, community norms developing, clear value prop
- **Metrics:** 1+ educator/artist partnership, > 10 regular participants, testimonials from users

### End of Month 10 (Reflection & Future Planning)
- **Success:** Clear understanding of impact, roadmap for next phase, sustainability plan
- **Metrics:** Documented learnings, roadmap document, clarity on long-term vision

---

## Monthly Cadence

### Development Phase (Months 1-4)
- **Focus:** Building features, testing, launching
- **Meeting cadence:** Weekly check-ins with advisor (if available)
- **Decision points:** End of each month, adjust scope if needed

### Community Phase (Months 5-10)
- **Focus:** Running stories, gathering feedback, deepening engagement
- **Story cadence:** 1 major story per month (Mon-Wed), plus 1-2 smaller activities
- **Reflection:** Weekly notes, monthly community feedback, monthly personal reflection
- **Decision points:** End of each month, adjust next story based on feedback

---

## Notes for Solo Development

**Sustainability Tips:**
- Document as you go (reduces cognitive load, helps collaborators)
- Celebrate wins, reflect on learnings regularly

**Community Facilitation Tips:**
- Start small (5-10 people is easier to manage than 50)
- Clear communication upfront (what is this? what will happen? what's expected?)
- Make first story memorable (good theme, clear instructions, celebrate participation)
- Gather feedback early and often (don't wait for month 6)
- Think co-create