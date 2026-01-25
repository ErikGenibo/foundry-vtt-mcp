import { z } from 'zod';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { FoundryClient } from '../foundry-client.js';
import { Logger } from '../logger.js';
import { GeminiClient } from '../gemini-client.js';

export interface TokenArtGenerationToolsOptions {
  foundryClient: FoundryClient;
  logger: Logger;
  geminiClient: GeminiClient | undefined;
}

export class TokenArtGenerationTools {
  private foundryClient: FoundryClient;
  private logger: Logger;
  private geminiClient: GeminiClient | undefined;

  constructor(options: TokenArtGenerationToolsOptions) {
    this.foundryClient = options.foundryClient;
    this.logger = options.logger.child({ component: 'TokenArtGenerationTools' });
    this.geminiClient = options.geminiClient;
  }

  getToolDefinitions(): Tool[] {
    // Only expose tool if Gemini is configured
    if (!this.geminiClient) {
      return [];
    }

    return [
      {
        name: 'generate-token-art',
        description: 'Generate AI portrait/token artwork using Google Gemini and optionally assign it to an actor. Creates a 1:1 aspect ratio image suitable for character portraits and tokens.',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'Description of the character portrait to generate. Be descriptive about appearance, style, lighting, and mood. Example: "A weathered half-orc barbarian with tribal tattoos, scars across his face, wild black hair, fierce expression, fantasy portrait style, dramatic lighting"'
            },
            actor_name: {
              type: 'string',
              description: 'Optional: Name of the actor to search for and assign the generated art to. Will fuzzy match against world actors.'
            },
            actor_id: {
              type: 'string',
              description: 'Optional: Specific actor ID to assign the generated art to. Takes precedence over actor_name.'
            },
            style_hints: {
              type: 'string',
              description: 'Optional: Additional style hints to append to the prompt (e.g., "oil painting style", "anime style", "realistic portrait", "dark fantasy")'
            },
            update_tokens: {
              type: 'boolean',
              description: 'Whether to also update any placed tokens of this actor with the new image. Default: true'
            }
          },
          required: ['prompt']
        }
      }
    ];
  }

  async handleGenerateTokenArt(args: any): Promise<any> {
    if (!this.geminiClient) {
      return {
        success: false,
        error: 'Gemini API is not configured. Set GEMINI_API_KEY environment variable to enable token art generation.'
      };
    }

    const schema = z.object({
      prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
      actor_name: z.string().optional(),
      actor_id: z.string().optional(),
      style_hints: z.string().optional(),
      update_tokens: z.boolean().default(true)
    });

    let parsed;
    try {
      parsed = schema.parse(args);
    } catch (validationError: any) {
      return {
        success: false,
        error: `Validation error: ${validationError.message}`
      };
    }

    const { prompt, actor_name, actor_id, style_hints, update_tokens } = parsed;

    this.logger.info('Token art generation requested', {
      promptLength: prompt.length,
      hasActorName: !!actor_name,
      hasActorId: !!actor_id,
      hasStyleHints: !!style_hints
    });

    try {
      // Build enhanced prompt for portrait generation
      let enhancedPrompt = `Character portrait: ${prompt}`;
      if (style_hints) {
        enhancedPrompt += `. Style: ${style_hints}`;
      }
      enhancedPrompt += '. High quality, detailed, centered composition, suitable for game token or character portrait.';

      // Generate image with Gemini (synchronous - no job queue needed)
      this.logger.info('Calling Gemini API for image generation');
      const result = await this.geminiClient.generateImage(enhancedPrompt, '1:1');

      if (!result.success || !result.imageData) {
        this.logger.error('Gemini generation failed', { error: result.error });
        return {
          success: false,
          error: result.error || 'Failed to generate image'
        };
      }

      this.logger.info('Image generated, uploading to Foundry', {
        imageSize: result.imageData.length
      });

      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedName = (actor_name || actor_id || 'character')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .substring(0, 30);
      const filename = `token_${sanitizedName}_${timestamp}.png`;

      // Upload to Foundry using the new upload-generated-token handler
      const uploadResult = await this.foundryClient.query(
        'foundry-mcp-bridge.upload-generated-token',
        {
          filename,
          imageData: result.imageData
        }
      );

      if (!uploadResult.success) {
        this.logger.error('Upload failed', { error: uploadResult.error });
        return {
          success: false,
          error: `Failed to upload image: ${uploadResult.error}`
        };
      }

      const webPath = uploadResult.path;
      this.logger.info('Token art uploaded', { path: webPath });

      // If actor specified, update the actor's image
      let actorUpdateResult: any = null;
      if (actor_id || actor_name) {
        this.logger.info('Updating actor image', { actor_id, actor_name });
        actorUpdateResult = await this.foundryClient.query(
          'foundry-mcp-bridge.updateActorImage',
          {
            actorId: actor_id,
            actorName: actor_name,
            imagePath: webPath,
            updateTokens: update_tokens
          }
        );

        if (!actorUpdateResult.success) {
          this.logger.warn('Actor update failed but image was generated', {
            error: actorUpdateResult.error
          });
        }
      }

      const response: any = {
        success: true,
        imagePath: webPath,
        filename
      };

      if (actorUpdateResult) {
        response.actorUpdated = actorUpdateResult.success;
        response.actorId = actorUpdateResult.actorId;
        response.actorName = actorUpdateResult.actorName;
        response.tokensUpdated = actorUpdateResult.tokensUpdated || 0;
        response.message = actorUpdateResult.success
          ? `Token art generated and assigned to ${actorUpdateResult.actorName}. ${actorUpdateResult.tokensUpdated} placed token(s) updated.`
          : `Token art generated at ${webPath} but failed to assign to actor: ${actorUpdateResult.error}`;
      } else {
        response.message = `Token art generated successfully at ${webPath}`;
      }

      this.logger.info('Token art generation complete', response);
      return response;

    } catch (error: any) {
      this.logger.error('Token art generation failed', { error: error.message });
      return {
        success: false,
        error: error.message || 'Unknown error during token art generation'
      };
    }
  }
}
