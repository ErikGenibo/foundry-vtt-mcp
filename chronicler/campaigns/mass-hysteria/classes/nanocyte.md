# Nanocyte (Homebrew Class)

> Ported from PF1e to SF2e. Played by @Posie.

## Core Stats

| Attribute | Value |
|-----------|-------|
| **Key Attribute** | Constitution |
| **HP** | 10 + Con |
| **Perception** | Trained |
| **Fort** | Expert |
| **Reflex** | Trained |
| **Will** | Expert |
| **Class DC** | Trained |

## Proficiencies

| Category | Proficiency |
|----------|-------------|
| **Skills** | Computers (trained), +3+Int additional |
| **Weapons** | Simple, Martial, Unarmed (trained) |
| **Armor** | Light, Medium, Unarmored (trained) |

---

## Core Abilities

### Nanite Surge (1st Level)

**Resource Pool:** (Nanocyte level / 2) + Con modifier per day

**Usage:**
- Spend to push nanites to extraordinary feats
- Can use multiple times per situation
- **Level 5+:** 10 minutes refocusing restores 1 surge (max restored/day = max surges)

**Applications:**
- Switch arrays as a free action (instead of 1 action)
- Sheath Array: Gain temp HP = nanocyte level
- Cloud Array: Increase density for concealment
- Defensive Dispersal: Reaction damage reduction

---

### Nanite Array (1st Level)

**Action:** 1 action to form/switch arrays (or free action with surge)

**Limitations:**
- Only one array active at a time
- Ends if: you fall unconscious, end turn 10+ feet from array, or switch arrays
- If array ends without switching, nanites disperse and return at start of next turn
- If blocked or 60+ feet away, nanites break down (long rest to restore)

**Detection:** Technological (detect tech works), but not otherwise subject to tech-affecting abilities

---

## Array Types

### Sheath Array (Self-Buff)

**Passive Benefits:**
- +1 enhancement bonus to Reflex saves
- +1 insight bonus to 2 chosen skills (Acrobatics, Athletics, Sleight of Hand, or Stealth)
- Bonuses increase by +1 at levels 3, 7, 11, 15, 19

**Surge Option:** Gain temp HP = nanocyte level (lost when sheath ends)

---

### Cloud Array (Area Control)

**Base Effect:**
- Nanites fill contiguous 5-foot squares
- Max squares = 1 + Con bonus
- At least one square must be adjacent to you
- Stationary once formed (reconfigure as 1 action, keeping at least one square unchanged)
- When you Step, can move 10 feet if starting/ending adjacent to or within cloud

**Surge Option:** Increase density for concealment
- Provides 10% miss chance (not enough to hide)
- Your attacks ignore your cloud's miss chance

**Scaling:**

| Level | Max Squares | Miss Chance (with surge) |
|-------|-------------|--------------------------|
| 1 | 1 + Con | 10% |
| 3 | 2 + Con | 15% |
| 7 | 3 + Con | 20% |
| 11 | 1 + (2 × Con) | 20% |
| 15 | 1 + (2 × Con) | 25% |
| 19 | 1 + (4 × Con) | 25% |

---

### Gear Array (Equipment Creation)

**Forms Known:**
- **Major Forms** (weapons, cybernetic augmentations): 2 at 1st, +1 at 3rd, 5th, then every 4 levels
- **Minor Forms** (tech items, personal items): 3 at 1st, +1 every 2 levels

**Restrictions:**
- Equipment level ≤ nanocyte level
- Augmentations must be cybernetic
- Items must be technological (not magic/hybrid)
- No consumables (grenades, etc.)
- Bulk ≤ Con modifier

**Creation:**
- Handheld items: auto-grab if hands free, otherwise floats until end of turn then drops
- Cybernetic augmentations: auto-install if slot empty, otherwise fails
- Items needing battery/ammo: can absorb and auto-load from your possession
- Items using <20 charge battery can use standard battery instead

**Retraining:** When gaining a level, can swap 1 major form and 1 minor form

---

## Faculty: Absorption

**Benefit:** Gain Defensive Dispersal at 1st level (normally 2nd)

### Defensive Dispersal

**Trigger:** You take damage
**Cost:** 1 Nanite Surge (reaction)

**Effect:**
- Reduce damage by: (1.5 × nanocyte level, rounded up) + Con modifier
- Gain +1 circumstance bonus to first saving throw against the effect

---

## Level Progression

### Level 2

- Skill feat (normal)
- Free archetype feat (normal)
- **Nanocyte Knack:** Select from [Level 2 Knacks](https://www.aonsrd.com/Knacks.aspx)

*(Knacks that don't translate directly from 1e to 2e - flag for GM review)*

---

## Quick Reference

**Daily Resources:**
- Nanite Surges: (Level/2) + Con

**Action Economy:**
- Form/Switch Array: 1 action (or free with surge)
- Reconfigure Cloud: 1 action
- Defensive Dispersal: Reaction + 1 surge

**Damage Reduction (Defensive Dispersal):**
| Level | Base Reduction |
|-------|----------------|
| 1 | 2 + Con |
| 2 | 3 + Con |
| 3 | 5 + Con |
| 4 | 6 + Con |
| 5 | 8 + Con |
| ... | (1.5 × level, rounded up) + Con |
