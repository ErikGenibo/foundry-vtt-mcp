import { Logger } from './logger.js';

export interface GeminiConfig {
  apiKey: string;
  model: 'gemini-2.5-flash-image' | 'gemini-3-pro-image-preview';
}

export interface GeminiGenerationResult {
  success: boolean;
  imageData?: string; // Base64 PNG
  error?: string;
}

export class GeminiClient {
  private config: GeminiConfig;
  private logger: Logger;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

  constructor(options: { logger: Logger; config: GeminiConfig }) {
    this.logger = options.logger.child({ component: 'GeminiClient' });
    this.config = options.config;
  }

  async generateImage(prompt: string, aspectRatio: string = '1:1'): Promise<GeminiGenerationResult> {
    const url = `${this.baseUrl}/${this.config.model}:generateContent`;

    try {
      this.logger.info('Generating image with Gemini', {
        model: this.config.model,
        promptLength: prompt.length,
        aspectRatio
      });

      const requestBody = {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          responseModalities: ['IMAGE'],
          imageConfig: {
            aspectRatio: aspectRatio
          }
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.config.apiKey
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(60000) // 60 second timeout
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = (errorData as any)?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Extract base64 image from response
      const imageData = (data as any)?.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data;

      if (!imageData) {
        throw new Error('No image data in Gemini response');
      }

      this.logger.info('Image generated successfully', {
        imageSize: imageData.length,
        model: this.config.model
      });

      return {
        success: true,
        imageData
      };

    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown Gemini API error';
      this.logger.error('Gemini image generation failed', { error: errorMessage });

      return {
        success: false,
        error: errorMessage
      };
    }
  }
}
