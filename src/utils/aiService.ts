import { Member } from '../types/gameTypes';

interface GeneratedLore {
  gymName: string;
  townName: string;
  motivation: string;
  challenge: string;
  reward: string;
}

export interface AIReturn {
  success: boolean;
  message: string;
  data?: any;
}

export const aiService = {
  generateGymLore: async (): Promise<GeneratedLore> => {
    // Mocked AI response for generating gym lore
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          gymName: 'Collierville Fitness Center',
          townName: 'Collierville',
          motivation: 'to become local legends',
          challenge: 'complete a series of fitness challenges',
          reward: 'eternal glory and a lifetime supply of smoothies',
        });
      }, 500);
    });
  },

  generateMemberProfile: async (): Promise<Member> => {
    // Mocked AI response for generating a member profile
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: `Member ${Math.floor(Math.random() * 100)}`,
          color: '#'+Math.floor(Math.random()*16777215).toString(16),
          id: Math.floor(Math.random() * 1000),
        });
      }, 500);
    });
  },

  validateSmoothieRecipe: async (ingredients: string[]): Promise<AIReturn> => {
    // Mocked AI response for validating a smoothie recipe
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = ingredients.length > 1;
        const message = isValid ? 'Great smoothie!' : 'Needs more ingredients.';
        resolve({
          success: isValid,
          message: message,
          data: {
            healthScore: isValid ? 85 : 30,
            tasteScore: isValid ? 92 : 50,
          },
        });
      }, 500);
    });
  },

  generateWorkoutRoutine: async (): Promise<string[]> => {
    // Mocked AI response for generating a workout routine
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          'Warm-up: 5 min cardio',
          'Squats: 3 sets of 12 reps',
          'Push-ups: 3 sets until failure',
          'Plank: 3 sets, hold for 30 seconds',
          'Cool-down: 5 min stretching',
        ]);
      }, 500);
    });
  },

  generateCharacterNames: (): { xavier: string; morty: string } => {
    const xavierNames = ['Xavier Lightning', 'Xavier Power', 'Xavier Strong', 'Xavier Swift', 'Xavier Bold'];
    const mortyNames = ['Morty Thunder', 'Morty Quick', 'Morty Brave', 'Morty Flash', 'Morty Fire'];
    
    return {
      xavier: xavierNames[Math.floor(Math.random() * xavierNames.length)],
      morty: mortyNames[Math.floor(Math.random() * mortyNames.length)]
    };
  },

  analyzeGameData: async (gameData: any): Promise<AIReturn> => {
    // Mocked AI response for analyzing game data
    return new Promise((resolve) => {
      setTimeout(() => {
        const totalScore = gameData.totalScore;
        let feedback = 'Good effort!';
        if (totalScore > 1000) {
          feedback = 'Excellent performance!';
        } else if (totalScore > 500) {
          feedback = 'Well done!';
        }
        resolve({
          success: true,
          message: 'Game data analysis complete.',
          data: {
            feedback: feedback,
            areasForImprovement: ['Cardio', 'Smoothie Recipes'],
          },
        });
      }, 500);
    });
  },

  suggestNextChallenge: async (completedGames: string[]): Promise<string> => {
    // Mocked AI response for suggesting the next challenge
    return new Promise((resolve) => {
      setTimeout(() => {
        const challenges = ['Front Desk', 'Workout', 'Smoothie', 'Basketball', 'Swimming', 'Yoga', 'Cardio'];
        const availableChallenges = challenges.filter(challenge => !completedGames.includes(challenge));
        const nextChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)] || 'All challenges completed!';
        resolve(nextChallenge);
      }, 500);
    });
  },
};
