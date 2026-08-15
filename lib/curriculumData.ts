export interface CurriculumModule {
  id: number;
  title: string;
  subtitle: string;
  locked: boolean;
  duration?: string;
  ageRange?: string;
  materials?: string[];
  objectives?: string[];
  description?: string;
  accessibility?: string[];
  outline?: { title: string; content: string }[];
}

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    id: 1,
    title: "Fractals and Structures",
    subtitle: "Crafting Our Legacy",
    locked: false,
    duration: "2–2.5 hours",
    ageRange: "5–12 yrs (target 5th grade)",
    materials: [
      "Recycled things",
      "Paper",
      "Straws",
      "Decorations",
      "Wooden sticks",
      "Paper towel roll",
      "Cardboard",
      "Tape",
    ],
    objectives: [
      "Wonder: Inspire curiosity and awe about the culture, history, and achievements of past kingdoms or about future worlds we are building.",
      "Insight & pride: Introduce children to the idea that the African city's organization in the 1400s was based on fractals, a mathematical concept not yet discovered in the West. The wall was thought to be larger than the wall of China — we were architects.",
      "Engineering/Structures: Children will engage with building and creating, learning about how structures were made and the engineering behind them.",
    ],
    description:
      "This is an immersive, hands-on learning engineering education experience designed to engage both children and guardians in the exploration of Benin City, a city in the 1400s where the concept of theft didn't exist and the city was organized in fractals, blending historical exploration with interactive play and hands-on activities. It encourages creativity, teamwork, and exploration.",
    accessibility: [
      "Language will stray away from engineering jargon",
      "Tools will be age-appropriate",
      "Instructions will be available and delivered in different methods",
      "Activities are flexible enough to accommodate varying abilities",
    ],
    outline: [
      {
        title: "Arrival",
        content:
          "As people arrive into the space, welcome them and encourage them to explore before the experience begins. Hand tokens to children/teens. The token will be their time traveler ticket, but they do not know this yet.",
      },
      {
        title: "Introduction (15 min)",
        content:
          "A brief introduction to the space, the place and the experience — worldbuilding. We begin at the library of ancestors. That's where the description of the place is made. At the end of the introduction the group is split in two: one group gets to time travel and the other group is made of archeologists and archivists — the memory librarian.",
      },
      {
        title: "Activity 1 — Parents/Guardians: Archivist Historian (60 min)",
        content:
          "Parents are to learn about Benin City by exploring. Most of the activities here are simple word finding games, coloring pages, connect the dots, etc. There's also a list of the articles and books that have inspired this experience ranging from articles about journals of Portuguese explorers to descriptions of a sunken city in an afro futuristic sci-fiction novel. Adults are expected to interact with the work and encouraged to write letters and love notes to our time travelers based on some prompts. Example: What are you most curious about in this world that we've discovered? These letters will be shared with the time travelers when they return.",
      },
      {
        title: "Activity 2 — Children: Time Travelers Building (60 min)",
        content:
          "Children time travel to the 1400s and can pick their attires. First, they are taken to the Library of Ancestors where they are given a show — a deeper dive and explanation of the customs in Benin City. One such thing is they are told that in this community people will help them build a house, and it just so happens that today newcomers have arrived and need us to build a house. Do the first activity with house building and structures with the given materials. Children are separated into groups and stations. Each station only has one material so they have to share and work together to construct a structure with many materials. The children have full autonomy and are encouraged to test their structures.",
      },
      {
        title: "Optional Activity 3 — Children: Time Travelers Drumming (20 min)",
        content:
          "If there are enough children, the children are split into groups of three, and one group pauses on the building to spend 20 minutes on this activity. Children will learn a traditional Benin City drum rhythm to further immerse themselves in the culture that they will perform at the general celebration.",
      },
      {
        title: "Celebration & Return",
        content:
          "As it is the custom in Benin, after the house is done the villagers get a party — the new homeowners host a party to thank the villagers. If activity 3 was done, here is where the children will perform. Mid-party we have to return back to the present. They are allowed to bring something with them, a talisman of their choosing.",
      },
      {
        title: "Conclusion (20 min)",
        content:
          "Back in the present, the guardians excavate the structures that the children just built. In the present, the children are the experts and present on their structures. Each presenter is also asked a question from the ones the parents generated. As the children present, their structures are being evaluated based on aesthetics, load-bearing capabilities, and a shake test for sturdiness simulating an earthquake. The activity closes with participants receiving a polaroid of their experience, and perhaps a little meditation as they reflect on what it would feel like to live in such a world, what they've learned, and what they want to bring back with them.",
      },
    ],
  },
  {
    id: 2,
    title: "Circuits and Sonic Sculptures",
    subtitle: "Crafting Our Legacy",
    locked: false,
    duration: "2–2.5 hours",
    ageRange: "5–12 yrs (target 5th grade)",
    materials: [
      "Recycled things",
      "Play-Doh",
      "Switch",
      "LED",
      "Wires",
      "Conductive wires",
      "Copper wires",
      "Conductive thread",
      "Felt",
    ],
    objectives: [
      "Wonder: Inspire curiosity and awe about the culture, history, and achievements of past kingdoms or about future worlds we are building.",
      "Insight & pride: Introduce participants to the idea that the African city's organization in the 1400s was based on fractals, a mathematical concept not yet discovered in the West. The wall was thought to be larger than the wall of China — we were architects.",
      "Understand basic electrical concepts: Identify the parts of a simple circuit — power source, conductor, load (LED or buzzer), and switch. Describe in simple terms how electricity flows through a circuit.",
      "Recognize conductors vs. insulators: Test different materials (Play-Doh, copper wire, felt, thread) and determine whether they conduct electricity. Explain why some materials allow electricity to flow and others do not.",
      "Advance — explain circuit types: Distinguish between series circuits (one path) and parallel circuits (multiple paths). Predict what happens if a component is removed in each type.",
    ],
    description:
      "An interactive, hands-on workshop where participants explore electricity through creative circuit-building. Using Play-Doh and other conductive materials, children experiment with light, sound, and switches to design functional circuits and artistic structures, building curiosity, problem-solving skills, and confidence in engineering concepts.",
    accessibility: [
      "Language will stray away from engineering jargon",
      "Tools will be age-appropriate",
      "Instructions will be available and delivered in different methods",
      "Activities are flexible enough to accommodate varying abilities",
    ],
    outline: [
      {
        title: "Activity 1: Open Exploration — \"Let There Be Light\" (30–40 min)",
        content:
          "Objective: participants freely experiment with circuits, Play-Doh, and LEDs. Provide materials: Play-Doh, LEDs, batteries, wires, switches. Give minimal instructions: \"See what you can make light up or make buzz!\" Encourage testing, combining, breaking, and rebuilding circuits. Facilitators observe, ask guiding questions (\"What happens if you connect here?\"), but do not explain rules yet. Learning focus: hands-on trial and error, discovery of cause-and-effect in circuits, collaboration and curiosity-driven experimentation.",
      },
      {
        title: "Activity 2: Guided Reflection & Explanation (15–20 min)",
        content:
          "Consolidate learning from open exploration. Gather participants and discuss observations: \"What worked? What didn't? Why?\" Link their discoveries to these concepts using their own examples. Learning focus: parts of a circuit (switch, battery, LED), series vs. parallel circuits, conductors vs. insulators. Connect exploration to scientific understanding and reinforce circuit vocabulary and principles.",
      },
      {
        title: "Activity 3: Applied Exploration — Creative Circuit Building (45–60 min)",
        content:
          "Participants apply newly learned principles to create functional, artistic, or structural circuits. Experiment with series and parallel circuits, integration of multiple outputs, and exploration-driven understanding of circuit behavior. Provide materials for more complex builds: multiple LEDs, switches, conductive thread, copper wire, felt, buzzers or small speakers, microphone. Encourage participants to create a circuit with at least one additional component. Walk around to help if participants are stuck — ask questions more than give answers.",
      },
    ],
  },
  {
    id: 3,
    title: "Mapping the World",
    subtitle: "Crafting Our Legacy",
    locked: true,
    description: "Navigate the hex grid, understand neighborhoods and lots, and learn how the archive mirrors Benin City's repeating patterns.",
  },
  {
    id: 4,
    title: "Building a Lot",
    subtitle: "Crafting Our Legacy",
    locked: true,
    description: "Document a physical or imagined structure: upload 3D scans, photos, and audio recordings tied to a specific place.",
  },
  {
    id: 5,
    title: "Layering Stories",
    subtitle: "Crafting Our Legacy",
    locked: true,
    description: "Add characters, events, and multi-layered narratives that connect personal history to community memory.",
  },
];

export const CURRICULUM_UNLOCK_KEY = "living-archive-curriculum-unlocked";
