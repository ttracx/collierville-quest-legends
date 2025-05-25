import { AICharacter, GameLore } from '../types/loreTypes';

export class AIService {
  private apiKey: string = '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';

  getApiKey(): string {
    return this.apiKey;
  }

  async generateCharacter(role: 'member' | 'trainer' | 'staff'): Promise<AICharacter | null> {
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
        personality: characterData.personality,
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
      
      // Clean up the response by removing markdown code blocks if present
      content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
      
      // Parse the cleaned JSON
      return JSON.parse(content);
    } catch (error) {
      console.error('Error generating lore:', error);
      // Return fallback lore if API fails
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
          morty: "Xavier's loyal companion who brings creativity and problem-solving skills to every challenge. His enthusiasm for healthy living and team spirit make him an invaluable partner in their quest for fitness excellence."
        }
      };
    }
  }
}

export const aiService = new AIService();
