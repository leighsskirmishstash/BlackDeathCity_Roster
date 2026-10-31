import type { FighterDef, SkillDef } from "./types";

export const SKILLS: SkillDef[] = [
  { id: "dual-weapon", name: "Dual-weapon Wielder", table: "veteran", blurb: "Off-hand weapons make 2 attacks instead of 1." },
  { id: "tough", name: "Tough Bastard", table: "veteran", blurb: "While bloodied, a Willpower test heals 1 life and clears bloodied." },
  { id: "shooting-drills", name: "Shooting Drills", table: "veteran", blurb: "A Willpower test lets a reload skip the Move or Action." },
  { id: "fast-learner", name: "Fast Learner", table: "veteran", blurb: "Earns d6 bonus experience after each battle." },
  { id: "great-weapon", name: "Great Weapon Master", table: "veteran", blurb: "Ignores Unwieldy on melee weapons." },
  { id: "duellist", name: "Duellist", table: "veteran", blurb: "Can parry critical hits with any hit." },
  { id: "unshakeable", name: "Unshakeable", table: "veteran", blurb: "Ignores Fear and scatter." },
  { id: "steady-aim", name: "Steady Aim", table: "veteran", blurb: "+1 to ranged attack rolls if this fighter has not moved." },

  { id: "rallying-cry", name: "Rallying Cry", table: "old-dogs", blurb: "Once per battle, heal 1. If still on the table at the end of the round, no flee test." },
  { id: "feint", name: "Feint", table: "old-dogs", blurb: "Once per melee action, a roll equal to the parry turns that hit into a critical." },
  { id: "explorer", name: "Explorer's Instincts", table: "old-dogs", blurb: "Re-roll one die of an exploration roll this fighter leads." },
  { id: "point-blank", name: "Point Blank Shot", table: "old-dogs", blurb: "An Initiative test allows a ranged attack into an engaged enemy, not with a Heavy weapon." },
  { id: "right-on-time", name: "Right On Time", table: "old-dogs", blurb: "Re-roll reinforcement rolls for a battle group that includes this fighter." },
  { id: "crackshot", name: "Crackshot", table: "old-dogs", blurb: "Ranged attacks critically hit on a natural 5 or 6." },
  { id: "blackpowder", name: "Blackpowder Specialist", table: "soldiers", blurb: "Re-roll misfires." },
  { id: "fight-till-end", name: "Fight Till the End", table: "soldiers", blurb: "While bloodied, +1 Damage and Critical Damage on melee weapons." },
  { id: "shield-expert", name: "Shield Expert", table: "soldiers", blurb: "A shield improves Armour by one more against a charger, to a maximum of 2+." },
  { id: "blessed-saints", name: "Blessed by the Saints", table: "soldiers", blurb: "The first critical hit each round is not a critical." },
  { id: "marksman", name: "Marksman", table: "soldiers", blurb: "+3\" range, except Flame weapons." },
  { id: "stand-ground", name: "Stand Ground", table: "soldiers", blurb: "Once per battle, melee weapons gain Brace and Bludgeon against a charger." },

  { id: "poisons", name: "Purveyor of Poisons", table: "schemes", blurb: "Melee weapons gain Poison, or +1 Rend if they already have it." },
  { id: "too-cunning", name: "Too Cunning to Die", table: "schemes", blurb: "Roll lasting injuries twice and pick either result." },
  { id: "dirty-fighter", name: "Dirty Fighter", table: "schemes", blurb: "Enemy parries are at -1, and a failed parry deals 1 damage." },
  { id: "dark-science", name: "Master of Dark Science", table: "schemes", blurb: "Friends within 6\" gain +3\" range and may re-roll misfires." },
  { id: "attack-attack", name: "Attack! Attack!", table: "schemes", blurb: "Once per battle, friends within 9\" get +1 to melee attack rolls this round." },
  { id: "unseen-quarter", name: "From Unseen Quarter", table: "schemes", blurb: "A reserve leader may arrive anywhere beyond 9\" and bring two henchmen." },
  { id: "impetuous", name: "Impetuous", table: "tunnel", blurb: "The first move of the battle gains an extra d6\"." },
  { id: "escape-artist", name: "Escape Artist", table: "tunnel", blurb: "Once per battle, leave melee and reappear within 2d6\", not engaged." },
  { id: "wall-scrambler", name: "Wall Scrambler", table: "tunnel", blurb: "Climbs walls like ladders and jumps its full move." },
  { id: "ambush", name: "Ambush", table: "tunnel", blurb: "+1 melee attack after a charge." },
  { id: "back-stabber", name: "Back Stabber", table: "tunnel", blurb: "+1 Rend when the enemy is engaged with more than one fighter." },
  { id: "shadow-lurker", name: "Shadow Lurker", table: "tunnel", blurb: "Within ½\" of terrain, not visible to enemies more than 9\" away." },

  { id: "cloud-of-bats", name: "Cloud of Bats", table: "aristocracy", blurb: "Once per battle, teleport up to 9\" horizontally, not into melee." },
  { id: "supernatural-healing", name: "Supernatural Healing", table: "aristocracy", blurb: "Lasting injuries are temporary. A Willpower test on death becomes d3 battles of slumber." },
  { id: "mesmeric-gaze", name: "Mesmeric Gaze", table: "aristocracy", blurb: "Once per battle, a Willpower contest reduces the defender's melee attacks by 1." },
  { id: "leech-blood", name: "Leech Blood", table: "aristocracy", blurb: "Once per battle, nearby enemies who fail Willpower suffer 1 damage and this fighter heals 1." },
  { id: "unholy-strength", name: "Unholy Strength", table: "aristocracy", blurb: "Melee weapons gain Bludgeon." },
  { id: "relentless", name: "Relentless Attacker", table: "aristocracy", blurb: "Enemy parries against this fighter are at -1." },
  { id: "death-march", name: "Death March", table: "undying", blurb: "Once per battle, friendly Thralls within 9\" gain +2 Move this round." },
  { id: "dread-aura", name: "Dread Aura", table: "undying", blurb: "Causes fear." },
  { id: "rise-again", name: "Rise Again", table: "undying", blurb: "The first time this fighter is taken down, a 6 at the start of a later round returns them and heals d3." },
  { id: "drag-down", name: "Drag Down Into the Earth", table: "undying", blurb: "When taken down in melee, one engaged enemy suffers d3 damage." },
  { id: "chill-touch", name: "Chill Touch", table: "undying", blurb: "+1 Critical Damage on melee weapons." },
  { id: "kingsguard", name: "Kingsguard", table: "undying", championOnly: true, blurb: "A champion can charge in to intercept an enemy who charged the leader." },

  { id: "shepherd", name: "Shepherd the Afflicted", table: "ordained", blurb: "Friends who start a move within 6\" may move 1\" further." },
  { id: "last-rites", name: "Last Rites", table: "ordained", blurb: "Heal 1 when another fighter is taken down within 6\"." },
  { id: "demonic-conduit", name: "Demonic Conduit", table: "ordained", blurb: "Once per battle, a reserve demon may arrive within 3\"." },
  { id: "unholy-sermon", name: "Unholy Sermon", table: "ordained", blurb: "Once per battle, friends within 6\" get +1 to melee attack rolls this round." },
  { id: "rite-contagion", name: "Rite of Contagion", table: "ordained", blurb: "Once per battle, enemies within 12\" who fail Willpower suffer 1 damage and are poisoned." },
  { id: "benediction", name: "The Black Benediction", table: "ordained", blurb: "Incoming Damage and Critical Damage are reduced by 1, to a minimum of 1." },
  { id: "maggots", name: "Infested with Maggots", table: "blessings", blurb: "On activation, if damaged, a 4+ heals 1 life." },
  { id: "shroud", name: "Shroud of Flies", table: "blessings", blurb: "Attack rolls against this fighter are at -1." },
  { id: "black-blood", name: "Black Blood", table: "blessings", blurb: "Cannot be poisoned." },
  { id: "vessel", name: "Vessel of Black Rot", table: "blessings", blurb: "When taken down, each enemy within 6\" is poisoned on a 4+." },
  { id: "toxic-miasma", name: "Toxic Miasma", table: "blessings", blurb: "An enemy who activates while engaged must pass Willpower or suffer 1 damage." },
  { id: "entropy", name: "Vector of Entropy", table: "blessings", blurb: "Engaged enemies have their Armour worsened by 1." },
];

export const SKILL_BY_ID: Record<string, SkillDef> = Object.fromEntries(SKILLS.map((s) => [s.id, s]));

const TABLE_LABEL: Record<SkillDef["table"], string> = {
  veteran: "Veteran Skills",
  "old-dogs": "Old Dogs",
  soldiers: "Soldier's Cunning",
  schemes: "Masterful Schemes",
  tunnel: "Tunnel Runners",
  aristocracy: "Dark Aristocracy",
  undying: "Undying Lords",
  ordained: "Ordained of the Cloister",
  blessings: "Blessings of Saint Rot",
};

export function skillTableLabel(table: SkillDef["table"]): string {
  return TABLE_LABEL[table];
}

export function skillAllowed(skill: SkillDef, fighter: FighterDef): boolean {
  if (skill.championOnly && fighter.role !== "champion") return false;
  const leaderish = fighter.role === "leader" || fighter.role === "champion";
  const has = (word: string) => fighter.keywords.includes(word);
  switch (skill.table) {
    case "veteran":
      return fighter.gainsXp;
    case "old-dogs":
      return has("Mercenary") && leaderish;
    case "soldiers":
      return has("Mercenary");
    case "schemes":
      return has("Verminkin") && leaderish;
    case "tunnel":
      return has("Verminkin");
    case "aristocracy":
      return has("Undead") && has("Aristocrat") && leaderish;
    case "undying":
      return has("Skeleton") && leaderish;
    case "ordained":
      return has("Cloister") && leaderish;
    case "blessings":
      return has("Cloister");
    default:
      return false;
  }
}
