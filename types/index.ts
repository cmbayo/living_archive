// types/index.ts

export interface Neighborhood {
  id: number;
  name: string;
}

export interface Media {
  id: number;
  url: string;
  type: "Audio" | "Photo" | "Structure3D" | "Mocap";
}

export interface Story {
  id: number;
  content: string;
  layer: number;
  createdAt: string;
}

export interface StoryEvent {
  story: Story;
}

export interface Event {
  id: number;
  name: string;
  datetime: string;
  description: string;
  major: boolean;
  stories: StoryEvent[];
}

export interface Lot {
  id: number;
  name: string;
  dateFounded: string | null;
  architectDesigner: string | null;
  publicSpace: boolean;
  neighborhood: Neighborhood | null;
  events: Event[];
}

export interface Character {
  id: number;
  name: string;
  backstory: string | null;
  currentAge: string;
  timeTraveler: boolean;
}

export interface Relationship {
  id: number;
  type: string;
  strength: number;
  character: Character;
  relatedTo: Character;
}