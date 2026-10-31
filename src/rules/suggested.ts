import { FIGHTER_BY_ID } from "./fighters";
import { fighterCost, rollFormula, uid } from "./logic";
import { ORIGIN_BY_ID } from "./origins";
import type { RosterFighter, Warband } from "./types";

export interface SuggestedFighter {
  defId: string;
  name: string;
  gear: string[];
  skills: string[];
  spells: string[];
}

export interface SuggestedBuild {
  id: string;
  faction: string;
  originId: string;
  name: string;
  summary: string;
  fighters: SuggestedFighter[];
}

export const SUGGESTED: SuggestedBuild[] = [
  {
    id: "guild-barracks",
    faction: "guild",
    originId: "swords",
    name: "Barracks Gun Line",
    summary: "Swords for Hire. The captain and a crossbow line shoot, the champion holds the front, and the plague doctor keeps someone standing for the injury roll.",
    fighters: [
      { defId: "guild-captain", name: "Captain Voss", gear: ["long-rifle", "cuirass"], skills: ["crackshot", "marksman"], spells: [] },
      { defId: "plague-doctor", name: "Doctor Pell", gear: ["cuirass", "dagger"], skills: [], spells: [] },
      { defId: "guild-champion", name: "Sergeant Hale", gear: ["sword", "shield", "cuirass"], skills: ["stand-ground"], spells: [] },
      { defId: "mercenary", name: "Crossbowman", gear: ["crossbow", "cuirass"], skills: [], spells: [] },
      { defId: "mercenary", name: "Second Crossbow", gear: ["crossbow", "cuirass"], skills: [], spells: [] },
      { defId: "mercenary", name: "Pistoleer", gear: ["bp-pistol", "sword", "cuirass"], skills: [], spells: [] },
      { defId: "mercenary", name: "Handgunner", gear: ["hand-crossbow", "sword", "shield"], skills: [], spells: [] },
      { defId: "mercenary", name: "File Leader", gear: ["sword", "shield", "cuirass"], skills: [], spells: [] },
    ],
  },
  {
    id: "guild-manor",
    faction: "guild",
    originId: "noble-origin",
    name: "Manor Household",
    summary: "Disgraced Noble. The Dilapidated Manor keeps a duellist, a great-weapon champion, and two hunting dogs. The household fights with sword and shield, and the leftover silver stands in for the wine cellar.",
    fighters: [
      { defId: "noble", name: "Lord Harren", gear: ["sword", "shield", "full-plate", "loyal-companion"], skills: ["unshakeable"], spells: [] },
      { defId: "guild-champion", name: "Master of the Yard", gear: ["zweihander", "cuirass"], skills: ["great-weapon"], spells: [] },
      { defId: "guild-champion", name: "House Sword", gear: ["sword", "shield", "cuirass"], skills: ["feint"], spells: [] },
      { defId: "mercenary", name: "Man-at-arms", gear: ["sword", "shield"], skills: [], spells: [] },
      { defId: "mercenary", name: "Second Man-at-arms", gear: ["sword", "shield"], skills: [], spells: [] },
      { defId: "mercenary", name: "Third Man-at-arms", gear: ["sword", "shield"], skills: [], spells: [] },
      { defId: "mercenary", name: "Fourth Man-at-arms", gear: ["sword", "shield"], skills: [], spells: [] },
      { defId: "mercenary", name: "Fifth Man-at-arms", gear: ["sword", "shield"], skills: [], spells: [] },
      { defId: "hound", name: "Kennel First", gear: [], skills: [], spells: [] },
      { defId: "hound", name: "Kennel Second", gear: [], skills: [], spells: [] },
    ],
  },
  {
    id: "guild-chapter",
    faction: "guild",
    originId: "witch-origin",
    name: "Chapter House Hunt",
    summary: "Witch Hunters Guild. The hunter and apprentice carry stakes and a lantern, the cleric keeps Healing Essence, and the ogre breaks whatever the litanies mark.",
    fighters: [
      { defId: "witch-hunter", name: "Hunter Marrow", gear: ["sword", "cuirass", "lantern", "stakes", "hand-crossbow"], skills: ["unshakeable"], spells: [] },
      { defId: "witch-apprentice", name: "Apprentice Quinn", gear: ["sword", "shield", "cuirass", "stakes"], skills: [], spells: [] },
      { defId: "guild-cleric", name: "Brother Anselm", gear: ["warhammer", "warded-robes", "grimoire"], skills: [], spells: ["Healing Essence"] },
      { defId: "ogre", name: "Borg", gear: ["ogre-blade", "ogre-armour"], skills: [], spells: [] },
      { defId: "mercenary", name: "Shieldman", gear: ["sword", "shield"], skills: [], spells: [] },
      { defId: "mercenary", name: "Second Shield", gear: ["sword", "shield"], skills: [], spells: [] },
      { defId: "mercenary", name: "Third Shield", gear: ["sword", "shield"], skills: [], spells: [] },
      { defId: "recruit", name: "Recruit", gear: ["dagger"], skills: [], spells: [] },
      { defId: "recruit", name: "Second Recruit", gear: ["dagger"], skills: [], spells: [] },
    ],
  },
  {
    id: "guild-library",
    faction: "guild",
    originId: "wizard-origin",
    name: "Library Circle",
    summary: "Wizard's Retinue. The Hidden Library fields the High Wizard and a Guild Wizard, each with a grimoire. A champion and five mercenaries keep the books from being stolen.",
    fighters: [
      { defId: "high-wizard", name: "Magister Olm", gear: ["staff", "warded-robes", "grimoire"], skills: [], spells: ["Arcane Missile", "Flaming Weapon"] },
      { defId: "guild-wizard", name: "Adept Lira", gear: ["staff", "warded-robes", "grimoire"], skills: [], spells: ["Eldritch Barrier"] },
      { defId: "guild-champion", name: "Warden Holt", gear: ["sword", "shield", "cuirass"], skills: ["unshakeable"], spells: [] },
      { defId: "mercenary", name: "Crossbow Guard", gear: ["crossbow", "sword", "cuirass"], skills: [], spells: [] },
      { defId: "mercenary", name: "Second Crossbow", gear: ["crossbow", "sword", "cuirass"], skills: [], spells: [] },
      { defId: "mercenary", name: "Third Crossbow", gear: ["crossbow", "sword", "cuirass"], skills: [], spells: [] },
      { defId: "mercenary", name: "Shield Guard", gear: ["sword", "shield"], skills: [], spells: [] },
      { defId: "mercenary", name: "Second Shield", gear: ["sword", "shield"], skills: [], spells: [] },
    ],
  },
  {
    id: "vermin-chapel",
    faction: "vermin",
    originId: "acolytes",
    name: "Chapel of Sores",
    summary: "Acolytes of Plague. The Desecrated Chapel hires both apprentices the origin allows. The priests carry the Lore of Poxes, and the warriors advance under gas masks.",
    fighters: [
      { defId: "pox-priest", name: "Father Squelch", gear: ["staff", "warded-robes", "grimoire", "bell"], skills: [], spells: ["Spray of Vomit", "Plague Bomb"] },
      { defId: "pox-apprentice", name: "Acolyte Retch", gear: ["staff", "warded-robes", "grimoire"], skills: [], spells: ["Fetid Blades"] },
      { defId: "pox-apprentice", name: "Acolyte Weep", gear: ["staff", "warded-robes", "grimoire"], skills: [], spells: ["Dark Vitality"] },
      { defId: "warrior", name: "Spear Rat", gear: ["spear", "sling", "gas-mask"], skills: [], spells: [] },
      { defId: "warrior", name: "Second Spear", gear: ["spear", "sling", "gas-mask"], skills: [], spells: [] },
      { defId: "warrior", name: "Third Spear", gear: ["spear", "sling", "gas-mask"], skills: [], spells: [] },
      { defId: "warrior", name: "Fourth Spear", gear: ["spear", "sling", "gas-mask"], skills: [], spells: [] },
      { defId: "warrior", name: "Fifth Spear", gear: ["spear", "sling"], skills: [], spells: [] },
      { defId: "giant-rat", name: "Pustule", gear: [], skills: [], spells: [] },
      { defId: "giant-rat", name: "Weal", gear: [], skills: [], spells: [] },
      { defId: "giant-rat", name: "Scab", gear: [], skills: [], spells: [] },
    ],
  },
  {
    id: "vermin-roofs",
    faction: "vermin",
    originId: "rooftop",
    name: "Rooftop Knives",
    summary: "Rooftop Runners. The assassin and apprentice crit on a 5 or 6 after a charge. Wall Scrambler gets the captain onto the roofs the origin already opens.",
    fighters: [
      { defId: "nightfang", name: "Skrik", gear: ["poison-blade", "throwing-stars", "grappling-hook"], skills: ["wall-scrambler"], spells: [] },
      { defId: "assassin-app", name: "Snikk", gear: ["punch-dagger", "throwing-stars", "smoke-bomb"], skills: [], spells: [] },
      { defId: "vermin-champion", name: "Kratcher", gear: ["poison-blade", "shield", "net"], skills: ["back-stabber"], spells: [] },
      { defId: "warrior", name: "Spear Rat", gear: ["spear", "sling", "gas-mask"], skills: [], spells: [] },
      { defId: "warrior", name: "Second Spear", gear: ["spear", "sling", "gas-mask"], skills: [], spells: [] },
      { defId: "warrior", name: "Star Rat", gear: ["sword", "throwing-stars", "gas-mask"], skills: [], spells: [] },
      { defId: "warrior", name: "Second Star", gear: ["sword", "throwing-stars", "gas-mask"], skills: [], spells: [] },
      { defId: "warrior", name: "Shield Rat", gear: ["sword", "shield", "sling", "gas-mask"], skills: [], spells: [] },
      { defId: "giant-rat", name: "Gnawer", gear: [], skills: [], spells: [] },
      { defId: "giant-rat", name: "Biter", gear: [], skills: [], spells: [] },
      { defId: "giant-rat", name: "Squeaker", gear: [], skills: [], spells: [] },
    ],
  },
  {
    id: "vermin-spark",
    faction: "vermin",
    originId: "spark-origin",
    name: "Workshop Gun",
    summary: "Sparkseer Coven. One contraption, kept on the floor where it can charge. The Sparkseer stands beside the rifle so Master of Dark Science can stretch its range and re-roll misfires.",
    fighters: [
      { defId: "sparkseer", name: "Tik-Tik", gear: ["long-rifle"], skills: ["dark-science"], spells: [] },
      { defId: "spark-app", name: "Klinkrik", gear: ["repeater", "punch-dagger"], skills: [], spells: [] },
      { defId: "contraption", name: "The Wheel", gear: ["flame-canister", "wheel-spikes"], skills: [], spells: [] },
      { defId: "warrior", name: "Slinger", gear: ["punch-dagger", "shield", "sling"], skills: [], spells: [] },
      { defId: "warrior", name: "Second Slinger", gear: ["punch-dagger", "shield", "sling"], skills: [], spells: [] },
      { defId: "warrior", name: "Third Slinger", gear: ["punch-dagger", "shield", "sling"], skills: [], spells: [] },
      { defId: "warrior", name: "Fourth Slinger", gear: ["punch-dagger", "sling"], skills: [], spells: [] },
      { defId: "warrior", name: "Fifth Slinger", gear: ["punch-dagger", "sling"], skills: [], spells: [] },
      { defId: "giant-rat", name: "Fuse", gear: [], skills: [], spells: [] },
      { defId: "giant-rat", name: "Scrap", gear: [], skills: [], spells: [] },
    ],
  },
  {
    id: "vermin-warren",
    faction: "vermin",
    originId: "tyrant",
    name: "Warren Pit",
    summary: "Merciless Tyrant. The Fortified Warren is a fighting pit. The warlord and a champion can force the after-battle duel, and a rat-mutant keeps the floor.",
    fighters: [
      { defId: "ironfang", name: "Krush", gear: ["sword", "shield"], skills: ["attack-attack", "too-cunning"], spells: [] },
      { defId: "vermin-champion", name: "Pit Master", gear: ["sword", "shield"], skills: ["back-stabber"], spells: [] },
      { defId: "assassin-app", name: "The Favourite", gear: ["poison-blade", "sword"], skills: [], spells: [] },
      { defId: "warrior", name: "Spear Rat", gear: ["spear", "sling", "gas-mask"], skills: [], spells: [] },
      { defId: "warrior", name: "Second Spear", gear: ["spear", "sling", "gas-mask"], skills: [], spells: [] },
      { defId: "warrior", name: "Third Spear", gear: ["spear", "sling", "gas-mask"], skills: [], spells: [] },
      { defId: "warrior", name: "Fourth Spear", gear: ["spear", "sling", "gas-mask"], skills: [], spells: [] },
      { defId: "warrior", name: "Fifth Spear", gear: ["spear", "sling"], skills: [], spells: [] },
      { defId: "rat-mutant", name: "The Pit", gear: [], skills: [], spells: [] },
      { defId: "giant-rat", name: "Scrap", gear: [], skills: [], spells: [] },
      { defId: "giant-rat", name: "Gnaw", gear: [], skills: [], spells: [] },
      { defId: "giant-rat", name: "Bite", gear: [], skills: [], spells: [] },
    ],
  },
  {
    id: "coven-blood",
    faction: "coven",
    originId: "aristocrats",
    name: "House of the Night",
    summary: "Aristocrats of Blood. The noble and courtesan keep blood magic. Skeletons do not add experience to the rating, and the zombie ogre ignores Heavy and Unwieldy.",
    fighters: [
      { defId: "blood-noble", name: "Lord Dragul", gear: ["cursed-blade", "cuirass"], skills: ["cloud-of-bats"], spells: ["Draw Blood"] },
      { defId: "blood-knight", name: "Sir Valek", gear: ["sword", "shield", "cuirass"], skills: ["unholy-strength"], spells: [] },
      { defId: "courtesan", name: "Lady Barovyra", gear: ["staff", "warded-robes"], skills: [], spells: ["Cursed Blades"] },
      { defId: "skeleton", name: "Spear Bones", gear: ["spear"], skills: [], spells: [] },
      { defId: "skeleton", name: "Second Spear", gear: ["spear"], skills: [], spells: [] },
      { defId: "skeleton", name: "Third Spear", gear: ["spear"], skills: [], spells: [] },
      { defId: "skeleton", name: "Fourth Spear", gear: ["spear"], skills: [], spells: [] },
      { defId: "skeleton", name: "Fifth Spear", gear: ["spear"], skills: [], spells: [] },
      { defId: "zombie-ogre", name: "The Porter", gear: ["ogre-blade"], skills: [], spells: [] },
    ],
  },
  {
    id: "coven-embalmer",
    faction: "coven",
    originId: "rogue-necro",
    name: "Embalmer's Shift",
    summary: "Rogue Necromancer. The Embalmer's Hall keeps Raise Zombie on the master and a hall full of thralls who add nothing to the rating. The gargoyle watches the door.",
    fighters: [
      { defId: "necromancer", name: "Master Vellum", gear: ["staff", "warded-robes", "grimoire"], skills: [], spells: ["Raise Zombie", "Witchfire"] },
      { defId: "necro-app", name: "Apprentice Stitch", gear: ["staff", "warded-robes", "grimoire"], skills: [], spells: ["Twilight Translocation"] },
      { defId: "zombie", name: "Shambler", gear: [], skills: [], spells: [] },
      { defId: "zombie", name: "Second Shambler", gear: [], skills: [], spells: [] },
      { defId: "zombie", name: "Third Shambler", gear: [], skills: [], spells: [] },
      { defId: "zombie", name: "Fourth Shambler", gear: [], skills: [], spells: [] },
      { defId: "zombie", name: "Fifth Shambler", gear: [], skills: [], spells: [] },
      { defId: "skeleton", name: "Spear Bones", gear: ["spear"], skills: [], spells: [] },
      { defId: "skeleton", name: "Second Spear", gear: ["spear"], skills: [], spells: [] },
      { defId: "zombie-ogre", name: "The Porter", gear: ["ogre-blade"], skills: [], spells: [] },
      { defId: "gargoyle", name: "The Lintels", gear: [], skills: [], spells: [] },
      { defId: "dire-bat", name: "The Loft", gear: [], skills: [], spells: [] },
    ],
  },
  {
    id: "coven-hunt",
    faction: "coven",
    originId: "the-hunt",
    name: "The Night Hunt",
    summary: "The Hunt Descends. Dire wolves do not count toward the beast limit, so three of them run with the noble. Zombies fill the henchman slots and never gain experience.",
    fighters: [
      { defId: "lycanfell", name: "Lord Vrykan", gear: ["sword", "shield"], skills: ["mesmeric-gaze"], spells: [] },
      { defId: "misbegotten", name: "The Bent One", gear: ["hulking-form", "sword"], skills: [], spells: [] },
      { defId: "barrow-champion", name: "Ossrik", gear: ["sword", "shield"], skills: ["dread-aura"], spells: [] },
      { defId: "zombie", name: "Shambler", gear: [], skills: [], spells: [] },
      { defId: "zombie", name: "Second Shambler", gear: [], skills: [], spells: [] },
      { defId: "zombie", name: "Third Shambler", gear: [], skills: [], spells: [] },
      { defId: "zombie", name: "Fourth Shambler", gear: [], skills: [], spells: [] },
      { defId: "zombie", name: "Fifth Shambler", gear: [], skills: [], spells: [] },
      { defId: "gargoyle", name: "The Eaves", gear: [], skills: [], spells: [] },
      { defId: "dire-wolf", name: "First Hound", gear: [], skills: [], spells: [] },
      { defId: "dire-wolf", name: "Second Hound", gear: [], skills: [], spells: [] },
      { defId: "dire-wolf", name: "Third Hound", gear: [], skills: [], spells: [] },
    ],
  },
  {
    id: "coven-barrow",
    faction: "coven",
    originId: "awakened",
    name: "Barrow Watch",
    summary: "Awakened Lord. The Ancient Barrows open under a skeleton lord who causes fear. Kingsguard stands in front of him, and the spears brace behind the banner.",
    fighters: [
      { defId: "barrow-lord", name: "King Ossek", gear: ["sword", "ancient-banner", "cuirass"], skills: ["dread-aura", "death-march"], spells: [] },
      { defId: "barrow-champion", name: "The Door", gear: ["sword", "shield"], skills: ["kingsguard"], spells: [] },
      { defId: "barrow-champion", name: "The Cold", gear: ["axe"], skills: ["chill-touch"], spells: [] },
      { defId: "skeleton", name: "Spear Bones", gear: ["spear", "shield"], skills: [], spells: [] },
      { defId: "skeleton", name: "Second Spear", gear: ["spear", "shield"], skills: [], spells: [] },
      { defId: "skeleton", name: "Third Spear", gear: ["spear", "shield"], skills: [], spells: [] },
      { defId: "skeleton", name: "Fourth Spear", gear: ["spear", "shield"], skills: [], spells: [] },
      { defId: "skeleton", name: "Fifth Spear", gear: ["spear", "shield"], skills: [], spells: [] },
      { defId: "zombie-ogre", name: "The Slab", gear: ["ogre-blade"], skills: [], spells: [] },
      { defId: "dire-wolf", name: "First Hound", gear: [], skills: [], spells: [] },
      { defId: "dire-wolf", name: "Second Hound", gear: [], skills: [], spells: [] },
    ],
  },
  {
    id: "cloister-keep",
    faction: "cloister",
    originId: "militant",
    name: "Keep Crusade",
    summary: "Knights-Militant. Plate is already in the knight price. Swords and shields stay inside the full-plate restriction, and the keep can drill three of them after the battle.",
    fighters: [
      { defId: "knight-abbot", name: "Abbot Cassian", gear: ["sword", "shield"], skills: ["last-rites", "entropy"], spells: [] },
      { defId: "cloister-champion", name: "Champion Remigius", gear: ["axe"], skills: ["shepherd"], spells: [] },
      { defId: "cloister-knight", name: "Knight of the Gate", gear: ["sword", "shield"], skills: [], spells: [] },
      { defId: "cloister-knight", name: "Knight of the Wall", gear: ["sword", "shield"], skills: [], spells: [] },
      { defId: "cloister-knight", name: "Knight of the Nave", gear: ["sword", "shield"], skills: [], spells: [] },
      { defId: "cloister-knight", name: "Knight of the Yard", gear: ["sword", "shield"], skills: [], spells: [] },
      { defId: "cloister-knight", name: "Knight of the Steps", gear: ["sword"], skills: [], spells: [] },
    ],
  },
  {
    id: "cloister-scriptorium",
    faction: "cloister",
    originId: "priesthood",
    name: "Scriptorium Circle",
    summary: "Priesthood of Sorcerers. The Secluded Scriptorium hires both sorcerers the origin allows. The cauldron sits with the High Sorcerer, and dregs keep the door.",
    fighters: [
      { defId: "high-sorcerer", name: "Abbess Vile", gear: ["staff", "warded-robes", "grimoire", "cauldron"], skills: [], spells: ["Swollen Form", "Putrid Blessing"] },
      { defId: "cloister-sorcerer", name: "Brother Mire", gear: ["staff", "warded-robes", "grimoire", "bell"], skills: [], spells: ["Black Mire"] },
      { defId: "cloister-sorcerer", name: "Sister Filth", gear: ["staff", "warded-robes", "grimoire"], skills: [], spells: ["Rain of Filth"] },
      { defId: "dreg", name: "Doorkeeper", gear: ["club", "cloister-sling"], skills: [], spells: [] },
      { defId: "dreg", name: "Second Door", gear: ["club", "cloister-sling"], skills: [], spells: [] },
      { defId: "dreg", name: "Third Door", gear: ["club", "cloister-sling"], skills: [], spells: [] },
      { defId: "dreg", name: "Fourth Door", gear: ["club", "cloister-sling"], skills: [], spells: [] },
      { defId: "dreg", name: "Fifth Door", gear: ["club", "cloister-sling"], skills: [], spells: [] },
      { defId: "beastman", name: "The Threshold", gear: ["sword", "shield"], skills: [], spells: [] },
    ],
  },
  {
    id: "cloister-altar",
    faction: "cloister",
    originId: "anointed",
    name: "Altar of Fear",
    summary: "The Anointed One. Any number of rot demons may be hired. Five of them cause fear and ignore Rend, with the herald holding Summon Rotling.",
    fighters: [
      { defId: "knight-abbot", name: "The Anointed", gear: ["sword", "shield"], skills: ["rite-contagion", "black-blood"], spells: [] },
      { defId: "rot-herald", name: "Herald of the Maw", gear: [], skills: [], spells: ["Summon Rotling"] },
      { defId: "rot-demon", name: "First Demon", gear: [], skills: [], spells: [] },
      { defId: "rot-demon", name: "Second Demon", gear: [], skills: [], spells: [] },
      { defId: "rot-demon", name: "Third Demon", gear: [], skills: [], spells: [] },
      { defId: "rot-demon", name: "Fourth Demon", gear: [], skills: [], spells: [] },
      { defId: "rot-demon", name: "Fifth Demon", gear: [], skills: [], spells: [] },
    ],
  },
  {
    id: "cloister-pulpit",
    faction: "cloister",
    originId: "rabble",
    name: "Pulpit Mob",
    summary: "Blessed Rabble. The Street Pulpit is a High Sorcerer and a shaman over a crowd of Dreg Cultists. Black Rot on those dregs is worth experience, and three rotlings run at their heels.",
    fighters: [
      { defId: "high-sorcerer", name: "Preacher Gall", gear: ["staff", "warded-robes", "grimoire"], skills: [], spells: ["Erupting Sores", "Black Bile"] },
      { defId: "shaman", name: "The Bark", gear: ["staff", "warded-robes", "grimoire"], skills: [], spells: [] },
      { defId: "dreg", name: "First Voice", gear: ["club", "blowpipe"], skills: [], spells: [] },
      { defId: "dreg", name: "Second Voice", gear: ["club", "blowpipe"], skills: [], spells: [] },
      { defId: "dreg", name: "Third Voice", gear: ["club", "blowpipe"], skills: [], spells: [] },
      { defId: "dreg", name: "Fourth Voice", gear: ["club", "blowpipe"], skills: [], spells: [] },
      { defId: "dreg", name: "Fifth Voice", gear: ["club", "cloister-sling"], skills: [], spells: [] },
      { defId: "dreg", name: "Sixth Voice", gear: ["club", "cloister-sling"], skills: [], spells: [] },
      { defId: "dreg", name: "Seventh Voice", gear: ["club", "cloister-sling"], skills: [], spells: [] },
      { defId: "dreg", name: "Eighth Voice", gear: ["club", "cloister-sling"], skills: [], spells: [] },
      { defId: "rotling", name: "First Whelp", gear: [], skills: [], spells: [] },
      { defId: "rotling", name: "Second Whelp", gear: [], skills: [], spells: [] },
      { defId: "rotling", name: "Third Whelp", gear: [], skills: [], spells: [] },
    ],
  },
];

function hire(row: SuggestedFighter, roll: boolean): RosterFighter {
  const def = FIGHTER_BY_ID[row.defId];
  return {
    uid: uid(),
    defId: row.defId,
    name: row.name,
    xp: roll ? rollFormula(def.xp) : baseExperience(def.xp),
    skills: [...(def.fixedSkills ?? []), ...row.skills],
    gear: [...row.gear],
    spells: [...row.spells],
    injuries: [],
    blackRot: 0,
    missBattles: 0,
    kills: 0,
  };
}

function baseExperience(formula: string): number {
  const match = formula.match(/^(\d+)\+d6$/);
  return match ? Number(match[1]) : 0;
}

export function silverLeft(build: SuggestedBuild): number {
  const spent = build.fighters.reduce((sum, row) => sum + fighterCost(hire(row, false)), 0);
  return 1000 - spent;
}

export function buildWarband(build: SuggestedBuild, roll = true): Warband {
  const origin = ORIGIN_BY_ID[build.originId];
  const fighters = build.fighters.map((row) => hire(row, roll));
  const spent = fighters.reduce((sum, fighter) => sum + fighterCost(fighter), 0);
  return {
    id: uid(),
    name: build.name,
    faction: build.faction,
    originId: build.originId,
    stronghold: origin.stronghold,
    stash: 1000 - spent,
    holdings: ["", "", "", "", ""],
    notes: build.summary,
    battles: 0,
    victories: 0,
    ransacked: 0,
    fightersLost: 0,
    fighters,
  };
}
