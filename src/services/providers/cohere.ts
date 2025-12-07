import { CohereClient } from 'cohere-ai';
import { AIProvider, Message, StreamCallback } from '../aiService';

export class CohereService implements AIProvider {
  async sendMessage(messages: Message[], model: string, apiKey?: string): Promise<string> {
    if (!apiKey) {
      throw new Error('Cohere API key is required');
    }

    const cohere = new CohereClient({ token: apiKey });

    try {
      // Cohere chat formatına çevir
      const chatHistory = messages.slice(0, -1).map(m => ({
        role: m.role.toUpperCase() as 'USER' | 'CHATBOT',
        message: m.content
      }));

      const lastMessage = messages[messages.length - 1].content;

      const response = await cohere.chat({
        model,
        message: lastMessage,
        chatHistory: chatHistory as any
      });

      return response.text || '';
    } catch (error: any) {
      throw new Error(`Cohere error: ${error.message}`);
    }
  }

  async streamMessage(
    messages: Message[],
    model: string,
    callback: StreamCallback,
    apiKey?: string
  ): Promise<void> {
    if (!apiKey) {
      callback.onError(new Error('Cohere API key is required'));
      return;
    }

    const cohere = new CohereClient({ token: apiKey });

    try {
      const chatHistory = messages.slice(0, -1).map(m => ({
        role: m.role.toUpperCase() as 'USER' | 'CHATBOT',
        message: m.content
      }));

      const lastMessage = messages[messages.length - 1].content;

      const stream = await cohere.chatStream({
        model,
        message: lastMessage,
        chatHistory: chatHistory as any
      });

      for await (const chunk of stream) {
        if (chunk.eventType === 'text-generation') {
          callback.onChunk(chunk.text || '');
        }
      }

      callback.onComplete();
    } catch (error: any) {
      callback.onError(new Error(`Cohere stream error: ${error.message}`));
    }
  }

  async getAvailableModels(): Promise<string[]> {
    return [
      'command-r-plus',
      'command-r',
      'command',
      'command-light'
    ];
  }
}
