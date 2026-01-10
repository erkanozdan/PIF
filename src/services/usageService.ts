import axios from 'axios';

export interface UsageInfo {
  provider: string;
  hasKey: boolean;
  isValid: boolean;
  isFree: boolean;
  usage?: {
    used?: number;
    limit?: number;
    remaining?: number;
    unit?: string;
    period?: string;
  };
  subscription?: {
    plan?: string;
    status?: string;
  };
  error?: string;
}

export class UsageService {
  // OpenAI kullanım bilgisi
  async getOpenAIUsage(apiKey: string): Promise<UsageInfo> {
    try {
      // OpenAI API key validation
      const response = await axios.get('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        timeout: 5000
      });

      if (response.status === 200) {
        return {
          provider: 'OpenAI',
          hasKey: true,
          isValid: true,
          isFree: false,
          subscription: {
            plan: 'Pay-as-you-go',
            status: 'active'
          }
        };
      }
    } catch (error: any) {
      return {
        provider: 'OpenAI',
        hasKey: true,
        isValid: false,
        isFree: false,
        error: error.response?.data?.error?.message || 'API key geçersiz'
      };
    }

    return {
      provider: 'OpenAI',
      hasKey: false,
      isValid: false,
      isFree: false
    };
  }

  // Anthropic kullanım bilgisi
  async getAnthropicUsage(apiKey: string): Promise<UsageInfo> {
    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-haiku-20240307',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'test' }]
        },
        {
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          },
          timeout: 5000
        }
      );

      // Header'lardan limit bilgilerini al
      const requestsLimit = response.headers['anthropic-ratelimit-requests-limit'];
      const requestsRemaining = response.headers['anthropic-ratelimit-requests-remaining'];
      const tokensLimit = response.headers['anthropic-ratelimit-tokens-limit'];
      const tokensRemaining = response.headers['anthropic-ratelimit-tokens-remaining'];

      return {
        provider: 'Anthropic',
        hasKey: true,
        isValid: true,
        isFree: false,
        usage: {
          used: requestsLimit ? parseInt(requestsLimit) - parseInt(requestsRemaining || '0') : undefined,
          limit: requestsLimit ? parseInt(requestsLimit) : undefined,
          remaining: requestsRemaining ? parseInt(requestsRemaining) : undefined,
          unit: 'requests',
          period: 'minute'
        },
        subscription: {
          plan: 'Pay-as-you-go',
          status: 'active'
        }
      };
    } catch (error: any) {
      return {
        provider: 'Anthropic',
        hasKey: true,
        isValid: false,
        isFree: false,
        error: error.response?.data?.error?.message || 'API key geçersiz'
      };
    }
  }

  // Google Gemini kullanım bilgisi
  async getGoogleUsage(apiKey: string): Promise<UsageInfo> {
    try {
      const response = await axios.get(
        `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
        { timeout: 5000 }
      );

      if (response.status === 200) {
        return {
          provider: 'Google Gemini',
          hasKey: true,
          isValid: true,
          isFree: true, // Gemini'nin ücretsiz tier'ı var
          subscription: {
            plan: 'Free tier available',
            status: 'active'
          }
        };
      }
    } catch (error: any) {
      return {
        provider: 'Google Gemini',
        hasKey: true,
        isValid: false,
        isFree: true,
        error: error.response?.data?.error?.message || 'API key geçersiz'
      };
    }

    return {
      provider: 'Google Gemini',
      hasKey: false,
      isValid: false,
      isFree: true
    };
  }

  // Diğer sağlayıcılar için genel validation
  async validateApiKey(provider: string, apiKey: string, baseURL: string, testEndpoint: string): Promise<UsageInfo> {
    try {
      const response = await axios.get(`${baseURL}${testEndpoint}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        timeout: 5000
      });

      if (response.status === 200) {
        return {
          provider,
          hasKey: true,
          isValid: true,
          isFree: false,
          subscription: {
            plan: 'Pay-as-you-go',
            status: 'active'
          }
        };
      }
    } catch (error: any) {
      return {
        provider,
        hasKey: true,
        isValid: false,
        isFree: false,
        error: 'API key geçersiz'
      };
    }

    return {
      provider,
      hasKey: false,
      isValid: false,
      isFree: false
    };
  }

  // Tüm sağlayıcılar için kullanım bilgisi
  async getAllUsageInfo(apiKeys: Record<string, string>): Promise<Record<string, UsageInfo>> {
    const results: Record<string, UsageInfo> = {};

    // Ollama - yerel, her zaman ücretsiz
    results['ollama'] = {
      provider: 'Ollama',
      hasKey: true,
      isValid: true,
      isFree: true,
      subscription: {
        plan: 'Local (Free)',
        status: 'active'
      }
    };

    // OpenAI
    if (apiKeys['openai']) {
      results['openai'] = await this.getOpenAIUsage(apiKeys['openai']);
    } else {
      results['openai'] = {
        provider: 'OpenAI',
        hasKey: false,
        isValid: false,
        isFree: false
      };
    }

    // Anthropic
    if (apiKeys['anthropic']) {
      results['anthropic'] = await this.getAnthropicUsage(apiKeys['anthropic']);
    } else {
      results['anthropic'] = {
        provider: 'Anthropic',
        hasKey: false,
        isValid: false,
        isFree: false
      };
    }

    // Google
    if (apiKeys['google']) {
      results['google'] = await this.getGoogleUsage(apiKeys['google']);
    } else {
      results['google'] = {
        provider: 'Google Gemini',
        hasKey: false,
        isValid: false,
        isFree: true
      };
    }

    // Mistral
    if (apiKeys['mistral']) {
      results['mistral'] = await this.validateApiKey(
        'Mistral AI',
        apiKeys['mistral'],
        'https://api.mistral.ai',
        '/v1/models'
      );
    } else {
      results['mistral'] = {
        provider: 'Mistral AI',
        hasKey: false,
        isValid: false,
        isFree: false
      };
    }

    // Cohere
    if (apiKeys['cohere']) {
      results['cohere'] = {
        provider: 'Cohere',
        hasKey: true,
        isValid: true,
        isFree: true, // Cohere'in trial tier'ı var
        subscription: {
          plan: 'Trial available',
          status: 'active'
        }
      };
    } else {
      results['cohere'] = {
        provider: 'Cohere',
        hasKey: false,
        isValid: false,
        isFree: true
      };
    }

    // DeepSeek
    if (apiKeys['deepseek']) {
      results['deepseek'] = await this.validateApiKey(
        'DeepSeek',
        apiKeys['deepseek'],
        'https://api.deepseek.com',
        '/models'
      );
    } else {
      results['deepseek'] = {
        provider: 'DeepSeek',
        hasKey: false,
        isValid: false,
        isFree: false
      };
    }

    // Moonshot (Kimi)
    if (apiKeys['moonshot']) {
      results['moonshot'] = await this.validateApiKey(
        'Kimi (Moonshot)',
        apiKeys['moonshot'],
        'https://api.moonshot.cn/v1',
        '/models'
      );
    } else {
      results['moonshot'] = {
        provider: 'Kimi (Moonshot)',
        hasKey: false,
        isValid: false,
        isFree: false
      };
    }

    // xAI (Grok)
    if (apiKeys['xai']) {
      results['xai'] = {
        provider: 'Grok (xAI)',
        hasKey: true,
        isValid: true,
        isFree: true, // Grok bazı versiyonlar için ücretsiz
        subscription: {
          plan: 'Free tier available',
          status: 'active'
        }
      };
    } else {
      results['xai'] = {
        provider: 'Grok (xAI)',
        hasKey: false,
        isValid: false,
        isFree: true
      };
    }

    return results;
  }
}

export const usageService = new UsageService();
