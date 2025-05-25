
export const GAME_STATES = {
  MENU: 'menu',
  INSTRUCTIONS: 'instructions',
  MAP: 'map',
  FRONTDESK: 'frontdesk',
  WORKOUT: 'workout',
  SMOOTHIE: 'smoothie',
  BASKETBALL: 'basketball',
  SWIMMING: 'swimming',
  YOGA: 'yoga',
  CARDIO: 'cardio',
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

export interface BasketballData {
  shots: number;
  makes: number;
  ballX: number;
  ballY: number;
  ballVelocityX: number;
  ballVelocityY: number;
  isCharging: boolean;
  chargePower: number;
  timer: number;
  score: number;
}

export interface SwimmingData {
  laps: number;
  position: number;
  speed: number;
  stamina: number;
  rhythm: number;
  timer: number;
  score: number;
}

export interface YogaData {
  currentPose: string;
  poseTimer: number;
  posesCompleted: number;
  balance: number;
  breathing: number;
  timer: number;
  score: number;
}

export interface CardioData {
  currentExercise: string;
  intensity: number;
  heartRate: number;
  calories: number;
  exerciseTimer: number;
  timer: number;
  score: number;
}

export interface GameData {
  frontDesk: FrontDeskData;
  workout: WorkoutData;
  smoothie: SmoothieData;
  basketball: BasketballData;
  swimming: SwimmingData;
  yoga: YogaData;
  cardio: CardioData;
  totalScore: number;
  completedGames: Set<GameState>;
}
