/**
 * Environment configuration service
 * Manages API keys and environment variables securely
 */

interface EnvironmentConfig {
  openAIApiKey: string | null;
  supabaseUrl: string;
  supabaseAnonKey: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

class EnvironmentService {
  private config: EnvironmentConfig;

  constructor() {
    this.config = {
      // API keys should be stored in environment variables, not hardcoded
      openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY || null,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
      isDevelopment: import.meta.env.DEV,
      isProduction: import.meta.env.PROD
    };

    // Validate required environment variables
    this.validateConfig();
  }

  /**
   * Get OpenAI API key from environment
   */
  getOpenAIApiKey(): string | null {
    if (!this.config.openAIApiKey) {
      console.warn('OpenAI API key not configured. AI features will be disabled.');
      return null;
    }
    return this.config.openAIApiKey;
  }

  /**
   * Get Supabase configuration
   */
  getSupabaseConfig(): { url: string; anonKey: string } {
    return {
      url: this.config.supabaseUrl,
      anonKey: this.config.supabaseAnonKey
    };
  }

  /**
   * Check if AI features are enabled
   */
  isAIEnabled(): boolean {
    return !!this.config.openAIApiKey;
  }

  /**
   * Check if backend features are enabled
   */
  isBackendEnabled(): boolean {
    return !!this.config.supabaseUrl && !!this.config.supabaseAnonKey;
  }

  /**
   * Get environment type
   */
  getEnvironment(): 'development' | 'production' {
    return this.config.isDevelopment ? 'development' : 'production';
  }

  /**
   * Validate configuration
   */
  private validateConfig(): void {
    const warnings: string[] = [];

    if (!this.config.openAIApiKey) {
      warnings.push('VITE_OPENAI_API_KEY is not set. AI features will be disabled.');
    }

    if (!this.config.supabaseUrl) {
      warnings.push('VITE_SUPABASE_URL is not set. Backend features will be disabled.');
    }

    if (!this.config.supabaseAnonKey) {
      warnings.push('VITE_SUPABASE_ANON_KEY is not set. Backend features will be disabled.');
    }

    if (warnings.length > 0) {
      console.warn('Environment configuration warnings:', warnings);
    }
  }

  /**
   * Get feature flags based on environment
   */
  getFeatureFlags() {
    return {
      enableAI: this.isAIEnabled(),
      enableBackend: this.isBackendEnabled(),
      enableLeaderboard: this.isBackendEnabled(),
      enableGameSaves: this.isBackendEnabled(),
      enableDebugMode: this.config.isDevelopment,
      enableAnalytics: this.config.isProduction
    };
  }
}

export const environmentService = new EnvironmentService();