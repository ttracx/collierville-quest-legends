
import { GameLore, AICharacter, LoreState } from '../types/loreTypes';
import { aiService } from './aiService';

class LoreManager {
  private state: LoreState = {
    isLoaded: false,
    currentLore: null,
    aiCharacters: [],
    isGenerating: false
  };

  async generateGameLore(): Promise<GameLore | null> {
    if (this.state.isGenerating) return null;
    
    this.state.isGenerating = true;
    
    try {
      const lore = await aiService.generateLore();
      if (lore) {
        this.state.currentLore = lore;
        this.state.isLoaded = true;
      }
      return lore;
    } catch (error) {
      console.error('Failed to generate lore:', error);
      return null;
    } finally {
      this.state.isGenerating = false;
    }
  }

  async generateCharacter(role: 'member' | 'trainer' | 'staff'): Promise<AICharacter | null> {
    if (this.state.isGenerating) return null;
    
    this.state.isGenerating = true;
    
    try {
      const character = await aiService.generateCharacter(role);
      if (character) {
        this.state.aiCharacters.push(character);
      }
      return character;
    } catch (error) {
      console.error('Failed to generate character:', error);
      return null;
    } finally {
      this.state.isGenerating = false;
    }
  }

  getCurrentLore(): GameLore | null {
    return this.state.currentLore;
  }

  getAICharacters(): AICharacter[] {
    return this.state.aiCharacters;
  }

  isGenerating(): boolean {
    return this.state.isGenerating;
  }

  isLoaded(): boolean {
    return this.state.isLoaded;
  }
}

export const loreManager = new LoreManager();
