import axios from 'axios';
import { AIProvider, Message, StreamCallback } from '../aiService';

export class OllamaService implements AIProvider {
  private baseURL = 'http://localhost:11434';

  async sendMessage(messages: Message[], model: string): Promise<string> {
    try {
      const response = await axios.post(`${this.baseURL}/api/chat`, {
        model,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        stream: false
      });

      return response.data.message.content;
    } catch (error: any) {
      throw new Error(`Ollama error: ${error.message}`);
    }
  }

  async streamMessage(
    messages: Message[],
    model: string,
    callback: StreamCallback
  ): Promise<void> {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/chat`,
        {
          model,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          stream: true
        },
        {
          responseType: 'stream'
        }
      );

      let buffer = '';

      response.data.on('data', (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              if (data.message?.content) {
                callback.onChunk(data.message.content);
              }
              if (data.done) {
                callback.onComplete();
              }
            } catch (e) {
              console.error('Parse error:', e);
            }
          }
        }
      });

      response.data.on('end', () => {
        callback.onComplete();
      });

      response.data.on('error', (error: Error) => {
        callback.onError(error);
      });
    } catch (error: any) {
      callback.onError(new Error(`Ollama stream error: ${error.message}`));
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseURL}/api/tags`);
      return response.data.models?.map((m: any) => m.name) || [];
    } catch (error) {
      console.error('Error fetching Ollama models:', error);
      return [];
    }
  }
}
