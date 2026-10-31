import { uid } from "./rules/logic";

const WIKI = "bdc-wiki-v1";

export type WikiPage = {
  id: string;
  title: string;
  body: string;
  updated: number;
};

const SEED: { title: string; body: string }[] = [
  {
    title: "How to write here",
    body: `This is the rules notebook for the warband. Pages stay in this browser until you export them.

A line that starts with # is a heading, and ## is a smaller one. A line that starts with - is a list item. Wrap a phrase in two asterisks on each side to emphasize it, as in **this**. Link another page by putting its title in double brackets, like [[Warband limits]].

Use New page for a topic, then write it. House rules and session notes belong here beside the roster.`,
  },
  {
    title: "Warband limits",
    body: `These are the shared hiring limits the roster builder already checks.

- Exactly 1 Leader
- 0–3 Champions
- At least 5 Henchmen
- 0–2 Brutes
- 0–3 Beasts
- Never more than 15 fighters
- Starting purse is 1000 silver

Rating is fighter cost plus wargear plus experience. The stash is not part of the rating.

Low is better for Blade, Bow, and Armour. High is better for Move, Initiative, Willpower, and Life.`,
  },
  {
    title: "House rules",
    body: `Write anything the group plays differently from the book.

- `,
  },
  {
    title: "Session notes",
    body: `Battles, injuries, and what to remember next time.

## `,
  },
];

function seed(): WikiPage[] {
  const now = Date.now();
  const pages = SEED.map((page, index) => ({
    id: uid(),
    title: page.title,
    body: page.body,
    updated: now - index,
  }));
  saveWiki(pages);
  return pages;
}

export function loadWiki(): WikiPage[] {
  try {
    const raw = localStorage.getItem(WIKI);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as WikiPage[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((page) => page && typeof page.id === "string" && typeof page.title === "string")
      .map((page) => ({
        ...page,
        body: page.body.replace(
          "Wrap a phrase in **double asterisks** to emphasize it.",
          "Wrap a phrase in two asterisks on each side to emphasize it, as in **this**.",
        ),
      }));
  } catch {
    return [];
  }
}

export function saveWiki(pages: WikiPage[]): void {
  localStorage.setItem(WIKI, JSON.stringify(pages));
}

export function blankPage(title = "New page"): WikiPage {
  return { id: uid(), title, body: "", updated: Date.now() };
}
