/** Signature and prepared spells by printed lore. Summaries only; full casting pages live in the Rules tab. */

export interface SpellDef {
  name: string;
  lore: string;
  kind: string;
  casting: string;
  blurb: string;
}

export const SPELLS: SpellDef[] = [
  { name: "Arcane Missile", lore: "Sanctioned Magic", kind: "attack", casting: "7+", blurb: 'Closest visible enemy within 15" is hit at Rend -1, Damage d3. Critical 10+: Damage +1.' },
  { name: "Flaming Weapon", lore: "Sanctioned Magic", kind: "enchant", casting: "7+", blurb: 'One melee weapon on a visible friend within 6" gains Arcane and +1 Rend until the end of the round. Critical 10+: range 12".' },
  { name: "Eldritch Barrier", lore: "Sanctioned Magic", kind: "cantrip", casting: "7+", blurb: 'A line between two visible points within 9" of the caster. Ranged attacks across it are at -1; fighters who activate in it or cross it suffer d3 damage. Critical 10+: points may be 9" apart.' },
  { name: "Silence", lore: "Sanctioned Magic", kind: "hex", casting: "7+", blurb: 'A visible enemy wizard or priest within 12" cannot take arcane actions this round. Critical 10+: range 18".' },
  { name: "Torrent of Fire", lore: "Sanctioned Magic", kind: "attack", casting: "8+", blurb: "Flame template. Each fighter under it is hit at Rend -1, Damage d3+1. Critical 12+: Rend -2." },
  { name: "Umbral Vortex", lore: "Sanctioned Magic", kind: "attack", casting: "9+", blurb: 'Blast within 15", then scatter d6". Hits at Rend -1, Damage d3+1. Stays until the end of the round and hits again. Critical 13+: no scatter.' },

  { name: "Healing Essence", lore: "Lore of the Saints", kind: "healing", casting: "6+", blurb: 'A visible friend within 15" heals d3. Critical 10+: heal 3.' },
  { name: "Bless Thy Blade", lore: "Lore of the Saints", kind: "enchant", casting: "7+", blurb: 'A visible friend within 9" adds 1 to melee hit rolls until the end of the round. Critical 10+: pick up to 2 friends.' },
  { name: "Godspeed", lore: "Lore of the Saints", kind: "aura", casting: "6+", blurb: 'Until the end of the round, friends who start a move within 9" add 1" to that move. Critical 10+: aura 12".' },
  { name: "Will of the Saints", lore: "Lore of the Saints", kind: "enchant", casting: "7+", blurb: 'A visible friend within 15" improves Armour by 1, to a maximum of 2+, until the end of the round. Critical 10+: up to 2 friends.' },
  { name: "Holy Strength", lore: "Lore of the Saints", kind: "aura", casting: "7+", blurb: "Friends within 6\" add 1 to melee Critical Damage until the end of the round. Critical 10+: aura 9\"." },
  { name: "Consecrated Ground", lore: "Lore of the Saints", kind: "aura", casting: "8+", blurb: 'A visible point on the floor within 12". Friends within 3" improve Armour by 1. Stays until a failed Willpower test, recast, or the caster is taken down. Critical 12+: radius 6".' },

  { name: "Shadow Leap", lore: "Lore of the Under-Tunnels", kind: "cantrip", casting: "7+", blurb: 'Remove a visible friend within 3" and set them up within 9" of the caster, not engaged. Critical 10+: 12".' },
  { name: "Doom", lore: "Lore of the Under-Tunnels", kind: "hex", casting: "6+", blurb: 'A visible enemy within 12" must re-roll one attack, parry or armour roll the next time you choose. Critical 10+: range 18".' },
  { name: "Chain Lightning", lore: "Lore of the Under-Tunnels", kind: "attack", casting: "8+", blurb: 'Closest visible enemy within 12" is hit at Rend -1, Damage d3, then another within 3" of that target. Critical 12+: a third target.' },
  { name: "Tunnel from Below", lore: "Lore of the Under-Tunnels", kind: "cantrip", casting: "8+", blurb: 'Blast on the floor within 12", then scatter d6". Set up d3 friends from reserve in the template, not engaged. Critical 12+: range 15".' },
  { name: "Gathering Shadows", lore: "Lore of the Under-Tunnels", kind: "aura", casting: "7+", blurb: "Friends within 6\" are in cover until the end of the round. Critical 10+: aura 9\"." },
  { name: "Bouncing Blast", lore: "Lore of the Under-Tunnels", kind: "attack", casting: "9+", blurb: 'Blast within 15", scatter d6", hit at Rend -1, Damage d3, then scatter and hit again. Critical 12+: first placement does not scatter.' },

  { name: "Spray of Vomit", lore: "Lore of Poxes", kind: "attack", casting: "7+", blurb: "Flame template. Hits at Rend -1, Damage 1. Critical 10+: Damage d3." },
  { name: "Fetid Blades", lore: "Lore of Poxes", kind: "enchant", casting: "7+", blurb: 'One melee weapon on a friend within 6" gains Arcane and Poison until the end of the round. Critical 10+: range 12".' },
  { name: "Rabid Fervour", lore: "Lore of Poxes", kind: "aura", casting: "7+", blurb: "Friends within 6\" add 1 to melee attack rolls until the end of the round. Critical 10+: aura 9\"." },
  { name: "Rotten Armour", lore: "Lore of Poxes", kind: "hex", casting: "7+", blurb: 'A visible enemy within 18" worsens Armour by 1, to a minimum of "-", until the end of the round. Critical 12+: for the rest of the battle.' },
  { name: "Dark Vitality", lore: "Lore of Poxes", kind: "healing", casting: "6+", blurb: "Each friend within 3\" heals 1. Critical 10+: range 6\"." },
  { name: "Plague Bomb", lore: "Lore of Poxes", kind: "attack", casting: "8+", blurb: 'Blast within 12", scatter d6", hit at Rend -, Damage d3, and those fighters are poisoned. Critical 12+: no scatter.' },

  { name: "Witchfire", lore: "Lore of Necromancy", kind: "attack", casting: "8+", blurb: 'Place d3 witchfire tokens (max 3). Spend one as a bonus action: closest visible enemy within 12" is hit at Rend -, Damage d3. Critical 12+: place 3 tokens.' },
  { name: "Ethereal Armour", lore: "Lore of Necromancy", kind: "enchant", casting: "8+", blurb: 'A visible friend within 6" improves Armour by 1, to a maximum of 2+, until the end of the round. Critical 12+: range 12".' },
  { name: "Raise Zombie", lore: "Lore of Necromancy", kind: "summon", casting: "9+", blurb: 'Add a Zombie within 3", not engaged, until taken down. At most 3 summoned fighters. Critical 12+: set up within 9".' },
  { name: "Twilight Translocation", lore: "Lore of Necromancy", kind: "cantrip", casting: "7+", blurb: 'Another visible friend within 6" is removed and set up within 15" of the caster, not engaged. Critical 12+: 18".' },
  { name: "Death Blast", lore: "Lore of Necromancy", kind: "attack", casting: "9+", blurb: 'Blast within 12", scatter d6", hit at Rend -1, Damage d3+1. Critical 12+: no scatter.' },
  { name: "Balefire", lore: "Lore of Necromancy", kind: "attack", casting: "9+", blurb: "Flame template. Hits at Rend -2, Damage d3. Critical 13+: Damage +1." },

  { name: "Draw Blood", lore: "Lore of Blood", kind: "attack", casting: "7+", blurb: 'Closest visible enemy within 9" suffers 1 damage and the caster heals 1. Critical 10+: 2 damage and heal 2.' },
  { name: "Cursed Blades", lore: "Lore of Blood", kind: "enchant", casting: "7+", blurb: 'One melee weapon on a friend within 6" gains Arcane and Poison until the end of the round. Critical 10+: range 12".' },
  { name: "Raise Skeleton", lore: "Lore of Blood", kind: "summon", casting: "10+", blurb: 'Add a Skeleton within 3" with cuirass, shield, and a club, spear or sword. At most 3 summoned fighters. Critical 14+: set up within 9".' },
  { name: "Recall", lore: "Lore of Blood", kind: "cantrip", casting: "7+", blurb: 'A friendly thrall is removed and set up within 3" of the caster, not engaged. Critical 10+: up to 2 thralls.' },
  { name: "Bat Scream", lore: "Lore of Blood", kind: "hex", casting: "8+", blurb: "Flame template. Each fighter under it suffers 1 damage and passes Willpower or is at -1 to attack and parry this round. Critical 10+: those tests are at -1." },
  { name: "Sanguine Spear", lore: "Lore of Blood", kind: "attack", casting: "10+", blurb: 'A 12" line, 1" wide. Each visible enemy it crosses is hit at Rend -2, Damage d3. Caster heals 1 per damage dealt. Critical 14+: line is 15".' },

  { name: "Swollen Form", lore: "Lore of Blessed Maggots", kind: "enchant", casting: "7+", blurb: 'A visible friend within 9" ignores the first 3 damage they suffer this round. Critical 10+: range 12".' },
  { name: "Black Mire", lore: "Lore of Blessed Maggots", kind: "hex", casting: "8+", blurb: 'A visible floor point within 6". Until the end of the round, floor within 6" of it costs non-Cloister fighters 2" extra to cross. Critical 12+: radius 9".' },
  { name: "Erupting Sores", lore: "Lore of Blessed Maggots", kind: "attack", casting: "8+", blurb: 'Closest visible enemy within 9" suffers d3 damage, then passes Willpower or scatters d6" if still standing. Critical 12+: range 12".' },
  { name: "Rain of Filth", lore: "Lore of Blessed Maggots", kind: "healing", casting: "7+", blurb: 'Blast within 12", scatter d6". Each fighter under it heals d3. Critical 12+: no scatter.' },
  { name: "Putrid Blessing", lore: "Lore of Blessed Maggots", kind: "enchant", casting: "8+", blurb: 'A friend within 6" gains Arcane and Poison on their melee weapons until the end of the round. Critical 10+: range 12".' },
  { name: "Black Bile", lore: "Lore of Blessed Maggots", kind: "attack", casting: "9+", blurb: "Flame template. Hits at Rend -1, Damage d3. Critical 14+: each fighter hit passes Willpower or is poisoned." },

  { name: "Summon Rotling", lore: "Demonic Lore of Rot", kind: "summon", casting: "9+", blurb: 'Add a Rotling within 3", not engaged, until taken down. At most 3 summoned fighters. Critical 14+: set up within 9".' },
  { name: "Demonic Strength", lore: "Demonic Lore of Rot", kind: "enchant", casting: "8+", blurb: "A friendly demon or beastman within 6\" adds 1 to melee Damage and Critical Damage until the end of the round. Critical 12+: two targets." },
  { name: "Rotten Insides", lore: "Demonic Lore of Rot", kind: "hex", casting: "6+", blurb: 'Closest visible enemy within 9" suffers 1 damage. If they stand, Move is 2" until they pass Willpower at the end of an activation. Critical 12+: range 12".' },
  { name: "Plague Wind", lore: "Demonic Lore of Rot", kind: "hex", casting: "6+", blurb: 'Blast within 15". Each enemy under it passes Willpower or is poisoned. Critical 10+: those tests are at -1.' },
  { name: "Protective Shroud", lore: "Demonic Lore of Rot", kind: "enchant", casting: "8+", blurb: 'A friendly demon or beastman within 6" improves Armour by 1 until the end of the round. Critical 12+: range 12".' },
  { name: "Plague Pit", lore: "Demonic Lore of Rot", kind: "cantrip", casting: "9+", blurb: 'Blast on visible floor within 9". Fighters under it are set at the edge, then pass Initiative or suffer d3 damage and are poisoned. Critical 14+: range 12".' },
];

export const SPELL_BY_NAME: Record<string, SpellDef> = Object.fromEntries(SPELLS.map((spell) => [spell.name, spell]));

export const LORE_SPELLS: Record<string, string[]> = Object.fromEntries(
  [...new Set(SPELLS.map((spell) => spell.lore))].map((lore) => [
    lore,
    SPELLS.filter((spell) => spell.lore === lore).map((spell) => spell.name),
  ]),
);

/** Lore keys that apply when a fighter's lore string names one or more lores. */
export function loresForFighter(lore: string | undefined): string[] {
  if (!lore) return [];
  if (lore in LORE_SPELLS) return [lore];
  if (lore.includes("Blessed Maggots") && lore.includes("Demonic Lore of Rot")) {
    return ["Lore of Blessed Maggots", "Demonic Lore of Rot"];
  }
  return Object.keys(LORE_SPELLS).filter((name) => lore.includes(name.replace(/^Lore of /, "").replace(/^Demonic /, "")));
}

export function spellsForLore(lore: string | undefined): string[] {
  return loresForFighter(lore).flatMap((name) => LORE_SPELLS[name] ?? []);
}

export function spellDefsForLore(lore: string | undefined): SpellDef[] {
  return spellsForLore(lore).map((name) => SPELL_BY_NAME[name]).filter((spell): spell is SpellDef => Boolean(spell));
}

export function spellTooltip(spell: SpellDef): string {
  return `${spell.kind} · casting ${spell.casting}. ${spell.blurb}`;
}
