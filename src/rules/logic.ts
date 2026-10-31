import { FIGHTER_BY_ID } from "./fighters";
import { GEAR_BY_ID, LISTS, isTwoHanded, rareCap } from "./gear";
import { ORIGIN_BY_ID } from "./origins";
import { SKILL_BY_ID, skillAllowed } from "./skills";
import { spellsForLore } from "./spells";
import type { BattleFighter, FighterDef, GearDef, RosterFighter, Warband } from "./types";

export type GearCategory = "melee" | "ranged" | "armour" | "held" | "item" | "mutation";

export const GEAR_CATEGORY_LABEL: Record<GearCategory, string> = {
  melee: "Melee weapons",
  ranged: "Ranged weapons",
  armour: "Armour",
  held: "Held items",
  item: "Items",
  mutation: "Bloodline mutations",
};

export function gearCategory(piece: GearDef): GearCategory {
  if (piece.mutation) return "mutation";
  if (piece.kind === "armour") return "armour";
  if (piece.kind === "ranged") return "ranged";
  if (piece.kind === "melee") return "melee";
  if (piece.held) return "held";
  return "item";
}

export interface SlotUsage {
  meleeOrHeld: number;
  ranged: number;
  armour: number;
  items: number;
  mutations: number;
  meleeOrHeldMax: number;
  rangedMax: number;
  armourMax: number;
  itemsMax: number;
  mutationsMax: number;
}

export function slotUsage(rf: RosterFighter): SlotUsage {
  const all = gearOf(rf);
  const slotted = all.filter((g) => !g.mutation);
  return {
    meleeOrHeld: slotted.filter((g) => g.kind === "melee" || g.held).length,
    ranged: slotted.filter((g) => g.kind === "ranged").length,
    armour: slotted.filter((g) => g.kind === "armour").length,
    items: slotted.filter((g) => g.kind === "item" && !g.held).length,
    mutations: all.filter((g) => g.mutation).length,
    meleeOrHeldMax: 2,
    rangedMax: 1,
    armourMax: 1,
    itemsMax: 2,
    mutationsMax: 1,
  };
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function rollD6(): number {
  return 1 + Math.floor(Math.random() * 6);
}

export function rollD66(): number {
  return rollD6() * 10 + rollD6();
}

export function rollFormula(formula: string): number {
  if (formula === "0") return 0;
  const match = formula.match(/^(?:(\d+)\+)?d6$/);
  if (!match) return 0;
  return Number(match[1] ?? 0) + rollD6();
}

export function fighterDef(rf: RosterFighter): FighterDef {
  const def = FIGHTER_BY_ID[rf.defId];
  if (!def) throw new Error(`Unknown fighter ${rf.defId}`);
  return def;
}

export function gearOf(rf: RosterFighter): GearDef[] {
  const def = fighterDef(rf);
  const ids = [...(def.included ?? []), ...rf.gear];
  return ids.map((id) => GEAR_BY_ID[id]).filter((g): g is GearDef => Boolean(g));
}

export function fighterCost(rf: RosterFighter): number {
  const def = fighterDef(rf);
  const bought = rf.gear.reduce((sum, id) => sum + (GEAR_BY_ID[id]?.cost ?? 0), 0);
  return def.cost + bought;
}

export function warbandRating(wb: Warband): number {
  return wb.fighters.reduce((sum, rf) => sum + fighterCost(rf) + (fighterDef(rf).gainsXp ? rf.xp : 0), 0);
}

export function rosterCost(wb: Warband): number {
  return wb.fighters.reduce((sum, rf) => sum + fighterCost(rf), 0);
}

const ROLE_CAP: Record<FighterDef["role"], { min: number; max: number | null }> = {
  leader: { min: 1, max: 1 },
  champion: { min: 0, max: 3 },
  henchman: { min: 5, max: null },
  brute: { min: 0, max: 2 },
  beast: { min: 0, max: 3 },
};

function limitFor(originId: string, def: FighterDef): number | null {
  const origin = ORIGIN_BY_ID[originId];
  if (origin?.limitOverrides && def.id in origin.limitOverrides) {
    return origin.limitOverrides[def.id];
  }
  return def.limit ?? null;
}

function armourNumber(value: string): number | null {
  if (value === "-" || value === "") return null;
  const n = Number(value.replace("+", ""));
  return Number.isFinite(n) ? n : null;
}

export function effectiveArmour(rf: RosterFighter): string {
  const def = fighterDef(rf);
  const pieces = gearOf(rf);
  const suit = pieces.find((g) => g.kind === "armour");
  let value = suit?.armour ?? def.stats.armour;
  const shields = pieces.filter((g) => g.id === "shield").length;
  let n = armourNumber(value);
  if (n != null && shields > 0) n = Math.max(2, n - shields);
  if (n == null) return "-";
  return `${n}+`;
}

export function maxLife(rf: RosterFighter, form: "base" | "beast"): number {
  if (rf.defId === "lycanfell" && form === "beast") return 8;
  if (rf.gear.includes("hulking-form")) return 8;
  return fighterDef(rf).stats.life;
}

export function displayStats(rf: RosterFighter, form: "base" | "beast" = "base") {
  const def = fighterDef(rf);
  if (rf.defId === "lycanfell" && form === "beast") {
    return { move: '5"', blade: "2+", bow: "6+", armour: "5+", init: 5, will: 4, life: 8 };
  }
  const stats = { ...def.stats, armour: effectiveArmour(rf), life: maxLife(rf, "base") };
  if (rf.gear.includes("wulfen-legs")) stats.move = '7"';
  return stats;
}

export type RosterCheckStatus = "pass" | "fail";

export interface RosterCheck {
  id: string;
  label: string;
  required: string;
  current: string;
  status: RosterCheckStatus;
  missing?: string;
}

export interface RosterAudit {
  ok: boolean;
  checks: RosterCheck[];
  missing: string[];
  issues: string[];
}

function roleCounts(wb: Warband): Record<FighterDef["role"], number> {
  const origin = ORIGIN_BY_ID[wb.originId];
  const byRole: Record<FighterDef["role"], number> = { leader: 0, champion: 0, henchman: 0, brute: 0, beast: 0 };
  for (const rf of wb.fighters) {
    const def = FIGHTER_BY_ID[rf.defId];
    if (!def) continue;
    const ignored = def.role === "beast" && Boolean(origin?.ignoreBeastLimit?.includes(def.id));
    if (!ignored) byRole[def.role] += 1;
  }
  return byRole;
}

/** Summarise how many of each fighter type fill a role, e.g. "5 · Courtesan, Bloodcursed Knight ×3, Misbegotten". */
function roleComposition(wb: Warband, role: FighterDef["role"]): string {
  const counts = new Map<string, number>();
  for (const rf of wb.fighters) {
    const def = FIGHTER_BY_ID[rf.defId];
    if (!def || def.role !== role) continue;
    counts.set(def.name, (counts.get(def.name) ?? 0) + 1);
  }
  if (counts.size === 0) return "0";
  const total = [...counts.values()].reduce((sum, n) => sum + n, 0);
  const parts = [...counts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, n]) => (n > 1 ? `${name} ×${n}` : name));
  return `${total} · ${parts.join(", ")}`;
}

export function auditRoster(wb: Warband): RosterAudit {
  const checks: RosterCheck[] = [];
  const issues: string[] = [];
  const origin = ORIGIN_BY_ID[wb.originId];
  const leaderName = origin ? (FIGHTER_BY_ID[origin.leaderId]?.name ?? origin.leaderId) : "origin leader";

  if (!origin || origin.faction !== wb.faction) {
    checks.push({
      id: "origin",
      label: "Origin",
      required: "An origin that matches this faction",
      current: origin ? `${origin.name} (wrong faction)` : "None",
      status: "fail",
      missing: "Pick an origin for this faction.",
    });
    return { ok: false, checks, missing: checks.flatMap((check) => (check.missing ? [check.missing] : [])), issues: ["Pick an origin for this faction."] };
  }

  checks.push({
    id: "name",
    label: "Warband name",
    required: "A named warband",
    current: wb.name.trim() || "Unnamed",
    status: wb.name.trim() ? "pass" : "fail",
    missing: wb.name.trim() ? undefined : "Name the warband.",
  });

  const byRole = roleCounts(wb);
  const total = wb.fighters.length;
  const leader = wb.fighters.find((rf) => {
    const def = FIGHTER_BY_ID[rf.defId];
    return def?.role === "leader";
  });
  const leaderOk = byRole.leader === 1 && Boolean(leader && leader.defId === origin.leaderId);
  checks.push({
    id: "leader",
    label: "Leader",
    required: `Exactly 1 · ${leaderName}`,
    current: byRole.leader === 0
      ? "0"
      : `${byRole.leader} · ${wb.fighters.filter((rf) => FIGHTER_BY_ID[rf.defId]?.role === "leader").map((rf) => fighterDef(rf).name).join(", ")}`,
    status: leaderOk ? "pass" : "fail",
    missing: leaderOk
      ? undefined
      : byRole.leader === 0
        ? `Recruit the leader: ${leaderName}.`
        : byRole.leader > 1
          ? `Keep exactly one leader: ${leaderName}.`
          : `${origin.name} must be led by ${leaderName}.`,
  });

  const championOver = Math.max(0, byRole.champion - 3);
  checks.push({
    id: "champions",
    label: "Champions (role)",
    required: "0–3 total champion slots (any champion types combined)",
    current: roleComposition(wb, "champion"),
    status: byRole.champion <= 3 ? "pass" : "fail",
    missing: byRole.champion <= 3
      ? undefined
      : `Remove ${championOver} champion${championOver === 1 ? "" : "s"} so only 3 champion slots are filled (${roleComposition(wb, "champion")}).`,
  });

  const henchNeed = Math.max(0, 5 - byRole.henchman);
  checks.push({
    id: "henchmen",
    label: "Henchmen (role)",
    required: "At least 5",
    current: roleComposition(wb, "henchman"),
    status: byRole.henchman >= 5 ? "pass" : "fail",
    missing: byRole.henchman >= 5
      ? undefined
      : henchNeed === 1
        ? "Recruit 1 more henchman."
        : `Recruit ${henchNeed} more henchmen.`,
  });

  checks.push({
    id: "brutes",
    label: "Brutes (role)",
    required: "0–2",
    current: roleComposition(wb, "brute"),
    status: byRole.brute <= 2 ? "pass" : "fail",
    missing: byRole.brute <= 2 ? undefined : `Remove ${byRole.brute - 2} brute${byRole.brute - 2 === 1 ? "" : "s"}.`,
  });

  const ignoredBeasts = origin.ignoreBeastLimit?.length
    ? wb.fighters.filter((rf) => origin.ignoreBeastLimit?.includes(rf.defId)).length
    : 0;
  checks.push({
    id: "beasts",
    label: "Beasts (role)",
    required: origin.ignoreBeastLimit?.length
      ? `0–3 counting toward the limit${ignoredBeasts ? ` (${ignoredBeasts} ignored by origin)` : ""}`
      : "0–3",
    current: roleComposition(wb, "beast"),
    status: byRole.beast <= 3 ? "pass" : "fail",
    missing: byRole.beast <= 3 ? undefined : `Remove ${byRole.beast - 3} beast${byRole.beast - 3 === 1 ? "" : "s"} that count toward the limit.`,
  });

  // Per-type caps (scroll 0-1 / origin overrides), shown separately from role slots.
  const typeCounts = new Map<string, { name: string; count: number; cap: number }>();
  for (const rf of wb.fighters) {
    const def = FIGHTER_BY_ID[rf.defId];
    if (!def || def.faction !== wb.faction) continue;
    const cap = limitFor(wb.originId, def);
    if (cap == null) continue;
    const row = typeCounts.get(def.id) ?? { name: def.name, count: 0, cap };
    row.count += 1;
    typeCounts.set(def.id, row);
  }
  for (const [id, row] of [...typeCounts.entries()].sort((a, b) => a[1].name.localeCompare(b[1].name))) {
    const ok = row.count <= row.cap;
    checks.push({
      id: `type-${id}`,
      label: row.name,
      required: `0–${row.cap} of this fighter type`,
      current: String(row.count),
      status: ok ? "pass" : "fail",
      missing: ok ? undefined : `Remove ${row.count - row.cap} ${row.name}${row.count - row.cap === 1 ? "" : "s"}.`,
    });
  }

  checks.push({
    id: "size",
    label: "Warband size",
    required: "At most 15 fighters (1 leader + 5 henchmen is the usual floor)",
    current: `${total} fighter${total === 1 ? "" : "s"}`,
    status: total <= 15 ? "pass" : "fail",
    missing: total <= 15 ? undefined : `Remove ${total - 15} fighter${total - 15 === 1 ? "" : "s"}.`,
  });

  checks.push({
    id: "stash",
    label: "Stash",
    required: "Stash cannot be negative",
    current: `${wb.stash}s`,
    status: wb.stash >= 0 ? "pass" : "fail",
    missing: wb.stash >= 0 ? undefined : "Remove gear or fighters until the stash is 0s or more.",
  });

  const byId: Record<string, number> = {};
  for (const rf of wb.fighters) {
    const def = FIGHTER_BY_ID[rf.defId];
    if (!def || def.faction !== wb.faction) {
      issues.push(`${rf.name || "A fighter"} is not part of this faction.`);
      continue;
    }
    byId[def.id] = (byId[def.id] ?? 0) + 1;
    const cap = limitFor(wb.originId, def);
    if (cap != null && byId[def.id] > cap) {
      issues.push(`${def.name} is limited to ${cap} (have ${byId[def.id]}).`);
    }
    if (!def.gainsXp && rf.xp !== 0) issues.push(`${def.name} does not gain experience.`);
    for (const skillId of rf.skills) {
      const skill = SKILL_BY_ID[skillId];
      if (!skill) issues.push(`${rf.name} has an unknown skill.`);
      else if (!skillAllowed(skill, def)) issues.push(`${rf.name} cannot take ${skill.name}.`);
    }
    for (const fixed of def.fixedSkills ?? []) {
      if (!rf.skills.includes(fixed)) issues.push(`${def.name} must keep ${SKILL_BY_ID[fixed]?.name ?? fixed}.`);
    }
    const extra = rf.skills.filter((id) => !(def.fixedSkills ?? []).includes(id));
    if (extra.length < def.skillPicks) {
      issues.push(`${rf.name || def.name} still needs ${def.skillPicks - extra.length} skill pick${def.skillPicks - extra.length === 1 ? "" : "s"}.`);
    }
    const needSpells = def.signatureSpells ?? 0;
    const chosenSpells = rf.spells.map((spell) => spell.trim()).filter(Boolean);
    if (needSpells > 0 && chosenSpells.length < needSpells) {
      issues.push(`${rf.name || def.name} needs ${needSpells} signature spell${needSpells === 1 ? "" : "s"} from ${def.lore}.`);
    }
    const loreSpells = new Set(spellsForLore(def.lore));
    for (const spell of chosenSpells) {
      if (loreSpells.size > 0 && !loreSpells.has(spell)) {
        issues.push(`${spell} is not on ${def.lore ?? "this lore"}.`);
      }
    }
    if (new Set(chosenSpells).size < chosenSpells.length) {
      issues.push(`${rf.name || def.name} has the same signature spell more than once.`);
    }
    issues.push(...gearErrors(rf));
  }

  const seen = new Set<string>();
  for (const rf of wb.fighters) {
    for (const skillId of rf.skills) {
      if (seen.has(skillId)) {
        issues.push(`${SKILL_BY_ID[skillId]?.name ?? skillId} is already on another fighter.`);
      }
      seen.add(skillId);
    }
  }

  const rareCount: Record<string, number> = {};
  for (const rf of wb.fighters) {
    for (const piece of gearOf(rf)) {
      const cap = rareCap(piece);
      if (cap == null || piece.cost === 0) continue;
      rareCount[piece.id] = (rareCount[piece.id] ?? 0) + 1;
      if (rareCount[piece.id] > cap) issues.push(`${piece.name} is limited to ${cap} in the warband (have ${rareCount[piece.id]}).`);
    }
  }

  const uniqueIssues = [...new Set(issues)];
  const fighterReady = uniqueIssues.length === 0;
  checks.push({
    id: "fighters",
    label: "Fighter readiness",
    required: "Skills, signature spells, gear slots, and rare caps legal",
    current: fighterReady ? "All fighters legal" : `${uniqueIssues.length} issue${uniqueIssues.length === 1 ? "" : "s"}`,
    status: fighterReady ? "pass" : "fail",
    missing: fighterReady ? undefined : "See the fighter issues list.",
  });

  const missing = [
    ...checks.flatMap((check) => (check.status === "fail" && check.missing && check.id !== "fighters" ? [check.missing] : [])),
    ...uniqueIssues,
  ];

  return {
    ok: checks.every((check) => check.status === "pass"),
    checks,
    missing,
    issues: uniqueIssues,
  };
}

export function validateWarband(wb: Warband): string[] {
  const audit = auditRoster(wb);
  return audit.missing;
}

export function gearErrors(rf: RosterFighter): string[] {
  const def = fighterDef(rf);
  const errors: string[] = [];
  const bought = rf.gear.map((id) => GEAR_BY_ID[id]).filter((g): g is GearDef => Boolean(g));
  if (def.fixedOnly && bought.some((piece) => !piece.mutation)) {
    errors.push(`${def.name} cannot be given other wargear.`);
  }
  if (bought.filter((piece) => piece.mutation).length > 1) {
    errors.push(`${def.name} can take only one bloodline mutation.`);
  }
  for (const piece of bought) {
    const onList = def.lists.some((list) => (LISTS[list] ?? []).includes(piece.id));
    if (!onList && !def.included?.includes(piece.id)) {
      errors.push(`${piece.name} is not on a list ${def.name} can buy from.`);
    }
    for (const need of piece.requires ?? []) {
      const has = rf.gear.includes(need) || (def.included ?? []).includes(need);
      if (!has) errors.push(`${piece.name} requires ${GEAR_BY_ID[need]?.name ?? need}.`);
    }
  }

  const all = gearOf(rf);
  const slotted = all.filter((g) => !g.mutation);
  const melee = slotted.filter((g) => g.kind === "melee" || g.held);
  const ranged = slotted.filter((g) => g.kind === "ranged");
  const armour = slotted.filter((g) => g.kind === "armour");
  const items = slotted.filter((g) => g.kind === "item" && !g.held);
  if (melee.length > 2) errors.push(`${rf.name || def.name} has more than 2 melee or held slots (max 2).`);
  if (ranged.length > 1) errors.push(`${rf.name || def.name} has more than 1 ranged weapon.`);
  if (armour.length > 1) errors.push(`${rf.name || def.name} has more than 1 set of armour.`);
  if (items.length > 2) errors.push(`${rf.name || def.name} has more than 2 items.`);
  const twoHandMelee = all.filter((g) => g.kind === "melee" && isTwoHanded(g));
  if (twoHandMelee.length > 1) errors.push(`${rf.name || def.name} can carry only one two-handed melee weapon.`);
  const plate = all.find((g) => g.blocksTwoHandRanged);
  const blocked = ranged.find((g) => isTwoHanded(g) && !(plate?.rangedException ?? []).includes(g.id));
  if (plate && blocked) errors.push(`Full plate bars ${blocked.name}. A brace of pistols is the exception.`);
  const held = all.some((g) => g.held);
  if (held && ranged.some((g) => isTwoHanded(g))) {
    errors.push(`${rf.name || def.name} cannot carry a held item and a two-handed ranged weapon.`);
  }
  return errors;
}

/** Why this fighter cannot add the gear piece, or null if the pick is legal. */
export function gearBlockReason(wb: Warband, rf: RosterFighter, gearId: string): string | null {
  if (rf.gear.includes(gearId)) return null;
  const piece = GEAR_BY_ID[gearId];
  if (!piece) return "Unknown wargear.";
  const def = fighterDef(rf);
  if (def.fixedOnly && !piece.mutation) return "This fighter cannot buy other wargear.";
  const onList = def.lists.some((list) => (LISTS[list] ?? []).includes(piece.id));
  if (!onList) return "Not on this fighter's wargear lists.";
  if (piece.cost > wb.stash) return `Costs ${piece.cost}s; only ${wb.stash}s left in the stash.`;
  for (const need of piece.requires ?? []) {
    const has = rf.gear.includes(need) || (def.included ?? []).includes(need);
    if (!has) return `Needs ${GEAR_BY_ID[need]?.name ?? need} first.`;
  }
  const cap = rareCap(piece);
  if (cap != null) {
    const used = wb.fighters.reduce((sum, other) => sum + gearOf(other).filter((g) => g.id === gearId).length, 0);
    if (used >= cap) return `Warband rare limit reached (${used}/${cap}).`;
  }

  const slots = slotUsage(rf);
  const category = gearCategory(piece);
  if (category === "mutation" && slots.mutations >= slots.mutationsMax) {
    return `Mutation slot is full (${slots.mutations}/${slots.mutationsMax}).`;
  }
  if (category === "armour" && slots.armour >= slots.armourMax) {
    return `Armour slot is full (${slots.armour}/${slots.armourMax}). Unequip the current armour first.`;
  }
  if (category === "ranged" && slots.ranged >= slots.rangedMax) {
    return `Ranged slot is full (${slots.ranged}/${slots.rangedMax}). Unequip the current ranged weapon first.`;
  }
  if ((category === "melee" || category === "held") && slots.meleeOrHeld >= slots.meleeOrHeldMax) {
    return `Melee/held slots are full (${slots.meleeOrHeld}/${slots.meleeOrHeldMax}). Unequip something first.`;
  }
  if (category === "item" && slots.items >= slots.itemsMax) {
    return `Item slots are full (${slots.items}/${slots.itemsMax}). Unequip an item first.`;
  }

  const carried = gearOf(rf);
  if (category === "melee" && isTwoHanded(piece) && carried.some((g) => g.kind === "melee" && isTwoHanded(g))) {
    return "Already carrying a two-handed melee weapon.";
  }
  const plate = carried.find((g) => g.blocksTwoHandRanged) ?? (piece.blocksTwoHandRanged ? piece : undefined);
  const rangedNow = carried.filter((g) => g.kind === "ranged");
  const rangedAfter = category === "ranged" ? [...rangedNow, piece] : rangedNow;
  if (plate) {
    const blocked = rangedAfter.find((g) => isTwoHanded(g) && !(plate.rangedException ?? []).includes(g.id));
    if (blocked) {
      return piece.blocksTwoHandRanged
        ? `Full plate cannot be worn with ${blocked.name}. A brace of pistols is the exception.`
        : `Cannot take ${piece.name} while wearing full plate. A brace of pistols is the exception.`;
    }
  }
  const heldNow = carried.some((g) => g.held) || Boolean(piece.held);
  if (heldNow && rangedAfter.some((g) => isTwoHanded(g))) {
    return piece.held
      ? "Cannot take a held item while carrying a two-handed ranged weapon."
      : "Cannot take a two-handed ranged weapon while carrying a held item.";
  }
  return null;
}

/** Why this fighter cannot take the skill, or null if the pick is legal. */
export function skillBlockReason(wb: Warband, rf: RosterFighter, skillId: string): string | null {
  if (rf.skills.includes(skillId)) return null;
  const skill = SKILL_BY_ID[skillId];
  if (!skill) return "Unknown skill.";
  const def = fighterDef(rf);
  if (!skillAllowed(skill, def)) return "Not available to this fighter.";
  if (wb.fighters.some((other) => other.uid !== rf.uid && other.skills.includes(skillId))) {
    return "Already taken by another fighter in this warband.";
  }
  return null;
}

/** Hiring and loadout problems that belong to this fighter's card. */
export function fighterIssues(wb: Warband, rf: RosterFighter): string[] {
  const def = fighterDef(rf);
  const errors: string[] = [];
  const origin = ORIGIN_BY_ID[wb.originId];
  if (def.role === "leader" && origin && rf.defId !== origin.leaderId) {
    errors.push(`${origin.name} is led by ${FIGHTER_BY_ID[origin.leaderId]?.name}.`);
  }
  const sameType = wb.fighters.filter((other) => other.defId === rf.defId).length;
  const cap = origin ? limitFor(wb.originId, def) : (def.limit ?? null);
  if (cap != null && sameType > cap) errors.push(`${def.name} is limited to ${cap}.`);
  if (!def.gainsXp && rf.xp !== 0) errors.push(`${def.name} does not gain experience.`);
  for (const skillId of rf.skills) {
    const skill = SKILL_BY_ID[skillId];
    if (!skill) errors.push(`Unknown skill.`);
    else if (!skillAllowed(skill, def)) errors.push(`Cannot take ${skill.name}.`);
    else if (wb.fighters.some((other) => other.uid !== rf.uid && other.skills.includes(skillId))) {
      errors.push(`${skill.name} is already on another fighter.`);
    }
  }
  for (const fixed of def.fixedSkills ?? []) {
    if (!rf.skills.includes(fixed)) errors.push(`Must keep ${SKILL_BY_ID[fixed]?.name ?? fixed}.`);
  }
  const extra = rf.skills.filter((id) => !(def.fixedSkills ?? []).includes(id));
  if (extra.length < def.skillPicks) {
    errors.push(`Still needs ${def.skillPicks - extra.length} skill${def.skillPicks - extra.length === 1 ? "" : "s"}.`);
  }
  const needSpells = def.signatureSpells ?? 0;
  const chosenSpells = rf.spells.map((spell) => spell.trim()).filter(Boolean);
  if (needSpells > 0 && chosenSpells.length < needSpells) {
    errors.push(`Needs ${needSpells} signature spell${needSpells === 1 ? "" : "s"} from ${def.lore}.`);
  }
  const loreSpells = new Set(spellsForLore(def.lore));
  for (const spell of chosenSpells) {
    if (loreSpells.size > 0 && !loreSpells.has(spell)) errors.push(`${spell} is not on ${def.lore}.`);
  }
  if (new Set(chosenSpells).size < chosenSpells.length) errors.push("Same signature spell selected twice.");
  errors.push(...gearErrors(rf));
  for (const piece of gearOf(rf)) {
    const rare = rareCap(piece);
    if (rare == null || piece.cost === 0) continue;
    const used = wb.fighters.reduce((sum, other) => sum + gearOf(other).filter((g) => g.id === piece.id).length, 0);
    if (used > rare) errors.push(`${piece.name} is limited to ${rare} in the warband.`);
  }
  return [...new Set(errors)];
}

export function currentLife(rf: RosterFighter, row: BattleFighter): number {
  return Math.max(0, maxLife(rf, row.form) - row.damage);
}

export function isBloodied(rf: RosterFighter, row: BattleFighter): boolean {
  return !row.takenDown && currentLife(rf, row) === 1;
}

export function downOrBloodied(wb: Warband, rows: BattleFighter[]): number {
  const mine = rows.filter((row) => row.warbandId === wb.id);
  return mine.filter((row) => {
    const rf = wb.fighters.find((f) => f.uid === row.uid);
    if (!rf) return false;
    return row.takenDown || isBloodied(rf, row);
  }).length;
}

export interface InjuryOutcome {
  roll: string;
  text: string;
  kill: boolean;
  miss?: number;
  bonusLevel: boolean;
  manual: boolean;
}

export function rollInjury(table: FighterDef["injury"]): InjuryOutcome {
  if (table === "thrall") {
    const roll = rollD6();
    if (roll === 1) {
      return { roll: String(roll), text: "Laid to rest. The fighter is killed.", kill: true, bonusLevel: false, manual: false };
    }
    return { roll: String(roll), text: "Unscathed. The fighter suffers no lasting effects.", kill: false, bonusLevel: false, manual: false };
  }
  if (table === "demon") {
    const roll = rollD66();
    if (roll <= 16) {
      return { roll: String(roll), text: "Banished. Remove the demon. Its wargear is lost.", kill: true, bonusLevel: false, manual: false };
    }
    if (roll <= 36) {
      return { roll: String(roll), text: "Fractured essence. The demon misses the next battle.", kill: false, miss: 1, bonusLevel: false, manual: false };
    }
    if (roll <= 65) {
      return { roll: String(roll), text: "Unharmed. The demon suffers no lasting effects.", kill: false, bonusLevel: false, manual: false };
    }
    return {
      roll: String(roll),
      text: "Enraged. Unharmed, then bonus experience to the next level after the experience step.",
      kill: false,
      bonusLevel: true,
      manual: false,
    };
  }
  if (table === "beast") {
    return {
      roll: "—",
      text: "The beast injury table is not printed in playtest v1.02. Record the result by hand.",
      kill: false,
      bonusLevel: false,
      manual: true,
    };
  }
  return {
    roll: "—",
    text: "The standard lasting injury table is not printed in playtest v1.02. Record the result by hand.",
    kill: false,
    bonusLevel: false,
    manual: true,
  };
}
