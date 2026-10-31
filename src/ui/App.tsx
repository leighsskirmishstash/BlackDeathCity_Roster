import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { FIGHTER_BY_ID, FIGHTERS, ROLE_LABEL } from "../rules/fighters";
import { GEAR_BY_ID, gearOnLists, TRAIT_BLURB, traitBlurbs } from "../rules/gear";
import {
  currentLife,
  displayStats,
  downOrBloodied,
  fighterCost,
  fighterDef,
  fighterIssues,
  gearBlockReason,
  gearCategory,
  GEAR_CATEGORY_LABEL,
  gearOf,
  isBloodied,
  maxLife,
  rollD6,
  rollFormula,
  rollInjury,
  rosterCost,
  skillBlockReason,
  slotUsage,
  uid,
  auditRoster,
  warbandRating,
  type GearCategory,
  type RosterAudit,
} from "../rules/logic";
import { FACTION_NAMES, ORIGIN_BY_ID, ORIGINS } from "../rules/origins";
import { generateRoster, STYLE_LABEL, type PlayStyle } from "../rules/generate";
import { SUGGESTED, buildWarband, silverLeft, type SuggestedBuild } from "../rules/suggested";
import { SKILLS, SKILL_BY_ID, skillAllowed, skillTableLabel } from "../rules/skills";
import {
  formatInjuryEntry,
  injuriesForTable,
  INJURY_TABLE_LABEL,
  injuryTablePrinted,
  type InjuryOption,
} from "../rules/injuries";
import { loresForFighter, SPELL_BY_NAME, spellDefsForLore, spellTooltip } from "../rules/spells";
import type { BattleFighter, BattleSession, GearDef, RosterFighter, SkillDef, Warband } from "../rules/types";
import { downloadWarband, loadBattle, loadWarbands, parseWarbandJson, saveBattle, saveWarbands } from "../storage";
import { Wiki } from "./Wiki";

type View = "home" | "band" | "battle" | "wiki";

export function App() {
  const [bands, setBands] = useState<Warband[]>(loadWarbands);
  const [battle, setBattle] = useState<BattleSession | null>(loadBattle);
  const [view, setView] = useState<View>(loadBattle() ? "battle" : "home");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => saveWarbands(bands), [bands]);
  useEffect(() => saveBattle(battle), [battle]);

  const active = bands.find((band) => band.id === activeId) ?? null;

  function putBand(next: Warband) {
    setBands((current) => current.map((band) => (band.id === next.id ? next : band)));
  }

  function openBand(id: string) {
    setActiveId(id);
    setView("band");
  }

  function addBand(band: Warband, open = true) {
    setBands((current) => [...current, band]);
    if (open) openBand(band.id);
  }

  return (
    <div className={view === "band" || view === "wiki" ? "app fill" : "app"}>
      <header className="top">
        <div>
          <p className="eyebrow">Playtest v1.02</p>
          <h1>Black Death City</h1>
        </div>
        <nav>
          <button className={view === "home" ? "on" : ""} onClick={() => setView("home")}>Warbands</button>
          <button className={view === "band" ? "on" : ""} disabled={!active} onClick={() => active && setView("band")}>Roster</button>
          <button className={view === "battle" ? "on" : ""} onClick={() => setView("battle")}>Battle</button>
          <button className={view === "wiki" ? "on" : ""} onClick={() => setView("wiki")}>Rules</button>
        </nav>
      </header>
      {view === "home" && (
        <Home
          bands={bands}
          onOpen={openBand}
          onCreate={(band) => addBand(band, true)}
          onDelete={(id) => {
            setBands((current) => current.filter((band) => band.id !== id));
            if (activeId === id) setActiveId(null);
          }}
          onImport={(band) => addBand(band, true)}
        />
      )}
      {view === "band" && active && (
        <Builder
          band={active}
          bands={bands}
          onChange={putBand}
          onOpen={openBand}
          onImport={(band) => addBand(band, true)}
        />
      )}
      {view === "band" && !active && <p className="empty">Open a warband from the list.</p>}
      {view === "battle" && (
        <Battle
          bands={bands}
          battle={battle}
          onBattle={setBattle}
          onBands={setBands}
        />
      )}
      {view === "wiki" && <Wiki />}
    </div>
  );
}

function Home({
  bands,
  onOpen,
  onCreate,
  onDelete,
  onImport,
}: {
  bands: Warband[];
  onOpen: (id: string) => void;
  onCreate: (band: Warband) => void;
  onDelete: (id: string) => void;
  onImport: (band: Warband) => void;
}) {
  const [name, setName] = useState("The Company");
  const [faction, setFaction] = useState("guild");
  const origins = ORIGINS.filter((origin) => origin.faction === faction);
  const [originId, setOriginId] = useState(origins[0].id);
  const [style, setStyle] = useState<PlayStyle>("melee");
  const [models, setModels] = useState(8);
  const [seed, setSeed] = useState(1);
  const [draft, setDraft] = useState<{ build: SuggestedBuild; style: PlayStyle; models: number } | null>(null);
  const generated = draft && draft.build.faction === faction && draft.build.originId === originId && draft.style === style && draft.models === models
    ? draft.build
    : null;

  useEffect(() => {
    const next = ORIGINS.find((origin) => origin.faction === faction);
    if (next) setOriginId(next.id);
  }, [faction]);

  function create() {
    const origin = ORIGIN_BY_ID[originId];
    const band: Warband = {
      id: uid(),
      name: name.trim() || "Unnamed warband",
      faction,
      originId,
      stronghold: origin.stronghold,
      stash: 1000,
      holdings: ["", "", "", "", ""],
      notes: "",
      battles: 0,
      victories: 0,
      ransacked: 0,
      fightersLost: 0,
      fighters: [],
    };
    onCreate(band);
  }

  function importFile(file: File) {
    file.text().then((text) => {
      try {
        onImport(parseWarbandJson(text));
      } catch (error) {
        window.alert(error instanceof Error ? error.message : "Could not import that warband file.");
      }
    });
  }

  return (
    <div className="layout">
      <section className="panel">
        <h2>New warband</h2>
        <label>Name<input value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label>
          Faction
          <select value={faction} onChange={(e) => setFaction(e.target.value)}>
            {Object.entries(FACTION_NAMES).map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
        </label>
        <label>
          Origin
          <select value={originId} onChange={(e) => setOriginId(e.target.value)}>
            {origins.map((origin) => (
              <option key={origin.id} value={origin.id}>{origin.name}</option>
            ))}
          </select>
        </label>
        <p className="muted">{ORIGIN_BY_ID[originId]?.summary}</p>
        <button className="primary" onClick={create}>Recruit an empty roster</button>
        <label className="file">
          Load a saved roster JSON
          <input type="file" accept="application/json,.json" onChange={(e) => e.target.files?.[0] && importFile(e.target.files[0])} />
        </label>
        <p className="muted">Rosters also auto-save in this browser under Saved warbands.</p>
      </section>
      <section className="stack">
        <h2>Roster generator</h2>
        <article className="card">
          <p className="muted">Uses the faction and origin selected above. A shorter roster spends the leftover silver on wargear for that play style. Six fighters is the smallest legal warband, and fifteen is the maximum.</p>
          <label>
            Play style
            <select value={style} onChange={(e) => setStyle(e.target.value as PlayStyle)}>
              {(Object.keys(STYLE_LABEL) as PlayStyle[]).map((id) => (
                <option key={id} value={id}>{STYLE_LABEL[id]}</option>
              ))}
            </select>
          </label>
          <label>
            Fighters
            <input
              type="number"
              min={6}
              max={15}
              value={models}
              onChange={(e) => setModels(Number(e.target.value))}
            />
          </label>
          <button className="primary" onClick={() => {
            const next = generated ? seed + 1 : seed;
            setSeed(next);
            setDraft({ build: generateRoster({ originId, style, models, seed: next }), style, models });
          }}>
            {generated ? "Generate another" : "Generate roster"}
          </button>
          {generated && (
            <>
              <h3>{generated.name}</h3>
              <p>{ORIGIN_BY_ID[generated.originId].name} · {ORIGIN_BY_ID[generated.originId].stronghold} · {generated.fighters.length} fighters · {silverLeft(generated)}s left in the stash</p>
              <p>{generated.summary}</p>
              <ul className="plain suggest-list">
                {generated.fighters.map((fighter) => (
                  <li key={fighter.name}>
                    {fighter.name} · {FIGHTER_BY_ID[fighter.defId].name}
                    {fighter.gear.length > 0 ? ` · ${fighter.gear.map((id) => GEAR_BY_ID[id]?.name ?? id).join(", ")}` : ""}
                    {fighter.spells.length > 0 ? ` · ${fighter.spells.join(", ")}` : ""}
                  </li>
                ))}
              </ul>
              <button className="primary" onClick={() => onCreate(buildWarband(generated))}>Recruit this roster</button>
            </>
          )}
        </article>
        <h2>Suggested for {FACTION_NAMES[faction]}</h2>
        <p className="muted">One starting list for each origin and its stronghold, inside 1000 silver. Recruiting one rolls the printed starting experience.</p>
        {SUGGESTED.filter((build) => build.faction === faction).map((build) => (
          <article key={build.id} className="card">
            <h3>{build.name}</h3>
            <p>{ORIGIN_BY_ID[build.originId].name} · {ORIGIN_BY_ID[build.originId].stronghold} · {build.fighters.length} fighters · {silverLeft(build)}s left in the stash</p>
            <p>{build.summary}</p>
            <ul className="plain suggest-list">
              {build.fighters.map((fighter) => (
                <li key={fighter.name}>{fighter.name} · {FIGHTER_BY_ID[fighter.defId].name}</li>
              ))}
            </ul>
            <button className="primary" onClick={() => onCreate(buildWarband(build))}>Recruit this list</button>
          </article>
        ))}
        <h2>Saved warbands</h2>
        {bands.length === 0 && <p className="empty">No warbands yet.</p>}
        {bands.map((band) => {
          const audit = auditRoster(band);
          return (
            <article key={band.id} className="card row-card">
              <div>
                <h3>{band.name}</h3>
                <p>{FACTION_NAMES[band.faction]} · {ORIGIN_BY_ID[band.originId]?.name}</p>
                <p className="muted">{band.fighters.length} fighters · rating {warbandRating(band)} · stash {band.stash}s · {band.victories}/{band.battles} victories</p>
                <p className={audit.ok ? "ok" : "warn"}>
                  {audit.ok ? "Legal roster" : `Illegal · ${audit.missing.length} item${audit.missing.length === 1 ? "" : "s"} missing`}
                </p>
                {!audit.ok && (
                  <ul className="errors compact">
                    {audit.missing.slice(0, 4).map((item) => <li key={item}>{item}</li>)}
                    {audit.missing.length > 4 && <li>+{audit.missing.length - 4} more</li>}
                  </ul>
                )}
              </div>
              <div className="actions">
                <button onClick={() => onOpen(band.id)}>Open</button>
                <button onClick={() => downloadWarband(band)}>Export</button>
                <button className="danger" onClick={() => onDelete(band.id)}>Delete</button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

type PrintLayout = "cards" | "roster";
type PageOrientation = "portrait" | "landscape";

function Builder({
  band,
  bands,
  onChange,
  onOpen,
  onImport,
}: {
  band: Warband;
  bands: Warband[];
  onChange: (band: Warband) => void;
  onOpen: (id: string) => void;
  onImport: (band: Warband) => void;
}) {
  const [selected, setSelected] = useState<string | null>(band.fighters[0]?.uid ?? null);
  const [showCards, setShowCards] = useState(false);
  const [printLayout, setPrintLayout] = useState<PrintLayout>("roster");
  const [pageOrientation, setPageOrientation] = useState<PageOrientation>("portrait");
  const [printOnly, setPrintOnly] = useState<string | null>(null);
  const [saveNote, setSaveNote] = useState<string | null>(null);
  const [leftPaneWidth, setLeftPaneWidth] = useState(() => {
    const saved = Number(window.localStorage.getItem("bdc-left-pane-width"));
    return Number.isFinite(saved) && saved >= 240 ? saved : 360;
  });
  const fileRef = useRef<HTMLInputElement | null>(null);
  const resizingRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const audit = useMemo(() => auditRoster(band), [band]);
  const fighter = band.fighters.find((rf) => rf.uid === selected) ?? null;
  const choices = FIGHTERS.filter((def) => def.faction === band.faction);
  const others = bands.filter((row) => row.id !== band.id);

  useEffect(() => {
    const clear = () => setPrintOnly(null);
    window.addEventListener("afterprint", clear);
    return () => window.removeEventListener("afterprint", clear);
  }, []);

  useEffect(() => {
    setSelected(band.fighters[0]?.uid ?? null);
  }, [band.id]);

  function openPrintView(layout: PrintLayout = printLayout) {
    setPrintLayout(layout);
    if (layout === "cards") setPageOrientation("landscape");
    setShowCards(true);
  }

  function printView(layout: PrintLayout = printLayout, uidValue?: string) {
    setPrintLayout(layout);
    if (layout === "cards") setPageOrientation("landscape");
    setPrintOnly(layout === "cards" ? (uidValue ?? null) : null);
    setShowCards(true);
    window.setTimeout(() => window.print(), 60);
  }

  function patch(partial: Partial<Warband>) {
    onChange({ ...band, ...partial });
  }

  function saveRoster() {
    const next = bands.map((row) => (row.id === band.id ? band : row));
    saveWarbands(next);
    setSaveNote("Saved in this browser.");
    window.setTimeout(() => setSaveNote(null), 2200);
  }

  function loadFile(file: File) {
    file.text().then((text) => {
      try {
        onImport(parseWarbandJson(text));
      } catch (error) {
        window.alert(error instanceof Error ? error.message : "Could not load that warband file.");
      }
    });
  }

  function startResizeLeftPane(event: ReactPointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    resizingRef.current = { startX: event.clientX, startWidth: leftPaneWidth };
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);

    function onMove(moveEvent: PointerEvent) {
      const drag = resizingRef.current;
      if (!drag) return;
      const next = Math.round(Math.min(720, Math.max(260, drag.startWidth + (moveEvent.clientX - drag.startX))));
      setLeftPaneWidth(next);
    }

    function onUp(upEvent: PointerEvent) {
      resizingRef.current = null;
      target.releasePointerCapture(upEvent.pointerId);
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerup", onUp);
      target.removeEventListener("pointercancel", onUp);
      setLeftPaneWidth((width) => {
        window.localStorage.setItem("bdc-left-pane-width", String(width));
        return width;
      });
    }

    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerup", onUp);
    target.addEventListener("pointercancel", onUp);
  }

  function addFighter(defId: string) {
    const def = FIGHTER_BY_ID[defId];
    const cost = def.cost;
    const rf: RosterFighter = {
      uid: uid(),
      defId,
      name: def.name,
      xp: rollFormula(def.xp),
      skills: [...(def.fixedSkills ?? [])],
      gear: [],
      spells: Array.from({ length: def.signatureSpells ?? 0 }, () => ""),
      injuries: [],
      blackRot: 0,
      missBattles: 0,
      kills: 0,
    };
    onChange({ ...band, stash: band.stash - cost, fighters: [...band.fighters, rf] });
    setSelected(rf.uid);
  }

  function updateFighter(next: RosterFighter, stashDelta = 0) {
    onChange({
      ...band,
      stash: band.stash + stashDelta,
      fighters: band.fighters.map((rf) => (rf.uid === next.uid ? next : rf)),
    });
  }

  function removeFighter(rf: RosterFighter) {
    onChange({
      ...band,
      stash: band.stash + fighterCost(rf),
      fighters: band.fighters.filter((row) => row.uid !== rf.uid),
    });
    setSelected(null);
  }

  return (
    <>
    <div
      className={showCards ? "builder is-hidden" : "builder"}
      style={{ ["--left-pane" as string]: `${leftPaneWidth}px` } as CSSProperties}
    >
      <section className="panel identity">
        <button
          type="button"
          className="pane-resizer"
          aria-label="Resize left pane"
          title="Drag to resize"
          onPointerDown={startResizeLeftPane}
        />
        <label>Warband<input value={band.name} onChange={(e) => patch({ name: e.target.value })} /></label>
        <label>Stronghold<input value={band.stronghold} onChange={(e) => patch({ stronghold: e.target.value })} /></label>
        <label>Stash<input type="number" value={band.stash} onChange={(e) => patch({ stash: Number(e.target.value) })} /></label>
        <div className="stats">
          <span>Rating <strong>{warbandRating(band)}</strong></span>
          <span>Roster <strong>{rosterCost(band)}s</strong></span>
          <span>Fighters <strong>{band.fighters.length}/15</strong></span>
          <span>Record <strong>{band.victories}/{band.battles}</strong></span>
        </div>
        <div className="actions wrap">
          <button className="primary" onClick={saveRoster}>Save roster</button>
          <button onClick={() => downloadWarband(band)}>Export JSON</button>
          <button onClick={() => fileRef.current?.click()}>Load JSON</button>
          <input
            ref={fileRef}
            className="sr-only"
            type="file"
            accept="application/json,.json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) loadFile(file);
              e.target.value = "";
            }}
          />
        </div>
        {saveNote && <p className="ok">{saveNote}</p>}
        {others.length > 0 && (
          <label>
            Open saved roster
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) onOpen(e.target.value);
                e.target.value = "";
              }}
            >
              <option value="">Choose a saved warband…</option>
              {others.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.name} · {FACTION_NAMES[row.faction]} · {row.fighters.length} fighters
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="actions wrap">
          <button onClick={() => openPrintView("roster")}>Print view</button>
          <button className="primary" onClick={() => printView("roster")}>Print roster pages</button>
          <button onClick={() => printView("cards")}>Print all cards</button>
        </div>
        <p className="muted">{ORIGIN_BY_ID[band.originId]?.summary}</p>
        <div className="holdings">
          {band.holdings.map((holding, index) => (
            <label key={index}>
              {index === 0 ? "Stronghold note" : `Holding ${index}`}
              <input
                value={holding}
                onChange={(e) => {
                  const holdings = [...band.holdings];
                  holdings[index] = e.target.value;
                  patch({ holdings });
                }}
              />
            </label>
          ))}
        </div>
        <label>Notes<textarea value={band.notes} onChange={(e) => patch({ notes: e.target.value })} rows={3} /></label>
        <RosterValidation audit={audit} originName={ORIGIN_BY_ID[band.originId]?.name} />
      </section>
      <section className="panel">
        <h2>Fighters</h2>
        <label>
          Recruit
          <select defaultValue="" onChange={(e) => { if (e.target.value) addFighter(e.target.value); e.target.value = ""; }}>
            <option value="">Choose a fighter…</option>
            {(["leader", "champion", "henchman", "brute", "beast"] as const).map((role) => (
              <optgroup key={role} label={ROLE_LABEL[role]}>
                {choices.filter((def) => def.role === role).map((def) => (
                  <option key={def.id} value={def.id}>{def.name} · {def.cost}s · {def.xp} xp</option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <ul className="roster">
          {band.fighters.map((rf) => {
            const def = fighterDef(rf);
            return (
              <li key={rf.uid}>
                <button className={rf.uid === selected ? "pick selected" : "pick"} onClick={() => setSelected(rf.uid)}>
                  <strong>{rf.name}</strong>
                  <span>{def.name} · {ROLE_LABEL[def.role]}</span>
                  <span className="muted">{fighterCost(rf)}s · {rf.xp} xp</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="panel">
        {fighter ? (
          <FighterEditor
            band={band}
            fighter={fighter}
            onChange={(next, delta) => updateFighter(next, delta)}
            onRemove={() => removeFighter(fighter)}
          />
        ) : (
          <p className="empty">Select a fighter.</p>
        )}
      </section>
    </div>
    <div className={`print-view${showCards ? " open" : ""} orient-${pageOrientation}`}>
      <div className="print-toolbar no-print">
        <button onClick={() => setShowCards(false)}>Back to roster</button>
        <div className="print-mode" role="group" aria-label="Print layout">
          <button
            className={printLayout === "roster" ? "selected" : undefined}
            onClick={() => setPrintLayout("roster")}
          >
            Roster pages
          </button>
          <button
            className={printLayout === "cards" ? "selected" : undefined}
            onClick={() => {
              setPrintLayout("cards");
              setPageOrientation("landscape");
            }}
          >
            Fighter cards
          </button>
        </div>
        <div className="print-mode" role="group" aria-label="Page orientation">
          <button
            className={pageOrientation === "portrait" ? "selected" : undefined}
            onClick={() => setPageOrientation("portrait")}
          >
            Portrait
          </button>
          <button
            className={pageOrientation === "landscape" ? "selected" : undefined}
            onClick={() => setPageOrientation("landscape")}
          >
            Landscape
          </button>
        </div>
        <button className="primary" onClick={() => printView(printLayout)}>
          {printLayout === "roster" ? "Print 2 pages" : "Print tarot cards"}
        </button>
        {printLayout === "cards" && (
          <p className="muted print-card-hint">Fighter cards are landscape tarot (110 × 75 mm). Portrait page prints 1 across; landscape page prints 2 across.</p>
        )}
      </div>
      <PrintSheet
        band={band}
        layout={printLayout}
        orientation={pageOrientation}
        only={printOnly}
        onPrintOne={(id) => printView("cards", id)}
      />
    </div>
    </>
  );
}

function RosterValidation({
  audit,
  originName,
}: {
  audit: RosterAudit;
  originName?: string;
}) {
  return (
    <div className={`roster-check ${audit.ok ? "is-legal" : "is-illegal"}`}>
      <div className="roster-check-head">
        <h3>Roster validation</h3>
        <p className={audit.ok ? "ok" : "warn"}>
          {audit.ok ? "Legal list" : "Illegal list"}
          {originName ? ` · ${originName}` : ""}
        </p>
      </div>
      <p className="muted">Role slots (leader / champions / henchmen / brutes / beasts) are separate from each fighter type’s own 0–x cap. Champions means every champion type combined.</p>
      <table className="check-table">
        <thead>
          <tr>
            <th>Requirement</th>
            <th>Needed</th>
            <th>Have</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {audit.checks.map((check) => (
            <tr key={check.id} className={check.status === "pass" ? "pass" : "fail"}>
              <td>{check.label}</td>
              <td>{check.required}</td>
              <td>{check.current}</td>
              <td>{check.status === "pass" ? "OK" : "Missing"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!audit.ok && (
        <>
          <h4>Missing to make this legal</h4>
          <ul className="errors">
            {audit.missing.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </>
      )}
      {audit.ok && <p className="ok">Nothing missing. This roster meets the printed hiring limits.</p>}
    </div>
  );
}

function PrintSheet({
  band,
  layout,
  orientation,
  only,
  onPrintOne,
}: {
  band: Warband;
  layout: PrintLayout;
  orientation: PageOrientation;
  only: string | null;
  onPrintOne: (uid: string) => void;
}) {
  const origin = ORIGIN_BY_ID[band.originId];
  const holdings = band.holdings.filter((line) => line.trim());
  const rules = useMemo(() => collectSpecialRules(band), [band]);

  useEffect(() => {
    const styleId = "bdc-print-orientation";
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.textContent = `@media print { @page { size: A4 ${orientation}; margin: 8mm; } }`;
    return () => {
      style?.remove();
    };
  }, [orientation]);

  if (layout === "cards") {
    return (
      <article className={`print-sheet layout-cards orient-${orientation}${only ? " one" : ""}`}>
        <header className="print-banner">
          <div>
            <p className="eyebrow">Black Death City · Playtest v1.02</p>
            <h2>{band.name}</h2>
            <p>{FACTION_NAMES[band.faction]} · {origin?.name} · {band.stronghold}</p>
          </div>
          <p>Rating {warbandRating(band)} · Roster {rosterCost(band)}s · Stash {band.stash}s · {band.victories}/{band.battles} · {band.fighters.length} fighters</p>
        </header>
        {band.fighters.length === 0 && <p>This warband has no fighters yet.</p>}
        <div className="print-cards">
          {band.fighters.map((rf) => (
            <FighterCard key={rf.uid} fighter={rf} solo={only === rf.uid} onPrint={() => onPrintOne(rf.uid)} />
          ))}
        </div>
      </article>
    );
  }

  return (
    <div className={`print-sheet layout-roster orient-${orientation}`}>
      <div className={`print-pages orient-${orientation}`}>
        <section className="print-page">
          <p className="print-page-label no-print">Page 1 · Roster · {orientation}</p>
          <header className="print-banner">
            <div>
              <p className="eyebrow">Black Death City · Playtest v1.02</p>
              <h2>{band.name}</h2>
              <p>{FACTION_NAMES[band.faction]} · {origin?.name} · {band.stronghold}</p>
            </div>
            <p>Rating {warbandRating(band)} · Roster {rosterCost(band)}s · Stash {band.stash}s · {band.victories}/{band.battles} · {band.fighters.length} fighters</p>
          </header>
          {band.fighters.length === 0 ? (
            <p>This warband has no fighters yet.</p>
          ) : (
            <RosterTable band={band} />
          )}
          {(holdings.length > 0 || band.notes.trim()) && (
            <footer className="roster-footer">
              {holdings.length > 0 && (
                <p><strong>Holdings.</strong> {holdings.join(" · ")}</p>
              )}
              {band.notes.trim() && (
                <p><strong>Notes.</strong> {band.notes.trim()}</p>
              )}
            </footer>
          )}
          <p className="print-page-num">1 / 2 · Roster · special rules on next page</p>
        </section>

        <section className="print-page">
          <p className="print-page-label no-print">Page 2 · Special rules · {orientation}</p>
          <header className="print-banner">
            <div>
              <p className="eyebrow">Black Death City · Playtest v1.02</p>
              <h2>{band.name}</h2>
              <p>Special rules · {FACTION_NAMES[band.faction]} · {origin?.name}</p>
            </div>
            <p>Reference sheet for skills, spells, items, and traits on this roster</p>
          </header>
          <SpecialRulesPage rules={rules} />
          <p className="print-page-num">2 / 2 · Special rules</p>
        </section>
      </div>
    </div>
  );
}

function gearLine(piece: GearDef): string {
  if (piece.kind === "melee" || piece.kind === "ranged") {
    const profile = [
      piece.range ? `Rng ${piece.range}` : null,
      `A ${piece.attacks ?? "—"}`,
      `R ${piece.rend ?? "—"}`,
      `D ${piece.damage ?? "—"}`,
      `C ${piece.crit ?? "—"}`,
      piece.traits?.length ? piece.traits.join(", ") : null,
    ].filter(Boolean).join(" · ");
    return `${piece.name} (${profile})`;
  }
  if (piece.kind === "armour") {
    return `${piece.name}${piece.armour ? ` (${piece.armour})` : ""}`;
  }
  return piece.name;
}

function RosterTable({ band }: { band: Warband }) {
  return (
    <div className="roster-table-wrap">
      <table className="roster-sheet">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Type</th>
            <th>Role</th>
            <th>Cost</th>
            <th>XP</th>
            <th>M</th>
            <th>Bl</th>
            <th>Bo</th>
            <th>Ar</th>
            <th>I</th>
            <th>W</th>
            <th>Lf</th>
            <th>Wargear</th>
            <th>Skills</th>
            <th>Spells</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {band.fighters.map((rf, index) => {
            const def = fighterDef(rf);
            const stats = displayStats(rf);
            const gear = gearOf(rf);
            const skills = rf.skills.map((id) => SKILL_BY_ID[id]?.name ?? id).join(", ");
            const spells = rf.spells.filter((spell) => spell.trim());
            const status = [
              rf.kills > 0 ? `${rf.kills} kills` : null,
              rf.blackRot > 0 ? `Black Rot ${rf.blackRot}` : null,
              rf.missBattles > 0 ? `misses ${rf.missBattles}` : null,
              def.note ?? null,
              ...rf.injuries,
            ].filter(Boolean).join("; ");
            return (
              <tr key={rf.uid}>
                <td>{index + 1}</td>
                <td className="roster-name">{rf.name}</td>
                <td>{def.name}</td>
                <td>{ROLE_LABEL[def.role]}</td>
                <td>{fighterCost(rf)}</td>
                <td>{rf.xp}</td>
                <td>{stats.move}</td>
                <td>{stats.blade}</td>
                <td>{stats.bow}</td>
                <td>{stats.armour}</td>
                <td>{stats.init}</td>
                <td>{stats.will}</td>
                <td>{stats.life}</td>
                <td className="roster-wide">
                  {gear.length === 0 ? "—" : gear.map((piece) => gearLine(piece)).join("; ")}
                </td>
                <td className="roster-wide">{skills || "—"}</td>
                <td className="roster-wide">
                  {spells.length
                    ? `${def.lore ? `${def.lore}: ` : ""}${spells.join(", ")}`
                    : def.lore
                      ? def.lore
                      : "—"}
                </td>
                <td className="roster-wide">{status || "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

type SpecialRulesBundle = {
  originName: string;
  originSummary: string;
  fighterNotes: { id: string; name: string; note: string }[];
  skills: { name: string; blurb: string }[];
  spells: { name: string; lore: string; kind: string; casting: string; blurb: string }[];
  items: { name: string; detail: string }[];
  traits: { name: string; blurb: string }[];
};

function collectSpecialRules(band: Warband): SpecialRulesBundle {
  const origin = ORIGIN_BY_ID[band.originId];
  const skillMap = new Map<string, { name: string; blurb: string }>();
  const spellMap = new Map<string, SpecialRulesBundle["spells"][number]>();
  const itemMap = new Map<string, { name: string; detail: string }>();
  const traitNames = new Set<string>();
  const fighterNotes: { id: string; name: string; note: string }[] = [];

  for (const rf of band.fighters) {
    const def = fighterDef(rf);
    if (def.note) fighterNotes.push({ id: rf.uid, name: rf.name, note: def.note });
    for (const id of rf.skills) {
      const skill = SKILL_BY_ID[id];
      if (skill) skillMap.set(skill.id, { name: skill.name, blurb: skill.blurb });
    }
    for (const name of rf.spells) {
      const spell = SPELL_BY_NAME[name];
      if (spell) {
        spellMap.set(spell.name, {
          name: spell.name,
          lore: spell.lore,
          kind: spell.kind,
          casting: spell.casting,
          blurb: spell.blurb,
        });
      }
    }
    for (const piece of gearOf(rf)) {
      const parts = [
        piece.kind === "melee" || piece.kind === "ranged"
          ? [
              piece.range ? `Range ${piece.range}` : null,
              `A ${piece.attacks ?? "—"}`,
              `R ${piece.rend ?? "—"}`,
              `D ${piece.damage ?? "—"}`,
              `C ${piece.crit ?? "—"}`,
            ].filter(Boolean).join(" · ")
          : null,
        piece.armour ? `Armour ${piece.armour}` : null,
        piece.held ? "Held item (uses a melee/held slot)." : null,
        piece.mutation ? "Bloodline mutation." : null,
        piece.note ?? null,
        ...traitBlurbs(piece.traits),
      ].filter(Boolean);
      if (parts.length) itemMap.set(piece.id, { name: piece.name, detail: parts.join(" ") });
      for (const trait of piece.traits ?? []) {
        if (!trait.startsWith("Rare")) traitNames.add(trait);
      }
    }
  }

  return {
    originName: origin?.name ?? band.originId,
    originSummary: origin?.summary ?? "",
    fighterNotes,
    skills: [...skillMap.values()].sort((a, b) => a.name.localeCompare(b.name)),
    spells: [...spellMap.values()].sort((a, b) => a.name.localeCompare(b.name)),
    items: [...itemMap.values()].sort((a, b) => a.name.localeCompare(b.name)),
    traits: [...traitNames]
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({ name, blurb: TRAIT_BLURB[name] ?? name })),
  };
}

function SpecialRulesPage({ rules }: { rules: SpecialRulesBundle }) {
  return (
    <div className="rules-sheet">
      <section className="rules-block">
        <h3>Origin · {rules.originName}</h3>
        <p>{rules.originSummary || "No origin summary."}</p>
      </section>
      {rules.fighterNotes.length > 0 && (
        <section className="rules-block">
          <h3>Fighter rules</h3>
          <ul className="plain tight">
            {rules.fighterNotes.map((row) => (
              <li key={row.id}><strong>{row.name}.</strong> {row.note}</li>
            ))}
          </ul>
        </section>
      )}
      <section className="rules-block">
        <h3>Skills</h3>
        {rules.skills.length === 0 ? <p className="muted">None on this roster.</p> : (
          <ul className="plain tight">
            {rules.skills.map((skill) => (
              <li key={skill.name}><strong>{skill.name}.</strong> {skill.blurb}</li>
            ))}
          </ul>
        )}
      </section>
      <section className="rules-block">
        <h3>Spells</h3>
        {rules.spells.length === 0 ? <p className="muted">None on this roster.</p> : (
          <ul className="plain tight">
            {rules.spells.map((spell) => (
              <li key={spell.name}>
                <strong>{spell.name}</strong>
                {" · "}
                {spell.lore} · {spell.kind} · {spell.casting}. {spell.blurb}
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="rules-block">
        <h3>Wargear</h3>
        {rules.items.length === 0 ? <p className="muted">None on this roster.</p> : (
          <ul className="plain tight">
            {rules.items.map((item) => (
              <li key={item.name}><strong>{item.name}.</strong> {item.detail}</li>
            ))}
          </ul>
        )}
      </section>
      <section className="rules-block">
        <h3>Weapon traits in use</h3>
        {rules.traits.length === 0 ? <p className="muted">None on this roster.</p> : (
          <ul className="plain tight">
            {rules.traits.map((trait) => (
              <li key={trait.name}><strong>{trait.name}.</strong> {trait.blurb}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function TrackBoxes({
  label,
  count,
  start,
}: {
  label: string;
  count: number;
  start?: number;
}) {
  return (
    <div className="track-row">
      <span className="track-label">
        {label}
        {start != null ? <em> start {start}</em> : null}
      </span>
      <span className="track-boxes" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <span key={index} className="track-box" />
        ))}
      </span>
    </div>
  );
}

function FighterCard({
  fighter,
  solo,
  onPrint,
}: {
  fighter: RosterFighter;
  solo: boolean;
  onPrint: () => void;
}) {
  const def = fighterDef(fighter);
  const stats = displayStats(fighter);
  const gear = gearOf(fighter);
  const life = maxLife(fighter, "base");
  const skills = fighter.skills
    .map((id) => SKILL_BY_ID[id])
    .filter((skill): skill is NonNullable<typeof skill> => Boolean(skill));
  const spells = fighter.spells
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => SPELL_BY_NAME[name] ?? { name, lore: def.lore ?? "", kind: "", casting: "", blurb: "" });
  const hasSpells = spells.length > 0 || Boolean(def.lore);
  const classes = [
    "print-card",
    solo ? "solo" : "",
    hasSpells ? "has-spells" : "",
  ].filter(Boolean).join(" ");
  return (
    <section className={classes}>
      <button className="card-print-btn no-print" onClick={onPrint}>Print</button>
      <div className="card-main">
        <header className="card-head">
          <div>
            <h3>{fighter.name}</h3>
            <p>{def.name} · {ROLE_LABEL[def.role]}</p>
          </div>
          <p className="card-meta">
            {fighterCost(fighter)}s · XP {fighter.xp} · Kills {fighter.kills}
            {fighter.blackRot > 0 ? ` · Rot ${fighter.blackRot}` : ""}
            {fighter.missBattles > 0 ? ` · Miss ${fighter.missBattles}` : ""}
          </p>
        </header>
        <dl className="values card-values">
          <div><dt>M</dt><dd>{stats.move}</dd></div>
          <div><dt>Bl</dt><dd>{stats.blade}</dd></div>
          <div><dt>Bo</dt><dd>{stats.bow}</dd></div>
          <div><dt>Ar</dt><dd>{stats.armour}</dd></div>
          <div><dt>I</dt><dd>{stats.init}</dd></div>
          <div><dt>W</dt><dd>{stats.will}</dd></div>
          <div><dt>Lf</dt><dd>{stats.life}</dd></div>
        </dl>
        <div className="card-rule" aria-hidden="true" />
        <div className="card-details">
          <div className="card-block">
            <h4>Wargear</h4>
            {gear.length === 0 ? <p className="muted card-inline">None</p> : (
              <ul className="plain card-gear">
                {gear.map((piece) => (
                  <li key={piece.id}>
                    <strong>{piece.name}</strong>
                    {piece.kind === "armour" && piece.armour ? ` ${piece.armour}` : ""}
                    {(piece.kind === "melee" || piece.kind === "ranged")
                      ? ` · A${piece.attacks ?? "—"} R${piece.rend ?? "—"} D${piece.damage ?? "—"} C${piece.crit ?? "—"}`
                      : ""}
                    {piece.traits?.length ? ` · ${piece.traits.join(", ")}` : ""}
                    {piece.note ? ` · ${piece.note}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="card-block">
            <h4>Skills</h4>
            {skills.length === 0 ? <p className="muted card-inline">—</p> : (
              <ul className="plain card-gear card-gear-stack">
                {skills.map((skill) => (
                  <li key={skill.id}>
                    <strong>{skill.name}</strong>
                    {skill.blurb ? ` · ${skill.blurb}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {def.note && <p className="card-note">{def.note}</p>}
        </div>
      </div>
      <div className="card-col card-trackers">
        <h4>Track</h4>
        <TrackBoxes label="Life" count={life} start={life} />
        <TrackBoxes label="XP" count={10} start={fighter.xp} />
        <TrackBoxes label="Kills" count={8} start={fighter.kills} />
        <TrackBoxes label="Rot" count={5} start={fighter.blackRot} />
        <TrackBoxes label="Miss" count={3} start={fighter.missBattles} />
        <div className="track-notes">
          <span className="track-label">Injuries</span>
          {[
            ...fighter.injuries,
            ...Array.from({ length: Math.max(0, (hasSpells ? 1 : 2) - fighter.injuries.length) }, () => ""),
          ].map((injury, index) => (
            <div key={`injury-${index}`} className="track-line">{injury}</div>
          ))}
        </div>
      </div>
      {hasSpells && (
        <div className="card-spells">
          <h4>Spells{def.lore ? ` · ${def.lore}` : ""}</h4>
          {spells.length === 0 ? (
            <p className="card-inline">Prepared in battle</p>
          ) : (
            <ul className="plain card-spells-list">
              {spells.map((spell) => (
                <li key={spell.name}>
                  <strong>{spell.name}</strong>
                  {spell.casting ? ` · ${spell.kind} ${spell.casting}` : ""}
                  {spell.blurb ? ` · ${spell.blurb}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

const GEAR_ORDER: GearCategory[] = ["melee", "ranged", "armour", "held", "item", "mutation"];

function FighterEditor({
  band,
  fighter,
  onChange,
  onRemove,
}: {
  band: Warband;
  fighter: RosterFighter;
  onChange: (fighter: RosterFighter, stashDelta: number) => void;
  onRemove: () => void;
}) {
  const def = fighterDef(fighter);
  const stats = displayStats(fighter);
  const slots = slotUsage(fighter);
  const issues = fighterIssues(band, fighter);
  const buyable = gearOnLists(def.lists).filter((piece) => !(def.fixedOnly && !piece.mutation));
  const byCategory = GEAR_ORDER
    .map((category) => ({
      category,
      pieces: buyable.filter((piece) => gearCategory(piece) === category),
    }))
    .filter((group) => group.pieces.length > 0);
  const skills = SKILLS.filter((skill) => skillAllowed(skill, def));
  const skillsByTable = groupSkills(skills);
  const loreNames = loresForFighter(def.lore);
  const spellChoices = spellDefsForLore(def.lore);
  const needSpells = def.signatureSpells ?? 0;
  const pickedSpells = fighter.spells.map((spell) => spell.trim()).filter(Boolean);

  function toggleGear(id: string) {
    const piece = GEAR_BY_ID[id];
    if (!piece) return;
    if (fighter.gear.includes(id)) {
      onChange({ ...fighter, gear: fighter.gear.filter((gear) => gear !== id) }, piece.cost);
      return;
    }
    if (gearBlockReason(band, fighter, id)) return;
    onChange({ ...fighter, gear: [...fighter.gear, id] }, -piece.cost);
  }

  function toggleSkill(id: string) {
    if (def.fixedSkills?.includes(id)) return;
    if (fighter.skills.includes(id)) {
      onChange({ ...fighter, skills: fighter.skills.filter((skill) => skill !== id) }, 0);
      return;
    }
    if (skillBlockReason(band, fighter, id)) return;
    onChange({ ...fighter, skills: [...fighter.skills, id] }, 0);
  }

  function toggleSpell(name: string) {
    const selected = pickedSpells.includes(name);
    if (selected) {
      onChange({ ...fighter, spells: pickedSpells.filter((spell) => spell !== name) }, 0);
      return;
    }
    if (needSpells > 0 && pickedSpells.length >= needSpells) return;
    onChange({ ...fighter, spells: [...pickedSpells, name] }, 0);
  }

  return (
    <div className="editor">
      <header className="editor-head">
        <div>
          <h2>{def.name}</h2>
          <p className="muted">{def.keywords.join(" · ")} · {def.cost}s to recruit · start {def.xp}</p>
        </div>
        <button className="danger" onClick={onRemove}>Dismiss</button>
      </header>
      <label>Name<input value={fighter.name} onChange={(e) => onChange({ ...fighter, name: e.target.value }, 0)} /></label>
      <dl className="values">
        <div><dt>Move</dt><dd>{stats.move}</dd></div>
        <div><dt>Blade</dt><dd>{stats.blade}</dd></div>
        <div><dt>Bow</dt><dd>{stats.bow}</dd></div>
        <div><dt>Armour</dt><dd>{stats.armour}</dd></div>
        <div><dt>Initiative</dt><dd>{stats.init}</dd></div>
        <div><dt>Willpower</dt><dd>{stats.will}</dd></div>
        <div><dt>Life</dt><dd>{stats.life}</dd></div>
      </dl>
      {def.note && <p>{def.note}</p>}
      <div className="fields">
        <label>Experience<input type="number" value={fighter.xp} disabled={!def.gainsXp} onChange={(e) => onChange({ ...fighter, xp: Number(e.target.value) }, 0)} /></label>
        <label>Kills<input type="number" value={fighter.kills} onChange={(e) => onChange({ ...fighter, kills: Number(e.target.value) }, 0)} /></label>
        <label>Black Rot<input type="number" value={fighter.blackRot} onChange={(e) => onChange({ ...fighter, blackRot: Number(e.target.value) }, 0)} /></label>
        <label>Misses battles<input type="number" value={fighter.missBattles} onChange={(e) => onChange({ ...fighter, missBattles: Number(e.target.value) }, 0)} /></label>
      </div>
      <p className="slot-bar">
        Slots · melee/held {slots.meleeOrHeld}/{slots.meleeOrHeldMax}
        · ranged {slots.ranged}/{slots.rangedMax}
        · armour {slots.armour}/{slots.armourMax}
        · items {slots.items}/{slots.itemsMax}
        {buyable.some((piece) => piece.mutation) ? ` · mutations ${slots.mutations}/${slots.mutationsMax}` : ""}
      </p>
      {issues.length > 0 ? (
        <ul className="errors fighter-errors">{issues.map((error) => <li key={error}>{error}</li>)}</ul>
      ) : (
        <p className="ok">This fighter's loadout is legal.</p>
      )}
      {(def.included?.length ?? 0) > 0 && (
        <p className="included">Included: {def.included!.map((id) => GEAR_BY_ID[id]?.name).join(", ")}</p>
      )}
      <div className="editor-split">
        <div>
          {byCategory.length > 0 ? (
            byCategory.map(({ category, pieces }) => (
              <GearGroup
                key={category}
                title={GEAR_CATEGORY_LABEL[category]}
                pieces={pieces}
                fighter={fighter}
                band={band}
                included={def.included ?? []}
                onToggle={toggleGear}
              />
            ))
          ) : (
            <p className="muted">{def.fixedOnly ? "This fighter cannot buy other wargear." : "No wargear lists for this fighter."}</p>
          )}
          <h3>Carried</h3>
          <ul className="plain">
            {gearOf(fighter).length === 0 && <li className="muted">Nothing carried yet.</li>}
            {gearOf(fighter).map((piece) => (
              <li key={`${piece.id}-${piece.mutation ? "m" : "g"}`} className="carried" title={gearTooltip(piece)}>
                <strong>{piece.name}</strong>
                <span className="muted">{GEAR_CATEGORY_LABEL[gearCategory(piece)]}</span>
                {piece.range && <span>{piece.range}</span>}
                {piece.kind === "melee" || piece.kind === "ranged" ? (
                  <>
                    <span>A {piece.attacks ?? "—"}</span>
                    <span>R {piece.rend ?? "—"}</span>
                    <span>D {piece.damage ?? "—"}</span>
                    <span>C {piece.crit ?? "—"}</span>
                  </>
                ) : null}
                {piece.armour && <span>Armour {piece.armour}</span>}
                {piece.traits?.map((trait) => <span key={trait}>{trait}</span>)}
                {piece.note && <small>{piece.note}</small>}
              </li>
            ))}
          </ul>
        </div>
        <div>
          {skillsByTable.length > 0 && (
            <>
              <h3>Skills {def.skillPicks > 0 ? `· starting picks ${def.skillPicks}` : ""}</h3>
              <p className="muted">Skills are unique across the warband. Campaign experience can add more after hiring.</p>
              {skillsByTable.map(({ table, skills: rows }) => (
                <div key={table} className="option-group">
                  <h4>{skillTableLabel(table)}</h4>
                  <ul className="checks">
                    {rows.map((skill) => {
                      const checked = fighter.skills.includes(skill.id);
                      const fixed = def.fixedSkills?.includes(skill.id) ?? false;
                      const block = checked || fixed ? null : skillBlockReason(band, fighter, skill.id);
                      return (
                        <li key={skill.id} className={block ? "blocked" : undefined} title={skill.blurb}>
                          <label title={skill.blurb}>
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={fixed || Boolean(block)}
                              onChange={() => toggleSkill(skill.id)}
                            />
                            <span>{skill.name}</span>
                          </label>
                          <small>{skill.blurb}</small>
                          {fixed && <small className="muted">Fixed starting skill.</small>}
                          {block && <small className="warn">{block}</small>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </>
          )}
          {(needSpells > 0 || loreNames.length > 0) && (
            <>
              <h3>
                {needSpells > 0
                  ? `Signature spells · ${pickedSpells.length}/${needSpells}`
                  : "Spell lore"}
              </h3>
              <p className="muted">
                {def.lore}
                {needSpells > 0 ? " · Hover a spell for casting details, or read the line under it." : " · Reference only; this fighter prepares spells each battle."}
              </p>
              {loreNames.map((lore) => {
                const rows = spellChoices.filter((spell) => spell.lore === lore);
                return (
                  <div key={lore} className="option-group">
                    {loreNames.length > 1 && <h4>{lore}</h4>}
                    <ul className="checks">
                      {rows.map((spell) => {
                        const checked = pickedSpells.includes(spell.name);
                        const full = needSpells > 0 && !checked && pickedSpells.length >= needSpells;
                        const tip = spellTooltip(spell);
                        return (
                          <li key={spell.name} className={full ? "blocked" : undefined} title={tip}>
                            <label title={tip}>
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={needSpells === 0 || full}
                                onChange={() => needSpells > 0 && toggleSpell(spell.name)}
                              />
                              <span>{spell.name} · {spell.kind} · {spell.casting}</span>
                            </label>
                            <small>{spell.blurb}</small>
                            {full && <small className="warn">Signature pick limit reached ({needSpells}). Unequip a spell first.</small>}
                            {needSpells === 0 && <small className="muted">Prepared in battle, not a signature pick.</small>}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </>
          )}
          <InjuryPicker fighter={fighter} onChange={onChange} />
        </div>
      </div>
    </div>
  );
}

function InjuryPicker({
  fighter,
  onChange,
}: {
  fighter: RosterFighter;
  onChange: (fighter: RosterFighter, stashDelta: number) => void;
}) {
  const def = fighterDef(fighter);
  const table = def.injury;
  const printed = injuryTablePrinted(table);
  const options = injuriesForTable(table);
  const [pick, setPick] = useState("");
  const [custom, setCustom] = useState("");

  function missFrom(option: InjuryOption): number {
    if (option.miss != null) return option.miss;
    if (option.missDice) {
      return Array.from({ length: option.missDice }, () => rollD6()).reduce((sum, roll) => sum + roll, 0);
    }
    return 0;
  }

  function addOption(option: InjuryOption) {
    const entry = formatInjuryEntry(option);
    const miss = missFrom(option);
    onChange({
      ...fighter,
      injuries: [...fighter.injuries, entry],
      missBattles: fighter.missBattles + miss,
    }, 0);
    setPick("");
  }

  function addCustom() {
    const entry = custom.trim();
    if (!entry) return;
    onChange({ ...fighter, injuries: [...fighter.injuries, entry] }, 0);
    setCustom("");
    setPick("");
  }

  function removeAt(index: number) {
    onChange({
      ...fighter,
      injuries: fighter.injuries.filter((_, i) => i !== index),
    }, 0);
  }

  const selected = options.find((option) => option.id === pick);

  return (
    <div className="option-group injury-picker">
      <h3>Injuries</h3>
      <p className="muted">
        {INJURY_TABLE_LABEL[table]}
        {printed
          ? " · pick a printed result to add it to this fighter."
          : " · not printed in playtest v1.02. Use a record helper or enter a custom result."}
      </p>
      <div className="injury-add">
        <label>
          Add injury
          <select
            value={pick}
            onChange={(e) => setPick(e.target.value)}
          >
            <option value="">Choose…</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.roll ? `${option.roll} · ${option.label}` : option.label}
              </option>
            ))}
            <option value="__custom">Custom…</option>
          </select>
        </label>
        {pick === "__custom" ? (
          <>
            <label>
              Custom result
              <input
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="Write the lasting injury"
              />
            </label>
            <button type="button" disabled={!custom.trim()} onClick={addCustom}>Add</button>
          </>
        ) : (
          <button type="button" disabled={!selected} onClick={() => selected && addOption(selected)}>Add</button>
        )}
      </div>
      {selected?.kill && (
        <p className="warn">This result kills the fighter. Add it here for the record, then Dismiss them from the roster if you want them removed.</p>
      )}
      {selected && <p className="muted injury-blurb">{selected.text}</p>}
      {fighter.injuries.length === 0 ? (
        <p className="muted">No lasting injuries.</p>
      ) : (
        <ul className="plain injury-list">
          {fighter.injuries.map((injury, index) => (
            <li key={`${injury}-${index}`}>
              <span>{injury}</span>
              <button type="button" className="linkish" onClick={() => removeAt(index)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function GearGroup({
  title,
  pieces,
  fighter,
  band,
  included,
  onToggle,
}: {
  title: string;
  pieces: GearDef[];
  fighter: RosterFighter;
  band: Warband;
  included: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="option-group">
      <h3>{title}</h3>
      <ul className="checks">
        {pieces.map((piece) => {
          const checked = fighter.gear.includes(piece.id);
          const isIncluded = included.includes(piece.id);
          const block = checked || isIncluded ? null : gearBlockReason(band, fighter, piece.id);
          const tip = gearTooltip(piece);
          return (
            <li key={piece.id} className={block ? "blocked" : undefined} title={tip}>
              <label title={tip}>
                <input
                  type="checkbox"
                  checked={checked || isIncluded}
                  disabled={isIncluded || Boolean(block)}
                  onChange={() => onToggle(piece.id)}
                />
                <span>
                  {piece.name} · {piece.cost}s
                  {piece.traits?.length ? ` · ${piece.traits.join(", ")}` : ""}
                  {piece.armour ? ` · Armour ${piece.armour}` : ""}
                  {piece.rare != null || (piece.traits ?? []).some((trait) => trait.startsWith("Rare")) ? " · rare" : ""}
                </span>
              </label>
              {(piece.kind === "melee" || piece.kind === "ranged") && (
                <small className="muted">
                  {piece.range ? `${piece.range} · ` : ""}
                  A {piece.attacks ?? "—"} · R {piece.rend ?? "—"} · D {piece.damage ?? "—"} · C {piece.crit ?? "—"}
                </small>
              )}
              {piece.note && <small>{piece.note}</small>}
              {traitBlurbs(piece.traits).map((line) => (
                <small key={line} className="muted">{line}</small>
              ))}
              {isIncluded && <small className="muted">Included with this fighter.</small>}
              {block && <small className="warn">{block}</small>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function groupSkills(skills: SkillDef[]): { table: SkillDef["table"]; skills: SkillDef[] }[] {
  const order: SkillDef["table"][] = ["veteran", "old-dogs", "soldiers", "schemes", "tunnel", "aristocracy", "undying", "ordained", "blessings"];
  return order
    .map((table) => ({ table, skills: skills.filter((skill) => skill.table === table) }))
    .filter((group) => group.skills.length > 0);
}

function gearTooltip(piece: GearDef): string {
  const parts = [`${piece.name} · ${piece.cost}s`];
  if (piece.kind === "melee" || piece.kind === "ranged") {
    parts.push([
      piece.range ? `Range ${piece.range}` : null,
      `Attacks ${piece.attacks ?? "—"}`,
      `Rend ${piece.rend ?? "—"}`,
      `Damage ${piece.damage ?? "—"}`,
      `Critical ${piece.crit ?? "—"}`,
    ].filter(Boolean).join(" · "));
  }
  if (piece.armour) parts.push(`Armour ${piece.armour}`);
  if (piece.held) parts.push("Uses a melee/held slot.");
  if (piece.mutation) parts.push("Bloodline mutation.");
  if (piece.note) parts.push(piece.note);
  parts.push(...traitBlurbs(piece.traits));
  return parts.join(" ");
}

function Battle({
  bands,
  battle,
  onBattle,
  onBands,
}: {
  bands: Warband[];
  battle: BattleSession | null;
  onBattle: (battle: BattleSession | null) => void;
  onBands: (bands: Warband[]) => void;
}) {
  const [left, setLeft] = useState(bands[0]?.id ?? "");
  const [right, setRight] = useState(bands[1]?.id ?? "");
  const [aftermath, setAftermath] = useState(false);

  function start() {
    const ids = [left, right].filter(Boolean);
    const fighters: BattleFighter[] = [];
    for (const id of ids) {
      const band = bands.find((item) => item.id === id);
      if (!band) continue;
      for (const rf of band.fighters) {
        if (rf.missBattles > 0) continue;
        fighters.push({
          uid: rf.uid,
          warbandId: id,
          damage: 0,
          form: "base",
          takenDown: false,
          hidden: false,
          engaged: false,
          activated: false,
          surged: false,
          poisoned: false,
          reloaded: false,
        });
      }
    }
    onBands(bands.map((band) => {
      if (!ids.includes(band.id)) return band;
      return {
        ...band,
        fighters: band.fighters.map((rf) => (rf.missBattles > 0 ? { ...rf, missBattles: rf.missBattles - 1 } : rf)),
      };
    }));
    onBattle({ id: uid(), round: 1, warbandIds: ids, fighters, log: ["Battle begins."] });
    setAftermath(false);
  }

  if (!battle) {
    return (
      <section className="panel narrow">
        <h2>Set up a battle</h2>
        <p>Load one or two saved warbands. Life, bloodied, taken down, hidden, poison, activations, and kills are tracked here. Attack dice stay on the table.</p>
        <label>Warband<select value={left} onChange={(e) => setLeft(e.target.value)}><option value="">Choose…</option>{bands.map((band) => <option key={band.id} value={band.id}>{band.name} · rating {warbandRating(band)}</option>)}</select></label>
        <label>Opponent<select value={right} onChange={(e) => setRight(e.target.value)}><option value="">None</option>{bands.filter((band) => band.id !== left).map((band) => <option key={band.id} value={band.id}>{band.name} · rating {warbandRating(band)}</option>)}</select></label>
        <button className="primary" disabled={!left} onClick={start}>Begin</button>
      </section>
    );
  }

  const session = battle;
  const playing = session.warbandIds.map((id) => bands.find((band) => band.id === id)).filter((band): band is Warband => Boolean(band));
  const ratings = playing.map((band) => warbandRating(band));
  const underdog = ratings.length === 2 ? (ratings[0] === ratings[1] ? "Roll off. The winner is the underdog." : playing[ratings[0] < ratings[1] ? 0 : 1].name) : playing[0]?.name;

  function patchRow(uidValue: string, partial: Partial<BattleFighter>) {
    onBattle({
      ...session,
      fighters: session.fighters.map((row) => (row.uid === uidValue ? { ...row, ...partial } : row)),
    });
  }

  function log(line: string) {
    onBattle({ ...session, log: [`Round ${session.round}: ${line}`, ...session.log].slice(0, 40) });
  }

  function hurt(band: Warband, rf: RosterFighter, row: BattleFighter, amount: number) {
    const undead = fighterDef(rf).keywords.includes("Undead");
    let damage = row.damage + amount;
    if (amount > 0 && row.poisoned && undead) {
      /* poison does not apply */
    }
    const life = Math.max(0, maxLife(rf, row.form) - damage);
    const takenDown = life <= 0 || row.takenDown;
    patchRow(row.uid, { damage, takenDown, hidden: takenDown ? false : row.hidden });
    if (takenDown && !row.takenDown) log(`${rf.name} is taken down.`);
  }

  function activate(band: Warband, rf: RosterFighter, row: BattleFighter) {
    let damage = row.damage;
    const undead = fighterDef(rf).keywords.includes("Undead");
    const immune = undead || rf.skills.includes("black-blood");
    if (row.poisoned && !immune && !row.takenDown) {
      damage += 1;
      log(`${rf.name} suffers 1 damage from poison.`);
    }
    const life = maxLife(rf, row.form) - damage;
    const poisoned = row.poisoned && !immune && life > 1;
    patchRow(row.uid, {
      activated: true,
      damage,
      poisoned,
      hidden: false,
      takenDown: life <= 0,
    });
  }

  function endRound() {
    onBattle({
      ...session,
      round: session.round + 1,
      fighters: session.fighters.map((row) => ({ ...row, activated: false, surged: false })),
      log: [`Round ${session.round} ends.`, ...session.log].slice(0, 40),
    });
  }

  return (
    <div className="battle">
      <section className="panel battle-bar">
        <div>
          <h2>Round {battle.round}</h2>
          <p>Underdog: <strong>{underdog}</strong>. Underdog wins priority ties. A flee test is required at 5 or more bloodied or taken down. A roll of 1 ends the battle.</p>
        </div>
        <div className="actions">
          <button onClick={endRound}>Next round</button>
          <button onClick={() => setAftermath(true)}>End battle</button>
          <button className="danger" onClick={() => onBattle(null)}>Abandon</button>
        </div>
      </section>
      <div className="columns">
        {playing.map((band) => {
          const pressure = downOrBloodied(band, battle.fighters);
          return (
            <section key={band.id} className="panel">
              <h2>{band.name}</h2>
              <p className="muted">Rating {warbandRating(band)} · {pressure} bloodied or down{pressure >= 5 ? " · flee test" : ""}</p>
              {band.fighters.filter((rf) => rf.missBattles <= 0).map((rf) => {
                const row = battle.fighters.find((item) => item.uid === rf.uid);
                if (!row) return null;
                const life = currentLife(rf, row);
                const bloodied = isBloodied(rf, row);
                const stats = displayStats(rf, row.form);
                return (
                  <article key={rf.uid} className={row.takenDown ? "mini down" : "mini"}>
                    <header>
                      <strong>{rf.name}</strong>
                      <span>{fighterDef(rf).name}{row.form === "beast" ? " · beast" : ""}</span>
                    </header>
                    <p className="muted">Mv {stats.move} Bl {stats.blade} Bw {stats.bow} Ar {stats.armour} In {stats.init} Wp {stats.will}</p>
                    <div className="pips" aria-label={`${life} life`}>
                      {Array.from({ length: maxLife(rf, row.form) }, (_, index) => (
                        <i key={index} className={index < life ? "pip full" : "pip"} />
                      ))}
                    </div>
                    <div className="tags">
                      {bloodied && <em>Bloodied</em>}
                      {row.takenDown && <em>Taken down</em>}
                      {row.hidden && <em>Hidden</em>}
                      {row.engaged && <em>Engaged</em>}
                      {row.poisoned && <em>Poisoned</em>}
                      {row.activated && <em>Activated</em>}
                      {row.surged && <em>Surged</em>}
                    </div>
                    <div className="actions wrap">
                      <button onClick={() => hurt(band, rf, row, 1)} disabled={row.takenDown}>Damage</button>
                      <button onClick={() => patchRow(row.uid, { damage: Math.max(0, row.damage - 1), takenDown: false })}>Heal</button>
                      <button onClick={() => patchRow(row.uid, { takenDown: true, hidden: false })}>Take down</button>
                      <button onClick={() => activate(band, rf, row)} disabled={row.activated || row.takenDown}>Activate</button>
                      <button onClick={() => patchRow(row.uid, { surged: true })} disabled={row.surged || row.takenDown}>Surge</button>
                      <button onClick={() => patchRow(row.uid, { hidden: !row.hidden })}>Hide</button>
                      <button onClick={() => patchRow(row.uid, { engaged: !row.engaged })}>Engage</button>
                      <button onClick={() => patchRow(row.uid, { poisoned: !row.poisoned })}>Poison</button>
                      {rf.defId === "lycanfell" && (
                        <button onClick={() => patchRow(row.uid, { form: row.form === "base" ? "beast" : "base" })}>Transform</button>
                      )}
                    </div>
                    <label>
                      Killer
                      <select
                        value={row.killerUid ?? ""}
                        onChange={(e) => {
                          const killerUid = e.target.value || undefined;
                          patchRow(row.uid, { killerUid });
                          if (killerUid) {
                            const killer = playing.flatMap((item) => item.fighters).find((item) => item.uid === killerUid);
                            log(`${killer?.name ?? "Someone"} takes down ${rf.name}.`);
                          }
                        }}
                      >
                        <option value="">Unlisted enemy</option>
                        {playing.filter((item) => item.id !== band.id).flatMap((item) => item.fighters).map((enemy) => (
                          <option key={enemy.uid} value={enemy.uid}>{enemy.name}</option>
                        ))}
                      </select>
                    </label>
                  </article>
                );
              })}
            </section>
          );
        })}
      </div>
      <section className="panel">
        <h2>Log</h2>
        <ul className="plain">{battle.log.map((line, index) => <li key={index}>{line}</li>)}</ul>
      </section>
      {aftermath && (
        <Aftermath
          bands={playing}
          battle={battle}
          onClose={() => setAftermath(false)}
          onApply={(nextBands) => {
            onBands(bands.map((band) => nextBands.find((item) => item.id === band.id) ?? band));
            onBattle(null);
            setAftermath(false);
          }}
        />
      )}
    </div>
  );
}

function Aftermath({
  bands,
  battle,
  onClose,
  onApply,
}: {
  bands: Warband[];
  battle: BattleSession;
  onClose: () => void;
  onApply: (bands: Warband[]) => void;
}) {
  const [drafts, setDrafts] = useState(() => bands.map((band) => structuredClone(band)));
  const [winner, setWinner] = useState(bands[0]?.id ?? "");
  const [notes, setNotes] = useState<Record<string, string>>({});

  function rollFor(bandId: string, fighterUid: string) {
    setDrafts((current) => current.map((band) => {
      if (band.id !== bandId) return band;
      return {
        ...band,
        fighters: band.fighters.flatMap((rf) => {
          if (rf.uid !== fighterUid) return [rf];
          const outcome = rollInjury(fighterDef(rf).injury);
          if (outcome.kill) return [];
          return [{
            ...rf,
            injuries: outcome.manual ? rf.injuries : [...rf.injuries, `${outcome.roll}: ${outcome.text}`],
            missBattles: rf.missBattles + (outcome.miss ?? 0),
          }];
        }),
      };
    }));
  }

  function addXp(bandId: string, fighterUid: string, amount: number) {
    setDrafts((current) => current.map((band) => band.id !== bandId ? band : {
      ...band,
      fighters: band.fighters.map((rf) => rf.uid === fighterUid && fighterDef(rf).gainsXp ? { ...rf, xp: rf.xp + amount } : rf),
    }));
  }

  function apply() {
    const killers = new Map<string, number>();
    for (const row of battle.fighters) {
      if (row.takenDown && row.killerUid) killers.set(row.killerUid, (killers.get(row.killerUid) ?? 0) + 1);
    }
    const next = drafts.map((band) => {
      const rows = battle.fighters.filter((row) => row.warbandId === band.id);
      const lost = rows.filter((row) => row.takenDown && !band.fighters.some((rf) => rf.uid === row.uid)).length;
      return {
        ...band,
        battles: band.battles + 1,
        victories: band.victories + (band.id === winner ? 1 : 0),
        fightersLost: band.fightersLost + lost,
        fighters: band.fighters.map((rf) => ({
          ...rf,
          kills: rf.kills + (killers.get(rf.uid) ?? 0),
          injuries: notes[rf.uid]?.trim() ? [...rf.injuries, notes[rf.uid].trim()] : rf.injuries,
        })),
      };
    });
    onApply(next);
  }

  return (
    <div className="modal">
      <div className="panel sheet">
        <h2>Aftermath</h2>
        <p>Skeleton and thrall injuries use their d6 table. Demons use the d66 table. The standard lasting-injury table and the beast table are not in playtest v1.02, so those results are written by hand. Experience thresholds are also unprinted: add the bonuses you earned.</p>
        <label>Winner<select value={winner} onChange={(e) => setWinner(e.target.value)}>{bands.map((band) => <option key={band.id} value={band.id}>{band.name}</option>)}</select></label>
        {drafts.map((band) => (
          <section key={band.id}>
            <h3>{band.name}</h3>
            {band.fighters.map((rf) => {
              const row = battle.fighters.find((item) => item.uid === rf.uid);
              return (
                <div key={rf.uid} className="after-row">
                  <strong>{rf.name}</strong>
                  <span>{row?.takenDown ? "Taken down" : "Standing"} · {rf.xp} xp · {rf.kills} kills</span>
                  <div className="actions wrap">
                    {row?.takenDown && <button onClick={() => rollFor(band.id, rf.uid)}>Roll injury</button>}
                    <button onClick={() => addXp(band.id, rf.uid, rollD6())}>+d6 xp</button>
                    <button onClick={() => addXp(band.id, rf.uid, 5)}>+5</button>
                    <button onClick={() => addXp(band.id, rf.uid, 10)}>+10</button>
                  </div>
                  <input placeholder="Injury or note" value={notes[rf.uid] ?? ""} onChange={(e) => setNotes({ ...notes, [rf.uid]: e.target.value })} />
                </div>
              );
            })}
          </section>
        ))}
        <div className="actions">
          <button className="primary" onClick={apply}>Write into the rosters</button>
          <button onClick={onClose}>Back to the battle</button>
        </div>
      </div>
    </div>
  );
}

