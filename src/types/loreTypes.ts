
export interface GameLore {
  setting: string;
  backstory: string;
  locations: {
    frontDesk: string;
    gym: string;
    smoothieBar: string;
  };
  characters: {
    xavier: string;
    morty: string;
  };
}

export interface AICharacter {
  id: string;
  name: string;
  description: string;
  personality: string;
  backstory: string;
  appearance: string;
  role: 'member' | 'trainer' | 'staff';
  color: string;
}

export interface LoreState {
  isLoaded: boolean;
  currentLore: GameLore | null;
  aiCharacters: AICharacter[];
  isGenerating: boolean;
}
