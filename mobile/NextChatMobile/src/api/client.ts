import axios from 'axios';
import { useChatStore } from '../store/chatStore';
import { NetworkOptimizer, PerformanceMonitor } from '../utils/performance';

// Define types for different providers
interface OpenAIChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIChatRequest {
  model: string;
  messages: OpenAIChatMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

interface OpenAIChatResponse {
  id: string;
  choices: {
    index: number;
    message: OpenAIChatMessage;
    finish_reason: string;
  }[];
}

// Baidu ERNIE types
interface BaiduChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface BaiduChatRequest {
  messages: BaiduChatMessage[];
}

interface BaiduChatResponse {
  id: string;
  object: string;
  created: number;
  result: string;
  is_truncated: boolean;
  need_clear_history: boolean;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Alibaba Qwen types
interface QwenChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface QwenChatRequest {
  model: string;
  input: {
    messages: QwenChatMessage[];
  };
  parameters: {
    result_format: string;
  };
}

interface QwenChatResponse {
  output: {
    choices: {
      message: QwenChatMessage;
      finish_reason: string;
    }[];
  };
  usage: {
    total_tokens: number;
    input_tokens: number;
    output_tokens: number;
  };
}

// Zhipu ChatGLM types
interface ZhipuChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ZhipuChatRequest {
  model: string;
  messages: ZhipuChatMessage[];
  stream?: boolean;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
}

interface ZhipuChatResponse {
  choices: {
    index: number;
    message: ZhipuChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// API clients for different providers
class OpenAIClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey: string) {
    this.baseUrl = 'https://api.openai.com/v1';
    this.apiKey = apiKey;
  }

  async chat(messages: OpenAIChatMessage[], model: string = 'gpt-4'): Promise<string> {
    return PerformanceMonitor.measureAsync(async () => {
      try {
        // Check cache first
        const cacheKey = `openai_${model}_${JSON.stringify(messages)}`;
        const cachedResponse = await NetworkOptimizer.getCachedResponse(cacheKey);
        if (cachedResponse) {
          return cachedResponse;
        }

        const request: OpenAIChatRequest = {
          model,
          messages,
          temperature: 0.7,
        };

        const response = await axios.post<OpenAIChatResponse>(
          `${this.baseUrl}/chat/completions`,
          request,
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 30000, // 30 second timeout
          }
        );

        const result = response.data.choices[0].message.content;
        
        // Cache the response
        await NetworkOptimizer.cacheResponse(cacheKey, result);
        
        return result;
      } catch (error) {
        console.error('OpenAI API error:', error);
        throw new Error('Failed to get response from OpenAI');
      }
    }, 'OpenAI API Call');
  }
}

class GoogleGeminiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey: string) {
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    this.apiKey = apiKey;
  }

  async chat(messages: OpenAIChatMessage[], model: string = 'gemini-pro'): Promise<string> {
    return PerformanceMonitor.measureAsync(async () => {
      try {
        // Check cache first
        const cacheKey = `gemini_${model}_${JSON.stringify(messages)}`;
        const cachedResponse = await NetworkOptimizer.getCachedResponse(cacheKey);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Convert messages to Gemini format
        const contents = messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }));

        const response = await axios.post(
          `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`,
          { contents },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 30000, // 30 second timeout
          }
        );

        const result = response.data.candidates[0].content.parts[0].text;
        
        // Cache the response
        await NetworkOptimizer.cacheResponse(cacheKey, result);
        
        return result;
      } catch (error) {
        console.error('Google Gemini API error:', error);
        throw new Error('Failed to get response from Google Gemini');
      }
    }, 'Google Gemini API Call');
  }
}

class BaiduErnieClient {
  private baseUrl: string;
  private apiKey: string;
  private secretKey: string;

  constructor(apiKey: string, secretKey: string) {
    this.baseUrl = 'https://aip.baidubce.com';
    this.apiKey = apiKey;
    this.secretKey = secretKey;
  }

  async getAccessToken(): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/oauth/2.0/token`,
        null,
        {
          params: {
            grant_type: 'client_credentials',
            client_id: this.apiKey,
            client_secret: this.secretKey,
          },
          timeout: 10000, // 10 second timeout
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('Baidu auth error:', error);
      throw new Error('Failed to get access token from Baidu');
    }
  }

  async chat(messages: OpenAIChatMessage[], model: string = 'ernie-bot-4'): Promise<string> {
    return PerformanceMonitor.measureAsync(async () => {
      try {
        // Check cache first
        const cacheKey = `baidu_${model}_${JSON.stringify(messages)}`;
        const cachedResponse = await NetworkOptimizer.getCachedResponse(cacheKey);
        if (cachedResponse) {
          return cachedResponse;
        }

        const accessToken = await this.getAccessToken();
        
        // Convert messages to Baidu format
        const baiduMessages: BaiduChatMessage[] = messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        }));

        const request: BaiduChatRequest = {
          messages: baiduMessages,
        };

        // Map model names to Baidu endpoints
        let endpoint = model;
        if (model === 'ernie-bot-4') {
          endpoint = 'completions_pro';
        } else if (model === 'ernie-bot') {
          endpoint = 'completions';
        } else if (model === 'ernie-bot-turbo') {
          endpoint = 'eb-instant';
        }

        const response = await axios.post<BaiduChatResponse>(
          `${this.baseUrl}/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${endpoint}?access_token=${accessToken}`,
          request,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 30000, // 30 second timeout
          }
        );

        const result = response.data.result;
        
        // Cache the response
        await NetworkOptimizer.cacheResponse(cacheKey, result);
        
        return result;
      } catch (error) {
        console.error('Baidu ERNIE API error:', error);
        throw new Error('Failed to get response from Baidu ERNIE');
      }
    }, 'Baidu ERNIE API Call');
  }
}

class AlibabaQwenClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey: string) {
    this.baseUrl = 'https://dashscope.aliyuncs.com';
    this.apiKey = apiKey;
  }

  async chat(messages: OpenAIChatMessage[], model: string = 'qwen-max'): Promise<string> {
    return PerformanceMonitor.measureAsync(async () => {
      try {
        // Check cache first
        const cacheKey = `qwen_${model}_${JSON.stringify(messages)}`;
        const cachedResponse = await NetworkOptimizer.getCachedResponse(cacheKey);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Convert messages to Qwen format
        const qwenMessages: QwenChatMessage[] = messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

        const request: QwenChatRequest = {
          model: model,
          input: {
            messages: qwenMessages,
          },
          parameters: {
            result_format: 'message',
          },
        };

        const response = await axios.post<QwenChatResponse>(
          `${this.baseUrl}/api/v1/services/aigc/text-generation/generation`,
          request,
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
              'X-DashScope-SSE': 'disable',
            },
            timeout: 30000, // 30 second timeout
          }
        );

        const result = response.data.output.choices[0].message.content;
        
        // Cache the response
        await NetworkOptimizer.cacheResponse(cacheKey, result);
        
        return result;
      } catch (error) {
        console.error('Alibaba Qwen API error:', error);
        throw new Error('Failed to get response from Alibaba Qwen');
      }
    }, 'Alibaba Qwen API Call');
  }
}

class ZhipuChatGLMClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey: string) {
    this.baseUrl = 'https://open.bigmodel.cn/api/paas/v4';
    this.apiKey = apiKey;
  }

  async chat(messages: OpenAIChatMessage[], model: string = 'glm-4'): Promise<string> {
    return PerformanceMonitor.measureAsync(async () => {
      try {
        // Check cache first
        const cacheKey = `zhipu_${model}_${JSON.stringify(messages)}`;
        const cachedResponse = await NetworkOptimizer.getCachedResponse(cacheKey);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Convert messages to Zhipu format
        const zhipuMessages: ZhipuChatMessage[] = messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

        const request: ZhipuChatRequest = {
          model: model,
          messages: zhipuMessages,
          temperature: 0.7,
        };

        const response = await axios.post<ZhipuChatResponse>(
          `${this.baseUrl}/chat/completions`,
          request,
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 30000, // 30 second timeout
          }
        );

        const result = response.data.choices[0].message.content;
        
        // Cache the response
        await NetworkOptimizer.cacheResponse(cacheKey, result);
        
        return result;
      } catch (error) {
        console.error('Zhipu ChatGLM API error:', error);
        throw new Error('Failed to get response from Zhipu ChatGLM');
      }
    }, 'Zhipu ChatGLM API Call');
  }
}

// Main API client that handles different providers
class APIClient {
  async chat(messages: OpenAIChatMessage[], model: string): Promise<string> {
    const { apiKey, secretKey, selectedModel } = useChatStore.getState();
    
    // Determine provider based on model name
    if (model.startsWith('gpt')) {
      const openaiClient = new OpenAIClient(apiKey);
      return openaiClient.chat(messages, model);
    } else if (model.startsWith('gemini')) {
      // For demo purposes, we'll use a mock response if no API key is provided
      if (!apiKey) {
        return `This is a simulated response for ${model}. In a real application, you would need to provide a Google API key.`;
      }
      
      const geminiClient = new GoogleGeminiClient(apiKey);
      return geminiClient.chat(messages, model);
    } else if (model.startsWith('ernie')) {
      // For Baidu models, we need both API key and secret key
      if (!apiKey || !secretKey) {
        return `This is a simulated response for ${model}. To use Baidu ERNIE models, please provide both API Key and Secret Key in settings.`;
      }
      
      const baiduClient = new BaiduErnieClient(apiKey, secretKey);
      return baiduClient.chat(messages, model);
    } else if (model.startsWith('qwen')) {
      if (!apiKey) {
        return `This is a simulated response for ${model}. To use Alibaba Qwen models, please provide an API Key in settings.`;
      }
      
      const qwenClient = new AlibabaQwenClient(apiKey);
      return qwenClient.chat(messages, model);
    } else if (model.startsWith('glm')) {
      if (!apiKey) {
        return `This is a simulated response for ${model}. To use Zhipu ChatGLM models, please provide an API Key in settings.`;
      }
      
      const zhipuClient = new ZhipuChatGLMClient(apiKey);
      return zhipuClient.chat(messages, model);
    } else {
      // Default response for other models
      return `This is a simulated response from ${model}. In a complete implementation, this would connect to the appropriate API.`;
    }
  }
}

export const apiClient = new APIClient();