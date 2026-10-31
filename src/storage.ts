import { uid } from "./rules/logic";
import type { BattleSession, RosterFighter, Warband } from "./rules/types";

const BANDS = "bdc-warbands-v1";
const BATTLE = "bdc-battle-v1";

export function loadWarbands(): Warband[] {
  try {
    const raw = localStorage.getItem(BANDS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Warband[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveWarbands(bands: Warband[]): void {
  localStorage.setItem(BANDS, JSON.stringify(bands));
}

export function downloadWarband(band: Warband): void {
  const blob = new Blob([JSON.stringify(band, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${band.name.replace(/\s+/g, "-").toLowerCase() || "warband"}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function parseWarbandJson(text: string): Warband {
  const parsed = JSON.parse(text) as Partial<Warband>;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Not a warband file.");
  }
  if (!parsed.faction || !parsed.originId) {
    throw new Error("Warband file is missing faction or origin.");
  }
  const fighters = Array.isArray(parsed.fighters)
    ? parsed.fighters.map((fighter) => normalizeFighter(fighter))
    : [];
  return {
    id: uid(),
    name: typeof parsed.name === "string" && parsed.name.trim() ? parsed.name.trim() : "Imported warband",
    faction: String(parsed.faction),
    originId: String(parsed.originId),
    stronghold: typeof parsed.stronghold === "string" ? parsed.stronghold : "",
    stash: Number(parsed.stash) || 0,
    holdings: Array.isArray(parsed.holdings) ? parsed.holdings.map((line) => String(line ?? "")) : ["", "", "", "", ""],
    notes: typeof parsed.notes === "string" ? parsed.notes : "",
    battles: Number(parsed.battles) || 0,
    victories: Number(parsed.victories) || 0,
    ransacked: Number(parsed.ransacked) || 0,
    fightersLost: Number(parsed.fightersLost) || 0,
    fighters,
  };
}

function normalizeFighter(raw: Partial<RosterFighter>): RosterFighter {
  return {
    uid: typeof raw.uid === "string" && raw.uid ? raw.uid : uid(),
    defId: String(raw.defId ?? ""),
    name: typeof raw.name === "string" && raw.name.trim() ? raw.name.trim() : "Fighter",
    xp: Number(raw.xp) || 0,
    skills: Array.isArray(raw.skills) ? raw.skills.map(String) : [],
    gear: Array.isArray(raw.gear) ? raw.gear.map(String) : [],
    spells: Array.isArray(raw.spells) ? raw.spells.map(String) : [],
    injuries: Array.isArray(raw.injuries) ? raw.injuries.map(String) : [],
    blackRot: Number(raw.blackRot) || 0,
    missBattles: Number(raw.missBattles) || 0,
    kills: Number(raw.kills) || 0,
  };
}

export function loadBattle(): BattleSession | null {
  try {
    const raw = localStorage.getItem(BATTLE);
    return raw ? (JSON.parse(raw) as BattleSession) : null;
  } catch {
    return null;
  }
}

export function saveBattle(battle: BattleSession | null): void {
  if (!battle) localStorage.removeItem(BATTLE);
  else localStorage.setItem(BATTLE, JSON.stringify(battle));
}
