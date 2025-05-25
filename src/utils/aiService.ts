
export class AIService {
  private apiKey: string | null = null;

  constructor() {
    this.apiKey = localStorage.getItem('openai_api_key');
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('openai_api_key', key);
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  async generateCharacter(role: 'member' | 'trainer' | 'staff'): Promise<AICharacter | null> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not set');
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

  async generateLore(): Promise<GameLore | null> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not set');
    }

    const prompt = `Create immersive lore for "LF Legends - Collierville Quest", a fitness center adventure game featuring Xavier and Morty.

Please respond with a JSON object containing:
- setting: Overall game world description (2-3 sentences)
- backstory: How Xavier and Morty's adventure began (3-4 sentences)
- locations: Object with descriptions for frontDesk, gym, and smoothieBar (1-2 sentences each)
- characters: Object with enhanced descriptions for xavier and morty (2-3 sentences each)

Make it engaging, family-friendly, and focused on fitness, teamwork, and healthy living.`;

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
              content: 'You are a creative game writer specializing in fitness and adventure themes. Always respond with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating lore:', error);
      return null;
    }
  }
}

export const aiService = new AIService();
