
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
  async saveGameState(userId: string, gameState: any, scores: Record<string, number>): Promise<{ success: boolean; error?: string }> {
    try {
      const gameData: GameSave = {
        user_id: userId,
        game_state: JSON.stringify(gameState),
        scores: {
          basketball: Number(scores.basketball) || 0,
          swimming: Number(scores.swimming) || 0,
          yoga: Number(scores.yoga) || 0,
          cardio: Number(scores.cardio) || 0,
          frontDesk: Number(scores.frontDesk) || 0,
          workout: Number(scores.workout) || 0,
          smoothie: Number(scores.smoothie) || 0
        },
        total_score: Object.values(scores).reduce((sum: number, score: number) => sum + (Number(score) || 0), 0),
        achievements: this.calculateAchievements(scores),
        updated_at: new Date().toISOString()
      };

      // Since tables don't exist yet, we'll handle this gracefully
      try {
        const { error } = await (supabase as any)
          .from('game_saves')
          .upsert(gameData, { onConflict: 'user_id' });

        if (error) throw error;
        return { success: true };
      } catch (dbError) {
        console.warn('Database tables not set up yet:', dbError);
        return { success: false, error: 'Database not configured. Please set up Supabase tables first.' };
      }
    } catch (error: any) {
      console.error('Error saving game state:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Load saved game state from Supabase
   */
  async loadGameState(userId: string): Promise<{ success: boolean; data?: GameSave; error?: string }> {
    try {
      const { data, error } = await (supabase as any)
        .from('game_saves')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return { success: true, data: data || null };
    } catch (error: any) {
      console.error('Error loading game state:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Submit score to leaderboard
   */
  async submitToLeaderboard(username: string, totalScore: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await (supabase as any)
        .from('leaderboard')
        .insert({
          username,
          total_score: totalScore,
          game_count: 1
        });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error submitting to leaderboard:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get top leaderboard entries
   */
  async getLeaderboard(limit: number = 10): Promise<{ success: boolean; data?: LeaderboardEntry[]; error?: string }> {
    try {
      const { data, error } = await (supabase as any)
        .from('leaderboard')
        .select('*')
        .order('total_score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Calculate achievements based on scores
   */
  private calculateAchievements(scores: Record<string, number>): string[] {
    const achievements: string[] = [];
    
    // Perfect game achievements
    if (Number(scores.basketball) >= 10) achievements.push('basketball_master');
    if (Number(scores.swimming) >= 50) achievements.push('swimming_champion');
    if (Number(scores.yoga) >= 100) achievements.push('zen_master');
    if (Number(scores.cardio) >= 100) achievements.push('cardio_king');
    if (Number(scores.workout) >= 50) achievements.push('strength_hero');
    if (Number(scores.smoothie) >= 10) achievements.push('smoothie_expert');
    
    // Overall achievements
    const totalScore = Object.values(scores).reduce((sum: number, score: number) => sum + (Number(score) || 0), 0);
    if (totalScore >= 100) achievements.push('fitness_enthusiast');
    if (totalScore >= 300) achievements.push('fitness_warrior');
    if (totalScore >= 500) achievements.push('fitness_legend');
    
    // Completion achievements
    const completedGames = Object.values(scores).filter((score: number) => Number(score) > 0).length;
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
      const { data, error } = await (supabase as any).auth.signInAnonymously();
      if (error) throw error;
      
      return { success: true, userId: data.user?.id };
    } catch (error: any) {
      console.error('Error creating anonymous session:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current user session
   */
  async getCurrentUser(): Promise<{ success: boolean; userId?: string; error?: string }> {
    try {
      const { data: { user }, error } = await (supabase as any).auth.getUser();
      if (error) throw error;
      
      return { success: true, userId: user?.id };
    } catch (error: any) {
      console.error('Error getting current user:', error);
      return { success: false, error: error.message };
    }
  }
}

// Import supabase at the end to avoid circular dependency issues
import { supabase } from '../integrations/supabase/client';

export const gameDataService = new GameDataService();
