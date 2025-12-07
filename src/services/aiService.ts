import { OllamaService } from './providers/ollama';
import { OpenAIService } from './providers/openai';
import { AnthropicService } from './providers/anthropic';
import { GoogleService } from './providers/google';
import { MistralService } from './providers/mistral';
import { CohereService } from './providers/cohere';
import { DeepSeekService } from './providers/deepseek';
import { MoonshotService } from './providers/moonshot';
import { XAIService } from './providers/xai';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface StreamCallback {
  onChunk: (text: string) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
}

export interface AIProvider {
  sendMessage(messages: Message[], model: string, apiKey?: string): Promise<string>;
  streamMessage(messages: Message[], model: string, callback: StreamCallback, apiKey?: string): Promise<void>;
  getAvailableModels(apiKey?: string): Promise<string[]>;
}

export class AIService {
  private providers: Map<string, AIProvider> = new Map();

  constructor() {
    this.providers.set('ollama', new OllamaService());
    this.providers.set('openai', new OpenAIService());
    this.providers.set('anthropic', new AnthropicService());
    this.providers.set('google', new GoogleService());
    this.providers.set('mistral', new MistralService());
    this.providers.set('cohere', new CohereService());
    this.providers.set('deepseek', new DeepSeekService());
    this.providers.set('moonshot', new MoonshotService());
    this.providers.set('xai', new XAIService());
  }

  getProvider(providerName: string): AIProvider | undefined {
    return this.providers.get(providerName);
  }

  async sendMessage(
    providerName: string,
    messages: Message[],
    model: string,
    apiKey?: string
  ): Promise<string> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }
    return provider.sendMessage(messages, model, apiKey);
  }

  async streamMessage(
    providerName: string,
    messages: Message[],
    model: string,
    callback: StreamCallback,
    apiKey?: string
  ): Promise<void> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }
    return provider.streamMessage(messages, model, callback, apiKey);
  }

  async getAvailableModels(providerName: string, apiKey?: string): Promise<string[]> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      return [];
    }
    return provider.getAvailableModels(apiKey);
  }

  getSupportedProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

export const aiService = new AIService();
