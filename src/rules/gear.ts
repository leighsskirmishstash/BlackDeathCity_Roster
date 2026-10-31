import type { GearDef } from "./types";

const melee = (
  id: string,
  name: string,
  cost: number,
  attacks: string,
  rend: string,
  damage: string,
  crit: string,
  traits: string[],
  note?: string,
): GearDef => ({
  id,
  name,
  kind: "melee",
  cost,
  attacks,
  rend,
  damage,
  crit,
  traits,
  note,
});

const ranged = (
  id: string,
  name: string,
  cost: number,
  range: string,
  attacks: string,
  rend: string,
  damage: string,
  crit: string,
  traits: string[],
): GearDef => ({
  id,
  name,
  kind: "ranged",
  cost,
  range,
  attacks,
  rend,
  damage,
  crit,
  traits,
});

export const GEAR: GearDef[] = [
  melee("axe", "Axe", 16, "3", "-1", "1", "d3", ["Off-hand"]),
  melee("club", "Club/Mace/Hammer", 14, "3", "-", "1", "d3", ["Bludgeon", "Off-hand"]),
  melee("dagger", "Dagger", 10, "3", "-", "1", "d3", ["Off-hand"]),
  melee("punch-dagger", "Dagger/Punch Dagger", 10, "3", "-", "1", "d3", ["Off-hand"]),
  melee("flail", "Flail", 14, "3", "-", "1", "d3", ["Off-hand", "Wrap"]),
  melee("halberd", "Halberd", 34, "3", "-1", "1", "d3+1", ["Brace", "Two-handed", "Unwieldy"]),
  melee("heavy-axe", "Heavy Axe", 40, "3", "-2", "2", "d3+1", ["Two-handed", "Unwieldy"]),
  melee("spear", "Spear", 16, "3", "-", "1", "d3", ["Brace", "Two-handed"]),
  melee("sword", "Sword", 18, "3", "-", "1", "d3", ["Guard", "Off-hand"]),
  melee("warhammer", "Warhammer", 38, "3", "-1", "2", "d3+1", ["Bludgeon", "Two-handed", "Unwieldy"]),
  melee("zweihander", "Zweihander", 42, "3", "-1", "2", "d3+1", ["Guard", "Two-handed", "Unwieldy"]),
  melee("great-club", "Great Club", 38, "3", "-1", "2", "d3+1", ["Bludgeon", "Two-handed", "Unwieldy"]),
  melee("heavy-flail", "Heavy-Flail", 38, "3", "-1", "2", "d3+1", ["Two-handed", "Unwieldy", "Wrap"]),
  melee("iron-claw", "Iron Claw", 12, "4", "-", "1", "1", ["Off-hand"]),
  melee("staff", "Arcane Staff", 10, "2", "-", "1", "d3", ["Arcane", "Off-hand"]),
  melee("ensorcelled", "Ensorcelled Weapon", 26, "3", "-1", "1", "d3", ["Arcane"]),
  melee("ogre-blade", "Ogre Blade", 36, "3", "-1", "2", "d3+1", ["Off-hand"]),
  melee("ogre-great", "Ogre Great Weapon", 50, "3", "-2", "3", "d3+2", ["Two-handed", "Unwieldy"]),
  melee("ogre-mace", "Ogre Mace", 38, "3", "-1", "2", "d3+1", ["Bludgeon", "Off-hand"]),
  melee("poison-blade", "Poison Blade", 20, "3", "-1", "1", "d3", ["Guard", "Off-hand", "Poison"]),
  melee("ensorcelled-halberd", "Ensorcelled Halberd", 52, "3", "-1", "1", "d3+1", ["Arcane", "Brace", "Two-handed", "Unwieldy"]),
  melee("spark-drill", "Spark-Drill", 62, "3", "-3", "1", "d3+1", ["Arcane", "Two-handed", "Unwieldy"]),
  melee("spark-fists", "Spark-Powered Fists", 60, "3", "-2", "2", "d3+1", ["Arcane", "Bludgeon", "Two-handed", "Unwieldy"]),
  melee("rat-blade", "Rat-Mutant Blade", 36, "3", "-1", "2", "d3+1", ["Off-hand"]),
  melee("cursed-blade", "Cursed Blade", 40, "3", "-1", "1", "d3", ["Arcane", "Guard", "Off-hand", "Poison"]),
  melee("cursed-sword", "Cursed Sword", 40, "3", "-1", "1", "d3", ["Arcane", "Guard", "Poison"], "Listed at 40 silver. The melee table prints Cursed Blade; this uses that profile."),
  melee("great-mace", "Great Mace", 38, "3", "-1", "2", "d3+1", ["Bludgeon", "Two-handed", "Unwieldy"]),
  melee("rot-blade", "Demonic Rot Blade", 45, "3", "-1", "1", "d3", ["Arcane", "Guard", "Poison"]),
  melee("great-rot-blade", "Great Demonic Rot Blade", 70, "3", "-2", "3", "d3+2", ["Arcane", "Bludgeon", "Poison", "Two-handed", "Unwieldy"]),
  melee("vicious-bite", "Vicious Bite", 0, "3", "-", "1", "d3", ["Natural Weapon"]),
  melee("nasty-bite", "Nasty Bite", 0, "4", "-", "1", "1", ["Natural Weapon", "Poison"]),
  melee("oversized-claw", "Oversized Claw", 0, "3", "-", "2", "d3+1", ["Bludgeon", "Natural Weapon"]),
  melee("crushing-bulk", "Crushing Bulk", 0, "3", "-1", "2", "d3+1", ["Bludgeon", "Natural Weapon"]),
  melee("zombie-bite", "Zombie Bite", 0, "3", "-", "1", "d3", ["Natural Weapon", "Poison"]),
  melee("stone-talons", "Stone Talons", 0, "3", "-1", "2", "d6+1", ["Bludgeon", "Natural Weapon"]),
  melee("biting-fangs", "Biting Fangs", 0, "4", "-", "1", "1", ["Natural Weapon"]),
  melee("necrotic-bite", "Necrotic Bite", 0, "3", "-1", "1", "d3", ["Natural Weapon"]),
  melee("wulfen-claws", "Wulfen Claws", 0, "3", "-1", "2", "d3+1", ["Bludgeon", "Natural Weapon"]),
  melee("rot-maw", "Demonic Rot Maw", 0, "3", "-1", "2", "d3+1", ["Arcane", "Bludgeon", "Natural Weapon", "Poison"]),
  melee("rot-strike", "Demonic Rot Strike", 0, "3", "-1", "1", "d3", ["Arcane", "Natural Weapon", "Poison"]),
  melee("proboscis", "Proboscis", 0, "3", "-", "1", "1", ["Natural Weapon", "Poison"]),

  ranged("bp-pistol", "Blackpowder Pistol", 18, '12"', "1", "-1", "1", "d6", ["Misfire", "Reload"]),
  ranged("bp-rifle", "Blackpowder Rifle", 22, '18"', "1", "-1", "1", "d6", ["Misfire", "Reload", "Two-handed"]),
  ranged("blunderbuss", "Blunderbuss", 15, '8"', "d3", "-", "1", "d3", ["Misfire", "Reload", "Two-handed"]),
  ranged("brace-pistols", "Brace of Pistols", 32, '12"', "2", "-1", "1", "d6", ["Misfire", "Reload", "Two-handed"]),
  ranged("crossbow", "Crossbow", 26, '20"', "1", "-1", "1", "d6", ["Reload", "Two-handed"]),
  ranged("hand-crossbow", "Hand Crossbow", 16, '12"', "1", "-", "1", "d6", ["Reload"]),
  ranged("long-bow", "Long Bow", 28, '24"', "1", "-1", "1", "d6", ["Heavy", "Two-handed"]),
  ranged("short-bow", "Short Bow", 18, '16"', "1", "-", "1", "d6", ["Two-handed"]),
  ranged("long-rifle", "Long Rifle", 90, '30"', "1", "-2", "2", "d6+2", ["Heavy", "Misfire", "Reload", "Two-handed", "Unwieldy"]),
  ranged("repeater", "Repeater Pistol", 35, '12"', "1", "-1", "1", "d6", ["Misfire"]),
  ranged("arbalest", "Arbalest", 96, '24"', "1", "-2", "3", "d6+2", ["Heavy", "Rare 0-1", "Reload", "Two-handed", "Unwieldy"]),
  ranged("fire-bombs", "Fire Bombs", 37, '8"', "1", "-", "2", "d3+1", ["Blast", "One-use", "Rare 0-1", "Scare"]),
  ranged("flamethrower", "Flamethrower", 88, "Flame", "1", "-", "d3", "-", ["Flame", "Rare 0-1", "Reload", "Scare", "Two-handed"]),
  ranged("volley-rifle", "Volley Rifle", 75, '16"', "3", "-1", "1", "d6", ["Misfire", "Rare 0-1", "Reload", "Two-handed", "Volley"]),
  ranged("ogre-cannon", "Ogre Cannon", 105, '18"', "1", "-3", "2", "d3+1", ["Blast", "Heavy", "Misfire", "Rare 0-1", "Reload", "Unwieldy", "Two-handed"]),
  ranged("ogre-pistol", "Ogre Pistol", 30, '16"', "1", "-1", "2", "d6+1", ["Misfire", "Reload"]),
  ranged("sling", "Sling", 15, '16"', "1", "-", "1", "d3", []),
  ranged("cloister-sling", "Sling", 14, '16"', "1", "-", "1", "d3", []),
  ranged("throwing-stars", "Throwing Stars", 12, '8"', "1", "-", "1", "d3", ["Poison"]),
  ranged("orb-bombs", "Orb Bombs", 32, '8"', "1", "-", "2", "d3+1", ["Blast", "One-use", "Rare 0-5"]),
  ranged("arc-gun", "Arc-Lightning Gun", 100, '18"', "6", "-", "1", "d3", ["Heavy", "Misfire", "Rare 0-1", "Two-handed", "Unwieldy", "Volley"]),
  ranged("flame-canister", "Flame-Canister", 50, "Flame", "1", "-", "d3", "-", ["Flame", "One-use", "Rare 0-2", "Scare"]),
  ranged("gatling", "Heavy Gatling Gun", 110, '16"', "3", "-1", "2", "d6+1", ["Heavy", "Misfire", "Rare 0-1", "Unwieldy", "Two-handed", "Volley"]),
  ranged("orb-launcher", "Orb Launcher", 120, '20"', "1", "-", "2", "d3+1", ["Blast", "Misfire", "Rare 0-1", "Reload", "Unwieldy", "Two-handed"]),
  ranged("rocket", "Rocket Launcher", 105, '30"', "1", "-1", "2", "d6+1", ["Blast", "Heavy", "Misfire", "One-use", "Rare 0-1", "Two-handed", "Unwieldy"]),
  ranged("blowpipe", "Blowpipe", 16, '12"', "1", "-", "1", "d3", ["Poison"]),

  { id: "cuirass", name: "Cuirass", kind: "armour", cost: 20, armour: "5+", note: "Armour value 5+." },
  { id: "full-plate", name: "Full-plate", kind: "armour", cost: 40, armour: "4+", blocksTwoHandRanged: true, rangedException: ["brace-pistols"], note: "Armour value 4+. Cannot take two-handed ranged weapons, except a Brace of Pistols." },
  { id: "warded-robes", name: "Warded Robes", kind: "armour", cost: 10, armour: "6+", note: "Enemy spells have no effect on a 4+." },
  { id: "ogre-armour", name: "Ogre Armour", kind: "armour", cost: 30, armour: "5+", note: "Armour value 5+." },
  { id: "heavy-plating", name: "Heavy Plating", kind: "armour", cost: 30, armour: "5+", movePenalty: 1, note: "Armour value 5+. Reduce Move by 1\"." },

  { id: "shield", name: "Shield", kind: "item", cost: 10, held: true, note: "Improves Armour by 1, to a maximum of 2+." },
  { id: "grimoire", name: "Grimoire", kind: "item", cost: 15, note: "Once per battle, re-roll a casting roll." },
  { id: "grappling-hook", name: "Grappling Hook", kind: "item", cost: 5, rare: 2, note: "Climb high walls like ladders." },
  { id: "guild-banner", name: "Guild Banner", kind: "item", cost: 25, held: true, rare: 1, note: "Re-roll flee tests while on the battlefield. Re-roll Willpower tests for friends within 12\" who can see this fighter." },
  { id: "clan-banner", name: "Clan Banner", kind: "item", cost: 25, held: true, rare: 1, note: "Re-roll flee tests while on the battlefield. Re-roll Willpower tests for friends within 12\" who can see this fighter." },
  { id: "ancient-banner", name: "Ancient Banner", kind: "item", cost: 25, held: true, rare: 1, note: "Re-roll flee tests while on the battlefield. Re-roll Willpower tests for friends within 12\" who can see this fighter." },
  { id: "cloister-icon", name: "Cloister Icon", kind: "item", cost: 25, held: true, rare: 1, note: "Re-roll flee tests while on the battlefield. Re-roll Willpower tests for friends within 12\" who can see this fighter." },
  { id: "loyal-companion", name: "Loyal Companion", kind: "item", cost: 20, rare: 1, note: "Extra melee attack: Rend -1, Damage 1, Critical d3, Natural Weapon. Not a separate fighter." },
  { id: "bomb-bolt", name: "Bomb-bolt", kind: "item", cost: 25, rare: 1, requires: ["crossbow"], note: "Once per battle with a Crossbow: improve Rend by 1, +1 Damage and Critical Damage, and gain Blast." },
  { id: "stakes", name: "Wooden Stakes", kind: "item", cost: 5, rare: 1, note: "Once per battle vs a bloodied Undead or Demon you are engaged with: Drive the Stake (bonus). On a 2+, take them down. +10 xp after the battle." },
  { id: "lantern", name: "Torchlight/Lantern", kind: "item", cost: 4, held: true, note: "Worsens Armour of engaged Demons and Undead by 1." },
  { id: "bell", name: "Ensorcelled Bell", kind: "item", cost: 10, rare: 1, note: "Once per battle, re-roll a miscast." },
  { id: "gas-mask", name: "Gas Mask", kind: "item", cost: 10, rare: 6, note: "This fighter cannot be poisoned." },
  { id: "net", name: "Net", kind: "item", cost: 30, held: true, rare: 3, note: "Once per battle at the start of a melee you are in: Initiative test to entwine the enemy (−1 Attacks on their melee; off-hand unaffected). Entwined fighters may Initiative-test each activation to free themselves." },
  { id: "smoke-bomb", name: "Smoke Bomb", kind: "item", cost: 20, rare: 3, note: "Once per battle while engaged: Drop Smoke Bomb (bonus). Remove and set up wholly within 6\", not engaged." },
  { id: "bomb-rat", name: "Bomb Rat", kind: "item", cost: 25, rare: 1, note: "Once per battle, summon a Giant Rat with a fuse that later detonates (blast, Rend -2, Damage d3)." },
  { id: "periscope", name: "Periscope", kind: "item", cost: 20, rare: 1, note: "If this fighter has not moved this activation, +5\" Range on their two-handed ranged weapons (not Flame)." },
  { id: "wheel-spikes", name: "Wheel-Spikes", kind: "item", cost: 50, note: "Improve Rend by 1 on Crushing Bulk and on the Splat! special rule attack." },
  { id: "cauldron", name: "Cauldron", kind: "item", cost: 40, held: true, rare: 1, note: "Action: Willpower test to prepare a known spell." },
  { id: "bestial-companion", name: "Bestial Companion", kind: "item", cost: 30, rare: 1, note: "Extra melee attack: Rend -1, Damage 2, Critical d3+1, Natural Weapon. Not a separate fighter." },
  { id: "spirit-guardian", name: "Spirit Guardian", kind: "item", cost: 45, rare: 1, note: "Once per battle: Invoke Ethereal Protection (bonus). Until end of round, ignore Rend targeting this fighter; each successful armour save vs melee deals 1 damage back. Not a separate fighter." },
  { id: "winged-familiar", name: "Winged Familiar", kind: "item", cost: 12, rare: 1, note: "Once per battle: Harry (bonus). Pick a visible enemy within 24\". Until end of round they must pass Willpower to Move or Act, or lose that Move/Action." },
  { id: "bat-wings", name: "Bat Wings", kind: "item", cost: 15, mutation: true, note: "This fighter gains Fly." },
  { id: "wulfen-legs", name: "Wulfen Legs", kind: "item", cost: 10, mutation: true, note: "Move becomes 7\"." },
  { id: "hulking-form", name: "Hulking Form", kind: "item", cost: 30, mutation: true, note: "Life becomes 8." },
];

/** Short trait blurbs for roster tooltips and option lists. */
export const TRAIT_BLURB: Record<string, string> = {
  Arcane: "Critical hits on a natural 5 or 6.",
  Blast: "Uses the blast template; a miss scatters then hits.",
  Bludgeon: "A saved critical hit still deals 1 damage.",
  Brace: "Vs a charger, you automatically have initiative when defending.",
  Flame: "Flame template; automatic hits, never critical.",
  Guard: "Once per melee, a miss from this weapon can parry a hit.",
  Heavy: "Cannot shoot if you moved this activation, and cannot move after shooting.",
  Misfire: "Natural 1 misfires after other dice: backfire, clogged, or flash.",
  "Natural Weapon": "Cannot be used to parry.",
  "Off-hand": "May be the second weapon; then makes 1 attack.",
  "One-use": "Once per battle.",
  Poison: "Critical hits poison: 1 damage each activation until healed or at 1 life. Demons/Undead immune.",
  Reload: "After firing, spend a Move or Action before firing again.",
  Scare: "Unengaged fighters hit take Willpower or scatter d6\".",
  "Two-handed": "Only one two-handed weapon; no off-hand attack while equipped.",
  Unwieldy: "-1 to attack rolls.",
  Volley: "Assign attacks to the target or other visible unengaged enemies within 3\".",
  Wrap: "Cannot parry or be parried.",
};

export function traitBlurbs(traits: string[] | undefined): string[] {
  if (!traits?.length) return [];
  return traits
    .map((trait) => {
      if (trait.startsWith("Rare")) return `${trait}: warband limit.`;
      return TRAIT_BLURB[trait] ? `${trait}: ${TRAIT_BLURB[trait]}` : trait;
    });
}

export const GEAR_BY_ID: Record<string, GearDef> = Object.fromEntries(GEAR.map((g) => [g.id, g]));

export const LISTS: Record<string, string[]> = {
  "guild:main": ["axe", "club", "dagger", "flail", "halberd", "heavy-axe", "spear", "sword", "warhammer", "zweihander", "bp-pistol", "bp-rifle", "blunderbuss", "crossbow", "hand-crossbow", "long-bow", "short-bow", "cuirass", "grappling-hook", "shield"],
  "guild:champion": ["brace-pistols", "long-rifle", "repeater", "full-plate", "guild-banner", "loyal-companion"],
  "guild:cleric": ["staff", "club", "warhammer", "cuirass", "full-plate", "warded-robes", "grimoire", "shield", "stakes"],
  "guild:ogre": ["ogre-blade", "ogre-great", "ogre-mace", "arbalest", "ogre-cannon", "ogre-pistol", "ogre-armour", "shield"],
  "guild:munitions": ["arbalest", "flamethrower", "fire-bombs", "volley-rifle", "bomb-bolt"],
  "guild:witch": ["lantern", "stakes"],
  "guild:wizard": ["staff", "ensorcelled", "sword", "warded-robes", "grimoire"],
  "vermin:main": ["axe", "club", "punch-dagger", "flail", "halberd", "heavy-flail", "iron-claw", "spear", "sword", "orb-bombs", "sling", "throwing-stars", "gas-mask", "grappling-hook", "net", "shield", "smoke-bomb"],
  "vermin:champion": ["ensorcelled-halberd", "poison-blade", "bp-pistol", "repeater", "full-plate", "bomb-rat", "clan-banner"],
  "vermin:contraption": ["punch-dagger", "arc-gun", "flame-canister", "wheel-spikes"],
  "vermin:practitioner": ["staff", "ensorcelled", "warded-robes", "grimoire", "bell"],
  "vermin:sparkseer": ["spark-drill", "arc-gun", "rocket", "flame-canister", "long-rifle", "periscope"],
  "vermin:mutant": ["rat-blade", "spark-drill", "spark-fists", "gatling", "orb-launcher", "flame-canister", "heavy-plating"],
  "coven:main": ["axe", "club", "dagger", "flail", "halberd", "spear", "sword", "cuirass", "shield"],
  "coven:champion": ["cursed-blade", "great-mace", "heavy-axe", "full-plate", "ancient-banner", "bestial-companion", "spirit-guardian", "winged-familiar"],
  "coven:practitioner": ["staff", "ensorcelled", "sword", "cursed-sword", "warded-robes", "grimoire", "bestial-companion", "winged-familiar", "spirit-guardian"],
  "coven:ogre": ["ogre-blade", "ogre-great", "ogre-mace", "shield"],
  "coven:mutation": ["bat-wings", "wulfen-legs", "hulking-form"],
  "cloister:main": ["axe", "club", "dagger", "flail", "halberd", "spear", "sword", "great-club", "heavy-axe", "cuirass", "shield", "cloister-icon"],
  "cloister:champion": ["rot-blade", "great-rot-blade", "full-plate"],
  "cloister:practitioner": ["staff", "ensorcelled", "sword", "warded-robes", "grimoire", "bell", "cauldron"],
  "cloister:dreg": ["cloister-sling", "blowpipe"],
};

export function gearOnLists(listIds: string[]): GearDef[] {
  const ids = new Set(listIds.flatMap((id) => LISTS[id] ?? []));
  return GEAR.filter((g) => ids.has(g.id) && g.cost > 0);
}

export function isTwoHanded(gear: GearDef): boolean {
  return (gear.traits ?? []).some((t) => t.startsWith("Two-handed"));
}

export function rareCap(gear: GearDef): number | undefined {
  if (gear.rare != null) return gear.rare;
  const rare = (gear.traits ?? []).find((t) => t.startsWith("Rare"));
  if (!rare) return undefined;
  const match = rare.match(/0-(\d+)/);
  return match ? Number(match[1]) : undefined;
}
