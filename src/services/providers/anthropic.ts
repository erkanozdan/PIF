import Anthropic from '@anthropic-ai/sdk';
import { AIProvider, Message, StreamCallback } from '../aiService';

export class AnthropicService implements AIProvider {
  async sendMessage(messages: Message[], model: string, apiKey?: string): Promise<string> {
    if (!apiKey) {
      throw new Error('Anthropic API key is required');
    }

    const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

    try {
      // Sistem mesajını ayır
      const systemMessage = messages.find(m => m.role === 'system');
      const chatMessages = messages.filter(m => m.role !== 'system');

      const response = await anthropic.messages.create({
        model,
        max_tokens: 4096,
        system: systemMessage?.content,
        messages: chatMessages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }))
      });

      return response.content[0].type === 'text' ? response.content[0].text : '';
    } catch (error: any) {
      throw new Error(`Anthropic error: ${error.message}`);
    }
  }

  async streamMessage(
    messages: Message[],
    model: string,
    callback: StreamCallback,
    apiKey?: string
  ): Promise<void> {
    if (!apiKey) {
      callback.onError(new Error('Anthropic API key is required'));
      return;
    }

    const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

    try {
      const systemMessage = messages.find(m => m.role === 'system');
      const chatMessages = messages.filter(m => m.role !== 'system');

      const stream = await anthropic.messages.stream({
        model,
        max_tokens: 4096,
        system: systemMessage?.content,
        messages: chatMessages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }))
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          callback.onChunk(chunk.delta.text);
        }
      }

      callback.onComplete();
    } catch (error: any) {
      callback.onError(new Error(`Anthropic stream error: ${error.message}`));
    }
  }

  async getAvailableModels(): Promise<string[]> {
    return [
      'claude-3-5-sonnet-20241022',
      'claude-3-5-haiku-20241022',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307'
    ];
  }
}
