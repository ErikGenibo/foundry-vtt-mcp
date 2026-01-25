import { z } from 'zod';
import { FoundryClient } from '../foundry-client.js';
import { Logger } from '../logger.js';

export interface CombatManagementToolsOptions {
  foundryClient: FoundryClient;
  logger: Logger;
}

export class CombatManagementTools {
  private foundryClient: FoundryClient;
  private logger: Logger;

  constructor({ foundryClient, logger }: CombatManagementToolsOptions) {
    this.foundryClient = foundryClient;
    this.logger = logger.child({ component: 'CombatManagementTools' });
  }

  /**
   * Tool definitions for combat management operations
   */
  getToolDefinitions() {
    return [
      {
        name: 'create-combat',
        description: 'Create a new combat encounter in the current or specified scene. Returns the combat ID for use with other combat tools.',
        inputSchema: {
          type: 'object',
          properties: {
            sceneId: {
              type: 'string',
              description: 'Optional scene ID. If not provided, uses the currently active scene.',
            },
            activate: {
              type: 'boolean',
              description: 'Whether to immediately activate (start) the combat (default: false)',
              default: false,
            },
          },
        },
      },
      {
        name: 'get-combat-state',
        description: 'Get the current state of the active combat encounter, including all combatants, their initiative, HP, and conditions.',
        inputSchema: {
          type: 'object',
          properties: {
            combatId: {
              type: 'string',
              description: 'Optional combat ID. If not provided, uses the currently active combat.',
            },
          },
        },
      },
      {
        name: 'add-combatants',
        description: 'Add tokens to the combat encounter. Tokens must exist on the current scene.',
        inputSchema: {
          type: 'object',
          properties: {
            combatId: {
              type: 'string',
              description: 'Optional combat ID. If not provided, uses the currently active combat.',
            },
            tokenIds: {
              type: 'array',
              description: 'Array of token IDs to add to combat',
              items: {
                type: 'string',
              },
              minItems: 1,
            },
          },
          required: ['tokenIds'],
        },
      },
      {
        name: 'remove-combatants',
        description: 'Remove combatants from the combat encounter.',
        inputSchema: {
          type: 'object',
          properties: {
            combatId: {
              type: 'string',
              description: 'Optional combat ID. If not provided, uses the currently active combat.',
            },
            combatantIds: {
              type: 'array',
              description: 'Array of combatant IDs to remove from combat',
              items: {
                type: 'string',
              },
              minItems: 1,
            },
          },
          required: ['combatantIds'],
        },
      },
      {
        name: 'roll-initiative',
        description: 'Roll initiative for combatants. Can roll for all, only NPCs, or specific combatants.',
        inputSchema: {
          type: 'object',
          properties: {
            combatId: {
              type: 'string',
              description: 'Optional combat ID. If not provided, uses the currently active combat.',
            },
            rollFor: {
              type: 'string',
              enum: ['all', 'npcs', 'specific'],
              description: 'Who to roll initiative for: "all" combatants, only "npcs", or "specific" combatants (requires combatantIds)',
              default: 'all',
            },
            combatantIds: {
              type: 'array',
              description: 'Specific combatant IDs to roll for (only used when rollFor is "specific")',
              items: {
                type: 'string',
              },
            },
            formula: {
              type: 'string',
              description: 'Optional custom initiative formula (e.g., "1d20+5"). If not provided, uses each combatant\'s default.',
            },
          },
        },
      },
      {
        name: 'set-initiative',
        description: 'Manually set the initiative value for a specific combatant.',
        inputSchema: {
          type: 'object',
          properties: {
            combatId: {
              type: 'string',
              description: 'Optional combat ID. If not provided, uses the currently active combat.',
            },
            combatantId: {
              type: 'string',
              description: 'The combatant ID to set initiative for',
            },
            initiative: {
              type: 'number',
              description: 'The initiative value to set',
            },
          },
          required: ['combatantId', 'initiative'],
        },
      },
      {
        name: 'start-combat',
        description: 'Start the combat encounter, activating it and beginning round 1.',
        inputSchema: {
          type: 'object',
          properties: {
            combatId: {
              type: 'string',
              description: 'Optional combat ID. If not provided, uses the currently active combat.',
            },
          },
        },
      },
      {
        name: 'next-turn',
        description: 'Advance to the next combatant\'s turn. Automatically advances the round when all combatants have acted.',
        inputSchema: {
          type: 'object',
          properties: {
            combatId: {
              type: 'string',
              description: 'Optional combat ID. If not provided, uses the currently active combat.',
            },
          },
        },
      },
      {
        name: 'previous-turn',
        description: 'Go back to the previous combatant\'s turn.',
        inputSchema: {
          type: 'object',
          properties: {
            combatId: {
              type: 'string',
              description: 'Optional combat ID. If not provided, uses the currently active combat.',
            },
          },
        },
      },
      {
        name: 'end-combat',
        description: 'End and delete the combat encounter.',
        inputSchema: {
          type: 'object',
          properties: {
            combatId: {
              type: 'string',
              description: 'Optional combat ID. If not provided, uses the currently active combat.',
            },
          },
        },
      },
      {
        name: 'apply-damage',
        description: 'Apply damage or healing to a token/actor. Use positive numbers for damage, negative for healing.',
        inputSchema: {
          type: 'object',
          properties: {
            targetId: {
              type: 'string',
              description: 'Token ID or Actor ID to apply damage to',
            },
            amount: {
              type: 'number',
              description: 'Amount of damage (positive) or healing (negative) to apply',
            },
            damageType: {
              type: 'string',
              description: 'Optional damage type for systems that track it (e.g., "fire", "slashing", "psychic")',
            },
            bypassResistance: {
              type: 'boolean',
              description: 'Whether to bypass damage resistance/immunity (default: false)',
              default: false,
            },
          },
          required: ['targetId', 'amount'],
        },
      },
      {
        name: 'apply-temp-hp',
        description: 'Set temporary hit points for a token/actor.',
        inputSchema: {
          type: 'object',
          properties: {
            targetId: {
              type: 'string',
              description: 'Token ID or Actor ID to apply temp HP to',
            },
            amount: {
              type: 'number',
              description: 'Amount of temporary HP to set (replaces existing temp HP if higher)',
              minimum: 0,
            },
          },
          required: ['targetId', 'amount'],
        },
      },
      {
        name: 'list-combats',
        description: 'List all combat encounters in the world, showing which is active.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'set-active-combat',
        description: 'Set a specific combat as the active combat encounter.',
        inputSchema: {
          type: 'object',
          properties: {
            combatId: {
              type: 'string',
              description: 'The combat ID to make active',
            },
          },
          required: ['combatId'],
        },
      },
    ];
  }

  // ============================================
  // Tool Handlers
  // ============================================

  async handleCreateCombat(args: any): Promise<any> {
    const schema = z.object({
      sceneId: z.string().optional(),
      activate: z.boolean().optional().default(false),
    });

    const { sceneId, activate } = schema.parse(args);

    this.logger.info('Creating combat', { sceneId, activate });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.createCombat', {
        sceneId,
        activate,
      });

      this.logger.debug('Combat created successfully', { combatId: result.combatId });

      return {
        success: true,
        combatId: result.combatId,
        sceneName: result.sceneName,
        active: result.active,
        message: `Combat encounter created${activate ? ' and started' : ''}`,
      };

    } catch (error) {
      this.logger.error('Failed to create combat', error);
      throw new Error(`Failed to create combat: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleGetCombatState(args: any): Promise<any> {
    const schema = z.object({
      combatId: z.string().optional(),
    });

    const { combatId } = schema.parse(args);

    this.logger.info('Getting combat state', { combatId });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.getCombatState', {
        combatId,
      });

      if (!result.combat) {
        return {
          success: false,
          message: 'No active combat found',
        };
      }

      return {
        success: true,
        combat: this.formatCombatState(result.combat),
      };

    } catch (error) {
      this.logger.error('Failed to get combat state', error);
      throw new Error(`Failed to get combat state: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleAddCombatants(args: any): Promise<any> {
    const schema = z.object({
      combatId: z.string().optional(),
      tokenIds: z.array(z.string()).min(1),
    });

    const { combatId, tokenIds } = schema.parse(args);

    this.logger.info('Adding combatants', { combatId, tokenCount: tokenIds.length });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.addCombatants', {
        combatId,
        tokenIds,
      });

      this.logger.debug('Combatants added', { added: result.added });

      return {
        success: true,
        added: result.added,
        combatants: result.combatants,
        message: `Added ${result.added} combatant(s) to combat`,
      };

    } catch (error) {
      this.logger.error('Failed to add combatants', error);
      throw new Error(`Failed to add combatants: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleRemoveCombatants(args: any): Promise<any> {
    const schema = z.object({
      combatId: z.string().optional(),
      combatantIds: z.array(z.string()).min(1),
    });

    const { combatId, combatantIds } = schema.parse(args);

    this.logger.info('Removing combatants', { combatId, count: combatantIds.length });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.removeCombatants', {
        combatId,
        combatantIds,
      });

      return {
        success: true,
        removed: result.removed,
        message: `Removed ${result.removed} combatant(s) from combat`,
      };

    } catch (error) {
      this.logger.error('Failed to remove combatants', error);
      throw new Error(`Failed to remove combatants: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleRollInitiative(args: any): Promise<any> {
    const schema = z.object({
      combatId: z.string().optional(),
      rollFor: z.enum(['all', 'npcs', 'specific']).optional().default('all'),
      combatantIds: z.array(z.string()).optional(),
      formula: z.string().optional(),
    });

    const { combatId, rollFor, combatantIds, formula } = schema.parse(args);

    if (rollFor === 'specific' && (!combatantIds || combatantIds.length === 0)) {
      throw new Error('combatantIds required when rollFor is "specific"');
    }

    this.logger.info('Rolling initiative', { combatId, rollFor, combatantIds, formula });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.rollInitiative', {
        combatId,
        rollFor,
        combatantIds,
        formula,
      });

      return {
        success: true,
        rolled: result.rolled,
        results: result.results,
        message: `Rolled initiative for ${result.rolled} combatant(s)`,
      };

    } catch (error) {
      this.logger.error('Failed to roll initiative', error);
      throw new Error(`Failed to roll initiative: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleSetInitiative(args: any): Promise<any> {
    const schema = z.object({
      combatId: z.string().optional(),
      combatantId: z.string(),
      initiative: z.number(),
    });

    const { combatId, combatantId, initiative } = schema.parse(args);

    this.logger.info('Setting initiative', { combatId, combatantId, initiative });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.setInitiative', {
        combatId,
        combatantId,
        initiative,
      });

      return {
        success: true,
        combatantName: result.combatantName,
        initiative: result.initiative,
        message: `Set ${result.combatantName}'s initiative to ${initiative}`,
      };

    } catch (error) {
      this.logger.error('Failed to set initiative', error);
      throw new Error(`Failed to set initiative: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleStartCombat(args: any): Promise<any> {
    const schema = z.object({
      combatId: z.string().optional(),
    });

    const { combatId } = schema.parse(args);

    this.logger.info('Starting combat', { combatId });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.startCombat', {
        combatId,
      });

      return {
        success: true,
        round: result.round,
        turn: result.turn,
        currentCombatant: result.currentCombatant,
        message: `Combat started! Round ${result.round}, ${result.currentCombatant}'s turn`,
      };

    } catch (error) {
      this.logger.error('Failed to start combat', error);
      throw new Error(`Failed to start combat: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleNextTurn(args: any): Promise<any> {
    const schema = z.object({
      combatId: z.string().optional(),
    });

    const { combatId } = schema.parse(args);

    this.logger.info('Advancing to next turn', { combatId });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.nextTurn', {
        combatId,
      });

      return {
        success: true,
        round: result.round,
        turn: result.turn,
        currentCombatant: result.currentCombatant,
        newRound: result.newRound,
        message: result.newRound
          ? `New round ${result.round}! ${result.currentCombatant}'s turn`
          : `${result.currentCombatant}'s turn`,
      };

    } catch (error) {
      this.logger.error('Failed to advance turn', error);
      throw new Error(`Failed to advance turn: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handlePreviousTurn(args: any): Promise<any> {
    const schema = z.object({
      combatId: z.string().optional(),
    });

    const { combatId } = schema.parse(args);

    this.logger.info('Going to previous turn', { combatId });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.previousTurn', {
        combatId,
      });

      return {
        success: true,
        round: result.round,
        turn: result.turn,
        currentCombatant: result.currentCombatant,
        message: `Back to ${result.currentCombatant}'s turn (Round ${result.round})`,
      };

    } catch (error) {
      this.logger.error('Failed to go to previous turn', error);
      throw new Error(`Failed to go to previous turn: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleEndCombat(args: any): Promise<any> {
    const schema = z.object({
      combatId: z.string().optional(),
    });

    const { combatId } = schema.parse(args);

    this.logger.info('Ending combat', { combatId });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.endCombat', {
        combatId,
      });

      return {
        success: true,
        message: 'Combat encounter ended',
        finalRound: result.finalRound,
      };

    } catch (error) {
      this.logger.error('Failed to end combat', error);
      throw new Error(`Failed to end combat: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleApplyDamage(args: any): Promise<any> {
    const schema = z.object({
      targetId: z.string(),
      amount: z.number(),
      damageType: z.string().optional(),
      bypassResistance: z.boolean().optional().default(false),
    });

    const { targetId, amount, damageType, bypassResistance } = schema.parse(args);

    const isHealing = amount < 0;
    this.logger.info(isHealing ? 'Applying healing' : 'Applying damage', {
      targetId,
      amount: Math.abs(amount),
      damageType,
      bypassResistance,
    });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.applyDamage', {
        targetId,
        amount,
        damageType,
        bypassResistance,
      });

      const verb = isHealing ? 'healed' : 'damaged';
      return {
        success: true,
        targetName: result.targetName,
        previousHp: result.previousHp,
        currentHp: result.currentHp,
        maxHp: result.maxHp,
        applied: result.applied,
        message: `${result.targetName} ${verb} for ${Math.abs(result.applied)} HP (${result.currentHp}/${result.maxHp})`,
      };

    } catch (error) {
      this.logger.error('Failed to apply damage', error);
      throw new Error(`Failed to apply damage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleApplyTempHp(args: any): Promise<any> {
    const schema = z.object({
      targetId: z.string(),
      amount: z.number().min(0),
    });

    const { targetId, amount } = schema.parse(args);

    this.logger.info('Applying temporary HP', { targetId, amount });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.applyTempHp', {
        targetId,
        amount,
      });

      return {
        success: true,
        targetName: result.targetName,
        previousTempHp: result.previousTempHp,
        currentTempHp: result.currentTempHp,
        message: `${result.targetName} now has ${result.currentTempHp} temporary HP`,
      };

    } catch (error) {
      this.logger.error('Failed to apply temp HP', error);
      throw new Error(`Failed to apply temp HP: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleListCombats(args: any): Promise<any> {
    this.logger.info('Listing combats');

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.listCombats', {});

      return {
        success: true,
        activeCombatId: result.activeCombatId,
        combats: result.combats,
        count: result.combats.length,
      };

    } catch (error) {
      this.logger.error('Failed to list combats', error);
      throw new Error(`Failed to list combats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleSetActiveCombat(args: any): Promise<any> {
    const schema = z.object({
      combatId: z.string(),
    });

    const { combatId } = schema.parse(args);

    this.logger.info('Setting active combat', { combatId });

    try {
      const result = await this.foundryClient.query('foundry-mcp-bridge.setActiveCombat', {
        combatId,
      });

      return {
        success: true,
        combatId: result.combatId,
        message: 'Combat set as active',
      };

    } catch (error) {
      this.logger.error('Failed to set active combat', error);
      throw new Error(`Failed to set active combat: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ============================================
  // Helper Methods
  // ============================================

  private formatCombatState(combat: any): any {
    return {
      id: combat.id,
      round: combat.round,
      turn: combat.turn,
      started: combat.started,
      active: combat.active,
      sceneName: combat.sceneName,
      currentCombatant: combat.currentCombatant ? {
        id: combat.currentCombatant.id,
        name: combat.currentCombatant.name,
        initiative: combat.currentCombatant.initiative,
      } : null,
      combatants: combat.combatants.map((c: any) => ({
        id: c.id,
        name: c.name,
        tokenId: c.tokenId,
        actorId: c.actorId,
        initiative: c.initiative,
        isNpc: c.isNpc,
        isDefeated: c.isDefeated,
        isVisible: c.isVisible,
        hp: c.hp ? {
          current: c.hp.current,
          max: c.hp.max,
          temp: c.hp.temp,
          percentage: Math.round((c.hp.current / c.hp.max) * 100),
        } : null,
        conditions: c.conditions || [],
        disposition: this.getDispositionName(c.disposition),
      })),
      turnOrder: combat.turnOrder,
    };
  }

  private getDispositionName(disposition: number): string {
    switch (disposition) {
      case -1:
        return 'hostile';
      case 0:
        return 'neutral';
      case 1:
        return 'friendly';
      default:
        return 'unknown';
    }
  }
}
