import { supabase } from '../integrations/supabase/client';

/**
 * Service for handling game data persistence with Supabase
 * Manages scores, game progress, and user profiles
 */

export interface GameSave {
  id?: string;
  user_id: string;
  game_state: string;
  scores: {
    basketball: number;
    swimming: number;
    yoga: number;
    cardio: number;
    frontDesk: number;
    workout: number;
    smoothie: number;
  };
  total_score: number;
  achievements: string[];
  created_at?: string;
  updated_at?: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  total_score: number;
  game_count: number;
  created_at: string;
}

class GameDataService {
  /**
   * Save current game state to Supabase
   */
  async saveGameState(userId: string, gameState: any, scores: any): Promise<{ success: boolean; error?: string }> {
    try {
      const gameData: GameSave = {
        user_id: userId,
        game_state: JSON.stringify(gameState),
        scores: scores,
        total_score: Object.values(scores).reduce((sum: number, score: any) => sum + (score || 0), 0),
        achievements: this.calculateAchievements(scores),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('game_saves')
        .upsert(gameData, { onConflict: 'user_id' });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error saving game state:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Load saved game state from Supabase
   */
  async loadGameState(userId: string): Promise<{ success: boolean; data?: GameSave; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('game_saves')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
      
      return { success: true, data: data || null };
    } catch (error) {
      console.error('Error loading game state:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Submit score to leaderboard
   */
  async submitToLeaderboard(username: string, totalScore: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('leaderboard')
        .insert({
          username,
          total_score: totalScore,
          game_count: 1
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error submitting to leaderboard:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get top leaderboard entries
   */
  async getLeaderboard(limit: number = 10): Promise<{ success: boolean; data?: LeaderboardEntry[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('total_score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Calculate achievements based on scores
   */
  private calculateAchievements(scores: any): string[] {
    const achievements: string[] = [];
    
    // Perfect game achievements
    if (scores.basketball >= 10) achievements.push('basketball_master');
    if (scores.swimming >= 50) achievements.push('swimming_champion');
    if (scores.yoga >= 100) achievements.push('zen_master');
    if (scores.cardio >= 100) achievements.push('cardio_king');
    if (scores.workout >= 50) achievements.push('strength_hero');
    if (scores.smoothie >= 10) achievements.push('smoothie_expert');
    
    // Overall achievements
    const totalScore = Object.values(scores).reduce((sum: number, score: any) => sum + (score || 0), 0);
    if (totalScore >= 100) achievements.push('fitness_enthusiast');
    if (totalScore >= 300) achievements.push('fitness_warrior');
    if (totalScore >= 500) achievements.push('fitness_legend');
    
    // Completion achievements
    const completedGames = Object.values(scores).filter((score: any) => score > 0).length;
    if (completedGames >= 3) achievements.push('triple_threat');
    if (completedGames >= 5) achievements.push('penta_athlete');
    if (completedGames >= 7) achievements.push('complete_champion');
    
    return achievements;
  }

  /**
   * Create anonymous user session
   */
  async createAnonymousSession(): Promise<{ success: boolean; userId?: string; error?: string }> {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      
      return { success: true, userId: data.user?.id };
    } catch (error) {
      console.error('Error creating anonymous session:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current user session
   */
  async getCurrentUser(): Promise<{ success: boolean; userId?: string; error?: string }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      return { success: true, userId: user?.id };
    } catch (error) {
      console.error('Error getting current user:', error);
      return { success: false, error: error.message };
    }
  }
}

export const gameDataService = new GameDataService();