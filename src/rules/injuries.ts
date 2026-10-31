import type { InjuryTable } from "./types";

/** Selectable injury outcomes keyed by the fighter's injury table. */
export interface InjuryOption {
  id: string;
  /** Short label for the dropdown. */
  label: string;
  /** Full text stored on the fighter card / roster. */
  text: string;
  /** Printed roll range, when the table is in playtest v1.02. */
  roll?: string;
  kill?: boolean;
  /** Add this many missed battles when selected. */
  miss?: number;
  /** Roll this many d6 and sum for missed battles when selected. */
  missDice?: number;
  bonusLevel?: boolean;
}

export const INJURY_TABLE_LABEL: Record<InjuryTable, string> = {
  standard: "Standard lasting-injury table",
  thrall: "Skeleton & Thrall Injury Table",
  demon: "Demon Injury Table",
  beast: "Beast injury table",
};

/** True when playtest v1.02 prints the full table. */
export function injuryTablePrinted(table: InjuryTable): boolean {
  return table === "thrall" || table === "demon";
}

const THRALL_INJURIES: InjuryOption[] = [
  {
    id: "thrall-laid-to-rest",
    label: "Laid to rest",
    text: "Laid to rest. The fighter is killed.",
    roll: "1",
    kill: true,
  },
  {
    id: "thrall-unscathed",
    label: "Unscathed",
    text: "Unscathed. The fighter suffers no lasting effects.",
    roll: "2–6",
  },
];

const DEMON_INJURIES: InjuryOption[] = [
  {
    id: "demon-banished",
    label: "Banished",
    text: "Banished. Remove the demon. Its wargear is lost.",
    roll: "11–16",
    kill: true,
  },
  {
    id: "demon-fractured",
    label: "Fractured essence",
    text: "Fractured essence. The demon misses the next battle.",
    roll: "21–36",
    miss: 1,
  },
  {
    id: "demon-unharmed",
    label: "Unharmed",
    text: "Unharmed. The demon suffers no lasting effects.",
    roll: "41–65",
  },
  {
    id: "demon-enraged",
    label: "Enraged",
    text: "Enraged. Unharmed, then bonus experience to the next level after the experience step.",
    roll: "66",
    bonusLevel: true,
  },
];

/**
 * Standard and beast tables are cited as page xx in playtest v1.02.
 * These are campaign-record helpers only — not printed table results.
 */
const UNPRINTED_RECORD_HELPERS: InjuryOption[] = [
  {
    id: "record-killed",
    label: "Killed",
    text: "Killed.",
    kill: true,
  },
  {
    id: "record-miss-1",
    label: "Miss next battle",
    text: "Misses the next battle.",
    miss: 1,
  },
  {
    id: "record-miss-d3",
    label: "Miss d3 battles",
    text: "Misses d3 battles.",
    missDice: 3,
  },
];

export const INJURIES_BY_TABLE: Record<InjuryTable, InjuryOption[]> = {
  thrall: THRALL_INJURIES,
  demon: DEMON_INJURIES,
  standard: UNPRINTED_RECORD_HELPERS,
  beast: UNPRINTED_RECORD_HELPERS,
};

export function injuriesForTable(table: InjuryTable): InjuryOption[] {
  return INJURIES_BY_TABLE[table] ?? [];
}

export function formatInjuryEntry(option: InjuryOption): string {
  return option.roll ? `${option.roll}: ${option.text}` : option.text;
}
