import { FIGHTER_BY_ID } from "./fighters";
import { GEAR_BY_ID, LISTS, isTwoHanded, rareCap } from "./gear";
import { ORIGIN_BY_ID } from "./origins";
import { SKILLS, skillAllowed } from "./skills";
import { LORE_SPELLS } from "./spells";
import type { SuggestedBuild, SuggestedFighter } from "./suggested";
import type { FighterDef, GearDef } from "./types";

export type PlayStyle = "melee" | "ranged" | "arcane" | "combo";

export const STYLE_LABEL: Record<PlayStyle, string> = {
  melee: "Melee",
  ranged: "Ranged",
  arcane: "Arcane",
  combo: "Mixed",
};

const MIN_MODELS = 6;
const MAX_MODELS = 15;
const PURSE = 1000;

const NAMES: Record<string, string[]> = {
  guild: ["Holt", "Maren", "Pell", "Voss", "Quinn", "Anselm", "Bram", "Harren", "Lira", "Sera", "Tomas", "Edda", "Cade", "Nils", "Brynn"],
  vermin: ["Skrik", "Snikk", "Kratcher", "Retch", "Weep", "Tik", "Klink", "Gnaw", "Squeak", "Veskit", "Mors", "Scab", "Pust", "Krush", "Ikk"],
  coven: ["Dragul", "Valek", "Vellum", "Stitch", "Ossek", "Vrykan", "Barovyra", "Ossrik", "Mourn", "Cairn", "Letha", "Wight", "Sepul", "Noct", "Ashen"],
  cloister: ["Cassian", "Remigius", "Vile", "Gall", "Mire", "Filth", "Hasp", "Cowl", "Sallow", "Blight", "Rook", "Moth", "Canker", "Pew", "Nave"],
};

const RANGED_BEST = ["long-rifle", "arbalest", "volley-rifle", "flamethrower", "ogre-cannon", "gatling", "orb-launcher", "rocket", "arc-gun", "crossbow", "long-bow", "bp-rifle", "brace-pistols", "repeater", "short-bow", "flame-canister", "hand-crossbow", "bp-pistol", "ogre-pistol", "blunderbuss", "orb-bombs", "sling", "cloister-sling", "blowpipe", "throwing-stars"];
const MELEE_BEST = ["cursed-blade", "zweihander", "great-mace", "heavy-axe", "warhammer", "cursed-sword", "halberd", "ogre-great", "spark-fists", "spark-drill", "ensorcelled-halberd", "great-club", "heavy-flail", "great-rot-blade", "ogre-blade", "rat-blade", "ogre-mace", "poison-blade", "rot-blade", "ensorcelled", "sword", "spear", "axe", "flail", "club", "iron-claw", "staff", "dagger", "punch-dagger"];
const ARCANE_BEST = ["ensorcelled", "cursed-sword", "staff", "sword"];
const ARMOUR_BEST = ["full-plate", "cuirass", "ogre-armour", "heavy-plating", "warded-robes"];
const SIDEARM = ["sword", "axe", "dagger", "punch-dagger", "club", "iron-claw"];
const ARCANE_ITEMS = ["grimoire", "bell", "winged-familiar", "spirit-guardian", "bestial-companion", "cauldron"];
const RANGED_ITEMS = ["bomb-bolt", "periscope", "gas-mask", "smoke-bomb", "grappling-hook", "orb-bombs"];
const MELEE_ITEMS = ["loyal-companion", "guild-banner", "clan-banner", "ancient-banner", "cloister-icon", "gas-mask", "stakes", "lantern", "grappling-hook", "net", "smoke-bomb", "hulking-form", "wulfen-legs", "bat-wings"];

type Kit = "melee" | "ranged" | "arcane";

interface Draft {
  def: FighterDef;
  gear: string[];
  skills: string[];
  spells: string[];
  kit: Kit;
}

export function generateRoster(input: {
  originId: string;
  style: PlayStyle;
  models: number;
  seed: number;
}): SuggestedBuild {
  const origin = ORIGIN_BY_ID[input.originId];
  const requested = clamp(Math.round(input.models) || MIN_MODELS, 1, MAX_MODELS);
  const target = clamp(requested, MIN_MODELS, MAX_MODELS);
  const drafts = hireBodies(origin.id, origin.faction, origin.leaderId, input.style, target);
  const silver = { left: PURSE - drafts.reduce((sum, draft) => sum + draft.def.cost, 0) };
  equip(drafts, silver);
  assignSkills(drafts, input.seed);
  assignSpells(drafts, input.seed);
  const fighters = nameFighters(drafts, origin.faction, input.seed);
  const hired = fighters.length;
  const notes: string[] = [
    `${STYLE_LABEL[input.style]} roster for ${origin.name}. The stronghold is the ${origin.stronghold}.`,
  ];
  if (requested < MIN_MODELS) {
    notes.push(`A warband needs at least ${MIN_MODELS} fighters, so this list hires ${hired}.`);
  } else if (hired < requested) {
    notes.push(`The 1000 silver purse could hire ${hired} of the ${requested} fighters asked for. The rest of the silver went onto wargear.`);
  } else if (hired <= 9) {
    notes.push("The short roster spends the leftover silver on wargear suited to this play style.");
  }
  if (silverLeftNote(fighters) >= 40) {
    notes.push("Silver left in the stash could not buy any more wargear that fits these fighters and this play style.");
  }
  if (input.style === "ranged" && !factionHasRanged(origin.faction)) {
    notes.push("This faction's printed lists have no ranged weapons, so the silver went into melee wargear instead.");
  }
  return {
    id: `generated-${origin.id}-${input.style}-${hired}-${input.seed}`,
    faction: origin.faction,
    originId: origin.id,
    name: `${STYLE_LABEL[input.style]} ${origin.stronghold}`,
    summary: notes.join(" "),
    fighters,
  };
}

function hireBodies(originId: string, faction: string, leaderId: string, style: PlayStyle, target: number): Draft[] {
  const leader = FIGHTER_BY_ID[leaderId];
  const drafts: Draft[] = [blank(leader, style, 0)];
  const wishlist = shoppingList(originId, faction, style);
  let wish = 0;
  while (drafts.length < target && wish < wishlist.length) {
    const id = wishlist[wish++];
    if (!canAdd(originId, drafts, id, target)) continue;
    drafts.push(blank(FIGHTER_BY_ID[id], style, drafts.length));
  }
  while (drafts.length < target) {
    const id = nextFiller(originId, faction, style, drafts, target);
    if (!id) break;
    drafts.push(blank(FIGHTER_BY_ID[id], style, drafts.length));
  }
  return drafts;
}

function shoppingList(originId: string, faction: string, style: PlayStyle): string[] {
  const cast: string[] = [];
  const fight: string[] = [];
  const brute: string[] = [];
  const beast: string[] = [];
  const premium: string[] = [];

  if (faction === "guild") {
    cast.push("guild-wizard", "guild-cleric");
    fight.push("guild-champion", "guild-champion", "guild-champion", "witch-apprentice", "plague-doctor");
    brute.push("ogre");
    beast.push("hound", "hound", "hound");
  } else if (faction === "vermin") {
    cast.push("warlock", "pox-apprentice");
    fight.push("vermin-champion", "vermin-champion", "assassin-app", "spark-app", "spark-app");
    brute.push("rat-mutant", "contraption");
    beast.push("giant-rat", "giant-rat", "giant-rat");
  } else if (faction === "coven") {
    cast.push("courtesan", "necro-app");
    fight.push("blood-knight", "barrow-champion", "barrow-champion", "misbegotten");
    brute.push("zombie-ogre", "gargoyle");
    beast.push("dire-wolf", "dire-wolf", "dire-bat");
  } else {
    cast.push("cloister-sorcerer", "shaman");
    fight.push("cloister-champion", "rot-herald");
    brute.push("rotspawn");
    beast.push("rotling", "rotling", "rotling", "bloat-fly");
    premium.push("cloister-knight", "beastman", "beastman");
  }

  if (originId === "acolytes") cast.unshift("pox-apprentice", "pox-apprentice");
  if (originId === "priesthood") cast.unshift("cloister-sorcerer", "cloister-sorcerer");
  if (originId === "wizard-origin") cast.unshift("guild-wizard");
  if (originId === "witch-origin") fight.unshift("witch-apprentice");
  if (originId === "aristocrats") fight.unshift("blood-knight", "blood-knight", "blood-knight");
  if (originId === "the-hunt") beast.unshift("dire-wolf", "dire-wolf", "dire-wolf");
  if (originId === "spark-origin" && (style === "ranged" || style === "combo")) brute.unshift("contraption");
  if (originId === "rooftop") fight.unshift("assassin-app");
  if (originId === "militant") premium.unshift("cloister-knight", "cloister-knight", "cloister-knight", "cloister-knight");
  if (originId === "anointed" && style !== "ranged") {
    premium.unshift("rot-demon", "rot-demon", "rot-demon", "rot-demon", "rot-demon", "rot-demon");
  }
  if (originId === "rabble") premium.unshift("dreg", "dreg", "dreg");

  if (style === "arcane") return [...cast, ...fight, ...beast, ...brute, ...premium];
  if (style === "ranged") return [...rangedFirst(fight, faction), ...brute, ...premium, ...beast, ...cast];
  if (style === "combo") return interleave(cast, fight, brute, premium, beast);
  return [...fight, ...brute, ...beast, ...premium, ...cast];
}

function rangedFirst(fight: string[], faction: string): string[] {
  if (faction === "vermin") return ["spark-app", "spark-app", "vermin-champion", ...fight];
  if (faction === "guild") return ["guild-champion", "guild-champion", ...fight];
  if (faction === "cloister") return ["dreg", "dreg", "dreg"];
  return fight;
}

function canAdd(originId: string, drafts: Draft[], id: string, target: number): boolean {
  const def = FIGHTER_BY_ID[id];
  if (!def) return false;
  if (!withinLimits(originId, drafts, def)) return false;
  const henchAfter = henchCount(drafts) + (def.role === "henchman" ? 1 : 0);
  const slotsAfter = target - (drafts.length + 1);
  const henchShort = Math.max(0, 5 - henchAfter);
  if (henchShort > slotsAfter) return false;
  const fillers = slotsAfter;
  const cheapest = cheapestHenchman(def.faction);
  const cost = drafts.reduce((sum, draft) => sum + draft.def.cost, 0) + def.cost + fillers * cheapest;
  const reserve = target * 18;
  return cost + reserve <= PURSE;
}

function nextFiller(originId: string, faction: string, style: PlayStyle, drafts: Draft[], target: number): string | null {
  const prefer = preferredFiller(originId, faction, style);
  if (canAdd(originId, drafts, prefer, target)) return prefer;
  const cheap = fillerId(faction);
  if (cheap !== prefer && canAdd(originId, drafts, cheap, target)) return cheap;
  return null;
}

function preferredFiller(originId: string, faction: string, style: PlayStyle): string {
  if (faction === "guild") return "mercenary";
  if (faction === "vermin") return "warrior";
  if (faction === "coven") return "skeleton";
  if (originId === "militant" && style === "melee") return "cloister-knight";
  if (originId === "anointed" && style !== "ranged") return "rot-demon";
  return "dreg";
}

function fillerId(faction: string): string {
  if (faction === "guild") return "recruit";
  if (faction === "vermin") return "warrior";
  if (faction === "coven") return "zombie";
  return "dreg";
}

function cheapestHenchman(faction: string): number {
  return FIGHTER_BY_ID[fillerId(faction)].cost;
}

function withinLimits(originId: string, drafts: Draft[], def: FighterDef): boolean {
  const origin = ORIGIN_BY_ID[originId];
  const same = drafts.filter((draft) => draft.def.id === def.id).length;
  const override = origin.limitOverrides?.[def.id];
  const cap = override !== undefined ? override : (def.limit ?? null);
  if (cap != null && same + 1 > cap) return false;
  const roleCount = drafts.filter((draft) => {
    if (draft.def.role !== def.role) return false;
    if (def.role === "beast" && origin.ignoreBeastLimit?.includes(draft.def.id)) return false;
    return true;
  }).length;
  const ignored = def.role === "beast" && origin.ignoreBeastLimit?.includes(def.id);
  if (ignored) return drafts.length < 15;
  if (def.role === "champion" && roleCount >= 3) return false;
  if (def.role === "brute" && roleCount >= 2) return false;
  if (def.role === "beast" && roleCount >= 3) return false;
  if (def.role === "leader") return false;
  return true;
}

function henchCount(drafts: Draft[]): number {
  return drafts.filter((draft) => draft.def.role === "henchman").length;
}

function blank(def: FighterDef, style: PlayStyle, index: number): Draft {
  return { def, gear: [], skills: [], spells: [], kit: kitFor(def, style, index) };
}

function kitFor(def: FighterDef, style: PlayStyle, index: number): Kit {
  const practitioner = def.lists.some((list) => list.endsWith("practitioner") || list.endsWith("wizard") || list.endsWith("cleric"));
  const canRanged = sells(def, (gear) => gear.kind === "ranged");
  const ordinaryMelee = sells(def, (gear) => gear.kind === "melee" && gear.id !== "staff");
  if (style === "ranged" && canRanged) return "ranged";
  if (practitioner && (style !== "melee" || !ordinaryMelee)) return "arcane";
  if (style === "combo") {
    if (practitioner && index % 2 === 0) return "arcane";
    if (canRanged && index % 2 === 1) return "ranged";
  }
  return "melee";
}

function equip(drafts: Draft[], silver: { left: number }) {
  for (const draft of drafts) addCheapestWeapon(drafts, draft, silver);
  for (const draft of drafts) addArmour(drafts, draft, silver);
  for (const draft of drafts) addCasterTools(drafts, draft, silver);
  for (const draft of drafts) addSecondary(drafts, draft, silver);
  for (const draft of drafts) upgradeWeapon(drafts, draft, silver);
  let moved = true;
  while (moved) {
    moved = false;
    for (const draft of drafts) {
      if (addNextItem(drafts, draft, silver)) moved = true;
    }
  }
  mopUp(drafts, silver);
}

function addCasterTools(drafts: Draft[], draft: Draft, silver: { left: number }) {
  if (draft.kit !== "arcane") return;
  for (const id of ["grimoire", "bell", "cauldron"]) {
    const piece = GEAR_BY_ID[id];
    if (!piece || piece.cost > silver.left || !allow(drafts, draft, id)) continue;
    if (piece.held && hasTwoHandMelee(draft)) continue;
    draft.gear.push(id);
    silver.left -= piece.cost;
  }
}

function addCheapestWeapon(drafts: Draft[], draft: Draft, silver: { left: number }) {
  const pred = (gear: GearDef) => {
    if (draft.kit === "ranged") return gear.kind === "ranged";
    if (draft.kit === "arcane") return gear.id === "staff" || gear.kind === "melee";
    return gear.kind === "melee";
  };
  const choices = available(draft.def).filter(pred).sort((a, b) => a.cost - b.cost);
  for (const gear of choices) {
    if (gear.cost <= silver.left && allow(drafts, draft, gear.id)) {
      draft.gear.push(gear.id);
      silver.left -= gear.cost;
      return;
    }
  }
}

function upgradeWeapon(drafts: Draft[], draft: Draft, silver: { left: number }) {
  const list = draft.kit === "ranged" ? RANGED_BEST : draft.kit === "arcane" ? ARCANE_BEST : MELEE_BEST;
  const kind = draft.kit === "ranged" ? "ranged" : "melee";
  const owned = draft.gear.filter((id) => GEAR_BY_ID[id]?.kind === kind);
  const primary = owned[0];
  for (const id of list) {
    if (draft.gear.includes(id)) continue;
    const piece = GEAR_BY_ID[id];
    if (!piece) continue;
    const refund = primary ? GEAR_BY_ID[primary].cost : 0;
    if (piece.cost - refund > silver.left || piece.cost <= refund) continue;
    const without = draft.gear.filter((gearId) => gearId !== primary);
    if (!allow(drafts, draft, id, without)) continue;
    draft.gear = [...without, id];
    silver.left -= piece.cost - refund;
    return;
  }
}

function addArmour(drafts: Draft[], draft: Draft, silver: { left: number }) {
  const order = draft.kit === "arcane"
    ? ["warded-robes", "cuirass", "full-plate"]
    : ARMOUR_BEST;
  for (const id of order) {
    const piece = GEAR_BY_ID[id];
    if (!piece || piece.cost > silver.left) continue;
    if (!allow(drafts, draft, id)) continue;
    if (blocksCurrentRanged(draft, piece)) continue;
    draft.gear.push(id);
    silver.left -= piece.cost;
    return;
  }
}

function addSecondary(drafts: Draft[], draft: Draft, silver: { left: number }) {
  if (draft.kit === "ranged" || draft.kit === "arcane") {
    for (const id of SIDEARM) {
      const piece = GEAR_BY_ID[id];
      if (!piece || piece.cost > silver.left || isTwoHanded(piece)) continue;
      if (!allow(drafts, draft, id)) continue;
      draft.gear.push(id);
      silver.left -= piece.cost;
      return;
    }
    return;
  }
  if (silver.left >= 10 && allow(drafts, draft, "shield")) {
    draft.gear.push("shield");
    silver.left -= 10;
    return;
  }
  for (const id of SIDEARM) {
    const piece = GEAR_BY_ID[id];
    if (!piece || piece.cost > silver.left || isTwoHanded(piece)) continue;
    if (!allow(drafts, draft, id)) continue;
    draft.gear.push(id);
    silver.left -= piece.cost;
    return;
  }
}

function mopUp(drafts: Draft[], silver: { left: number }) {
  let moved = true;
  while (moved) {
    moved = false;
    for (const draft of drafts) {
      const choices = available(draft.def)
        .filter((gear) => !draft.gear.includes(gear.id) && gearFitsKit(draft.kit, gear))
        .sort((a, b) => b.cost - a.cost);
      for (const gear of choices) {
        if (gear.cost > silver.left || !allow(drafts, draft, gear.id)) continue;
        if (gear.kind === "melee" && draft.gear.some((id) => GEAR_BY_ID[id]?.kind === "melee")) continue;
        if (gear.held && hasTwoHandMelee(draft)) continue;
        draft.gear.push(gear.id);
        silver.left -= gear.cost;
        moved = true;
        break;
      }
    }
  }
}

function gearFitsKit(kit: Kit, gear: GearDef): boolean {
  if (gear.kind === "armour") return true;
  if (gear.id === "shield" || gear.id === "grimoire" || gear.id === "bell" || gear.id === "gas-mask" || gear.id === "grappling-hook") return true;
  if (kit === "ranged") return gear.kind === "ranged" || gear.kind === "item" || (!isTwoHanded(gear) && gear.kind === "melee");
  if (kit === "arcane") return gear.kind !== "ranged";
  return gear.kind !== "ranged";
}

function addNextItem(drafts: Draft[], draft: Draft, silver: { left: number }): boolean {
  const list = draft.kit === "arcane" ? ARCANE_ITEMS : draft.kit === "ranged" ? RANGED_ITEMS : MELEE_ITEMS;
  for (const id of list) {
    if (draft.gear.includes(id)) continue;
    const piece = GEAR_BY_ID[id];
    if (!piece || piece.cost > silver.left) continue;
    if (!allow(drafts, draft, id)) continue;
    if (piece.held && hasTwoHandMelee(draft)) continue;
    draft.gear.push(id);
    silver.left -= piece.cost;
    return true;
  }
  return false;
}

function allow(drafts: Draft[], draft: Draft, id: string, gear = draft.gear): boolean {
  const piece = GEAR_BY_ID[id];
  if (!piece || piece.cost <= 0 || gear.includes(id)) return false;
  if (draft.def.fixedOnly && !piece.mutation) return false;
  if (piece.mutation && gear.some((gearId) => GEAR_BY_ID[gearId]?.mutation)) return false;
  const onList = draft.def.lists.some((list) => (LISTS[list] ?? []).includes(id));
  if (!onList) return false;
  for (const need of piece.requires ?? []) {
    const has = gear.includes(need) || (draft.def.included ?? []).includes(need);
    if (!has) return false;
  }
  const cap = rareCap(piece);
  if (cap != null) {
    const used = drafts.reduce((sum, other) => sum + other.gear.filter((gearId) => gearId === id).length, 0);
    const already = gear.filter((gearId) => gearId === id).length;
    const current = draft.gear.filter((gearId) => gearId === id).length;
    if (used - current + already + 1 > cap) return false;
  }
  return slotsOk(draft.def, [...gear, id]);
}

function slotsOk(def: FighterDef, bought: string[]): boolean {
  const all = [...(def.included ?? []), ...bought].map((id) => GEAR_BY_ID[id]).filter((gear): gear is GearDef => Boolean(gear));
  const slotted = all.filter((gear) => !gear.mutation);
  const melee = slotted.filter((gear) => gear.kind === "melee" || gear.held);
  const ranged = slotted.filter((gear) => gear.kind === "ranged");
  const armour = slotted.filter((gear) => gear.kind === "armour");
  const items = slotted.filter((gear) => gear.kind === "item" && !gear.held);
  if (melee.length > 2 || ranged.length > 1 || armour.length > 1 || items.length > 2) return false;
  const twoHandMelee = all.filter((gear) => gear.kind === "melee" && isTwoHanded(gear));
  if (twoHandMelee.length > 1) return false;
  const plate = all.find((gear) => gear.blocksTwoHandRanged);
  const blocked = ranged.find((gear) => isTwoHanded(gear) && !(plate?.rangedException ?? []).includes(gear.id));
  if (plate && blocked) return false;
  if (all.some((gear) => gear.held) && ranged.some((gear) => isTwoHanded(gear))) return false;
  return true;
}

function blocksCurrentRanged(draft: Draft, armour: GearDef): boolean {
  if (!armour.blocksTwoHandRanged) return false;
  const ranged = [...(draft.def.included ?? []), ...draft.gear]
    .map((id) => GEAR_BY_ID[id])
    .filter((gear): gear is GearDef => Boolean(gear && gear.kind === "ranged" && isTwoHanded(gear)));
  return ranged.some((gear) => !(armour.rangedException ?? []).includes(gear.id));
}

function hasTwoHandMelee(draft: Draft): boolean {
  return [...(draft.def.included ?? []), ...draft.gear].some((id) => {
    const gear = GEAR_BY_ID[id];
    return Boolean(gear && gear.kind === "melee" && isTwoHanded(gear));
  });
}

function assignSkills(drafts: Draft[], seed: number) {
  const used = new Set<string>();
  for (const draft of drafts) {
    for (const id of draft.def.fixedSkills ?? []) used.add(id);
  }
  drafts.forEach((draft, index) => {
    const need = draft.def.skillPicks;
    const prefs = skillPrefs(draft);
    const gearFirst = prefs.filter((id) => ["great-weapon", "crackshot", "marksman", "blackpowder", "dual-weapon", "shield-expert"].includes(id));
    const rest = rotate(prefs.filter((id) => !gearFirst.includes(id)), seed + index);
    for (const id of [...gearFirst, ...rest, ...SKILLS.map((skill) => skill.id)]) {
      if (draft.skills.length >= need) break;
      if (used.has(id) || draft.skills.includes(id)) continue;
      const skill = SKILLS.find((row) => row.id === id);
      if (!skill || !skillAllowed(skill, draft.def)) continue;
      if (!skillFitsGear(id, draft)) continue;
      draft.skills.push(id);
      used.add(id);
    }
  });
}

function skillPrefs(draft: Draft): string[] {
  if (draft.kit === "ranged") {
    return ["crackshot", "marksman", "steady-aim", "shooting-drills", "blackpowder", "point-blank", "dark-science", "unshakeable", "fast-learner"];
  }
  if (draft.kit === "arcane") {
    return ["unshakeable", "too-cunning", "benediction", "shepherd", "last-rites", "tough", "fast-learner", "rite-contagion"];
  }
  return ["great-weapon", "duellist", "feint", "dual-weapon", "stand-ground", "ambush", "back-stabber", "attack-attack", "poisons", "unholy-strength", "relentless", "dread-aura", "death-march", "chill-touch", "kingsguard", "unholy-sermon", "shepherd", "fight-till-end", "shield-expert", "dirty-fighter"];
}

function skillFitsGear(id: string, draft: Draft): boolean {
  const gear = [...(draft.def.included ?? []), ...draft.gear].map((gearId) => GEAR_BY_ID[gearId]).filter((piece): piece is GearDef => Boolean(piece));
  const melee = gear.filter((piece) => piece.kind === "melee");
  const ranged = gear.filter((piece) => piece.kind === "ranged");
  if (id === "great-weapon") return melee.some((piece) => (piece.traits ?? []).includes("Unwieldy"));
  if (id === "crackshot" || id === "marksman" || id === "steady-aim" || id === "shooting-drills" || id === "point-blank") return ranged.length > 0;
  if (id === "blackpowder") return ranged.some((piece) => (piece.traits ?? []).includes("Misfire"));
  if (id === "shield-expert") return gear.some((piece) => piece.id === "shield");
  if (id === "dual-weapon") return melee.filter((piece) => !isTwoHanded(piece)).length >= 2;
  return true;
}

function assignSpells(drafts: Draft[], seed: number) {
  drafts.forEach((draft, index) => {
    const need = draft.def.signatureSpells ?? 0;
    const lore = LORE_SPELLS[draft.def.lore ?? ""] ?? [];
    draft.spells = rotate(lore, seed + index).slice(0, need);
  });
}

function nameFighters(drafts: Draft[], faction: string, seed: number): SuggestedFighter[] {
  const pool = NAMES[faction] ?? NAMES.guild;
  const used = new Set<string>();
  const ordered = [...drafts].sort((a, b) => roleRank(a.def.role) - roleRank(b.def.role));
  return ordered.map((draft, index) => {
    let name = pool[(seed + index) % pool.length];
    if (used.has(name)) name = `${name} ${index + 1}`;
    used.add(name);
    return { defId: draft.def.id, name, gear: draft.gear, skills: draft.skills, spells: draft.spells };
  });
}

function roleRank(role: FighterDef["role"]): number {
  return { leader: 0, champion: 1, henchman: 2, brute: 3, beast: 4 }[role];
}

function factionHasRanged(faction: string): boolean {
  return faction !== "coven";
}

function silverLeftNote(fighters: SuggestedFighter[]): number {
  const spent = fighters.reduce((sum, fighter) => {
    const body = FIGHTER_BY_ID[fighter.defId].cost;
    const gear = fighter.gear.reduce((gearSum, id) => gearSum + (GEAR_BY_ID[id]?.cost ?? 0), 0);
    return sum + body + gear;
  }, 0);
  return PURSE - spent;
}

function sells(def: FighterDef, pred: (gear: GearDef) => boolean): boolean {
  return available(def).some(pred);
}

function available(def: FighterDef): GearDef[] {
  const ids = new Set(def.lists.flatMap((list) => LISTS[list] ?? []));
  return [...ids].map((id) => GEAR_BY_ID[id]).filter((gear): gear is GearDef => Boolean(gear && gear.cost > 0));
}

function rotate<T>(items: T[], by: number): T[] {
  if (items.length === 0) return [];
  const start = Math.abs(by) % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

function interleave(...lists: string[][]): string[] {
  const out: string[] = [];
  const max = Math.max(0, ...lists.map((list) => list.length));
  for (let i = 0; i < max; i += 1) {
    for (const list of lists) if (list[i]) out.push(list[i]);
  }
  return out;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
