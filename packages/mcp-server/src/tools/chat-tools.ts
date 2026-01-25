import { z } from 'zod';
import { FoundryClient } from '../foundry-client.js';
import { Logger } from '../logger.js';

export interface ChatToolsOptions {
  foundryClient: FoundryClient;
  logger: Logger;
}

export class ChatTools {
  private foundryClient: FoundryClient;
  private logger: Logger;

  constructor({ foundryClient, logger }: ChatToolsOptions) {
    this.foundryClient = foundryClient;
    this.logger = logger.child({ component: 'ChatTools' });
  }

  /**
   * Tool definitions for chat operations
   */
  getToolDefinitions() {
    return [
      {
        name: 'send-chat-message',
        description: 'Send a chat message to Foundry VTT. Can speak as NPCs, make announcements, or send whispers to specific players. Supports in-character (IC), out-of-character (OOC), and emote message types.',
        inputSchema: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'The message content. Supports basic HTML formatting.',
            },
            speaker: {
              type: 'object',
              description: 'Who is speaking. If not provided, speaks as the GM.',
              properties: {
                alias: {
                  type: 'string',
                  description: 'Display name for the speaker (e.g., "Mysterious Voice", "Town Crier")',
                },
                actorId: {
                  type: 'string',
                  description: 'Actor ID to speak as (uses actor name and token image)',
                },
                tokenId: {
                  type: 'string',
                  description: 'Token ID to speak as (uses token name)',
                },
              },
            },
            type: {
              type: 'string',
              enum: ['ic', 'ooc', 'emote', 'whisper'],
              description: 'Message type: "ic" (in-character), "ooc" (out-of-character), "emote" (action/narration), "whisper" (private). Default: "ic"',
              default: 'ic',
            },
            whisperTo: {
              type: 'array',
              description: 'For whisper messages: array of player names or "gm" to whisper to specific users',
              items: {
                type: 'string',
              },
            },
            flavor: {
              type: 'string',
              description: 'Optional flavor text shown above the message (useful for context)',
            },
          },
          required: ['content'],
        },
      },
      {
        name: 'get-chat-history',
        description: 'Retrieve recent chat messages from Foundry VTT.',
        inputSchema: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              description: 'Maximum number of messages to retrieve (default: 20, max: 100)',
              default: 20,
              minimum: 1,
              maximum: 100,
            },
            speakerFilter: {
              type: 'string',
              description: 'Optional: filter by speaker name (partial match)',
            },
            includeWhispers: {
              type: 'boolean',
              description: 'Include whispered messages (GM only, default: false)',
              default: false,
            },
          },
        },
      },
      {
        name: 'narrate',
        description: 'Send a narrative/descriptive text to chat. Styled distinctly as GM narration. Use for scene descriptions, atmospheric text, or story beats.',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'The narrative text to display',
            },
            title: {
              type: 'string',
              description: 'Optional title/header for the narration box',
            },
            whisperTo: {
              type: 'array',
              description: 'Optional: whisper to specific players instead of showing to all',
              items: {
                type: 'string',
              },
            },
          },
          required: ['text'],
        },
      },
    ];
  }

  // ============================================
  // Tool Handlers
  // ============================================

  async handleSendChatMessage(args: any): Promise<any> {
    const schema = z.object({
      content: z.string().min(1),
      speaker: z.object({
        alias: z.string().optional(),
        actorId: z.string().optional(),
        tokenId: z.string().optional(),
      }).optional(),
      type: z.enum(['ic', 'ooc', 'emote', 'whisper']).optional().default('ic'),
      whisperTo: z.array(z.string()).optional(),
      flavor: z.string().optional(),
    });

    const parsed = schema.parse(args);

    this.logger.info('Sending chat message', {
      type: parsed.type,
      hasWhisper: !!parsed.whisperTo,
      speakerAlias: parsed.speaker?.alias,
    });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.sendChatMessage', {
        content: parsed.content,
        speaker: parsed.speaker,
        messageType: parsed.type,
        whisperTo: parsed.whisperTo,
        flavor: parsed.flavor,
      });

      this.logger.debug('Chat message sent', { messageId: result.messageId });

      return {
        success: true,
        messageId: result.messageId,
        speaker: result.speaker,
        message: `Message sent${parsed.whisperTo ? ' (whispered)' : ''}`,
      };

    } catch (error) {
      this.logger.error('Failed to send chat message', error);
      throw new Error(`Failed to send chat message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleGetChatHistory(args: any): Promise<any> {
    const schema = z.object({
      limit: z.number().min(1).max(100).optional().default(20),
      speakerFilter: z.string().optional(),
      includeWhispers: z.boolean().optional().default(false),
    });

    const parsed = schema.parse(args);

    this.logger.info('Getting chat history', { limit: parsed.limit });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.getChatHistory', {
        limit: parsed.limit,
        speakerFilter: parsed.speakerFilter,
        includeWhispers: parsed.includeWhispers,
      });

      return {
        success: true,
        messages: result.messages,
        count: result.messages.length,
      };

    } catch (error) {
      this.logger.error('Failed to get chat history', error);
      throw new Error(`Failed to get chat history: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleNarrate(args: any): Promise<any> {
    const schema = z.object({
      text: z.string().min(1),
      title: z.string().optional(),
      whisperTo: z.array(z.string()).optional(),
    });

    const parsed = schema.parse(args);

    this.logger.info('Sending narration', { hasTitle: !!parsed.title });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.narrate', {
        text: parsed.text,
        title: parsed.title,
        whisperTo: parsed.whisperTo,
      });

      return {
        success: true,
        messageId: result.messageId,
        message: 'Narration sent',
      };

    } catch (error) {
      this.logger.error('Failed to send narration', error);
      throw new Error(`Failed to send narration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
