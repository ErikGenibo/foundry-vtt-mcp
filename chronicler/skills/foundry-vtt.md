# Foundry VTT - The Chronicler's Virtual Table

> How I translate encounter designs into Foundry-ready setups.

## What This Skill Is

Your game runs on Foundry VTT with Discord voice. This skill helps me translate encounter designs from `sf2e-encounters.md` into practical Foundry implementation.

When I design an encounter, I can provide:
- Map setup guidance
- Token preparation lists
- Lighting and atmosphere settings
- Journal entries for GM reference
- Recommended modules for specific effects

---

## Encounter-to-Foundry Translation

### What I Provide

For each encounter design, I can generate:

```
FOUNDRY SETUP: [Encounter Name]

MAP
- Recommended map / map type
- Grid size and dimensions
- Key terrain features to mark

TOKENS
- Enemy tokens needed (with suggested art sources)
- NPC tokens if relevant
- Terrain/hazard tokens

WALLS & LIGHTING
- Wall placement for terrain features
- Light sources and darkness zones
- Fog of war considerations

AUDIO
- Ambient sound suggestions
- Combat music recommendations
- Trigger sounds for phase changes

JOURNAL
- GM notes for the encounter
- Enemy stat blocks or references
- Trigger conditions and phase transitions

MODULES
- Recommended modules for specific effects
- Automation suggestions if using SF2e system
```

---

## Map Considerations

### Your Map Source: Droid Cartographer

You use [Droid Cartographer](https://www.patreon.com/droidcartographer/about) maps, which provide:
- High-detail sci-fi/cyberpunk battlemaps
- Dungeondraft source files (.dd2vtt export)
- Day/night variants
- Perfect for Starfinder/sci-fi campaigns

### Importing Droid Cartographer Maps

You have **Universal Battlemap Importer** installed. Here's the workflow:

**Step 1: Export from Dungeondraft (if using source files)**
- Open the .dungeondraft_map file
- File → Export → Universal VTT
- This creates a .dd2vtt file with embedded walls/lights

**Step 2: Import to Foundry**
1. Go to **Scenes** tab
2. Click **Universal Battlemap Import** at the bottom
3. Select your .dd2vtt file
4. **CRITICAL: Set the upload path!** (e.g., `worlds/yourworld/maps/`)
   - If you skip this, you get walls/lights but no image
5. Adjust settings:
   - **Fidelity:** Low (recommended) - higher = more wall points but worse performance
   - **Object Walls:** Keep checked for furniture/objects to block light
6. Click Import

**Common Problems & Fixes:**

| Problem | Cause | Fix |
|---------|-------|-----|
| **Map imports but no image** | Upload path not set | Set path in step 4 |
| **Lights way too bright** | Dungeondraft export quirk | Delete lights, recreate manually OR run console fix |
| **Walls not accurate enough** | Fidelity too low | Re-import with higher fidelity |
| **Performance issues** | Fidelity too high | Re-import with lower fidelity |

**Lights Too Bright Fix:**
If lights are blinding, open console (F12) and run:
```javascript
canvas.lighting.placeables.forEach(l => l.document.update({config: {alpha: 0.5}}));
```
Adjust `0.5` to taste (lower = dimmer).

**Pro Tip:** For complex maps, it's often faster to:
1. Import with walls only (delete lights after)
2. Add your own lights manually where you want them
3. This gives you precise control over atmosphere

### Other Sci-Fi Map Sources

- **2-Minute Tabletop** - Sci-fi map packs
- **Cze and Peku** - Station/ship interiors
- **The MAD Cartographer** - Foundry-ready with walls/lights included

### Map Feature Checklist

When setting up a map, ensure:

- [ ] Grid aligned properly
- [ ] Walls placed for cover positions
- [ ] Doors placed (if applicable)
- [ ] Lighting zones defined
- [ ] Terrain markers for difficult terrain
- [ ] Story objects marked (consoles, objectives)

---

## Token Preparation

### Token Checklist

Before the session:

- [ ] Enemy tokens created with correct stats
- [ ] Token art selected (distinct per enemy type)
- [ ] HP and AC configured
- [ ] Initiative modifiers set
- [ ] Token disposition set (hostile/neutral)

### Token Sources for Sci-Fi

| Source | Type | Notes |
|--------|------|-------|
| **Token Stamp** | Free generator | Quick custom tokens |
| **Heroforge** | 3D screenshots | For important NPCs |
| **Devin Night** | Token packs | Professional quality |
| **Game-icons.net** | Simple icons | Good for generic enemies |

### Naming Conventions

For multiple enemies of same type:
- "Sweetie Enforcer 1", "Sweetie Enforcer 2" (clear)
- Or use descriptors: "Scarred Enforcer", "Tall Enforcer" (memorable)

---

## Walls and Lighting

### Wall Types for Terrain

| Terrain Feature | Wall Type | Notes |
|-----------------|-----------|-------|
| **Solid wall** | Normal wall | Blocks movement and vision |
| **Half cover** | Terrain wall | Blocks movement, limited vision |
| **Window/glass** | Invisible wall + transparent | Blocks movement, not vision |
| **Waist-high cover** | Terrain wall (half-height) | Partial cover in system |
| **Dangerous terrain** | None (use tile marker) | Visual indicator only |

### Lighting for Atmosphere

| Encounter Type | Lighting Approach |
|----------------|-------------------|
| **Bright facility** | Global illumination, minimal shadows |
| **Dim station** | Low ambient, light sources at consoles/doors |
| **Dark tunnels** | No ambient, token vision only |
| **Zero-G space** | Starfield ambient, harsh point lights |
| **Emergency/red alert** | Red-tinted ambient, flashing if module supports |

### Phase Transition Lighting

For multi-phase encounters, prep lighting presets:
- **Phase 1:** Normal lighting
- **Phase 2:** Dimmed (power failure), or red (alert), or changed
- **Phase 3:** Dramatic shift (emergency lighting, darkness, etc.)

Use Foundry's lighting animation for flickering, pulsing effects.

---

## Audio Setup

### Sound Layers

| Layer | Purpose | Examples |
|-------|---------|----------|
| **Ambient** | Constant background | Ship hum, station noise, wind |
| **Combat Music** | Fight intensity | Triggered on initiative |
| **Spot Effects** | Specific moments | Explosions, alarms, phase triggers |

### Recommended Playlists

Create playlists for:
- **Exploration** - Low tension, atmospheric
- **Combat (standard)** - Action music, moderate intensity
- **Combat (boss)** - High intensity, dramatic
- **Tension** - Pre-combat, discovery, horror

### Triggering Audio

- Start combat playlist when initiative is rolled
- Prep phase transition sounds (explosion, alarm, etc.)
- Use Foundry's sound trigger feature for story moments

---

## Journal Organization

### GM Notes Structure

For each encounter, create a Journal Entry:

```
# [Encounter Name]

## Quick Reference
- Threat Level: [Moderate/Severe/etc.]
- XP Budget: [X]
- Expected Duration: [X rounds or minutes]

## Enemy Summary
| Name | Level | HP | AC | Key Ability |
|------|-------|----|----|-------------|
| ... | ... | ... | ... | ... |

## Phase Triggers
- Phase 1 → 2: [Trigger condition]
- Phase 2 → 3: [Trigger condition]

## GM Reminders
- [ ] Enemy uses [ability] on round 2
- [ ] Reinforcements arrive if [condition]
- [ ] Don't forget [story beat]

## Post-Combat
- Loot/Evidence found
- Information revealed
- Thread advancement
```

### Linking Journals

- Link to NPC actors for quick stat access
- Link to scene for quick scene activation
- Link to related encounters for campaign flow

---

## Recommended Modules

### Your Current Setup

You have these relevant modules installed:
- **Universal Battlemap Importer** - Map import (see Droid Cartographer section)
- **Monk's Active Tile Triggers** - Interactive terrain
- **Dice So Nice** - Visual dice
- **Levels** - Multi-level maps
- **Wall Height** - Advanced wall features
- **Tokenizer** - Token creation
- **Starfinder Anachronism** - SF2e engine

### Recommended Addition: NPC GEN Importer

**[NPC GEN Importer](https://foundryvtt.com/packages/NPC-GEN-IMPORTER)** - Lets you paste text to instantly create NPCs

This is the key module for Chronicler integration. When I generate enemies with Foundry import format (see `enemy-design.md`), you can paste directly into Foundry and get a fully-statted actor.

**Install:** Foundry Setup → Add-on Modules → Install Module → Search "NPC GEN"

### Other Useful Modules

| Module | Purpose | You Have? |
|--------|---------|-----------|
| **Token Action HUD** | Quick action buttons for NPCs | No |
| **Sequencer** | Visual effects for abilities | No |
| **FXMaster** | Particle effects (sparks, smoke) | No |
| **PF2e Workbench** | Quality-of-life automation | No |

---

## Pre-Session Checklist

Before running an encounter:

### Technical Prep
- [ ] Map loaded and grid aligned
- [ ] Walls and doors placed
- [ ] Lighting configured
- [ ] Tokens created and placed off-map
- [ ] Audio playlists ready

### Content Prep
- [ ] Journal entry with GM notes
- [ ] Enemy stat blocks accessible
- [ ] Phase triggers documented
- [ ] Post-combat outcomes prepped

### Player Experience
- [ ] Token art distinct and readable
- [ ] Scene looks good at player zoom level
- [ ] Audio levels tested
- [ ] Any handouts/images ready to share

---

## Quick Setup Templates

### Simple Combat Scene

```
1. Load appropriate map
2. Place enemy tokens in starting positions (hidden)
3. Verify lighting (or use global illumination)
4. Queue combat playlist
5. Create minimal journal: enemy HP/AC, key abilities
```

### Complex Multi-Phase Scene

```
1. Load map with all terrain features
2. Configure Phase 1 lighting
3. Save Phase 2/3 lighting as presets (or use module)
4. Place all tokens (including reinforcements, hidden)
5. Prep audio: ambient, combat, phase transition sounds
6. Create detailed journal with phase triggers
7. Test scene transitions before session
```

### Chase Scene

```
1. Use abstract positioning (no detailed map) OR
2. Series of simple scenes (one per chase segment)
3. Tokens represent range bands, not exact position
4. Prep obstacle descriptions in journal
5. Use theatre of mind for speed
```

---

## What I Generate For You

### When You Have an Encounter Design

Tell me: "Prep this encounter for Foundry"

I generate:
- Token list with quantities
- Wall/lighting recommendations
- Journal entry template
- Audio suggestions
- Module recommendations if special effects needed

### When You Need a Quick Scene

Tell me: "Quick Foundry setup for [location/situation]"

I generate:
- Map recommendations
- Minimal token needs
- Basic lighting approach
- Essential journal notes

### When You Need Atmosphere

Tell me: "Make this scene feel [mood]"

I generate:
- Lighting configuration
- Audio recommendations
- Visual effect suggestions
- Player experience considerations

---

*The Chronicler bridges story and screen. What shall we bring to the virtual table?*
