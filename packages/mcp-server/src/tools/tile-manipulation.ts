import { z } from 'zod';
import { FoundryClient } from '../foundry-client.js';
import { Logger } from '../logger.js';

export interface TileManipulationToolsOptions {
  foundryClient: FoundryClient;
  logger: Logger;
}

export class TileManipulationTools {
  private foundryClient: FoundryClient;
  private logger: Logger;

  constructor({ foundryClient, logger }: TileManipulationToolsOptions) {
    this.foundryClient = foundryClient;
    this.logger = logger.child({ component: 'TileManipulationTools' });
  }

  /**
   * Tool definitions for tile manipulation operations
   */
  getToolDefinitions() {
    return [
      {
        name: 'create-tile',
        description: 'Create a new tile on the current scene. Tiles are image overlays that can be placed on the map for terrain, objects, or visual effects.',
        inputSchema: {
          type: 'object',
          properties: {
            textureSrc: {
              type: 'string',
              description: 'Path to the tile image (e.g., "modules/dc-maps-modular/maps/corridor.webp")',
            },
            x: {
              type: 'number',
              description: 'X coordinate for tile placement (in pixels)',
            },
            y: {
              type: 'number',
              description: 'Y coordinate for tile placement (in pixels)',
            },
            width: {
              type: 'number',
              description: 'Width of the tile in pixels',
            },
            height: {
              type: 'number',
              description: 'Height of the tile in pixels',
            },
            rotation: {
              type: 'number',
              description: 'Rotation in degrees (0-360)',
              default: 0,
            },
            hidden: {
              type: 'boolean',
              description: 'Whether the tile is hidden from players',
              default: false,
            },
            overhead: {
              type: 'boolean',
              description: 'Whether this is an overhead tile (renders above tokens)',
              default: false,
            },
            z: {
              type: 'number',
              description: 'Z-index for layering tiles (higher = on top)',
              default: 100,
            },
          },
          required: ['textureSrc', 'x', 'y', 'width', 'height'],
        },
      },
      {
        name: 'move-tile',
        description: 'Move a tile to a new position on the current scene.',
        inputSchema: {
          type: 'object',
          properties: {
            tileId: {
              type: 'string',
              description: 'The ID of the tile to move',
            },
            x: {
              type: 'number',
              description: 'The new X coordinate (in pixels)',
            },
            y: {
              type: 'number',
              description: 'The new Y coordinate (in pixels)',
            },
          },
          required: ['tileId', 'x', 'y'],
        },
      },
      {
        name: 'update-tile',
        description: 'Update properties of an existing tile such as size, rotation, visibility, or texture.',
        inputSchema: {
          type: 'object',
          properties: {
            tileId: {
              type: 'string',
              description: 'The ID of the tile to update',
            },
            updates: {
              type: 'object',
              description: 'Object containing the properties to update',
              properties: {
                x: {
                  type: 'number',
                  description: 'New X coordinate',
                },
                y: {
                  type: 'number',
                  description: 'New Y coordinate',
                },
                width: {
                  type: 'number',
                  description: 'New width in pixels',
                },
                height: {
                  type: 'number',
                  description: 'New height in pixels',
                },
                rotation: {
                  type: 'number',
                  description: 'New rotation in degrees (0-360)',
                },
                hidden: {
                  type: 'boolean',
                  description: 'Whether the tile is hidden from players',
                },
                overhead: {
                  type: 'boolean',
                  description: 'Whether this is an overhead tile',
                },
                z: {
                  type: 'number',
                  description: 'Z-index for layering',
                },
                textureSrc: {
                  type: 'string',
                  description: 'New texture/image path',
                },
              },
            },
          },
          required: ['tileId', 'updates'],
        },
      },
      {
        name: 'delete-tiles',
        description: 'Delete one or more tiles from the current scene.',
        inputSchema: {
          type: 'object',
          properties: {
            tileIds: {
              type: 'array',
              description: 'Array of tile IDs to delete',
              items: {
                type: 'string',
              },
              minItems: 1,
            },
          },
          required: ['tileIds'],
        },
      },
      {
        name: 'list-tiles',
        description: 'List all tiles on the current scene with their properties.',
        inputSchema: {
          type: 'object',
          properties: {
            includeHidden: {
              type: 'boolean',
              description: 'Whether to include hidden tiles (default: true)',
              default: true,
            },
          },
        },
      },
      {
        name: 'get-tile-details',
        description: 'Get detailed information about a specific tile.',
        inputSchema: {
          type: 'object',
          properties: {
            tileId: {
              type: 'string',
              description: 'The ID of the tile to get details for',
            },
          },
          required: ['tileId'],
        },
      },
    ];
  }

  async handleCreateTile(args: any): Promise<any> {
    const schema = z.object({
      textureSrc: z.string(),
      x: z.number(),
      y: z.number(),
      width: z.number().positive(),
      height: z.number().positive(),
      rotation: z.number().min(0).max(360).optional().default(0),
      hidden: z.boolean().optional().default(false),
      overhead: z.boolean().optional().default(false),
      z: z.number().optional().default(100),
    });

    const tileData = schema.parse(args);

    this.logger.info('Creating tile', tileData);

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.createTile', tileData);

      this.logger.debug('Tile created successfully', { tileId: result.tileId });

      return {
        success: true,
        tileId: result.tileId,
        position: { x: tileData.x, y: tileData.y },
        size: { width: tileData.width, height: tileData.height },
      };

    } catch (error) {
      this.logger.error('Failed to create tile', error);
      throw new Error(`Failed to create tile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleMoveTile(args: any): Promise<any> {
    const schema = z.object({
      tileId: z.string(),
      x: z.number(),
      y: z.number(),
    });

    const { tileId, x, y } = schema.parse(args);

    this.logger.info('Moving tile', { tileId, x, y });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.moveTile', {
        tileId,
        x,
        y,
      });

      this.logger.debug('Tile moved successfully', { tileId });

      return {
        success: true,
        tileId,
        newPosition: { x, y },
      };

    } catch (error) {
      this.logger.error('Failed to move tile', error);
      throw new Error(`Failed to move tile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleUpdateTile(args: any): Promise<any> {
    const schema = z.object({
      tileId: z.string(),
      updates: z.object({
        x: z.number().optional(),
        y: z.number().optional(),
        width: z.number().positive().optional(),
        height: z.number().positive().optional(),
        rotation: z.number().min(0).max(360).optional(),
        hidden: z.boolean().optional(),
        overhead: z.boolean().optional(),
        z: z.number().optional(),
        textureSrc: z.string().optional(),
      }),
    });

    const { tileId, updates } = schema.parse(args);

    this.logger.info('Updating tile', { tileId, updates });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.updateTile', {
        tileId,
        updates,
      });

      this.logger.debug('Tile updated successfully', { tileId, result });

      return {
        success: true,
        tileId,
        updated: true,
        appliedUpdates: updates,
      };

    } catch (error) {
      this.logger.error('Failed to update tile', error);
      throw new Error(`Failed to update tile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleDeleteTiles(args: any): Promise<any> {
    const schema = z.object({
      tileIds: z.array(z.string()).min(1),
    });

    const { tileIds } = schema.parse(args);

    this.logger.info('Deleting tiles', { count: tileIds.length, tileIds });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.deleteTiles', {
        tileIds,
      });

      this.logger.debug('Tiles deleted successfully', {
        deleted: result.deletedCount,
        requested: tileIds.length,
      });

      return {
        success: result.success,
        deletedCount: result.deletedCount,
        tileIds: result.tileIds,
        errors: result.errors,
      };

    } catch (error) {
      this.logger.error('Failed to delete tiles', error);
      throw new Error(`Failed to delete tiles: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleListTiles(args: any): Promise<any> {
    const schema = z.object({
      includeHidden: z.boolean().optional().default(true),
    });

    const { includeHidden } = schema.parse(args);

    this.logger.info('Listing tiles', { includeHidden });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.listTiles', {
        includeHidden,
      });

      this.logger.debug('Retrieved tile list', { count: result.tiles?.length });

      return {
        success: true,
        tiles: result.tiles,
        totalCount: result.tiles?.length || 0,
      };

    } catch (error) {
      this.logger.error('Failed to list tiles', error);
      throw new Error(`Failed to list tiles: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleGetTileDetails(args: any): Promise<any> {
    const schema = z.object({
      tileId: z.string(),
    });

    const { tileId } = schema.parse(args);

    this.logger.info('Getting tile details', { tileId });

    try {
      const tileData = await this.foundryClient.query('foundry-mcp-bridge.getTileDetails', {
        tileId,
      });

      this.logger.debug('Retrieved tile details', { tileId });

      return this.formatTileDetails(tileData);

    } catch (error) {
      this.logger.error('Failed to get tile details', error);
      throw new Error(`Failed to get tile details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private formatTileDetails(tileData: any): any {
    return {
      id: tileData.id,
      position: {
        x: tileData.x,
        y: tileData.y,
      },
      size: {
        width: tileData.width,
        height: tileData.height,
      },
      appearance: {
        rotation: tileData.rotation,
        hidden: tileData.hidden,
        overhead: tileData.overhead,
        z: tileData.z,
        textureSrc: tileData.texture?.src || tileData.textureSrc,
      },
      occlusion: tileData.occlusion,
    };
  }
}
