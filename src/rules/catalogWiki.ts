import { GEAR } from "./gear";
import { FIGHTERS, ROLE_LABEL } from "./fighters";
import { FACTION_NAMES, ORIGINS } from "./origins";
import type { RuleArticle } from "./rulebook";
import { SKILLS, skillTableLabel } from "./skills";

export function catalogArticles(): RuleArticle[] {
  const pages: RuleArticle[] = [];

  for (const [faction, name] of Object.entries(FACTION_NAMES)) {
    const origins = ORIGINS.filter((origin) => origin.faction === faction);
    const fighters = FIGHTERS.filter((fighter) => fighter.faction === faction);
    pages.push({
      section: "Factions",
      title: name,
      body: `One of the four playtest factions. Pick an origin, then hire from this list. Shared limits are on [[Recruiting a warband]].

## Origins
${origins.map((origin) => `- [[${origin.name}]]`).join("\n")}

## Fighters
${fighters.map((fighter) => `- [[${fighter.name}]] · ${ROLE_LABEL[fighter.role]} · ${fighter.cost}s`).join("\n")}`,
    });
  }

  for (const origin of ORIGINS) {
    const leader = FIGHTERS.find((fighter) => fighter.id === origin.leaderId);
    pages.push({
      section: "Factions",
      title: origin.name,
      body: `${FACTION_NAMES[origin.faction]}. Leader: ${leader ? `[[${leader.name}]]` : origin.leaderId}. Stronghold: ${origin.stronghold}.

${origin.summary}

Stronghold income and the full aftermath sequence are not printed in playtest v1.02. The effect above is the origin rule from the faction scroll.`,
    });
  }

  for (const fighter of FIGHTERS) {
    const stats = fighter.stats;
    const skills = [
      ...(fighter.fixedSkills ?? []).map((id) => SKILLS.find((skill) => skill.id === id)?.name).filter(Boolean),
    ];
    pages.push({
      section: "Fighters",
      title: fighter.name,
      body: `${FACTION_NAMES[fighter.faction]} · ${ROLE_LABEL[fighter.role]} · ${fighter.keywords.join(", ")}
${fighter.cost}s to recruit${fighter.limit != null ? ` · limit 0-${fighter.limit}` : ""} · starting experience ${fighter.xp}

Move ${stats.move} · Blade ${stats.blade} · Bow ${stats.bow} · Armour ${stats.armour} · Initiative ${stats.init} · Willpower ${stats.will} · Life ${stats.life}

${fighter.note ? `${fighter.note}\n` : ""}${loreLine(fighter)}${fighter.skillPicks ? `Skill picks when hired: ${fighter.skillPicks}.\n` : ""}${skills.length ? `Starts with ${skills.map((name) => `[[${name}]]`).join(", ")}.\n` : ""}${fighter.included?.length ? `Included gear: ${fighter.included.map((id) => gearName(id)).join(", ")}.\n` : ""}${fighter.fixedOnly ? "No other wargear.\n" : fighter.lists.length ? `Wargear lists: ${fighter.lists.join(", ")}.\n` : ""}Injury table: ${fighter.injury}. See [[Experience and injuries]].`,
    });
  }

  for (const gear of GEAR) {
    const line =
      gear.kind === "armour"
        ? `Armour ${gear.armour ?? "—"}.`
        : `${gear.range ? `Range ${gear.range} · ` : ""}Attacks ${gear.attacks ?? "—"} · Rend ${gear.rend ?? "—"} · Damage ${gear.damage ?? "—"} · Critical ${gear.crit ?? "—"}`;
    pages.push({
      section: "Wargear",
      title: gear.id === "cloister-sling" ? "Cloister Sling" : gear.name,
      body: `${gear.kind} · ${gear.cost}s${gear.mutation ? " · mutation, does not use a slot" : ""}
${line}
${gear.traits?.length ? `Traits: ${gear.traits.join(", ")}. See [[Weapon traits]].` : "No weapon traits."}
${gear.note ? `\n${gear.note}` : ""}
Slots are on [[Wargear slots]].`,
    });
  }

  const tables = [...new Set(SKILLS.map((skill) => skill.table))];
  for (const table of tables) {
    const label = skillTableLabel(table);
    const rows = SKILLS.filter((skill) => skill.table === table);
    pages.push({
      section: "Skills",
      title: label,
      body: rows.map((skill) => `- [[${skill.name}]]`).join("\n"),
    });
  }

  for (const skill of SKILLS) {
    pages.push({
      section: "Skills",
      title: skill.name,
      body: `${skillTableLabel(skill.table)}. A warband cannot give this skill to a second fighter while the first still has it.

${skill.blurb}`,
    });
  }

  return pages;
}

function gearName(id: string): string {
  return GEAR.find((gear) => gear.id === id)?.name ?? id;
}

function loreLine(fighter: { lore?: string; signatureSpells?: number }): string {
  if (!fighter.lore) return "";
  const names =
    fighter.lore === "Blessed Maggots and Demonic Lore of Rot"
      ? "[[Lore of Blessed Maggots]] and [[Demonic Lore of Rot]]"
      : `[[${fighter.lore}]]`;
  const signatures = fighter.signatureSpells ? ` Signature spells: ${fighter.signatureSpells}.` : "";
  return `Spell lore: ${names}.${signatures}\n`;
}
