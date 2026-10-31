import type { ReactNode } from "react";

export function RuleFigure({ title }: { title: string }) {
  const plate = PLATES[title];
  if (!plate) return null;
  return <div className="rule-plates">{plate}</div>;
}

function Plate({ src, alt, caption, children }: { src: string; alt: string; caption: string; children?: ReactNode }) {
  return (
    <figure className="rule-figure">
      <div className="rule-shot">
        <img src={src} alt={alt} />
        {children}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="rule-steps">
      {items.map((item, index) => (
        <li key={item}>
          <span>{index + 1}</span>
          <p>{item}</p>
        </li>
      ))}
    </ol>
  );
}

const PLATES: Record<string, ReactNode> = {
  Measuring: (
    <Plate
      src="/rules/measuring.jpg"
      alt="Two bases, one on a ledge, joined by a horizontal, vertical, and diagonal line."
      caption="Measure base to base. The diagonal is the distance. Use only the flat line when a rule says horizontal, and only the upright line when it says vertical."
    >
      <span className="tag h">4" horizontal</span>
      <span className="tag v">3" vertical</span>
      <span className="tag d">5" between bases</span>
    </Plate>
  ),
  Visibility: (
    <Plate
      src="/rules/visibility.jpg"
      alt="An observer looking at a fighter partly hidden by a stone wall."
      caption="The body can be seen, so the fighter is visible. Part of the body is behind the wall, so they are also obscured and count as in cover against a shot."
    >
      <span className="tag left">Observer</span>
      <span className="tag right">Visible, obscured</span>
    </Plate>
  ),
  Templates: (
    <>
      <Plate
        src="/rules/blast.jpg"
        alt="A circular blast template on cobbles, with bases around the ring and one on a raised roof."
        caption="Anyone under the ring is hit. A fighter engaged with someone who is hit is hit as well. A fighter 3&quot; or more above or below the centre is not. Judge cover from the centre of the ring."
      >
        <span className="tag roof">3" up: not hit</span>
        <span className="tag edge">Engaged pair: both hit</span>
      </Plate>
      <Plate
        src="/rules/flame.jpg"
        alt="A teardrop flame template touching a base, with one base inside behind a low wall and one behind a tall wall."
        caption="The narrow end touches the attacker's base. Everyone inside is hit, and there is no cover. A fighter hidden by a tall wall, and not visible, is not hit."
      >
        <span className="tag flame-in">Hit, no cover</span>
        <span className="tag flame-out">Not visible</span>
      </Plate>
    </>
  ),
  "Wargear slots": (
    <Plate
      src="/rules/wargear-slots.jpg"
      alt="Two swords, a breastplate, a crossbow, a shield, and a vial laid out with space between them."
      caption="Two melee weapons, one suit of armour, one ranged weapon, and two items. A shield is a held item: it takes a melee slot, not an item slot."
    >
      <span className="tag slot-a">Melee</span>
      <span className="tag slot-b">Melee</span>
      <span className="tag slot-c">Armour</span>
      <span className="tag slot-d">Ranged</span>
      <span className="tag slot-e">Held item</span>
      <span className="tag slot-f">Item</span>
    </Plate>
  ),
  "Setting up a battle": (
    <Steps
      items={[
        "Lower warband rating is the underdog. Equal ratings roll off.",
        "Roll the scenario.",
        "Set up the battlefield the way that scenario asks.",
        "Prepare spells.",
        "Other before-the-battle rules, underdog first.",
        "Begin round 1.",
      ]}
    />
  ),
  Rounds: (
    <Steps
      items={[
        "Priority roll. The underdog wins a tie.",
        "Start of round. Reinforcements and scenario rules.",
        "Activate every fighter, alternating.",
        "End of round.",
        "Flee tests if 5 or more are bloodied or down. Underdog first.",
      ]}
    />
  ),
  "Melee attacks": (
    <Steps
      items={[
        "Pick the enemy you are touching.",
        "Each side picks a weapon. An off-hand weapon rolls 1 attack.",
        "A charger strikes first. Otherwise roll Initiative.",
        "Roll attacks. A natural 6 is a critical. Blade or better hits.",
        "Take turns striking or parrying until both are done, or someone falls.",
      ]}
    />
  ),
  "Resolving hits": (
    <Steps
      items={[
        "Armour roll, modified by Rend. A worsened 6+ or an impossible save skips the roll.",
        "Each unsaved hit deals Damage. A critical deals Critical Damage.",
      ]}
    />
  ),
  "A Deadly Encounter": (
    <Plate
      src="/rules/battlefield.jpg"
      alt="A square ruined district with an open centre and four corner approaches."
      caption={'Four corner entries. Deploy within 12" of yours. The centre 6" scores d3 victory points when you hold it alone.'}
    >
      <span className="tag c1">Entry</span>
      <span className="tag c2">Entry</span>
      <span className="tag c3">Entry</span>
      <span className="tag c4">Entry</span>
      <span className="tag mid">Hold 6"</span>
    </Plate>
  ),
  "Glimmers in the Dark": (
    <Plate
      src="/rules/battlefield.jpg"
      alt="A ruined square with an open centre where treasure is placed."
      caption={'First treasure within 3" of the centre. The other two within 8" of the centre, more than 3" apart. Three escapes win.'}
    >
      <span className="tag mid">Treasure</span>
    </Plate>
  ),
  "No Quarter": (
    <Plate
      src="/rules/battlefield.jpg"
      alt="A ruined square divided by crossing streets into four quarters."
      caption={'The streets divide four quarters. From round 3, a quarter you outnumber scores a domination mark. Fighters within 6" of the centre belong to no quarter.'}
    >
      <span className="tag q1">Quarter</span>
      <span className="tag q2">Quarter</span>
      <span className="tag q3">Quarter</span>
      <span className="tag q4">Quarter</span>
      <span className="tag mid">No control</span>
    </Plate>
  ),
  "The Chapel": (
    <Plate
      src="/rules/battlefield.jpg"
      alt="A ruined square with a marked rectangle in the centre for the chapel."
      caption={'The chapel is a 12" by 16" area in the centre. Three treasure tokens sit inside, each near a different corner.'}
    >
      <span className="tag chapel">Chapel 12×16</span>
    </Plate>
  ),
  "Street of Death": (
    <figure className="rule-figure">
      <svg className="rule-map" viewBox="0 0 360 220" role="img" aria-label="A street running through ruins, with an escape edge at the top.">
        <rect width="360" height="220" fill="#f4ead8" />
        <rect x="120" y="16" width="120" height="188" fill="#e7dcc6" stroke="#241911" />
        <text x="180" y="110" textAnchor="middle" fill="#6a5848" fontSize="14">Street</text>
        <text x="180" y="14" textAnchor="middle" fill="#7d2e2a" fontSize="12">Escape edge</text>
        <text x="70" y="40" fill="#241911" fontSize="12">Ruins</text>
        <text x="250" y="40" fill="#241911" fontSize="12">Ruins</text>
        <text x="180" y="200" textAnchor="middle" fill="#241911" fontSize="12">Hit starts 18" from the escape edge</text>
      </svg>
      <figcaption>The defender does not flee. The hit reaching the escape edge wins. Taking the hit down wins for the ambushers.</figcaption>
    </figure>
  ),
  "The Find": (
    <Plate
      src="/rules/battlefield.jpg"
      alt="A ruined square with a small holding marked in the centre."
      caption={'The holding is 8" by 8". The defender places 5 treasure tokens within 3" of its centre, and cannot pick them up until round 3.'}
    >
      <span className="tag chapel">Holding 8×8</span>
    </Plate>
  ),
};
