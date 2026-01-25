import { z } from 'zod';
import { FoundryClient } from '../foundry-client.js';
import { Logger } from '../logger.js';

export interface MacroToolsOptions {
  foundryClient: FoundryClient;
  logger: Logger;
}

export class MacroTools {
  private foundryClient: FoundryClient;
  private logger: Logger;

  constructor({ foundryClient, logger }: MacroToolsOptions) {
    this.foundryClient = foundryClient;
    this.logger = logger.child({ component: 'MacroTools' });
  }

  getToolDefinitions() {
    return [
      {
        name: 'list-macros',
        description: 'List all macros in the world, optionally filtered by type or folder.',
        inputSchema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['script', 'chat'],
              description: 'Filter by macro type: "script" (JavaScript) or "chat" (chat command)',
            },
            folderFilter: {
              type: 'string',
              description: 'Filter by folder name',
            },
          },
        },
      },
      {
        name: 'execute-macro',
        description: 'Execute a macro by name or ID. Use with caution - macros can perform any action.',
        inputSchema: {
          type: 'object',
          properties: {
            macroId: {
              type: 'string',
              description: 'Macro ID or name to execute',
            },
            args: {
              type: 'object',
              description: 'Optional arguments to pass to the macro (available as `args` in script macros)',
              additionalProperties: true,
            },
          },
          required: ['macroId'],
        },
      },
      {
        name: 'get-macro-details',
        description: 'Get detailed information about a macro including its command/script.',
        inputSchema: {
          type: 'object',
          properties: {
            macroId: {
              type: 'string',
              description: 'Macro ID or name',
            },
          },
          required: ['macroId'],
        },
      },
    ];
  }

  async handleListMacros(args: any): Promise<any> {
    const schema = z.object({
      type: z.enum(['script', 'chat']).optional(),
      folderFilter: z.string().optional(),
    });

    const parsed = schema.parse(args);
    this.logger.info('Listing macros', { type: parsed.type, folderFilter: parsed.folderFilter });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.listMacros', {
        type: parsed.type,
        folderFilter: parsed.folderFilter,
      });

      return {
        success: true,
        macros: result.macros,
        count: result.macros.length,
      };
    } catch (error) {
      this.logger.error('Failed to list macros', error);
      throw new Error(`Failed to list macros: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleExecuteMacro(args: any): Promise<any> {
    const schema = z.object({
      macroId: z.string(),
      args: z.record(z.any()).optional(),
    });

    const parsed = schema.parse(args);
    this.logger.info('Executing macro', { macroId: parsed.macroId, hasArgs: !!parsed.args });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.executeMacro', {
        macroId: parsed.macroId,
        args: parsed.args,
      });

      return {
        success: true,
        macroName: result.macroName,
        executed: result.executed,
        message: `Executed macro "${result.macroName}"`,
        result: result.result,
      };
    } catch (error) {
      this.logger.error('Failed to execute macro', error);
      throw new Error(`Failed to execute macro: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleGetMacroDetails(args: any): Promise<any> {
    const schema = z.object({
      macroId: z.string(),
    });

    const parsed = schema.parse(args);
    this.logger.info('Getting macro details', { macroId: parsed.macroId });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.getMacroDetails', {
        macroId: parsed.macroId,
      });

      return {
        success: true,
        macro: result.macro,
      };
    } catch (error) {
      this.logger.error('Failed to get macro details', error);
      throw new Error(`Failed to get macro details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
