
export const GAME_STATES = {
  MENU: 'menu',
  INSTRUCTIONS: 'instructions',
  MAP: 'map',
  FRONTDESK: 'frontdesk',
  WORKOUT: 'workout',
  SMOOTHIE: 'smoothie',
  VICTORY: 'victory'
} as const;

export type GameState = typeof GAME_STATES[keyof typeof GAME_STATES];

export interface Member {
  name: string;
  color: string;
  id: number;
}

export interface FrontDeskData {
  timer: number;
  matches: number;
  currentMember: Member | null;
  badges: Member[];
  score: number;
}

export interface WorkoutData {
  reps: number;
  progress: number;
  lastKey: string | null;
  timer: number;
  score: number;
}

export interface Ingredient {
  name: string;
  x: number;
  y: number;
  color: string;
}

export interface SmoothieData {
  smoothies: number;
  currentRecipe: string[];
  blender: string[];
  ingredients: Ingredient[];
  score: number;
}

export interface GameData {
  frontDesk: FrontDeskData;
  workout: WorkoutData;
  smoothie: SmoothieData;
  totalScore: number;
  completedGames: Set<GameState>;
}
