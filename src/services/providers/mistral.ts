import { Mistral } from '@mistralai/mistralai';
import { AIProvider, Message, StreamCallback } from '../aiService';

export class MistralService implements AIProvider {
  async sendMessage(messages: Message[], model: string, apiKey?: string): Promise<string> {
    if (!apiKey) {
      throw new Error('Mistral API key is required');
    }

    const client = new Mistral({ apiKey });

    try {
      const response = await client.chat.complete({
        model,
        messages: messages.map(m => ({
          role: m.role as any,
          content: m.content
        }))
      });

      return response.choices?.[0]?.message?.content || '';
    } catch (error: any) {
      throw new Error(`Mistral error: ${error.message}`);
    }
  }

  async streamMessage(
    messages: Message[],
    model: string,
    callback: StreamCallback,
    apiKey?: string
  ): Promise<void> {
    if (!apiKey) {
      callback.onError(new Error('Mistral API key is required'));
      return;
    }

    const client = new Mistral({ apiKey });

    try {
      const stream = await client.chat.stream({
        model,
        messages: messages.map(m => ({
          role: m.role as any,
          content: m.content
        }))
      });

      for await (const chunk of stream) {
        const content = chunk.data.choices[0]?.delta?.content;
        if (content) {
          callback.onChunk(content);
        }
      }

      callback.onComplete();
    } catch (error: any) {
      callback.onError(new Error(`Mistral stream error: ${error.message}`));
    }
  }

  async getAvailableModels(): Promise<string[]> {
    return [
      'mistral-large-latest',
      'mistral-medium-latest',
      'mistral-small-latest',
      'open-mistral-7b',
      'open-mixtral-8x7b',
      'open-mixtral-8x22b'
    ];
  }
}
