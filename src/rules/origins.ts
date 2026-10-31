import type { OriginDef } from "./types";

export const FACTION_NAMES: Record<string, string> = {
  guild: "Guild Mercenaries",
  vermin: "Verminkin",
  coven: "Death Covens",
  cloister: "The Blighted Cloister",
};

export const ORIGINS: OriginDef[] = [
  { id: "swords", faction: "guild", name: "Swords for Hire", leaderId: "guild-captain", stronghold: "Guild Barracks", summary: "Drill up to 3 henchmen for d6 experience. On a 6 after a battle, a Guild Recruit can be hired for 0 silver." },
  { id: "noble-origin", faction: "guild", name: "Disgraced Noble", leaderId: "noble", stronghold: "Dilapidated Manor", summary: "Starts with 2d6 bottles of wine. Selling one re-rolls that holding's income." },
  { id: "witch-origin", faction: "guild", name: "Witch Hunters Guild", leaderId: "witch-hunter", stronghold: "Chapter House", summary: "After a loss, each Witch Hunter and Priest who passes a Willpower test earns 5 experience." },
  { id: "wizard-origin", faction: "guild", name: "Wizard's Retinue", leaderId: "high-wizard", stronghold: "Hidden Library", summary: "Before the battle, one wizard may choose a prepared spell instead of rolling it." },

  { id: "acolytes", faction: "vermin", name: "Acolytes of Plague", leaderId: "pox-priest", stronghold: "Desecrated Chapel", summary: "The warband may include 0–2 Pox Priest's Apprentices. One priest may choose a prepared spell.", limitOverrides: { "pox-apprentice": 2 } },
  { id: "rooftop", faction: "vermin", name: "Rooftop Runners", leaderId: "nightfang", stronghold: "Hidden Vantage", summary: "Up to d3 fighters may deploy on roofs within 12\" of the centre, more than 9\" from enemies." },
  { id: "spark-origin", faction: "vermin", name: "Sparkseer Coven", leaderId: "sparkseer", stronghold: "Rickety Workshop", summary: "0–2 Rolling Contraptions. A contraption injury may be rolled twice. One Sparkseer may start with 3 engineering points.", limitOverrides: { contraption: 2 } },
  { id: "tyrant", faction: "vermin", name: "Merciless Tyrant", leaderId: "ironfang", stronghold: "Fortified Warren", summary: "After a battle, two champions or henchmen who were not taken down may duel. Winner earns 10 experience. Loser suffers an injury." },

  { id: "aristocrats", faction: "coven", name: "Aristocrats of Blood", leaderId: "blood-noble", stronghold: "Opulent Manor", summary: "0–3 Bloodcursed Knights. Up to 3 vampyres earn d6 experience, or 2d6 after a win.", limitOverrides: { "blood-knight": 3 } },
  { id: "rogue-necro", faction: "coven", name: "Rogue Necromancer", leaderId: "necromancer", stronghold: "Embalmer's Hall", summary: "The leader may take 5 experience, or attempt to raise a Zombie and hire it for 0 silver on a 5+." },
  { id: "the-hunt", faction: "coven", name: "The Hunt Descends", leaderId: "lycanfell", stronghold: "Grand Pavilion", summary: "Dire Wolves do not count toward the beast limit. A beast the leader kills is worth 10 experience. On a 6, a Dire Wolf can be hired for 0 silver.", ignoreBeastLimit: ["dire-wolf"] },
  { id: "awakened", faction: "coven", name: "Awakened Lord", leaderId: "barrow-lord", stronghold: "Ancient Barrows", summary: "On a 6, roll once on the treasure table. If the leader is laid to rest, they miss d3 battles instead of leaving." },

  { id: "militant", faction: "cloister", name: "Knights-Militant", leaderId: "knight-abbot", stronghold: "Fortified Keep", summary: "Any number of Cloister Knights. Up to 3 knights earn d6 experience. A win adds one exploration re-roll.", limitOverrides: { "cloister-knight": null } },
  { id: "priesthood", faction: "cloister", name: "Priesthood of Sorcerers", leaderId: "high-sorcerer", stronghold: "Secluded Scriptorium", summary: "0–2 Cloister Sorcerers. Wizard experience can be banked, or poison vials brewed on 5+.", limitOverrides: { "cloister-sorcerer": 2 } },
  { id: "anointed", faction: "cloister", name: "The Anointed One", leaderId: "knight-abbot", stronghold: "Unholy Altar", summary: "Any number of Rot Demons. Before the aftermath, 3d6 after a win or 2d6 after a loss can kill the leader, grant experience, or add a free demon.", limitOverrides: { "rot-demon": null } },
  { id: "rabble", faction: "cloister", name: "Blessed Rabble", leaderId: "high-sorcerer", stronghold: "Street Pulpit", summary: "Each level of Black Rot on a Dreg Cultist is worth 5 experience. When any fighter is killed, every Dreg Cultist earns 10 experience." },
];

export const ORIGIN_BY_ID: Record<string, OriginDef> = Object.fromEntries(ORIGINS.map((o) => [o.id, o]));
