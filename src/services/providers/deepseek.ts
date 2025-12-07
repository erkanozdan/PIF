import OpenAI from 'openai';
import { AIProvider, Message, StreamCallback } from '../aiService';

export class DeepSeekService implements AIProvider {
  private baseURL = 'https://api.deepseek.com';

  async sendMessage(messages: Message[], model: string, apiKey?: string): Promise<string> {
    if (!apiKey) {
      throw new Error('DeepSeek API key is required');
    }

    const client = new OpenAI({
      apiKey,
      baseURL: this.baseURL,
      dangerouslyAllowBrowser: true
    });

    try {
      const response = await client.chat.completions.create({
        model,
        messages: messages as any,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error: any) {
      throw new Error(`DeepSeek error: ${error.message}`);
    }
  }

  async streamMessage(
    messages: Message[],
    model: string,
    callback: StreamCallback,
    apiKey?: string
  ): Promise<void> {
    if (!apiKey) {
      callback.onError(new Error('DeepSeek API key is required'));
      return;
    }

    const client = new OpenAI({
      apiKey,
      baseURL: this.baseURL,
      dangerouslyAllowBrowser: true
    });

    try {
      const stream = await client.chat.completions.create({
        model,
        messages: messages as any,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          callback.onChunk(content);
        }
      }

      callback.onComplete();
    } catch (error: any) {
      callback.onError(new Error(`DeepSeek stream error: ${error.message}`));
    }
  }

  async getAvailableModels(): Promise<string[]> {
    return [
      'deepseek-chat',
      'deepseek-coder'
    ];
  }
}
