# Campaigns Index

> Entry point for the Chronicler to understand and navigate campaign data.

## How This Works

When asked about a campaign, read this file first, then follow the file map for that campaign to load the appropriate context.

---

## Active Campaigns

| Campaign | System | Status | Party Level |
|----------|--------|--------|-------------|
| **Mass Hysteria** | Starfinder 2e | Active | 3 |

---

## Campaign: Mass Hysteria

**Location:** `mass-hysteria/`

### Quick Context Load

For general questions or session work, read these files in order:

| Priority | File | Purpose |
|----------|------|---------|
| 1 | `SESSION-STATE.md` | Current save point, what happened last, what's next |
| 2 | `chronicle.md` | Living chronicle - party, NPCs, threads, lore |
| 3 | `sessions/[latest]-recap.md` | Most recent session events |

### Full File Map

```
mass-hysteria/
├── SESSION-STATE.md          # START HERE - save point, quick resume
├── chronicle.md              # Living chronicle (party, threads, lore)
├── campaign-timers.md        # Active countdowns and consequence tracking
├── party-inventory.md        # Items, artifacts, money
│
├── characters/               # PC dossiers
│   ├── ringo.md             # Captain/Pilot - Pahtra Operator, bounty #4
│   ├── prismara.md          # Engineer - blind Vlaka Mechanic, precog
│   ├── tu-sev.md            # Advisor - Contemplative Mystic, Akashic
│   └── posie.md             # Safety Officer - Skittermander Nanocyte
│
├── npcs/                     # Major NPC dossiers
│   ├── nana-sweetie.md      # Crime lord / Port Gelling governor
│   ├── the-midwife.md       # Newborn servant, can cure Seeds
│   ├── lyra-ghost.md        # Bounty hunter - ACTIVE, watching Ringo
│   ├── gaxxus.md            # Bounty hunter - INCOMING, "The Breaker"
│   ├── lysander-southpaw.md # Childhood nemesis, Zenithcorp resources
│   ├── cassie.md            # Quest giver, Jemini's mother
│   ├── chlo-foods.md        # Corporate enemy - Will Kommen, Director Hashimoto
│   └── cerulean-collective.md # Ringo's former employers, hunting him
│
├── classes/                  # Homebrew class rules
│   └── nanocyte.md          # PF1e → SF2e port for Posie
│
├── locations/                # Location details and NPCs
│   ├── port-gelling-map.md  # District layout and navigation
│   ├── port-gelling-npcs.md # 16+ NPCs with full descriptions
│   └── haunted-sif.md       # Mother Swarm destination, Posie's arc
│
├── lore/                     # Deep lore documents
│   ├── precursors.md        # Ancient biotech civilization, grey goo, the Hollow
│   ├── the-newborn.md       # Cosmic change incarnate, Seeds of Flesh
│   ├── the-fragments.md     # Scattered nanite colonies, Mother Swarm
│   ├── cosmic-conflict.md   # Why the three factions are at war
│   └── port-gelling-politics.md  # Street-level factions, Nana's enemies
│
├── gm-vault/                 # GM-only secrets (unrevealed)
│   └── secrets.md           # Hidden lore, future hooks, twists
│
└── sessions/                 # Session documentation
    ├── arc-1-chlo-foods.md  # Sessions 1-2: Chlo Foods asteroid, meeting Nana
    ├── 2026-01-18-prep.md   # Cult compound prep (encounters, NPCs, beats)
    ├── 2026-01-18-recap.md  # Cult compound recap (events, consequences)
    ├── [date]-prep.md       # Pre-session prep template
    └── [date]-recap.md      # Post-session recap template
```

### What To Load When

| User Request | Files to Read |
|-------------|---------------|
| "Tell me about the campaign" | SESSION-STATE.md → chronicle.md |
| "Who are the PCs?" | chronicle.md (party section) OR characters/*.md for deep dive |
| "What happened last session?" | SESSION-STATE.md → sessions/[latest]-recap.md |
| "Help me prep next session" | SESSION-STATE.md → chronicle.md → campaign-timers.md → sessions/[latest]-prep.md |
| "Tell me about [NPC]" | npcs/[name].md OR locations/port-gelling-npcs.md |
| "What's the lore on [topic]?" | lore/[topic].md → chronicle.md → gm-vault/secrets.md |
| "What are the active plot threads?" | chronicle.md (threads section) → campaign-timers.md |
| "I need to know about [PC]" | characters/[name].md |
| "What are the active timers?" | campaign-timers.md |
| "What items does the party have?" | party-inventory.md |
| "Where is [location] in Port Gelling?" | locations/port-gelling-map.md |
| "Tell me about Nana/Midwife/Lyra/Cassie" | npcs/[name].md |

### Key Context Points

**Setting:** Antares System - custom star system with Drift Beacon, newly opened (<5 years)

**Tone:** Cosmic horror + found family, transformation themes, consequences matter

**Ship:** Mass Hysteria (Dynamic Freighter) - has 5 life signs with 4 crew, something in the walls

**Current Location:** Port Gelling on Antares Prime

**Current Arc:** Children of the Unseen Horizon (cult investigation → Precursor discovery)

**Protected Elements:**
- Jim (human pawnshop owner) is a memorial to user's father - nothing bad happens to Jim, ever

### Active Timers & Pressures

| Timer | Status | Stakes |
|-------|--------|--------|
| Jemini's Infection | Stage 1 | Needs Midwife cure before transformation |
| Lyra's Surveillance | Active | Bounty hunter watching, sent "XOXO" message |
| Nana's Investigation | Triggered | Crime lord now knows about Newborn/Midwife |

---

## Adding a New Campaign

To add a new campaign:

1. Create folder: `campaigns/[campaign-name]/`
2. Create minimum files:
   - `chronicle.md` - Living chronicle
   - `SESSION-STATE.md` - Save point
3. Add entry to this index with file map
4. Create subfolders as needed: `characters/`, `locations/`, `sessions/`, `gm-vault/`

---

## Related Resources

- **Skills:** `../skills/index.md` - Chronicler analytical frameworks
- **Setting Knowledge:** `../setting-knowledge/` - System/world reference
- **Templates:** `../templates/` - Reusable document formats

---

*The Chronicler navigates your campaigns. Which story shall we tell?*