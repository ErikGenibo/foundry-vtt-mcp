# Nanocyte Class (SF1e → PF2e Port)

> Homebrew port of the Starfinder 1e Nanocyte class to Pathfinder 2e / Starfinder 2e Anachronism.

---

## Class Basics

| Attribute | Value |
|-----------|-------|
| **Key Ability** | Constitution |
| **HP** | 10 + CON modifier per level |
| **Perception** | Trained |
| **Fortitude** | Expert |
| **Reflex** | Trained |
| **Will** | Expert |

### Proficiencies
- **Skills:** Trained in Computers, plus 3 + INT additional skills
- **Weapons:** Trained in simple, martial, and unarmed
- **Armor:** Trained in light, medium, and unarmored
- **Class DC:** Trained

---

## Level Progression

| Level | Class Features | Knacks | Array Scaling |
|-------|----------------|--------|---------------|
| 1 | Nanite Array, Nanite Surge, Faculty, Faculty Technique | — | Base |
| 2 | Skill Feat, Free Archetype | Knack | — |
| 3 | Nanite Resilience, General Feat | — | +2 bonuses, +1 cloud square, 15% miss, +1 major form |
| 4 | Skill Feat | Knack | — |
| 5 | Faculty Technique, Surge Capacity | — | +1 major, +1 minor form |

---

## Core Class Features

### Nanite Surge (Level 1)

You can push your nanites to perform extraordinary feats a number of times per day equal to **half your nanocyte level (rounded up) + your Constitution modifier**.

Surges can be used to:
- Switch arrays as a free action at the start of your turn (instead of 1 action)
- Gain temporary HP when forming Sheath Array (equal to nanocyte level)
- Increase Cloud Array density for concealment
- Other effects granted by knacks and faculty techniques

**Surge Capacity (Level 5):** Your maximum surges per day doubles to **(nanocyte level + 2 × your Constitution modifier)**. However, you can now spend a maximum of **half your maximum surges (rounded up)** in any single encounter.

---

### Nanite Array (Level 1)

Your body hosts nanites that can take one of three forms. As **1 action**, you can direct your nanites to adopt an array. You can have only one array active at a time. Alternatively, at the start of your turn, you can spend a **nanite surge** to form or switch arrays as a **free action**.

Arrays end when you:
- Direct them into a different array
- Fall unconscious
- End your turn more than 10 feet from the array

If an array ends without switching, nanites disperse and return at the start of your next turn. If you're more than 60 feet away or blocked from reaching the array, nanites break down and you can't use arrays until a long rest.

---

#### Sheath Array

Nanites reinforce your body.

**Benefits:**
- +1 status bonus to Reflex saves
- +1 circumstance bonus to two skills (choose from: Acrobatics, Athletics, Sleight of Hand, or Stealth) when you form this array

**Surge Option:** When forming Sheath Array, spend a surge to gain temporary HP equal to your nanocyte level. Lost when Sheath Array ends.

**Scaling:**
- Level 3: Bonuses increase to +2
- Level 7: Bonuses increase to +3
- Level 11: Bonuses increase to +4
- Level 15: Bonuses increase to +5
- Level 19: Bonuses increase to +6

---

#### Cloud Array

Nanites spread into a faintly visible cloud.

**Benefits:**
- Fills contiguous 5-foot squares equal to **1 + your CON modifier**
- At least one square must be adjacent to you
- Cloud is stationary; reconfigure as 1 action (one square must remain)
- When you Step, you can move 10 feet if you begin and end adjacent to or within your cloud

**Surge Option:** When forming Cloud Array, spend a surge to increase density. Creatures attacking through the cloud must succeed at a DC 2 flat check or miss (doesn't stack with other concealment, you can't hide within it, your own attacks ignore it).

**Scaling:**
- Level 3: +1 square, flat check DC increases to 3
- Level 7: +1 square, flat check DC increases to 4
- Level 11: Squares = 1 + (2 × CON modifier)
- Level 15: Flat check DC increases to 5 (standard concealment)
- Level 19: Squares = 1 + (4 × CON modifier)

---

#### Gear Array

Nanites form equipment.

**Forms:** You know a selection of major forms (weapons, cybernetic augmentations) and minor forms (tech items, personal items).

| Level | Major Forms | Minor Forms |
|-------|-------------|-------------|
| 1 | 2 | 3 |
| 2 | 2 | 4 |
| 3 | 3 | 4 |
| 4 | 3 | 5 |
| 5 | 4 | 5 |

**Restrictions:**
- Equipment level ≤ your nanocyte level
- Augmentations must be cybernetic
- Weapons/items must be technological (not magic/hybrid)
- No consumables (grenades, etc.)
- Bulk ≤ your CON modifier

**Manifesting:**
- Handheld items: Auto-grab if hands free, otherwise floats until end of turn
- Augmentations: Auto-install if slot empty, otherwise fails
- Items requiring battery/ammo: Must load from your possession

---

### Nanite Resilience (Level 3)

Your nanites convert hostile energies into fuel. You gain a +1 circumstance bonus to saves against diseases, poisons, and effects with the radiation trait. When you succeed at such a save, you regain 1 nanite surge use (maximum once per 10 minutes).

---

## Faculties

Choose your primary faculty at level 1. You gain faculty techniques at levels 1, 5, 9, 13, and 17.

### Faculty: Absorption

Your nanites excel at absorbing and redirecting energy.

**Level 1 Technique - Defensive Dispersal (Reaction)**
- **Trigger:** You take damage
- **Cost:** 1 nanite surge
- **Effect:** Reduce damage by **(1.5 × nanocyte level, rounded up) + CON modifier**. Gain +1 circumstance bonus to the first saving throw against the triggering effect.

**Level 5 Technique - Reactive Absorption**
When you use Defensive Dispersal, you can store the absorbed energy. Until the end of your next turn, your next Strike deals additional damage equal to half the damage you reduced (minimum 1). Damage type matches the triggering damage if energy, or force otherwise.

---

## Nanocyte Knacks

Knacks are class feats gained at levels 2, 4, 6, 8, etc.

### 2nd-Level Knacks

#### Abundant Nanites
Treat your Constitution modifier as 2 higher for calculating nanite surges per day and Gear Array bulk limits.

#### Agile Host
When you have Sheath Array active, add its insight bonus to your initiative checks.

#### Cushioning Sheath
While Sheath Array is active, treat falls as 10 feet shorter. Spend a surge as a reaction when falling to reduce by an additional 20 feet.

#### Defensive Manifestation
You gain the Shield Block reaction as a bonus feat. You can manifest a shield via Gear Array without counting against your form limits.

#### Drifting Host
Increase the distance your nanites can be from you to 15 feet (25 feet at 18th level).

#### Esoteric Edge
You become trained in 2 weapons with the special trait that you don't already have proficiency with.

#### Glimmering Nanites
Your Cloud Array sheds dim light in its area. You can communicate simple concepts via light patterns (creatures must have sight to receive).

#### Heavy Armor Edge
You become trained in heavy armor. Reduce the Strength requirement of heavy armor you wear by 2.

#### Intelligent Nanites
Spend a nanite surge as a free action to gain trained proficiency in one skill you lack for 1 minute. At 10th level, this becomes expert proficiency.

#### Leaping Nanites
Calculate jump DCs as if you had a running start. Double any insight bonus from Sheath Array when applied to Athletics checks to jump.

#### Mimicking Nanites
You can use Gear Array to create solid object illusions. DC 15 + (1.5 × level) to detect as fake.

#### Myriad Forms
Learn three additional minor forms for your Gear Array.

#### Otherworldly Nanites
You gain a focus pool of 1 Focus Point and learn one focus spell from a tradition other than your own (if any). Use CON as your spellcasting ability for this spell.

#### Shielding Nanites
You gain the Bodyguard feat. When an ally in your Cloud Array is attacked, you can spend a surge as a reaction to grant them a +2 circumstance bonus to AC against that attack.

#### Split Manifestation
You can manifest two one-handed weapons (or a one-handed weapon and shield) as a single Gear Array activation.

#### Surgical Host
While any array is active, you can attempt Medicine checks on creatures within 10 feet as if you had a healer's toolkit. Spend a surge to treat deadly wounds as a 3-action activity instead of 10 minutes.

#### Swarm Strike
Your nanites form a melee unarmed attack (1d6 bludgeoning, agile, finesse). You can use CON instead of STR for attack and damage rolls. At 7th level, damage increases to 1d8.

#### Versatile Nanites
Add two additional skills to the list you can choose from when forming Sheath Array. You can select this knack multiple times.

---

## Design Notes

### Porting Philosophy
- SF1e enhancement/insight bonuses converted to PF2e types (status for saves, circumstance for skills)
- Miss chances converted to flat check DCs (10% ≈ DC 2, scaling to DC 5 at level 15)
- Surge economy: doubles at level 5, with per-encounter limit added at that point (no refocusing)
- Free action array switching limited to start of turn (PF2e action economy)
- Array scaling follows SF1e's 3rd/7th/11th pattern
- Knacks treated as class feats at even levels
- Faculty techniques at 1st, 5th, 9th, 13th, 17th (matching SF1e)

### Posie's Current Build (Level 2)
- Faculty: Absorption (Defensive Dispersal at level 1)
- Arrays: Sheath, Cloud, Gear (2 major, 4 minor forms)
- Surges: 5/day (1 + 4 CON), no per-encounter limit yet
- Archetype: Envoy Dedication
- Defensive Dispersal reduces damage by 7 (3 + 4)

### Posie at Level 5 (Preview)
- Surges: 13/day (5 + 2×4 CON), max 7 per encounter
- Gains Reactive Absorption (store absorbed energy for next Strike)

---

*Last updated: 2026-01-18*
