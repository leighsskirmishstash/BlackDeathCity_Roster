export type Role = "leader" | "champion" | "henchman" | "brute" | "beast";

export type InjuryTable = "standard" | "thrall" | "demon" | "beast";

export type SkillTable =
  | "veteran"
  | "old-dogs"
  | "soldiers"
  | "schemes"
  | "tunnel"
  | "aristocracy"
  | "undying"
  | "ordained"
  | "blessings";

export interface Stats {
  move: string;
  blade: string;
  bow: string;
  armour: string;
  init: number;
  will: number;
  life: number;
}

export interface GearDef {
  id: string;
  name: string;
  kind: "melee" | "ranged" | "armour" | "item";
  cost: number;
  attacks?: string;
  rend?: string;
  damage?: string;
  crit?: string;
  range?: string;
  traits?: string[];
  armour?: string;
  held?: boolean;
  rare?: number;
  blocksTwoHandRanged?: boolean;
  rangedException?: string[];
  movePenalty?: number;
  requires?: string[];
  note?: string;
  /** Bought upgrades that do not use a wargear slot. */
  mutation?: boolean;
}

export interface SkillDef {
  id: string;
  name: string;
  table: SkillTable;
  blurb: string;
  championOnly?: boolean;
}

export interface FighterDef {
  id: string;
  faction: string;
  name: string;
  role: Role;
  keywords: string[];
  cost: number;
  limit?: number;
  stats: Stats;
  lists: string[];
  xp: string;
  gainsXp: boolean;
  skillPicks: number;
  fixedSkills?: string[];
  signatureSpells?: number;
  lore?: string;
  included?: string[];
  fixedOnly?: boolean;
  injury: InjuryTable;
  note?: string;
}

export interface OriginDef {
  id: string;
  faction: string;
  name: string;
  leaderId: string;
  stronghold: string;
  summary: string;
  /** null means no maximum from the scroll limit. */
  limitOverrides?: Record<string, number | null>;
  /** These beasts do not count toward the 0–3 beast cap. */
  ignoreBeastLimit?: string[];
}

export interface RosterFighter {
  uid: string;
  defId: string;
  name: string;
  xp: number;
  skills: string[];
  gear: string[];
  spells: string[];
  injuries: string[];
  blackRot: number;
  missBattles: number;
  kills: number;
}

export interface Warband {
  id: string;
  name: string;
  faction: string;
  originId: string;
  stronghold: string;
  stash: number;
  holdings: string[];
  notes: string;
  battles: number;
  victories: number;
  ransacked: number;
  fightersLost: number;
  fighters: RosterFighter[];
}

export interface BattleFighter {
  uid: string;
  warbandId: string;
  damage: number;
  form: "base" | "beast";
  takenDown: boolean;
  hidden: boolean;
  engaged: boolean;
  activated: boolean;
  surged: boolean;
  poisoned: boolean;
  reloaded: boolean;
  killerUid?: string;
}

export interface BattleSession {
  id: string;
  round: number;
  warbandIds: string[];
  fighters: BattleFighter[];
  log: string[];
  winnerId?: string;
}
