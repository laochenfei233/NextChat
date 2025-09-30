import axios from 'axios';
import { useChatStore } from '../store/chatStore';

// DALL-E Image Generation types
interface DalleImageRequest {
  model: string;
  prompt: string;
  n: number;
  size: string;
}

interface DalleImageResponse {
  created: number;
  data: {
    url: string;
  }[];
}

// Image generation client
class ImageGenerationClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey: string) {
    this.baseUrl = 'https://api.openai.com/v1';
    this.apiKey = apiKey;
  }

  async generateImage(prompt: string, model: string = 'dall-e-3', size: string = '1024x1024'): Promise<string> {
    try {
      const request: DalleImageRequest = {
        model,
        prompt,
        n: 1,
        size,
      };

      const response = await axios.post<DalleImageResponse>(
        `${this.baseUrl}/images/generations`,
        request,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.data[0].url;
    } catch (error) {
      console.error('Image generation error:', error);
      throw new Error('Failed to generate image');
    }
  }
}

// Image utilities
export class ImageUtils {
  private static instance: ImageUtils;

  private constructor() {}

  static getInstance(): ImageUtils {
    if (!ImageUtils.instance) {
      ImageUtils.instance = new ImageUtils();
    }
    return ImageUtils.instance;
  }

  // Generate image using DALL-E
  async generateImage(prompt: string): Promise<string> {
    const { apiKey } = useChatStore.getState();
    
    if (!apiKey) {
      throw new Error('API key is required for image generation');
    }

    const client = new ImageGenerationClient(apiKey);
    return await client.generateImage(prompt);
  }

  // Base64 to Blob (for image handling)
  base64ToBlob(base64: string, contentType: string = ''): Blob {
    const byteString = atob(base64.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: contentType });
  }

  // Download image (web only)
  downloadImage(url: string, filename: string = 'image.png'): void {
    // This is a simplified version for web
    // In React Native, you would use a library like react-native-camera-roll
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
    }
  }
}

export const imageUtils = ImageUtils.getInstance();