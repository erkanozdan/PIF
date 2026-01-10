import OpenAI from 'openai';
import { AIProvider, Message, StreamCallback } from '../aiService';

export class OpenAIService implements AIProvider {
  async sendMessage(messages: Message[], model: string, apiKey?: string): Promise<string> {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }

    const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

    try {
      const response = await openai.chat.completions.create({
        model,
        messages: messages as any,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error: any) {
      throw new Error(`OpenAI error: ${error.message}`);
    }
  }

  async streamMessage(
    messages: Message[],
    model: string,
    callback: StreamCallback,
    apiKey?: string
  ): Promise<void> {
    if (!apiKey) {
      callback.onError(new Error('OpenAI API key is required'));
      return;
    }

    const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

    try {
      const stream = await openai.chat.completions.create({
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
      callback.onError(new Error(`OpenAI stream error: ${error.message}`));
    }
  }

  async getAvailableModels(apiKey?: string): Promise<string[]> {
    // OpenAI model listesi (sık kullanılanlar)
    return [
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-4',
      'gpt-3.5-turbo',
      'o1-preview',
      'o1-mini'
    ];
  }
}
