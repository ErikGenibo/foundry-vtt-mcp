import { z } from 'zod';
import { FoundryClient } from '../foundry-client.js';
import { Logger } from '../logger.js';

export interface AudioToolsOptions {
  foundryClient: FoundryClient;
  logger: Logger;
}

export class AudioTools {
  private foundryClient: FoundryClient;
  private logger: Logger;

  constructor({ foundryClient, logger }: AudioToolsOptions) {
    this.foundryClient = foundryClient;
    this.logger = logger.child({ component: 'AudioTools' });
  }

  getToolDefinitions() {
    return [
      {
        name: 'list-playlists',
        description: 'List all playlists in the world with their sounds/tracks.',
        inputSchema: {
          type: 'object',
          properties: {
            includeHidden: {
              type: 'boolean',
              description: 'Include hidden playlists (default: false)',
              default: false,
            },
          },
        },
      },
      {
        name: 'play-playlist',
        description: 'Start playing a playlist. Can play the whole playlist or a specific sound within it.',
        inputSchema: {
          type: 'object',
          properties: {
            playlistId: {
              type: 'string',
              description: 'Playlist ID or name',
            },
            soundId: {
              type: 'string',
              description: 'Optional: specific sound ID or name within the playlist to play',
            },
            fade: {
              type: 'number',
              description: 'Fade-in duration in milliseconds (default: 0)',
              default: 0,
            },
          },
          required: ['playlistId'],
        },
      },
      {
        name: 'stop-playlist',
        description: 'Stop a playing playlist or specific sound.',
        inputSchema: {
          type: 'object',
          properties: {
            playlistId: {
              type: 'string',
              description: 'Playlist ID or name to stop. Use "all" to stop all playlists.',
            },
            soundId: {
              type: 'string',
              description: 'Optional: specific sound ID or name to stop',
            },
            fade: {
              type: 'number',
              description: 'Fade-out duration in milliseconds (default: 0)',
              default: 0,
            },
          },
          required: ['playlistId'],
        },
      },
      {
        name: 'set-playlist-volume',
        description: 'Set the volume for a playlist or specific sound.',
        inputSchema: {
          type: 'object',
          properties: {
            playlistId: {
              type: 'string',
              description: 'Playlist ID or name',
            },
            soundId: {
              type: 'string',
              description: 'Optional: specific sound ID or name',
            },
            volume: {
              type: 'number',
              description: 'Volume level from 0.0 (silent) to 1.0 (full)',
              minimum: 0,
              maximum: 1,
            },
          },
          required: ['playlistId', 'volume'],
        },
      },
      {
        name: 'get-playing-audio',
        description: 'Get information about currently playing audio.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ];
  }

  async handleListPlaylists(args: any): Promise<any> {
    const schema = z.object({
      includeHidden: z.boolean().optional().default(false),
    });

    const parsed = schema.parse(args);
    this.logger.info('Listing playlists', { includeHidden: parsed.includeHidden });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.listPlaylists', {
        includeHidden: parsed.includeHidden,
      });

      return {
        success: true,
        playlists: result.playlists,
        count: result.playlists.length,
      };
    } catch (error) {
      this.logger.error('Failed to list playlists', error);
      throw new Error(`Failed to list playlists: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handlePlayPlaylist(args: any): Promise<any> {
    const schema = z.object({
      playlistId: z.string(),
      soundId: z.string().optional(),
      fade: z.number().optional().default(0),
    });

    const parsed = schema.parse(args);
    this.logger.info('Playing playlist', { playlistId: parsed.playlistId, soundId: parsed.soundId });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.playPlaylist', {
        playlistId: parsed.playlistId,
        soundId: parsed.soundId,
        fade: parsed.fade,
      });

      return {
        success: true,
        playlistName: result.playlistName,
        soundName: result.soundName,
        message: result.soundName
          ? `Now playing "${result.soundName}" from "${result.playlistName}"`
          : `Now playing playlist "${result.playlistName}"`,
      };
    } catch (error) {
      this.logger.error('Failed to play playlist', error);
      throw new Error(`Failed to play playlist: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleStopPlaylist(args: any): Promise<any> {
    const schema = z.object({
      playlistId: z.string(),
      soundId: z.string().optional(),
      fade: z.number().optional().default(0),
    });

    const parsed = schema.parse(args);
    this.logger.info('Stopping playlist', { playlistId: parsed.playlistId });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.stopPlaylist', {
        playlistId: parsed.playlistId,
        soundId: parsed.soundId,
        fade: parsed.fade,
      });

      return {
        success: true,
        stopped: result.stopped,
        message: parsed.playlistId === 'all'
          ? 'Stopped all playlists'
          : `Stopped ${result.playlistName || parsed.playlistId}`,
      };
    } catch (error) {
      this.logger.error('Failed to stop playlist', error);
      throw new Error(`Failed to stop playlist: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleSetPlaylistVolume(args: any): Promise<any> {
    const schema = z.object({
      playlistId: z.string(),
      soundId: z.string().optional(),
      volume: z.number().min(0).max(1),
    });

    const parsed = schema.parse(args);
    this.logger.info('Setting playlist volume', { playlistId: parsed.playlistId, volume: parsed.volume });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.setPlaylistVolume', {
        playlistId: parsed.playlistId,
        soundId: parsed.soundId,
        volume: parsed.volume,
      });

      return {
        success: true,
        playlistName: result.playlistName,
        volume: parsed.volume,
        message: `Set volume to ${Math.round(parsed.volume * 100)}%`,
      };
    } catch (error) {
      this.logger.error('Failed to set playlist volume', error);
      throw new Error(`Failed to set playlist volume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleGetPlayingAudio(args: any): Promise<any> {
    this.logger.info('Getting playing audio');

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.getPlayingAudio', {});

      return {
        success: true,
        playing: result.playing,
        count: result.playing.length,
      };
    } catch (error) {
      this.logger.error('Failed to get playing audio', error);
      throw new Error(`Failed to get playing audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
