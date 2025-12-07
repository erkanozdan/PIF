import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider, Message, StreamCallback } from '../aiService';

export class GoogleService implements AIProvider {
  async sendMessage(messages: Message[], model: string, apiKey?: string): Promise<string> {
    if (!apiKey) {
      throw new Error('Google API key is required');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model });

    try {
      // Google Gemini formatına çevir
      const history = messages.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const lastMessage = messages[messages.length - 1];

      const chat = geminiModel.startChat({
        history: history as any
      });

      const result = await chat.sendMessage(lastMessage.content);
      return result.response.text();
    } catch (error: any) {
      throw new Error(`Google error: ${error.message}`);
    }
  }

  async streamMessage(
    messages: Message[],
    model: string,
    callback: StreamCallback,
    apiKey?: string
  ): Promise<void> {
    if (!apiKey) {
      callback.onError(new Error('Google API key is required'));
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model });

    try {
      const history = messages.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const lastMessage = messages[messages.length - 1];

      const chat = geminiModel.startChat({
        history: history as any
      });

      const result = await chat.sendMessageStream(lastMessage.content);

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          callback.onChunk(text);
        }
      }

      callback.onComplete();
    } catch (error: any) {
      callback.onError(new Error(`Google stream error: ${error.message}`));
    }
  }

  async getAvailableModels(): Promise<string[]> {
    return [
      'gemini-2.0-flash-exp',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.0-pro'
    ];
  }
}
