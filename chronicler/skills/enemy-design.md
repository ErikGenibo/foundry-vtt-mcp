# Enemy Design - The Chronicler's Antagonist Forge

> How I create custom enemies that serve your campaign's story.

## What This Skill Is

Generic monsters from bestiaries work fine for random encounters. But story-critical antagonists deserve custom design.

This is my framework for creating enemies that:
- Connect to your campaign's threads
- Challenge your specific party
- Create memorable moments
- Serve narrative purposes beyond "obstacle to kill"

---

## Story-First Enemy Design

### The Core Questions

Before I stat anything, I answer:

| Question | Why It Matters |
|----------|----------------|
| **Why do they oppose the PCs?** | Motivation creates depth |
| **What do they want?** | Goals beyond "fight to the death" |
| **How do they connect to the story?** | Enemies should advance threads |
| **What makes them memorable?** | Distinctive traits stick in player memory |
| **What happens if they survive?** | Recurring villains need escape routes |

### Enemy-Thread Connection

Every significant enemy I design connects to at least one campaign thread:

| Connection Type | Example |
|-----------------|---------|
| **Thread Agent** | Works directly for the thread's antagonist |
| **Thread Obstacle** | Blocks progress on the thread |
| **Thread Revealer** | Knows information about the thread |
| **Thread Consequence** | Result of player actions on the thread |
| **Thread Parallel** | Mirrors PC's situation, different choice |

---

## The Enemy Design Template

When I create a custom enemy, I produce:

```
[ENEMY NAME]
Role: [Boss / Lieutenant / Specialist / Minion]
Level: [Party +/- X]
Thread Connection: [Which thread, how connected]

CONCEPT
One sentence: Who they are and why they matter.

MOTIVATION
What they want. Why they're here. What they'll do to get it.

DISTINCTIVE FEATURES
- Visual: What players see
- Behavioral: How they act
- Tactical: How they fight

COMBAT ROLE
[Brute / Striker / Controller / Support / Artillery / Lurker]

KEY ABILITIES (2-3)
- Signature move that defines their combat feel
- Ability that creates tactical decisions
- Ability that connects to their story role

TACTICS
How they fight. What triggers retreat. What triggers desperation.

STORY HOOKS
- What they know (interrogation value)
- What they carry (loot/evidence)
- Who they work for (thread connection)
- What happens if they escape (future encounter)
```

---

## Combat Roles

I design enemies with clear tactical roles:

| Role | Combat Feel | Story Use |
|------|-------------|-----------|
| **Brute** | High HP/damage, lower AC | Intimidating muscle, dumb enforcer |
| **Striker** | Mobile, high single-target | Assassin, hunter, rival |
| **Controller** | Zones, conditions, battlefield | Mastermind's tool, caster-type |
| **Support** | Buffs allies, debuffs PCs | Lieutenant, healer, commander |
| **Artillery** | Ranged damage, fragile | Sniper, turret, mage |
| **Lurker** | Ambush, alpha strike | Stalker, trap-layer, predator |

### Role Combinations

Interesting enemy groups mix roles:

| Group | Composition | Tactical Challenge |
|-------|-------------|-------------------|
| **Ambush Team** | 1 Lurker + 2 Strikers | Sudden pressure, scattered party |
| **Defensive Line** | 2 Brutes + 1 Support | Wall of HP, sustained healing |
| **Control Zone** | 1 Controller + 3 Artillery | Area denial, focus fire |
| **Boss Setup** | 1 Boss + 2 Support + Minions | Action economy, buff stacking |

---

## Mechanical Anchoring

I anchor custom enemies to existing SF2e/PF2e creatures for balanced stats:

### Process

1. **Find Base Creature** - Similar concept at target level
2. **Adjust Stats** - Swap abilities to fit concept
3. **Add Signature** - One unique ability that defines them
4. **Test XP** - Verify against budget

### Stat Guidelines by Level

See `sf2e-reference.md` for full tables. Quick reference:

| Stat | Moderate | High | Extreme |
|------|----------|------|---------|
| AC | Level + 15 | Level + 17 | Level + 19 |
| Attack | Level + 10 | Level + 13 | Level + 16 |
| DC | Level + 17 | Level + 20 | Level + 23 |
| HP | Level × 15 | Level × 20 | Level × 25 |

**One Extreme stat makes an enemy memorable.** Don't max everything.

---

## Signature Abilities

Every significant enemy gets one **signature ability** that:
- Defines how they feel to fight
- Creates tactical decisions
- Connects to their story concept

### Signature Ability Types

| Type | Effect | Example |
|------|--------|---------|
| **Reaction** | Responds to player actions | Parry, counterstrike, redirect |
| **Movement** | Changes positioning rules | Teleport, phase, swap places |
| **Control** | Affects battlefield | Create terrain, forced movement |
| **Resource** | Interacts with action economy | Extra actions, deny reactions |
| **Scaling** | Changes over fight | Enrage at low HP, power up |

### Examples

**The Extractor** (Interrogator-type)
- *Signature: Pain Compliance* - On hit, can forgo damage to force target to answer one yes/no question truthfully

**Vex, Old Partner** (Rival-type)
- *Signature: I Know Your Tricks* - Once per round, can predict and counter one of Ringo's abilities, negating it

**Sweetie Enforcer** (Augmented Muscle)
- *Signature: Loyalty Injection* - When reduced below 50% HP, injects stimulant. Gains +2 to attacks but takes 1d6 damage per round

---

## Enemy Motivations Beyond Murder

Enemies with goals beyond "kill PCs" create richer encounters:

| Motivation | Tactical Behavior | Story Opportunity |
|------------|-------------------|-------------------|
| **Capture** | Non-lethal, restraint focus | Interrogation, captivity arc |
| **Retrieve** | Focus on object, may ignore PCs | Let them grab it, then what? |
| **Delay** | Defensive, waste time | What are they buying time for? |
| **Test** | Hold back, evaluate | Recruitment opportunity |
| **Escape** | Fight to disengage | Recurring villain setup |
| **Protect** | Defensive around target | Moral complexity if target is sympathetic |
| **Message** | Make a point, then leave | Intimidation, warning |

---

## Worked Examples

### Example 1: Thread Lieutenant

**Request:** "I need a lieutenant for Nana Sweetie's organization"

**My Design:**

```
MISTER WARM
Role: Lieutenant
Level: Party +1
Thread Connection: Nana Sweetie (enforcer, knows some secrets)

CONCEPT
Nana's "grandchild" who handles problems that need a personal touch.
Disturbingly polite violence.

MOTIVATION
Genuine loyalty to Nana. Sees himself as protecting family.
Will capture over kill if ordered. Will die for Nana.

DISTINCTIVE FEATURES
- Visual: Immaculate suit, warm smile, augmented hands
- Behavioral: Calls everyone "friend," apologizes while hurting
- Tactical: Grapple-focused, isolates targets

COMBAT ROLE
Brute/Controller hybrid

KEY ABILITIES
- Friendly Grip (2 actions): Grapple + move. Drags target away from allies.
- "Let's Talk Privately": Grappled targets can't be targeted by allies' beneficial effects
- Grandmother's Orders: Can switch to non-lethal at will, no penalty

TACTICS
Opens with Friendly Grip on squishiest target. Drags them away from group.
Holds them hostage for negotiation if fight turns bad.
Retreats if ordered by Nana. Never abandons a captured "guest."

STORY HOOKS
- Knows: Location of one Sweetie safehouse
- Carries: Comm device with Nana's frequency
- Works for: Nana Sweetie directly
- If escapes: Reports everything to Nana, comes back better prepared
```

---

### Example 2: Character Foil

**Request:** "I need someone from Ringo's past as Jax"

**My Design:**

```
VEX, THE OLD PARTNER
Role: Boss
Level: Party +2
Thread Connection: Ringo's past (knows the truth, wants Jax back)

CONCEPT
Ringo's former partner in crime. Still believes in what they were.
Betrayed when Jax disappeared. Wants answers. Wants Jax back.

MOTIVATION
Not revenge—reunion. Vex genuinely misses their partner.
The crew fell apart without Jax. Vex blames himself.
Will fight to capture, not kill. Wants to TALK.

DISTINCTIVE FEATURES
- Visual: Mirror of Ringo's old style, plus the years between
- Behavioral: Uses Jax's name, references shared history
- Tactical: Anticipates Ringo's fighting style

COMBAT ROLE
Striker/Controller

KEY ABILITIES
- I Know Your Tricks: Once per round, when Ringo uses an ability Vex has seen before, Vex can negate it as a reaction
- "Remember This Move?": Can use one of Ringo's class abilities against him
- We're Not Done Talking: When Ringo tries to flee, Vex can immediately move to cut off retreat

TACTICS
Opens by addressing "Jax" loudly. Waits for response.
Focuses Ringo but won't kill—aims to incapacitate.
Will offer to let others go if Jax comes quietly.
Only goes lethal if other PCs are about to kill him.

STORY HOOKS
- Knows: Everything about Ringo's past life
- Carries: Old photo of the crew, including Jax
- Works for: Himself (the crew remnants, if any)
- If escapes: Becomes recurring presence. Keeps finding Jax.
```

---

### Example 3: Environmental Threat

**Request:** "I need something dangerous on the asteroid for the truffle mission"

**My Design:**

```
THE THING IN THE TUNNELS
Role: Solo Boss / Environmental Hazard
Level: Party +3
Thread Connection: Space truffle mystery (what ARE these truffles?)

CONCEPT
Reason the asteroid was abandoned. Lives in the truffle caves.
May be connected to truffle lifecycle. Discovery raises questions.

MOTIVATION
Territorial. Protects the truffle growths.
Not evil—animal intelligence. Can be avoided or driven off.
Killing it might have consequences for truffle supply.

DISTINCTIVE FEATURES
- Visual: Bioluminescent, fungal, wrong number of limbs
- Behavioral: Ambush predator, retreats when hurt
- Tactical: Uses tunnels, darkness, surprise

COMBAT ROLE
Lurker/Brute

KEY ABILITIES
- Tunnel Network: Can disappear into walls, emerge anywhere in cave system
- Spore Cloud (recharge 5-6): 20ft burst, DC [High] Fort or sickened + concealment
- Photophobic: Bright light causes it to retreat for 1 round

TACTICS
Hit and run. Emerge, strike, vanish.
Spore cloud to disorient, then pick off isolated targets.
Retreats at 50% HP. Returns with ambush if they stay.
Can be driven off permanently with sustained bright light + damage.

STORY HOOKS
- Discovery: What IS this thing? Connected to truffles?
- Killing it: Easy victory, but... did the truffles just change?
- Driving off: Honorable solution, but it's still here
- Communicating?: High Nature/Survival check reveals it's protecting something
```

---

## What I Generate For You

### When You Need a Story Enemy

Tell me: "I need an enemy connected to [thread/character]"

I generate:
- Full enemy design using template above
- Thread connection explicitly stated
- Tactical and story hooks
- What happens if they survive

### When You Need a Combat Challenge

Tell me: "I need a [role] at [level] for [situation]"

I generate:
- Mechanically sound enemy
- Signature ability
- Tactical behavior
- Basic story hooks

### When You Need a Recurring Villain

Tell me: "I want [concept] to be a recurring antagonist"

I generate:
- Full design with escape mechanisms
- Escalation path (how they grow over encounters)
- Relationship evolution with PCs
- Ultimate confrontation setup

---

## How To Use Me

### Provide Context

The more I know, the better my enemy designs:
- Which thread should this enemy connect to?
- Which PCs should this enemy challenge?
- What role in the story (obstacle, rival, foil, mystery)?
- Any specific abilities or themes you want?

### Iterate With Me

My first design is a starting point:
- "Make them more sympathetic"
- "Add a connection to Tu'Sev"
- "I want them to be recruitable"
- "Too powerful—scale down"

---

## Full Stat Block Generation

When you need complete, mechanically-sound stat blocks, I generate them using the official PF2e/SF2e creature building rules from the [Gamemastery Guide](https://2e.aonprd.com/Rules.aspx?ID=2874).

### The Process

1. **Story design first** - Use the template above
2. **Choose stat profile** - Based on combat role
3. **Apply level-appropriate numbers** - From tables below
4. **Add abilities** - 2-4 meaningful abilities
5. **Verify balance** - Check XP cost matches intent

### Stat Profiles by Combat Role

| Role | AC | HP | Attack | Damage | Best Save | Weak Save |
|------|----|----|--------|--------|-----------|-----------|
| **Brute** | Moderate | High | High | High | Fort | Ref/Will |
| **Striker** | High | Moderate | Extreme | High | Ref | Will |
| **Controller** | Moderate | Moderate | Moderate | Low | Will | Fort |
| **Support** | Moderate | Moderate | Moderate | Low | Will | Ref |
| **Artillery** | Low | Low | High | Extreme | Ref | Fort |
| **Lurker** | High | Low | Extreme | Extreme | Ref | Fort |

### Core Statistics Tables

#### Armor Class by Level

| Level | Low | Moderate | High | Extreme |
|-------|-----|----------|------|---------|
| 1 | 13 | 15 | 16 | 19 |
| 2 | 14 | 16 | 18 | 21 |
| 3 | 15 | 17 | 19 | 22 |
| 4 | 17 | 19 | 21 | 24 |
| 5 | 19 | 21 | 22 | 25 |
| 6 | 20 | 22 | 24 | 27 |
| 7 | 21 | 23 | 25 | 28 |
| 8 | 23 | 25 | 27 | 30 |
| 9 | 24 | 26 | 28 | 31 |
| 10 | 27 | 29 | 30 | 33 |

#### Hit Points by Level

| Level | Low | Moderate | High |
|-------|-----|----------|------|
| 1 | 14-16 | 19-21 | 24-26 |
| 2 | 22-26 | 28-32 | 36-40 |
| 3 | 32-36 | 38-42 | 50-54 |
| 4 | 41-45 | 48-52 | 63-67 |
| 5 | 53-59 | 72-78 | 91-97 |
| 6 | 64-70 | 84-90 | 108-114 |
| 7 | 74-80 | 96-102 | 123-129 |
| 8 | 84-92 | 108-116 | 139-147 |
| 9 | 96-104 | 121-129 | 156-164 |
| 10 | 127-135 | 171-179 | 215-223 |

#### Strike Attack Bonus by Level

| Level | Low | Moderate | High | Extreme |
|-------|-----|----------|------|---------|
| 1 | +5 | +7 | +9 | +11 |
| 2 | +6 | +8 | +10 | +13 |
| 3 | +7 | +9 | +12 | +14 |
| 4 | +9 | +11 | +13 | +16 |
| 5 | +11 | +13 | +15 | +17 |
| 6 | +12 | +14 | +17 | +19 |
| 7 | +13 | +15 | +18 | +20 |
| 8 | +15 | +17 | +20 | +22 |
| 9 | +16 | +18 | +21 | +23 |
| 10 | +17 | +21 | +23 | +25 |

#### Strike Damage by Level

| Level | Low | Moderate | High | Extreme |
|-------|-----|----------|------|---------|
| 1 | 1d4+2 (4) | 1d6+2 (5) | 1d6+3 (6) | 1d8+4 (8) |
| 2 | 1d6+2 (5) | 1d6+4 (7) | 1d8+5 (9) | 1d10+6 (11) |
| 3 | 1d6+4 (7) | 1d8+4 (8) | 1d10+5 (10) | 1d12+6 (12) |
| 4 | 1d8+4 (8) | 1d8+6 (10) | 1d10+8 (13) | 2d8+6 (15) |
| 5 | 2d4+6 (11) | 2d6+6 (13) | 2d8+7 (16) | 2d12+7 (20) |
| 6 | 2d6+5 (12) | 2d6+7 (14) | 2d8+8 (17) | 2d12+8 (21) |
| 7 | 2d6+6 (13) | 2d8+6 (15) | 2d10+8 (19) | 2d12+10 (23) |
| 8 | 2d6+8 (15) | 2d8+8 (17) | 2d10+10 (21) | 3d10+8 (24) |
| 9 | 2d6+9 (16) | 2d8+9 (18) | 2d10+11 (22) | 3d10+9 (25) |
| 10 | 2d6+10 (17) | 2d10+11 (22) | 2d12+13 (26) | 2d12+20 (33) |

#### Saving Throws by Level

| Level | Terrible | Low | Moderate | High | Extreme |
|-------|----------|-----|----------|------|---------|
| 1 | +2 | +4 | +7 | +10 | +11 |
| 2 | +3 | +5 | +8 | +11 | +12 |
| 3 | +4 | +6 | +9 | +12 | +14 |
| 4 | +5 | +7 | +10 | +13 | +15 |
| 5 | +7 | +9 | +12 | +15 | +17 |
| 6 | +8 | +10 | +13 | +16 | +18 |
| 7 | +9 | +11 | +14 | +17 | +19 |
| 8 | +10 | +12 | +15 | +18 | +20 |
| 9 | +12 | +14 | +17 | +20 | +22 |
| 10 | +14 | +16 | +19 | +22 | +24 |

#### Perception by Level

| Level | Terrible | Low | Moderate | High | Extreme |
|-------|----------|-----|----------|------|---------|
| 1 | +2 | +4 | +7 | +10 | +11 |
| 5 | +7 | +9 | +12 | +15 | +17 |
| 10 | +14 | +16 | +19 | +22 | +24 |

#### Spell DC / Ability DC by Level

| Level | Moderate | High | Extreme |
|-------|----------|------|---------|
| 1 | 14 | 17 | 20 |
| 5 | 19 | 22 | 26 |
| 10 | 26 | 29 | 33 |

### Ability Design Principles

From the [Design Abilities](https://2e.aonprd.com/Rules.aspx?ID=1024) rules:

**Respect action economy:**
- Combat is short; creatures often only get 3-4 turns
- 2-4 abilities is usually enough
- Reactions help creatures act off-turn
- Higher-level creatures should have better action economy (free actions, Improved Grab instead of Grab)

**Make abilities visible:**
- Avoid "invisible" bonuses (+2 to attack just because)
- Abilities should be things players SEE happening
- "Enraged" with visible effects > passive damage boost

**One Extreme stat:**
- One stat at Extreme makes the creature memorable
- Extreme AC = "hard to hit" identity
- Extreme damage = "glass cannon" identity
- Don't make everything Extreme

**Signature ability guidelines:**
- Should define how the fight FEELS
- Create tactical decisions for players
- Connect to the creature's story/concept
- Compare to spells/feats of similar level for balance

### Full Stat Block Template

When I generate a full stat block, it follows this format:

```
[CREATURE NAME]                                    CREATURE [LEVEL]
[Alignment] [Size] [Traits]
Perception +[X]; [senses]
Languages [languages]
Skills [Skill] +[X], [Skill] +[X]
Str +[X], Dex +[X], Con +[X], Int +[X], Wis +[X], Cha +[X]
Items [equipment if any]

---
AC [X]; Fort +[X], Ref +[X], Will +[X]
HP [X]; Immunities [if any]; Weaknesses [if any]; Resistances [if any]

---
[REACTION NAME] [reaction] **Trigger** [trigger]; **Effect** [effect]

---
Speed [X] ft.
**Melee** [one-action] [weapon] +[X] ([traits]), **Damage** [dice]+[mod] [type]
**Ranged** [one-action] [weapon] +[X] ([range], [traits]), **Damage** [dice]+[mod] [type]
**[SPECIAL ABILITY NAME]** [action cost] [Description of ability]
**[SPECIAL ABILITY NAME]** [action cost] [Description of ability]
```

### Worked Example: Full Stat Block

**Request:** "Give me complete stats for Mister Warm at Level 6 (party is Level 5)"

```
MISTER WARM                                        CREATURE 6
NE Medium Humanoid
Perception +12; low-light vision
Languages Common, Vesk
Skills Athletics +16, Deception +14, Intimidation +14, Stealth +12
Str +4, Dex +2, Con +3, Int +1, Wis +2, Cha +3
Items fine suit, augmented grappling hands, comm device (Nana's frequency)

---
AC 23; Fort +15, Ref +12, Will +14
HP 105

---
**Polite Redirect** [reaction] **Trigger** An ally within 10 feet is targeted by a Strike;
**Effect** Mister Warm Steps and can redirect the Strike to himself if he is now a valid target.

---
Speed 25 ft.
**Melee** [one-action] augmented fist +16 (grapple, nonlethal, unarmed), **Damage** 2d8+8 bludgeoning
**Friendly Grip** [two-actions] Mister Warm attempts to Grapple a creature, then Strides up to his Speed,
bringing the grappled creature with him. The creature can attempt a DC 24 Fortitude save to break free
at the end of the movement.
**"Let's Talk Privately"** A creature Mister Warm has grabbed can't be targeted by allies' beneficial
spells or effects, and allies can't flank with Mister Warm against the grabbed creature.
**Grandmother's Orders** Mister Warm can choose to deal nonlethal damage with any of his Strikes
without taking the usual -2 penalty.
```

### Sources & Further Reading

- [Building Creatures](https://2e.aonprd.com/Rules.aspx?ID=2874) - Archives of Nethys (official rules)
- [Design Abilities](https://2e.aonprd.com/Rules.aspx?ID=1024) - Ability design principles
- [Creature Abilities](https://2e.aonprd.com/MonsterAbilities.aspx) - Common creature abilities to adapt
- [Monsters Database](https://2e.aonprd.com/Monsters.aspx) - Reference existing creatures for benchmarking

---

## Foundry VTT Import Format

**Recommended Module:** [NPC GEN Importer](https://foundryvtt.com/packages/NPC-GEN-IMPORTER)

This module lets you paste specially-formatted text to instantly create PF2e/SF2e NPCs in Foundry. I can generate this format for direct import.

### NPC-GEN Format

When you request Foundry-importable format, I generate:

```
===base===
name: [Creature Name]
type: [Creature Type]
level: [Number]
size: [Size]
alignment: [Alignment]
rarity: [Common/Uncommon/Rare/Unique]
traits: [Trait1, Trait2]
languages: [Language1, Language2]
perception: [+Modifier], [Sense1; Sense2]
saves: Fort [+X], Ref [+X], Will [+X]
abilities: Str [+X], Dex [+X], Con [+X], Int [+X], Wis [+X], Cha [+X]
ac: [Number]
hp: [Number]
speed: [X feet]
skills: [Skill +X]; [Skill +X]
resistances: [Type Value]
weaknesses: [Type Value]
immunities: [Type]
public notes: [Description visible to players]
private notes: [GM-only notes]

===actions===
[free/reaction/1/2/3] [Action Name]: [Description] |traits: [Traits]

===attacks===
[Weapon Name] [+Modifier]: [Damage dice + modifier type] |traits: [Traits]
```

### Worked Example: Foundry-Importable

**Request:** "Give me Mister Warm in Foundry import format"

```
===base===
name: Mister Warm
type: Humanoid
level: 6
size: Medium
alignment: NE
rarity: Uncommon
traits: Humanoid
languages: Common, Vesk
perception: +12, low-light vision
saves: Fort +15, Ref +12, Will +14
abilities: Str +4, Dex +2, Con +3, Int +1, Wis +2, Cha +3
ac: 23
hp: 105
speed: 25 feet
skills: Athletics +16; Deception +14; Intimidation +14; Stealth +12
public notes: Nana Sweetie's "grandchild" who handles problems requiring a personal touch. Disturbingly polite.
private notes: Knows location of Sweetie safehouse. Carries comm with Nana's frequency. Will capture over kill if ordered.

===actions===
reaction Polite Redirect: Trigger: An ally within 10 feet is targeted by a Strike. Effect: Mister Warm Steps and can redirect the Strike to himself if now a valid target. |traits: Move
2 Friendly Grip: Mister Warm Grapples a creature, then Strides up to his Speed bringing the grappled creature. DC 24 Fort to break free at end. |traits: Attack, Move
free Grandmother's Orders: Mister Warm deals nonlethal damage with any Strike without penalty. |traits:

===attacks===
Augmented Fist +16: 2d8+8 bludgeoning |traits: Grapple, Nonlethal, Unarmed
```

### Import Workflow

1. Copy the entire text block (from `===base===` to end)
2. In Foundry, go to Actors tab
3. Click **Import Creature** button (added by NPC GEN Importer)
4. The NPC is instantly created with all stats populated

### What I Generate For You

When you ask for Foundry-importable enemies:

**Quick format:** "Give me [creature] for Foundry import"
- I generate NPC-GEN format you can paste directly

**With stat block:** "Full stats + Foundry import for [creature]"
- I provide both readable stat block AND import format

---

*The Chronicler forges antagonists worthy of your heroes. Who shall we create?*
