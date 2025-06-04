import { AICharacter, GameLore } from '../types/loreTypes';
import { environmentService } from '../services/environmentService';

export class AIService {
  private apiKey: string | null;

  constructor() {
    this.apiKey = environmentService.getOpenAIApiKey();
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  isEnabled(): boolean {
    return !!this.apiKey;
  }

  async generateCharacter(role: 'member' | 'trainer' | 'staff'): Promise<AICharacter | null> {
    if (!this.isEnabled()) {
      console.warn('AI service is disabled. Using fallback character generation.');
      return this.generateFallbackCharacter(role);
    }

    const prompt = `Generate a unique character for a fitness center game with the following role: ${role}.

Please respond with a JSON object containing:
- name: A realistic first name
- description: A brief 2-sentence description
- personality: 3-4 personality traits
- backstory: A short background story (2-3 sentences)
- appearance: Physical description focusing on distinctive features

Make the character diverse, interesting, and appropriate for a family-friendly fitness center game.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a creative character designer for a fitness center game. Always respond with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 300
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const characterData = JSON.parse(data.choices[0].message.content);

      const colors = ['#ff6b35', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#E91E63'];
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: characterData.name,
        description: characterData.description,
        personality: Array.isArray(characterData.personality) ? characterData.personality.join(', ') : characterData.personality,
        backstory: characterData.backstory,
        appearance: characterData.appearance,
        role,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    } catch (error) {
      console.error('Error generating character:', error);
      return null;
    }
  }

  async generateLore(): Promise<any> {
    if (!this.isEnabled()) {
      console.warn('AI service is disabled. Using fallback lore generation.');
      return this.generateFallbackLore();
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getApiKey()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a creative game writer specializing in fitness and adventure themes. Always respond with valid JSON only, no markdown formatting or code blocks.'
            },
            {
              role: 'user',
              content: `Create immersive lore for "LF Legends - Collierville Quest", a fitness center adventure game featuring Xavier and Morty.

Please respond with a JSON object containing:
- setting: Overall game world description (2-3 sentences)
- backstory: How Xavier and Morty's adventure began (3-4 sentences)
- locations: Object with descriptions for frontDesk, gym, and smoothieBar (1-2 sentences each)
- characters: Object with enhanced descriptions for xavier and morty (2-3 sentences each)

Make it engaging, family-friendly, and focused on fitness, teamwork, and healthy living.`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let content = data.choices[0].message.content;
      
      content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
      
      return JSON.parse(content);
    } catch (error) {
      console.error('Error generating lore:', error);
      return {
        setting: "In the vibrant town of Collierville, the LF Legends fitness center stands as a beacon of health and adventure. This state-of-the-art facility combines cutting-edge equipment with fun challenges that inspire members to reach their fitness goals.",
        backstory: "Xavier and Morty discovered a mysterious fitness challenge map hidden in the gym's trophy case. The map revealed three legendary trials that promised to unlock the secrets of true fitness mastery. Together, they embarked on an epic quest to complete all challenges and become the ultimate LF Legends.",
        locations: {
          frontDesk: "The welcoming hub where adventures begin, staffed by friendly team members ready to guide you on your fitness journey.",
          gym: "A dynamic space filled with state-of-the-art equipment and energizing music that motivates every workout session.",
          smoothieBar: "A refreshing oasis offering delicious and nutritious smoothies to fuel your body after intense training sessions."
        },
        characters: {
          xavier: "A determined young athlete with incredible agility and a positive attitude that inspires everyone around him. His leadership skills and unwavering dedication make him the perfect guide for any fitness adventure.",
          morty: "Xavier's loyal companion who brings creativity and problem-solving skills to every challenge. His enthusiasm for healthy living and team spirit make him an invaluable partner in their quest for fitness excellence.",
          mike: "The fitness center's strength coach who specializes in weightlifting and muscle building. His encouraging demeanor and expert knowledge help members push past their limits safely.",
          carson: "A competitive basketball player who brings athletic excellence to every game. His sportsmanship and team-first attitude make him a natural leader on the court.",
          ava: "A certified yoga instructor who promotes mindfulness and flexibility. Her calming presence and expert guidance help members find balance in both body and mind."
        }
      };
    }
  }

  /**
   * Generate fallback character when AI is disabled
   */
  private generateFallbackCharacter(role: 'member' | 'trainer' | 'staff'): AICharacter {
    const fallbackCharacters = {
      member: [
        {
          name: 'Alex',
          description: 'An enthusiastic fitness beginner eager to learn new exercises. Always arrives early and stays late to practice.',
          personality: 'motivated, curious, friendly, determined',
          backstory: 'Recently moved to Collierville and joined the fitness center to make new friends. Previously worked in an office job and decided to prioritize health.',
          appearance: 'Average height with an athletic build in progress, short dark hair, and always wearing colorful workout gear.'
        },
        {
          name: 'Jordan',
          description: 'A regular member who loves group fitness classes. Known for encouraging others during tough workouts.',
          personality: 'supportive, energetic, social, optimistic',
          backstory: 'Former college athlete who maintains fitness through regular gym visits. Works as a local teacher and believes in leading by example.',
          appearance: 'Tall and lean, with curly brown hair often in a ponytail, bright smile, and coordinated athletic wear.'
        }
      ],
      trainer: [
        {
          name: 'Coach Taylor',
          description: 'A certified personal trainer specializing in strength training. Known for creating personalized workout plans.',
          personality: 'professional, encouraging, knowledgeable, patient',
          backstory: 'Former competitive powerlifter who transitioned to coaching after an injury. Passionate about helping others reach their potential safely.',
          appearance: 'Muscular build, close-cropped hair, often wearing the gym\'s trainer uniform with a whistle around the neck.'
        }
      ],
      staff: [
        {
          name: 'Sam',
          description: 'Front desk coordinator who knows every member by name. Always ready with a smile and helpful advice.',
          personality: 'welcoming, organized, helpful, cheerful',
          backstory: 'Started as a part-time employee while in college and loved the environment so much they stayed full-time. Certified in CPR and first aid.',
          appearance: 'Medium height, friendly face, neat appearance, always wearing the fitness center polo and name badge.'
        }
      ]
    };

    const characters = fallbackCharacters[role];
    const selected = characters[Math.floor(Math.random() * characters.length)];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#9B59B6'];

    return {
      id: Math.random().toString(36).substr(2, 9),
      ...selected,
      role,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }

  /**
   * Generate fallback lore when AI is disabled
   */
  private generateFallbackLore(): GameLore {
    return {
      setting: "In the vibrant town of Collierville, the LF Legends fitness center stands as a beacon of health and adventure. This state-of-the-art facility combines cutting-edge equipment with fun challenges that inspire members to reach their fitness goals.",
      backstory: "Xavier and Morty discovered a mysterious fitness challenge map hidden in the gym's trophy case. The map revealed seven legendary trials that promised to unlock the secrets of true fitness mastery. Together, they embarked on an epic quest to complete all challenges and become the ultimate LF Legends.",
      locations: {
        frontDesk: "The welcoming hub where adventures begin, staffed by friendly team members ready to guide you on your fitness journey.",
        gym: "A dynamic space filled with state-of-the-art equipment and energizing music that motivates every workout session.",
        smoothieBar: "A refreshing oasis offering delicious and nutritious smoothies to fuel your body after intense training sessions."
      },
      characters: {
        xavier: "A determined young athlete with incredible agility and a positive attitude that inspires everyone around him. His leadership skills and unwavering dedication make him the perfect guide for any fitness adventure.",
        morty: "Xavier's loyal companion who brings creativity and problem-solving skills to every challenge. His enthusiasm for healthy living and team spirit make him an invaluable partner in their quest for fitness excellence.",
        mike: "The fitness center's strength coach who specializes in weightlifting and muscle building. His encouraging demeanor and expert knowledge help members push past their limits safely.",
        carson: "A competitive basketball player who brings athletic excellence to every game. His sportsmanship and team-first attitude make him a natural leader on the court.",
        ava: "A certified yoga instructor who promotes mindfulness and flexibility. Her calming presence and expert guidance help members find balance in both body and mind."
      }
    };
  }
}

export const aiService = new AIService();
