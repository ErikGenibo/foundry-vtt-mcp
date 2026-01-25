import { z } from 'zod';
import { FoundryClient } from '../foundry-client.js';
import { Logger } from '../logger.js';

export interface TableToolsOptions {
  foundryClient: FoundryClient;
  logger: Logger;
}

export class TableTools {
  private foundryClient: FoundryClient;
  private logger: Logger;

  constructor({ foundryClient, logger }: TableToolsOptions) {
    this.foundryClient = foundryClient;
    this.logger = logger.child({ component: 'TableTools' });
  }

  getToolDefinitions() {
    return [
      {
        name: 'list-tables',
        description: 'List all rollable tables in the world.',
        inputSchema: {
          type: 'object',
          properties: {
            folderFilter: {
              type: 'string',
              description: 'Optional: filter by folder name',
            },
          },
        },
      },
      {
        name: 'roll-table',
        description: 'Roll on a rollable table and get the result. Great for random encounters, loot, NPC traits, etc.',
        inputSchema: {
          type: 'object',
          properties: {
            tableId: {
              type: 'string',
              description: 'Table ID or name to roll on',
            },
            displayChat: {
              type: 'boolean',
              description: 'Show the result in chat (default: true)',
              default: true,
            },
            rollCount: {
              type: 'number',
              description: 'Number of times to roll (default: 1)',
              default: 1,
              minimum: 1,
              maximum: 10,
            },
          },
          required: ['tableId'],
        },
      },
      {
        name: 'get-table-contents',
        description: 'Get all entries/results in a rollable table without rolling.',
        inputSchema: {
          type: 'object',
          properties: {
            tableId: {
              type: 'string',
              description: 'Table ID or name',
            },
          },
          required: ['tableId'],
        },
      },
    ];
  }

  async handleListTables(args: any): Promise<any> {
    const schema = z.object({
      folderFilter: z.string().optional(),
    });

    const parsed = schema.parse(args);
    this.logger.info('Listing tables', { folderFilter: parsed.folderFilter });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.listTables', {
        folderFilter: parsed.folderFilter,
      });

      return {
        success: true,
        tables: result.tables,
        count: result.tables.length,
      };
    } catch (error) {
      this.logger.error('Failed to list tables', error);
      throw new Error(`Failed to list tables: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleRollTable(args: any): Promise<any> {
    const schema = z.object({
      tableId: z.string(),
      displayChat: z.boolean().optional().default(true),
      rollCount: z.number().min(1).max(10).optional().default(1),
    });

    const parsed = schema.parse(args);
    this.logger.info('Rolling table', { tableId: parsed.tableId, count: parsed.rollCount });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.rollTable', {
        tableId: parsed.tableId,
        displayChat: parsed.displayChat,
        rollCount: parsed.rollCount,
      });

      return {
        success: true,
        tableName: result.tableName,
        results: result.results,
        message: result.results.length === 1
          ? `Rolled "${result.results[0].text}" on ${result.tableName}`
          : `Rolled ${result.results.length} results on ${result.tableName}`,
      };
    } catch (error) {
      this.logger.error('Failed to roll table', error);
      throw new Error(`Failed to roll table: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleGetTableContents(args: any): Promise<any> {
    const schema = z.object({
      tableId: z.string(),
    });

    const parsed = schema.parse(args);
    this.logger.info('Getting table contents', { tableId: parsed.tableId });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.getTableContents', {
        tableId: parsed.tableId,
      });

      return {
        success: true,
        tableName: result.tableName,
        formula: result.formula,
        entries: result.entries,
        entryCount: result.entries.length,
      };
    } catch (error) {
      this.logger.error('Failed to get table contents', error);
      throw new Error(`Failed to get table contents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
