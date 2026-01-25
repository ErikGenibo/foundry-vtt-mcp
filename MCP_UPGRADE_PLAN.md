# Foundry MCP Comprehensive Upgrade Plan

## Executive Summary

Your current MCP is **well-designed and feature-rich** (41 tools). The architecture is sound. Rather than replacing it, we should extend it to cover the missing Foundry capabilities.

**Key finding:** The external modules (Integrate AI, PF2e AI Combat Assistant) solve different problems:
- **Integrate AI** = Simple API wrapper for local LLMs in Foundry chat (not useful - you already have Claude via MCP)
- **PF2e AI Combat Assistant** = Uses LLM to suggest tactical moves (useful concepts to borrow, but PF2e-specific)

---

## What You Already Have

### Current Features (Screenshots Explained)

| Feature | What It Does |
|---------|-------------|
| **Enhanced Creature Index** | Pre-computes creature metadata (CR, type, traits) for instant filtering without loading every compendium entry. System-specific builders for D&D 5e, PF2e, DSA5. |
| **Map Generation Service** | ComfyUI backend for AI-generated battlemaps (SDXL model). Runs locally, no API costs. |
| **Enable MCP Bridge** | Master toggle for the Claude connection |
| **WebSocket (Local Only)** | Direct localhost connection (vs WebRTC for remote) |

### Current Tool Coverage

```
Characters     [==========] Full coverage
Compendiums    [==========] Full coverage
Scenes         [======    ] Basic (missing walls, lights, sounds)
Tokens         [========  ] Good (has conditions, movement)
Tiles          [==========] Full coverage
Journals       [==========] Full coverage (quests, dashboards)
Dice           [====      ] Basic (player rolls only)
Ownership      [==========] Full coverage
AI Generation  [==========] Maps + Token art
COMBAT         [          ] MISSING - Critical gap
Chat           [          ] MISSING - High value
Audio          [          ] MISSING - Atmosphere
Tables         [          ] MISSING - Random content
Effects        [          ] MISSING - Combat buffs
Scene Building [          ] MISSING - Walls/Lights
```

---

## The Missing Capabilities

### Tier 1: Critical (Live Session Support)

| Feature | Foundry API | Use Case | Complexity |
|---------|-------------|----------|------------|
| **Combat Management** | `game.combat`, `Combat.create()` | Create/run encounters, initiative, turns | Medium |
| **Combat Damage** | `actor.update()` on HP | Track damage/healing during fights | Low |
| **Chat Messages** | `ChatMessage.create()` | Speak as NPCs, announce events | Low |
| **Active Effects** | `ActiveEffect.create()` | Apply buffs, debuffs, conditions to actors | Medium |

### Tier 2: High Value (Session Enhancement)

| Feature | Foundry API | Use Case | Complexity |
|---------|-------------|----------|------------|
| **Rollable Tables** | `RollTable.draw()` | Random loot, encounters, NPC traits | Low |
| **Macros** | `Macro.execute()` | Trigger complex automation | Low |
| **Playlists** | `Playlist.playSound()` | Control ambient music/sounds | Low |
| **Measured Templates** | `MeasuredTemplate.create()` | Show spell AoE on map | Medium |

### Tier 3: Scene Building

| Feature | Foundry API | Use Case | Complexity |
|---------|-------------|----------|------------|
| **Walls** | `WallDocument.create()` | Build dungeon walls, doors | Medium |
| **Ambient Lights** | `AmbientLight.create()` | Dynamic lighting | Medium |
| **Ambient Sounds** | `AmbientSound.create()` | Positional audio | Low |
| **Drawings** | `Drawing.create()` | Tactical markers, annotations | Low |
| **Notes** | `Note.create()` | Map pins linked to journals | Low |

### Tier 4: Advanced (v13 Features)

| Feature | Foundry API | Use Case | Complexity |
|---------|-------------|----------|------------|
| **Regions** | `Region.create()` | Trigger zones (enter area → event) | High |
| **Fog Control** | `canvas.fog.reveal()` | Show/hide map areas | Medium |
| **Cards/Decks** | `Cards.draw()` | Card-based mechanics | Medium |

---

## Implementation Plan

### Phase 1: Combat Core (Highest Priority)

**Goal:** Enable running encounters through Claude

#### New Tools to Add:

```typescript
// combat-management.ts

// 1. Create Combat
'create-combat'
- Creates a new combat encounter
- Optional: specify scene

// 2. Add Combatants
'add-combatants'
- Add tokens/actors to combat
- Returns initiative order

// 3. Roll Initiative
'roll-initiative'
- Roll for all or specific combatants
- Option: roll for NPCs only

// 4. Combat Control
'next-turn' / 'previous-turn'
- Advance combat tracker

'start-combat' / 'end-combat'
- Begin/conclude encounter

// 5. Combat State
'get-combat-state'
- Current turn, round, all combatants
- HP, conditions, initiative values

// 6. Apply Damage/Healing
'apply-damage'
- Target: token or actor
- Amount: number (negative = healing)
- Type: optional damage type
```

#### Foundry Module Changes:

```typescript
// queries.ts - Add handlers:
CONFIG.queries[`${modulePrefix}.createCombat`] = this.handleCreateCombat.bind(this);
CONFIG.queries[`${modulePrefix}.addCombatants`] = this.handleAddCombatants.bind(this);
CONFIG.queries[`${modulePrefix}.rollInitiative`] = this.handleRollInitiative.bind(this);
CONFIG.queries[`${modulePrefix}.nextTurn`] = this.handleNextTurn.bind(this);
CONFIG.queries[`${modulePrefix}.getCombatState`] = this.handleGetCombatState.bind(this);
CONFIG.queries[`${modulePrefix}.applyDamage`] = this.handleApplyDamage.bind(this);

// data-access.ts - Add implementations:
async createCombat(sceneId?: string): Promise<any> {
  const scene = sceneId ? game.scenes.get(sceneId) : game.scenes.active;
  const combat = await Combat.create({ scene: scene.id });
  return { id: combat.id, scene: scene.name };
}

async addCombatants(combatId: string, tokenIds: string[]): Promise<any> {
  const combat = game.combats.get(combatId);
  const combatants = tokenIds.map(id => ({ tokenId: id }));
  await combat.createEmbeddedDocuments('Combatant', combatants);
  return { added: tokenIds.length };
}

async nextTurn(): Promise<any> {
  await game.combat?.nextTurn();
  return {
    round: game.combat.round,
    turn: game.combat.turn,
    current: game.combat.combatant?.name
  };
}
```

---

### Phase 2: Chat & Communication

**Goal:** Claude can speak as NPCs and announce events

#### New Tools:

```typescript
// chat-tools.ts

'send-chat-message'
- speaker: { alias: "NPC Name", token?: tokenId, actor?: actorId }
- content: string (supports Foundry enriched HTML)
- whisper: optional array of user IDs for private messages
- type: IC (in-character), OOC (out-of-character), EMOTE, ROLL

'get-chat-history'
- limit: number of recent messages
- filter: optional speaker or type filter
```

#### Example Use:

```
User: "Have the shopkeeper greet the party"
Claude: [Uses send-chat-message with speaker: {alias: "Garrick the Smith"}]
→ Chat shows: Garrick the Smith: "Welcome, travelers! What can I forge for you today?"
```

---

### Phase 3: Active Effects

**Goal:** Apply buffs, debuffs, and temporary conditions to actors

#### New Tools:

```typescript
'create-effect'
- actorId or tokenId: target
- effectData: {
    name: string,
    icon: string,
    duration: { rounds?, turns?, seconds? },
    changes: [ // Foundry effect changes
      { key: "system.attributes.ac.bonus", mode: 2, value: "2" }
    ]
  }

'remove-effect'
- actorId: string
- effectId or effectName: string

'list-effects'
- actorId: string
- Returns active effects with remaining duration
```

---

### Phase 4: Atmosphere & Audio

**Goal:** Control music and ambient sounds

#### New Tools:

```typescript
'list-playlists'
- Returns all playlists with their sounds

'play-sound'
- playlistId: string
- soundId: string (or soundName for fuzzy match)
- Options: { fade: number, loop: boolean }

'stop-playlist' / 'stop-all-audio'

'set-global-volume'
- volume: 0.0 to 1.0
```

---

### Phase 5: Random Tables

**Goal:** Roll on tables for loot, encounters, events

#### New Tools:

```typescript
'list-tables'
- Returns all rollable tables

'roll-table'
- tableId or tableName: string
- displayChat: boolean (show result to players?)
- Returns: drawn result with text and any linked items

'create-table' (optional)
- name: string
- results: array of { text, weight, range }
```

---

### Phase 6: Scene Building Tools

**Goal:** Create dungeon layouts dynamically

#### New Tools:

```typescript
'create-wall'
- points: [[x1,y1], [x2,y2]]
- door: boolean
- move/sight/sound: wall restriction types

'create-light'
- x, y: position
- dim, bright: radius values
- color: hex color
- animation: { type, speed, intensity }

'create-sound'
- x, y: position
- path: audio file path
- radius: audible range
- volume: 0.0 to 1.0

'create-template'
- type: 'circle' | 'cone' | 'ray' | 'rect'
- x, y: origin
- distance: size
- direction: angle (for cones/rays)
- Optional: color, texture
```

---

### Phase 7: Macro Execution

**Goal:** Trigger existing macros for complex actions

#### New Tools:

```typescript
'list-macros'
- Returns available macros with descriptions

'execute-macro'
- macroId or macroName: string
- args: optional object passed to macro

'create-macro' (advanced)
- name, type ('script' | 'chat'), command
```

---

## Architecture Notes

### File Structure for New Tools

```
packages/mcp-server/src/tools/
├── character.ts          (existing)
├── compendium.ts         (existing)
├── combat-management.ts  (NEW - Phase 1)
├── chat-tools.ts         (NEW - Phase 2)
├── active-effects.ts     (NEW - Phase 3)
├── audio-tools.ts        (NEW - Phase 4)
├── table-tools.ts        (NEW - Phase 5)
├── scene-building.ts     (NEW - Phase 6)
└── macro-tools.ts        (NEW - Phase 7)
```

### Pattern to Follow

Each tool file follows this pattern:

```typescript
// 1. Define tool class
export class CombatManagementTools {
  constructor(options: { foundryClient: FoundryClient; logger: Logger }) {}

  // 2. Define tool schemas
  getToolDefinitions(): Tool[] {
    return [
      {
        name: 'create-combat',
        description: '...',
        inputSchema: { type: 'object', properties: {...} }
      }
    ];
  }

  // 3. Implement handlers
  async createCombat(input: any): Promise<any> {
    return this.foundryClient.query('foundry-mcp-bridge.createCombat', input);
  }
}

// 4. Register in index.ts
```

### Foundry Module Pattern

```typescript
// packages/foundry-module/src/queries.ts

// Register handler
CONFIG.queries[`${modulePrefix}.createCombat`] = this.handleCreateCombat.bind(this);

// Implement handler
private async handleCreateCombat(data: any): Promise<any> {
  const gmCheck = this.validateGMAccess();
  if (!gmCheck.allowed) return { error: 'Access denied', success: false };

  this.dataAccess.validateFoundryState();
  return await this.dataAccess.createCombat(data);
}

// packages/foundry-module/src/data-access.ts

async createCombat(data: { sceneId?: string }): Promise<any> {
  const scene = data.sceneId
    ? game.scenes.get(data.sceneId)
    : game.scenes.active;

  const combat = await Combat.create({
    scene: scene?.id,
    active: true
  });

  return {
    success: true,
    combatId: combat.id,
    sceneName: scene?.name,
    round: 0,
    turn: 0
  };
}
```

---

## Priority Order

| Phase | Features | Value | Effort | Do First? |
|-------|----------|-------|--------|-----------|
| 1 | Combat Management | Critical | Medium | YES |
| 2 | Chat Messages | High | Low | YES |
| 3 | Active Effects | High | Medium | After 1 |
| 4 | Audio/Playlists | Medium | Low | Easy win |
| 5 | Rollable Tables | Medium | Low | Easy win |
| 6 | Scene Building | Medium | High | Later |
| 7 | Macros | Medium | Low | Easy win |

**Recommended order:** Phase 1 → Phase 2 → Phase 4 → Phase 5 → Phase 7 → Phase 3 → Phase 6

---

## What NOT to Build

1. **Integrate AI functionality** - You already have Claude via MCP; adding another LLM layer is redundant
2. **Tactical AI suggestions** - The PF2e Combat Assistant approach requires PF2e-specific rules; Claude already has this knowledge
3. **Rule automation** - Let Foundry's game system modules handle rules; MCP should just execute actions

---

## Testing Strategy

Each new tool should:

1. **Unit test** the MCP server handler (mock FoundryClient)
2. **Integration test** with Foundry module in a test world
3. **Document** with example prompts for Claude

Example test:
```typescript
describe('CombatManagementTools', () => {
  it('creates combat for active scene', async () => {
    const result = await tools.createCombat({});
    expect(result.success).toBe(true);
    expect(result.combatId).toBeDefined();
  });
});
```

---

## Summary

Your current MCP is solid. The gap is **live session support** - Combat being the biggest missing piece. By adding ~20 new tools across 7 phases, you'll have comprehensive Foundry control.

Start with **Combat + Chat** (Phases 1-2) to immediately improve session running. Then add the "easy wins" (Audio, Tables, Macros) before tackling the more complex Scene Building tools.

The architecture already supports this expansion - just follow the existing patterns in the codebase.
