export type RuleArticle = {
  section: string;
  title: string;
  body: string;
};

export const RULE_SECTIONS = [
  "Start here",
  "Core",
  "Battle",
  "Weapons",
  "Magic",
  "Scenarios",
  "Warbands",
  "Factions",
  "Fighters",
  "Wargear",
  "Skills",
] as const;

export const ARTICLES: RuleArticle[] = [
  {
    section: "Start here",
    title: "Rules index",
    body: `Playtest v1.02 reference for the table. Search the box, or open a section. A name in brackets, such as [[Melee attacks]], jumps to that page. Fighter scrolls, gear and skills are generated from the roster catalogue.

- [[Dice]], [[Measuring]], [[Visibility]], [[Fighter values]], [[Life and bloodied]]
- [[Wargear slots]], [[Terrain]], [[Fear]], [[Poison]]
- [[Setting up a battle]], [[Rounds]], [[Activation]], [[Moves]], [[Hide]]
- [[Melee attacks]], [[Ranged attacks]], [[Resolving hits]], [[Weapon traits]], [[Templates]]
- [[Casting spells]], then each lore
- [[Scenarios]], [[Treasure]], [[Reinforcements]]
- [[Recruiting a warband]], [[Warband rating]], [[Experience and injuries]]
- [[Guild Mercenaries]], [[Verminkin]], [[Death Covens]], [[The Blighted Cloister]]`,
  },
  {
    section: "Core",
    title: "Dice",
    body: `The game uses six-sided dice and a direction dice (an arrow on each face). A d12 can stand in for the direction dice: pick a table edge as 12 o'clock.

- A d6 is one die. 2d6 and 3d6 are added together.
- d6x2 means roll, then multiply. 2d6x5 works the same way.
- A d3 is a d6 halved, rounding up. 1–2 is 1, 3–4 is 2, 5–6 is 3.
- A d66 is two d6. The first die is the tens, the second is the units. A 3 then a 5 is 35.
- 3+ means 3 or more after modifiers.
- A natural roll ignores modifiers. A natural 6 is still a 6 if something subtracts 1.
- A re-roll lets you roll the stated dice again. A roll is never re-rolled more than once.
- A roll-off is one die each. Highest wins. Ties roll again.
- Scatter: roll the direction dice and move that way by the stated distance, horizontally unless a rule says otherwise. See [[Moves]].`,
  },
  {
    section: "Core",
    title: "Measuring",
    body: `Distances are in inches. You may measure at any time.

Between fighters, measure from the closest points of the bases. Unless a rule says horizontal or vertical only, count both.

The usual battlefield is 36" by 36", or 30" by 44". Players build a ruined district together. "The battlefield" includes terrain and platforms. "The battlefield floor" is the ground only, plus the base a terrain piece stands on.

See [[Terrain]] and [[Visibility]].`,
  },
  {
    section: "Core",
    title: "Visibility",
    body: `A fighter is visible if a straight line can be drawn from any part of its body (head, torso or limbs) to the observer's head without passing through solid terrain or another fighter. Facing does not matter.

Weapons, banners, feathers, spikes and tails do not count. A point on the battlefield is visible by the same test. A fighter is visible to itself.

Obscured: some of the body is visible and some is hidden by solid terrain or another fighter. An obscured target is in cover against ranged attacks. See [[Ranged attacks]].

Hidden fighters are not visible to enemies they are obscured from. See [[Hide]].`,
  },
  {
    section: "Core",
    title: "Fighter values",
    body: `Every fighter has seven values. Low is better for Blade, Bow and Armour. High is better for Move, Initiative, Willpower and Life.

- Move: furthest a normal move can go. A typical human is 5".
- Blade: the roll needed to hit in melee. Blade 4+ hits on 4, 5 or 6.
- Bow: the roll needed to hit at range.
- Armour: the roll needed to save a hit. 6+ is cloth. 3+ is heavy armour and a shield. Improving armour lowers the number (6+ becomes 5+). Worsening raises it. 2+ cannot improve. A worsened 6+ becomes "-", and no armour roll is made. "-" cannot get worse.
- Initiative: added to a die to see who strikes first, and used for falling tests.
- Willpower: grit, and the number added when casting. See [[Casting spells]].
- Life: damage a fighter can take. A typical human has 4.

An Initiative or Willpower test is a die roll that must be equal to or lower than the value. Higher fails.

Keywords sit under the title. A rule that names a keyword only affects fighters with it. "Other friendly fighters" excludes the fighter itself.

See [[Life and bloodied]] and [[Recruiting a warband]].`,
  },
  {
    section: "Core",
    title: "Life and bloodied",
    body: `A fighter starts the battle at its Life value. Damage reduces life by that amount. Healing restores life already lost, never above Life.

At 0 life the fighter is taken down and removed. That is not automatically death. After the battle, roll on the injury table that applies. See [[Experience and injuries]].

Bloodied means exactly 1 life left. On that activation the fighter may make a move or an action, not both. Bonus actions are still allowed. If they are healed during the activation, the limit lifts for the rest of it.

See [[Activation]] and [[Flee tests]].`,
  },
  {
    section: "Core",
    title: "Wargear slots",
    body: `A fighter may carry 2 melee weapons, 1 ranged weapon, 1 suit of armour and 2 items, unless a scroll says otherwise.

Armour replaces the Armour value on the scroll. Some armour forbids two-handed ranged weapons. Full-plate allows a brace of pistols as the exception.

A held item, such as a shield, uses a melee slot instead of an item slot. It can sit beside a two-handed melee weapon, but that weapon loses 1 Attack. A held item cannot be taken with a two-handed ranged weapon.

Silver is written "20s". Rare 0-1 means only one fighter in the warband may carry that item. See [[Weapon traits]] and the gear pages.`,
  },
  {
    section: "Core",
    title: "Terrain",
    body: `Agree what each piece is before the battle.

- Low terrain is under 1.5" tall (rubble, low walls). Crossing it costs 1" of movement. See [[Moves]].
- High terrain is a wall of 1.5" or more. It can be climbed.
- A platform is a flat surface larger than 1" by 1". The base may overhang, but its centre must stay on the platform.
- Ladders, doors and windows have their own movement costs.
- Deadly terrain (spikes, acid) deals d3 damage if a fighter moves across it or falls onto it.
- Impassable terrain cannot be climbed, crossed, or ended on, unless the fighter can fly. If a fighter is forced onto it, slide them off by the shortest route.

Falling off a platform: after an action, a fighter within ½" of an open edge who just suffered damage must pass an Initiative test or fall. Fly ignores this. See [[Moves]].`,
  },
  {
    section: "Core",
    title: "Fear",
    body: `A fighter that causes fear forces an enemy who starts an activation engaged with them to pass a Willpower test. Failure ends that activation immediately.

Enemies who also cause fear ignore it. [[Unshakeable]] ignores fear and scatter.`,
  },
  {
    section: "Core",
    title: "Poison",
    body: `A critical hit from a Poison weapon that deals damage poisons the target. Each time a poisoned fighter activates, they suffer 1 damage. Poison ends if they are healed or if they have 1 life left.

Demons and Undead cannot be poisoned.

See [[Weapon traits]].`,
  },
  {
    section: "Battle",
    title: "Setting up a battle",
    body: `1. The lower [[Warband rating]] is the underdog. Equal ratings roll off, and the winner is the underdog. The underdog wins priority ties and takes some tests first.
2. Roll the [[Scenarios]] table.
3. Follow that scenario's before-the-battle steps.
4. Each wizard and priest prepares spells. See [[Casting spells]].
5. Other before-the-battle rules, underdog first.
6. Start round 1. See [[Rounds]].`,
  },
  {
    section: "Battle",
    title: "Rounds",
    body: `Each round:

1. Priority roll. Roll off. The winner chooses who activates first. The underdog wins a tie.
2. Start of round. Scenario rules, reinforcements and similar. If several apply, priority chooses the order. Skip the step if nothing applies.
3. Fighters activate, alternating, until every fighter on the table has activated. See [[Activation]].
4. End of round, same ordering rule as the start.
5. [[Flee tests]].

The battle ends when a warband flees, or when the scenario says it ends. If several rules happen at once on your activation, you choose the order. Outside an activation, roll off and the winner chooses.`,
  },
  {
    section: "Battle",
    title: "Activation",
    body: `Players alternate picking a fighter who has not activated. Every fighter on the battlefield must activate once. Priority chooses who takes the first turn of the round.

An activation is 1 move and 1 action, in either order. Either or both may be skipped.

Moves: normal, run, charge, disengage. See [[Moves]].
Actions: [[Hide]], [[Melee attacks]], [[Ranged attacks]], or an arcane action. See [[Casting spells]].

A bonus action is extra. A fighter may take as many as rules allow, including while bloodied or surging.

Surge: once you have no one left to activate and the opponent does, you may pick someone who already activated. They get a move or an action, not both. Each fighter surges at most once a round. Bloodied fighters surge as normal. When everyone has also surged, the opponent finishes their remaining activations.

A bloodied fighter gets a move or an action, not both, plus any bonus actions. See [[Life and bloodied]].`,
  },
  {
    section: "Battle",
    title: "Moves",
    body: `Engaged means within 1" of an enemy.

- Normal: up to Move, not while engaged, and not into 1" of an enemy.
- Run: not engaged, and no action yet this activation. Move + d6", not into 1" of an enemy. No action afterwards.
- Charge: not engaged, and no action yet. Move + d6", and the move must end within 1" of an enemy. If it cannot, the fighter does not move and the activation ends.
- Disengage: while engaged, pass an Initiative test. Failure spends the move and leaves them in place. Success: up to 3", ending more than 1" from every enemy.

Movement limits: no moving through fighters or terrain, except doors and windows. No part of the base crosses the battlefield edge.

Low terrain, and each door or window, costs 1" of the move. Only a normal move may pass a closed door. Beasts cannot use closed doors.

Jumping from a platform edge: up to 3" horizontal through the air, up to 1" up, any distance down. Only the horizontal distance counts. A drop of 3" or more is impact. Ending still in the air means an immediate fall.

Falling is straight down to a floor or platform. A drop of 3" or more is impact. Fighters landed on are pushed out until they are more than 1" away, then each passes an Initiative test or suffers d3 damage.

Impact: one die per whole inch dropped. Each 4+ is 1 damage.

Climbing a ladder costs 1", then the fighter is placed at the other end. Enemies blocking the end stop the climb, except a charge, which may be placed engaged with them. Beasts cannot climb. Climbing high terrain keeps the fighter within ½" of the wall and may move up and down. While climbing they cannot take actions, and a hit forces an Initiative test or they fall.

Fly: horizontal distance counts, vertical does not. They cannot end the move in the air.

Scatter: direction dice, then the stated inches. Low terrain, doors and windows still cost 1". High terrain stops them. A platform edge is an Initiative test: pass to stop at the edge, fail to fall and then finish the distance. They stop when they touch another fighter. Becoming engaged this way is not a charge.`,
  },
  {
    section: "Battle",
    title: "Hide",
    body: `Hide is an action. The fighter must not be engaged, must be touching terrain, and must be more than 3" from every enemy. Place a token.

While hidden, they are not visible to enemies they are obscured from, so those enemies cannot shoot them. Hidden lasts until the start of their next activation. It ends early if they move off terrain or come within 3" of an enemy.

Hiding does nothing against blast or flame templates. See [[Templates]].`,
  },
  {
    section: "Battle",
    title: "Melee attacks",
    body: `A fighter who is engaged may take the melee attack action.

1. Pick one enemy they are engaged with. The activator is the attacker. The other is the defender. Both fight.
2. Each side picks a melee weapon. A second weapon with Off-hand may be used as well, unless the fighter has a two-handed weapon. An off-hand weapon makes 1 attack roll, not its full Attacks value. A fighter with no melee weapon uses Unarmed Strike: Attacks 2, Rend -, Damage 1, Critical 1, Natural Weapon.
3. If the attacker charged this activation, they have initiative. Otherwise each side rolls a die and adds Initiative. Higher acts first. Ties go to the attacker. Brace can steal this. See [[Weapon traits]].
4. Both sides roll Attacks dice. A natural 6 is a critical hit. Any other roll that meets Blade is a hit. The rest miss. Unwieldy subtracts 1.
5. Starting with initiative, alternate. An attack resolves one of your hits. A parry spends one of your hits, then rolls a die: 1 fails, 2+ discards one enemy hit. Parrying a critical hit spends one of your critical hits, unless a rule says otherwise. Guard can spend a miss instead, once. Continue until both sides are done or someone is taken down.

Then resolve each landed hit. See [[Resolving hits]].`,
  },
  {
    section: "Battle",
    title: "Ranged attacks",
    body: `A fighter with a ranged weapon who is not engaged may take this action.

Pick the weapon and a target within its Range. The target must be the closest visible enemy who is not engaged. If that closest fighter is obscured, you may shoot the closest visible enemy who is not obscured instead.

Roll Attacks dice. A natural 6 is a critical. Any other roll that meets Bow is a hit. Then resolve the hits. See [[Resolving hits]].

Cover: an obscured target improves Armour by 1, to a maximum of 2+.

Heavy weapons cannot both move and shoot in the same activation. Reload weapons must spend a later move or action before they fire again. See [[Weapon traits]].`,
  },
  {
    section: "Battle",
    title: "Resolving hits",
    body: `Used for melee, ranged and attack spells.

1. Armour roll. Equal or better than Armour saves the hit. Rend modifies the roll (Rend -1 means 4+ armour saves on 5+). If Armour is "-", or Rend makes a save impossible, skip the roll.
2. Each unsaved hit deals the weapon's Damage. A critical hit deals Critical Damage instead.

Bludgeon still deals 1 damage when a critical hit is saved. See [[Weapon traits]] and [[Poison]].`,
  },
  {
    section: "Battle",
    title: "Flee tests",
    body: `At the end of the round, a warband with 5 or more fighters bloodied or taken down takes a flee test. If both do, the underdog tests first. A failed test ends the battle immediately.

Roll a die. 1 fails. 2+ passes. A player may choose to fail without rolling.

The battle also ends when the scenario's victory condition says so. See [[Scenarios]].`,
  },
  {
    section: "Weapons",
    title: "Weapon traits",
    body: `- Arcane: critical hits on a natural 5 or 6.
- Blast: uses the blast template. A miss that is not a misfire scatters d6x2" and then hits. See [[Templates]].
- Bludgeon: a saved critical hit still deals 1 damage.
- Brace: if you are the defender and the attacker charged, you automatically have initiative.
- Flame: flame template, automatic hits, never a critical. See [[Templates]].
- Guard: once per melee action, a parry may spend a miss from this weapon instead of a hit.
- Heavy: cannot attack if you moved this activation, and cannot move after you attack with it. Spending the move to reload still allows the shot.
- Misfire: any natural 1 on the attack roll misfires after the other dice are resolved. 1 backfire: d3 damage to the firer and the weapon is done for the battle. 2 clogged: the weapon is done for the battle. 3–6 flash: the attack misses.
- Natural Weapon: its attacks cannot parry.
- Off-hand: may be the second weapon, and then makes 1 attack roll.
- One-use: once per battle.
- Poison: see [[Poison]].
- Rare 0-x: only that many fighters may carry one.
- Reload: after it fires, spend a move or an action before it can fire again.
- Scare: after the attack, each fighter hit who is not engaged takes a Willpower test or scatters d6".
- Two-handed: only one such weapon. No off-hand attack while it is equipped.
- Unwieldy: -1 to attack rolls.
- Volley: assign each attack to the normal target or to another visible, unengaged enemy within 3" of that target, then resolve them.
- Wrap: these attacks cannot be parried, and cannot be used to parry.`,
  },
  {
    section: "Weapons",
    title: "Templates",
    body: `Blast: place it before the attack roll, centred on any visible point within range. It does not have to be the closest enemy. Fighters under it are hit. Anyone engaged with a fighter who is hit is also hit. Fighters 3" or more above or below the centre are not hit. Visibility and cover are judged from the centre. Hiding is ignored. Fighters not visible to the centre are not hit. A miss scatters the template d6x2" and then resolves as a hit, unless the weapon also misfired, in which case the template is removed. Scattering off a platform counts only horizontal distance. High terrain stops the scatter at its edge.

Flame: lay the template flat, narrow end touching the attacker's base, any direction. No attack rolls. Everyone under it is hit, and so is anyone engaged with them. Fighters 3" or more above or below are not hit. Hiding is ignored. Fighters not visible to the attacker are not hit. Nobody is in cover from flame.`,
  },
  {
    section: "Magic",
    title: "Casting spells",
    body: `Wizards and priests know one or more spell lores, listed on their scroll. When recruited, they pick the stated number of signature spells from those lores. Before each battle, they also prepare 1 random spell from each lore they know. If the roll is a signature spell, or a duplicate of another roll you are allowed to make, follow the scroll's duplicate rule for that caster. Some origins let one caster choose the prepared spell instead of rolling.

An arcane action is either Draw power or Cast a spell.

Draw power: place a token. On the next activation, if they cast, the casting roll gains one extra die. If they do not cast, the token is lost at the end of that activation.

Cast: pick a prepared spell and roll 1 die, or 2 if power was drawn. Add Willpower to the dice. Meeting the casting value casts the spell. Meeting the critical value also applies the critical effect.

Miscast: a single die miscasts on a natural 1. Two or more dice miscast if any show the same number. Then roll 2d6:
- 2: the spell fails, the caster is taken down, and a blast template centred on them deals d6 damage to other fighters under it.
- 3–5: the spell fails, and a blast template on the caster deals d3 damage to fighters under it.
- 6–7: the spell fails and the caster cannot take arcane actions for the rest of the battle.
- 8+: the caster suffers d3 damage. If they are not taken down, the spell is critically cast.

Lores: [[Sanctioned Magic]], [[Lore of the Saints]], [[Lore of the Under-Tunnels]], [[Lore of Poxes]], [[Lore of Necromancy]], [[Lore of Blood]], [[Lore of Blessed Maggots]], [[Demonic Lore of Rot]].`,
  },
  {
    section: "Magic",
    title: "Sanctioned Magic",
    body: `d6 lore for Guild wizards.

1. Arcane Missile, attack, 7+. The closest visible enemy within 15" is hit at Rend -1, Damage d3. Critical 10+: Damage +1.
2. Flaming Weapon, enchant, 7+. One melee weapon on a visible friend within 6" gains Arcane and +1 Rend until the end of the round. Critical 10+: range 12".
3. Eldritch Barrier, cantrip, 7+. A line between two visible points within 9" of the caster, within 6" of each other, at the same height. Until the end of the round or the caster falls, ranged attacks across it are at -1, and anyone who activates in it or crosses it suffers d3 damage. Critical 10+: the points may be 9" apart.
4. Silence, hex, 7+. A visible enemy wizard or priest within 12" cannot take arcane actions this round. Critical 10+: range 18".
5. Torrent of Fire, attack, 8+. Flame template. Each fighter under it is hit at Rend -1, Damage d3+1. Critical 12+: Rend -2.
6. Umbral Vortex, attack, 9+. Blast within 15", then scatter d6". Hits at Rend -1, Damage d3+1. The vortex stays until the end of the round: it blocks line of sight on that elevation, and fighters who start in it or cross it are hit again. Critical 13+: it does not scatter.`,
  },
  {
    section: "Magic",
    title: "Lore of the Saints",
    body: `d6 lore for Guild clerics.

1. Healing Essence, healing, 6+. A visible friend within 15" heals d3. Critical 10+: heal 3.
2. Bless Thy Blade, enchant, 7+. A visible friend within 9" adds 1 to melee hit rolls until the end of the round. Critical 10+: pick up to 2 friends.
3. Godspeed, aura, 6+. Until the end of the round, friends who start a move within 9" add 1" to that move. Critical 10+: aura 12".
4. Will of the Saints, enchant, 7+. A visible friend within 15" improves Armour by 1, to a maximum of 2+, until the end of the round. Critical 10+: up to 2 friends.
5. Holy Strength, aura, 7+. Friends within 6" add 1 to melee Critical Damage until the end of the round. Critical 10+: aura 9".
6. Consecrated Ground, aura, 8+. A visible point on the floor within 12". Friends within 3" improve Armour by 1. It stays in play. At the start of the caster's activation they pass a Willpower test or it ends. Casting it again ends the previous one. It ends if the caster is taken down. Critical 12+: the radius is 6".`,
  },
  {
    section: "Magic",
    title: "Lore of the Under-Tunnels",
    body: `d6 lore for the Verminkin warlock.

1. Shadow Leap, cantrip, 7+. Remove a visible friend within 3" and set them up within 9" of the caster, not engaged. Critical 10+: 12".
2. Doom, hex, 6+. A visible enemy within 12" must re-roll one attack, parry or armour roll the next time you choose, then the doom ends. Critical 10+: range 18".
3. Chain Lightning, attack, 8+. The closest visible enemy within 12" is hit at Rend -1, Damage d3. Then one enemy within 3" of that target and visible to it is hit the same way. Critical 12+: a third target within 3" of the first two.
4. Tunnel from Below, cantrip, 8+. Blast on the floor within 12", then scatter d6". Set up d3 friends from reserve in the template, not engaged. Critical 12+: range 15".
5. Gathering Shadows, aura, 7+. Friends within 6" are in cover until the end of the round. Critical 10+: aura 9".
6. Bouncing Blast, attack, 9+. Blast within 15", scatter d6", hit at Rend -1, Damage d3, then scatter d6" and hit again. Critical 12+: the first placement does not scatter.`,
  },
  {
    section: "Magic",
    title: "Lore of Poxes",
    body: `d6 lore for pox priests.

1. Spray of Vomit, attack, 7+. Flame template. Hits at Rend -1, Damage 1. Critical 10+: Damage d3.
2. Fetid Blades, enchant, 7+. One melee weapon on a friend within 6" gains Arcane and Poison until the end of the round. Critical 10+: range 12".
3. Rabid Fervour, aura, 7+. Friends within 6" add 1 to melee attack rolls until the end of the round. Critical 10+: aura 9".
4. Rotten Armour, hex, 7+. A visible enemy within 18" worsens Armour by 1, to a minimum of "-", until the end of the round. Critical 12+: for the rest of the battle.
5. Dark Vitality, healing, 6+. Each friend within 3" heals 1. Critical 10+: range 6".
6. Plague Bomb, attack, 8+. Blast within 12", scatter d6", hit at Rend -, Damage d3, and those fighters are poisoned. Critical 12+: it does not scatter.`,
  },
  {
    section: "Magic",
    title: "Lore of Necromancy",
    body: `d6 lore for necromancers.

1. Witchfire, attack, 8+. Place d3 witchfire tokens by the caster, to a maximum of 3. Once per activation, spend one as a bonus action: the closest visible enemy within 12" is hit at Rend -, Damage d3. Critical 12+: place 3 tokens instead of d3.
2. Ethereal Armour, enchant, 8+. A visible friend within 6" improves Armour by 1, to a maximum of 2+, until the end of the round. Critical 12+: range 12".
3. Raise Zombie, summon, 9+. Add a Zombie within 3", not engaged, until it is taken down. A warband can have at most 3 summoned fighters. Critical 12+: set up within 9".
4. Twilight Translocation, cantrip, 7+. Another visible friend within 6" is removed and set up within 15" of the caster, not engaged. Critical 12+: 18".
5. Death Blast, attack, 9+. Blast within 12", scatter d6", hit at Rend -1, Damage d3+1. Critical 12+: it does not scatter.
6. Balefire, attack, 9+. Flame template. Hits at Rend -2, Damage d3. Critical 13+: Damage +1.`,
  },
  {
    section: "Magic",
    title: "Lore of Blood",
    body: `d6 lore for blood wizards.

1. Draw Blood, attack, 7+. The closest visible enemy within 9" suffers 1 damage and the caster heals 1. Critical 10+: 2 damage and heal 2.
2. Cursed Blades, enchant, 7+. One melee weapon on a friend within 6" gains Arcane and Poison until the end of the round. Critical 10+: range 12".
3. Raise Skeleton, summon, 10+. Add a Skeleton within 3", not engaged, with a cuirass, a shield, and a club, spear or sword, until it is taken down. At most 3 summoned fighters. Critical 14+: set up within 9".
4. Recall, cantrip, 7+. A friendly thrall is removed and set up within 3" of the caster, not engaged. Critical 10+: up to 2 thralls.
5. Bat Scream, hex, 8+. Flame template. Each fighter under it suffers 1 damage and passes a Willpower test or is at -1 to attack and parry rolls until the end of the round. Critical 10+: those Willpower tests are at -1.
6. Sanguine Spear, attack, 10+. A 12" line, 1" wide. Each visible enemy it crosses is hit at Rend -2, Damage d3. The caster heals 1 for each damage dealt. Critical 14+: the line is 15".`,
  },
  {
    section: "Magic",
    title: "Lore of Blessed Maggots",
    body: `d6 lore for Cloister sorcerers.

1. Swollen Form, enchant, 7+. A visible friend within 9" ignores the first 3 damage they suffer this round. Critical 10+: range 12".
2. Black Mire, hex, 8+. A visible point on the floor within 6". Until the end of the round, the floor within 6" of it costs non-Cloister fighters 2" extra whenever they cross it. Critical 12+: the radius is 9".
3. Erupting Sores, attack, 8+. The closest visible enemy within 9" suffers d3 damage, then passes a Willpower test or scatters d6" if still standing. Critical 12+: range 12".
4. Rain of Filth, healing, 7+. Blast within 12", scatter d6". Each fighter under it heals d3. Critical 12+: it does not scatter.
5. Putrid Blessing, enchant, 8+. A friend within 6" gains Arcane and Poison on their melee weapons until the end of the round. Critical 10+: range 12".
6. Black Bile, attack, 9+. Flame template. Hits at Rend -1, Damage d3. Critical 14+: each fighter hit passes a Willpower test or is poisoned.`,
  },
  {
    section: "Magic",
    title: "Demonic Lore of Rot",
    body: `d6 lore for rot demons and the Darkcloven Shaman's second lore.

1. Summon Rotling, summon, 9+. Add a Rotling within 3", not engaged, until it is taken down. At most 3 summoned fighters. Critical 14+: set up within 9".
2. Demonic Strength, enchant, 8+. A friendly demon or beastman within 6" adds 1 to melee Damage and Critical Damage until the end of the round. Critical 12+: two targets.
3. Rotten Insides, hex, 6+. The closest visible enemy within 9" suffers 1 damage. If they stand, their Move is 2" until they pass a Willpower test at the end of one of their activations. Critical 12+: range 12".
4. Plague Wind, hex, 6+. Blast within 15". Each enemy under it passes a Willpower test or is poisoned. Critical 10+: those tests are at -1.
5. Protective Shroud, enchant, 8+. A friendly demon or beastman within 6" improves Armour by 1 until the end of the round. Critical 12+: range 12".
6. Plague Pit, cantrip, 9+. Blast on a visible point of floor within 9". Each fighter under it is set up at the pit's edge, not engaged, in an order the caster's player chooses, then passes an Initiative test or suffers d3 damage and is poisoned. The pit blocks floor movement and destroys treasure on it until the end of the round. Critical 14+: range 12".`,
  },
  {
    section: "Scenarios",
    title: "Scenarios",
    body: `Roll a d6.

1. [[A Deadly Encounter]]
2. [[Glimmers in the Dark]]
3. [[No Quarter]]
4. [[The Chapel]]
5. [[Street of Death]]
6. [[The Find]]

Battle groups split the warband into as equal groups as possible. Several scenarios leave groups in reserve. See [[Reinforcements]] and [[Treasure]].

Each scenario then rolls a twist on its own d6 table. The twist pages below carry the ones that change the fight. Read the matching scenario page for deployment distances.`,
  },
  {
    section: "Scenarios",
    title: "Reinforcements",
    body: `In the start-of-round step, priority picks one battle group still in reserve and rolls for each fighter in it. Then the opponent does the same.

- 1–2: no arrival. Roll again next round.
- 3–5: set up within 3" horizontally of a battlefield edge connected to their entry point, more than 6" from enemies.
- 6: set up wholly within 3" of any battlefield edge, more than 6" from enemies.

Some scenarios replace this roll with a fixed edge.`,
  },
  {
    section: "Scenarios",
    title: "Treasure",
    body: `Tokens are about 25mm. During a normal move, a fighter within ½" may pick one up, which costs 1" of that move. They hold one treasure. Remove the token.

Beasts and thralls cannot pick up or hold treasure, and neither can any fighter whose scroll forbids it.

If the carrier is taken down, they drop it. If they take damage and are not taken down, roll at the end of that activation: on a 1 they drop it. Place the token within ½" of them.

A fighter holding treasure who ends a move within 1" of a battlefield edge and is not engaged escapes with it and is removed. The warband claims it.

When a warband flees, roll for each carrier. 1 drops the treasure on the table. 2+ escapes with it.

At the end, the winner claims treasure still on the table. See the scenario for how many escapes win the battle.`,
  },
  {
    section: "Scenarios",
    title: "A Deadly Encounter",
    body: `Two warbands meet and neither backs down. Roll a twist. Ruined streets. Two battle groups each. Roll off for an entry point. The winner deploys one random group wholly within 12" of it. The opponent takes the opposite corner and does the same. The other groups are in reserve and start arriving on round 3.

Victory points: at the end of a round, fighters within 6" of the centre and no enemies there score d3. Each enemy taken down scores 1. At 8 or more, if the score is not tied, the higher total wins. If both have 8 or more and are tied, keep fighting. Otherwise a flee hands the win to the other side.

The first fighter to take an enemy down with an attack earns 10 experience.

Twists: 1 rain after a 5+ at the start of a round past the first, then vision is 12" and misfire rolls are at -1 (minimum 1). 2 a tower at the centre lets leaders or champions within 6" auto-pass flee tests, Hold the Centre scores 3 instead of d3, and the winner may re-roll exploration. 3 three battle groups instead of two. 4 reinforcements from round 6. 5 the trailing player may condemn one enemy at the start of the round; taking them down scores an extra point. 6 the underdog places a chest within 6" of an unused entry; leaders or champions within 3" auto-pass flee tests, and holding it with no enemy within 3" scores 1 extra point at the end of the round. The winner rolls for the chest: 1 empty, 2–5 d6x10 silver, 6 3d6x5 silver.`,
  },
  {
    section: "Scenarios",
    title: "Glimmers in the Dark",
    body: `A race for hidden treasure. Three tokens: the first within 3" of the centre, the others within 8" of the centre and more than 3" from other tokens, players alternating and the underdog placing first. Three battle groups. Deploy one random group within 12" of a chosen entry. Reinforcements from round 2.

Three fighters escaping with treasure wins immediately. Otherwise the side that does not flee wins. Each fighter who escapes with treasure earns 10 experience.

Twists include a cursed coin (carriers pass Willpower or suffer d3, demons and undead ignore it), five tokens of which the first approach within 3" is worthless on 1–2, and Saint Trickster's game (one token, and picking it up scatters the next 3d6" from the centre, up to five).`,
  },
  {
    section: "Scenarios",
    title: "No Quarter",
    body: `A crossroads. Two streets meet in the middle. Three battle groups. Deploy one random group within 9" of a chosen entry. Reinforcements from round 2.

From round 3, at the end of the round, a quarter that contains more of your fighters than the enemy's scores 1 domination mark. Fighters wholly within 6" of the centre belong to no quarter. At 10 or more marks, if the score is not tied, the higher total wins. Otherwise a flee hands the win over.

Each time you score marks, each friendly fighter wholly in that quarter earns 1 experience.

Twists: rolling fog (quarters on 4+, fighters more than 6" apart are not visible if one is in fog), a full deployment within 9" with no reserves, a forsaken quarter the trailing player can shut off from round 4, home quarters scoring 3, a random critical quarter from round 3 that scores an extra mark, and a centre statue that heals d3 at the end of an activation within 6" (not demons or undead).`,
  },
  {
    section: "Scenarios",
    title: "The Chapel",
    body: `A chapel 12" by 16" at the centre. The underdog places 3 treasure tokens inside, each within 1" of a different corner. Three battle groups. Deploy within 9" of an entry. Reinforcements from round 3.

Each enemy taken down scores 1 death mark. At 8 or more, the higher total wins. A tie at 8 or more continues. Otherwise a flee decides it.

Chapel treasure is worth 2d6x5 silver each. The first fighter to finish a move wholly inside earns 10 experience. Prying a sarcophagus lid, if there is one, earns 2d6 experience.

One twist fills the chapel with a storm table: limited vision, a misfire penalty, healing or damage on the floor, +1 melee Attacks inside, or a round that ends at once.`,
  },
  {
    section: "Scenarios",
    title: "Street of Death",
    body: `The underdog is the ambusher. The other side is the defender. A street 5–6" wide runs through dense ruins.

Roll off. The winner picks a defender leader or champion to be the hit. The defender rolls a die and picks that many other fighters to walk with them, none of them leaders or champions. Those fighters deploy on the street, more than 18" from the escape edge the defender chooses. Everyone else in the defender's warband is split into two reserve groups. The ambusher deploys one random group more than 12" from enemies. Their other group is in reserve.

The defender does not take flee tests and cannot choose to flee. If the hit ends a move within 1" of the escape edge and is not engaged, the defender wins. If the hit is taken down, the ambushers win. If the ambushers flee, the defender wins.

Reinforcements use a die for a map edge instead of the usual table. Ambushers arrive from round 2. Defenders arrive from round 3. Set up wholly within 6" of that edge, more than 6" from enemies.

The hit earns 20 experience for escaping. The fighter who takes the hit down earns 20.

Twists include the hit starting drunk (scatter and lose the activation on 1–5 until they sober on a 6, or as soon as they are hurt or engaged; demons and undead ignore it), heavy rain, +3 Life on the hit, a tunnel between two tokens, and both defender groups arriving on round 3.`,
  },
  {
    section: "Scenarios",
    title: "The Find",
    body: `Roll off. The winner is the attacker. A holding 8" by 8" sits at the centre. The defender places 5 treasure tokens within 3" of its centre. Two battle groups each. The attacker deploys one group within 6" of a chosen entry. The defender deploys one group within 3" of the holding. Reinforcements from round 3. Defenders cannot pick up treasure until round 3.

Three fighters escaping with treasure wins at once. Otherwise the side that does not flee wins. Each escape earns that fighter 10 experience.

Twists: a fire that becomes a blaze on 4+ and then an inferno (d3 for crossing the holding, then treasure inside is destroyed on 4+ at the end of the round), the defender taking no flee tests, up to d3 short walls on the holding's edge, reinforcements from round 6, the attacker deploying both groups within 6" of any edge while the defender may grab treasure from round 1, and 8 tokens instead of 5.`,
  },
  {
    section: "Warbands",
    title: "Recruiting a warband",
    body: `1. Pick a faction: [[Guild Mercenaries]], [[Verminkin]], [[Death Covens]] or [[The Blighted Cloister]].
2. Pick an origin. It fixes the leader and the stronghold, and may change a limit.
3. Recruit fighters.
4. Buy wargear from the lists on each scroll.
5. Pick skills. The same skill cannot be on two fighters at once. See [[Skills]].
6. Work out the [[Warband rating]].

The starting purse is 1000 silver. Unspent silver goes to the stash. The stash is not part of the rating.

Limits, unless an origin says otherwise:
- Exactly 1 leader
- 0–3 champions
- At least 5 henchmen
- 0–2 brutes
- 0–3 beasts
- Never more than 15 fighters
- A "0-1" on a scroll is that fighter's own cap

Starting experience is on the scroll, often 20+d6 or 60+d6. Roll it when the fighter is hired.`,
  },
  {
    section: "Warbands",
    title: "Warband rating",
    body: `Add the silver cost of every fighter and their wargear, then add the experience of every fighter who gains experience. Leave the stash out.

The lower rating is the underdog. See [[Setting up a battle]].`,
  },
  {
    section: "Warbands",
    title: "Experience and injuries",
    body: `Fighters who gain experience start with the amount on their scroll. Scenario pages list bonus experience. Skills can add more after a battle. The thresholds for spending experience, and the exploration table, are not printed in this playtest.

When a fighter is taken down, they are not automatically dead. Playtest v1.02 prints two injury tables.

Thralls, including skeletons: roll a d6. 1 they are killed. 2–6 unscathed. Thralls do not gain experience.

Demons: roll a d66. 11–16 banished, and their wargear is lost. 21–36 they miss the next battle. 41–65 unharmed. 66 unharmed, then bonus experience up to the next level after the experience step.

The standard lasting-injury table and the beast injury table are not in this document. Record those results by hand.

A fighter who must miss battles sits out, and the count drops when a battle begins.`,
  },
];
