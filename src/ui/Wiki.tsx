import { useEffect, useMemo, useState, type ReactNode } from "react";
import { catalogArticles } from "../rules/catalogWiki";
import { ARTICLES, RULE_SECTIONS, type RuleArticle } from "../rules/rulebook";
import { blankPage, loadWiki, saveWiki, type WikiPage } from "../wiki";
import { RuleFigure } from "./figures";

const RULES: RuleArticle[] = [...ARTICLES, ...catalogArticles()];

export function Wiki() {
  const [pages, setPages] = useState<WikiPage[]>(loadWiki);
  const [activeTitle, setActiveTitle] = useState("Rules index");
  const [noteId, setNoteId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState(true);

  useEffect(() => saveWiki(pages), [pages]);

  const needle = query.trim().toLowerCase();
  const ruleHits = useMemo(() => {
    if (!needle) return RULES;
    return RULES.filter((article) => `${article.title}\n${article.body}`.toLowerCase().includes(needle));
  }, [needle]);
  const noteHits = useMemo(() => {
    if (!needle) return pages;
    return pages.filter((page) => `${page.title}\n${page.body}`.toLowerCase().includes(needle));
  }, [pages, needle]);
  const titles = useMemo(() => [...RULES.map((article) => article.title), ...pages.map((page) => page.title)], [pages]);
  const article = noteId ? null : RULES.find((item) => item.title.toLowerCase() === activeTitle.toLowerCase()) ?? RULES[0];
  const note = pages.find((page) => page.id === noteId) ?? null;

  function patch(id: string, partial: Partial<WikiPage>) {
    setPages((current) =>
      current.map((page) => (page.id === id ? { ...page, ...partial, updated: Date.now() } : page)),
    );
  }

  function add(title = "New page") {
    const page = blankPage(title);
    setPages((current) => [...current, page]);
    setNoteId(page.id);
    setQuery("");
  }

  function openTitle(title: string) {
    const rule = RULES.find((item) => item.title.toLowerCase() === title.toLowerCase());
    if (rule) {
      setNoteId(null);
      setActiveTitle(rule.title);
      return;
    }
    const found = pages.find((page) => page.title.toLowerCase() === title.toLowerCase());
    if (found) setNoteId(found.id);
  }

  function remove(page: WikiPage) {
    if (!window.confirm(`Delete “${page.title}”?`)) return;
    setPages((current) => {
      const next = current.filter((item) => item.id !== page.id);
      setNoteId(next[0]?.id ?? null);
      return next;
    });
  }

  function move(page: WikiPage, direction: -1 | 1) {
    setPages((current) => {
      const index = current.findIndex((item) => item.id === page.id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = current.slice();
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  }

  function exportPages() {
    const blob = new Blob([JSON.stringify(pages, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "black-death-city-rules.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function importFile(file: File) {
    file.text().then((text) => {
      const parsed = JSON.parse(text) as WikiPage[];
      if (!Array.isArray(parsed)) return;
      const next = parsed
        .filter((page) => page && typeof page.title === "string")
        .map((page) => ({
          id: typeof page.id === "string" ? page.id : blankPage().id,
          title: page.title,
          body: typeof page.body === "string" ? page.body : "",
          updated: typeof page.updated === "number" ? page.updated : Date.now(),
        }));
      setPages(next);
      setNoteId(next[0]?.id ?? null);
    });
  }

  return (
    <div className="wiki">
      <aside className="panel wiki-pages">
        <div className="row-card">
          <h2>Rules</h2>
          <button className="primary" onClick={() => add()}>New page</button>
        </div>
        <label>
          Find a rule
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Poison, chapel, blade…" />
        </label>
        {needle && <p className="muted">{ruleHits.length + noteHits.length} matches</p>}
        {RULE_SECTIONS.map((section) => {
          const items = ruleHits.filter((item) => item.section === section);
          if (items.length === 0) return null;
          return (
            <details key={section} open={Boolean(needle) || section === article?.section}>
              <summary>{section} · {items.length}</summary>
              <ul className="roster">
                {items.map((item) => (
                  <li key={`${item.section}-${item.title}`}>
                    <button
                      className={!note && article?.title === item.title ? "pick selected" : "pick"}
                      onClick={() => openTitle(item.title)}
                    >
                      <strong>{item.title}</strong>
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
        <details open={Boolean(needle) || Boolean(note)}>
          <summary>Your notes · {noteHits.length}</summary>
          <ul className="roster">
            {noteHits.map((page) => (
              <li key={page.id}>
                <button className={page.id === noteId ? "pick selected" : "pick"} onClick={() => setNoteId(page.id)}>
                  <strong>{page.title || "Untitled"}</strong>
                  <span className="muted">{previewLine(page.body)}</span>
                </button>
              </li>
            ))}
          </ul>
        </details>
        {ruleHits.length + noteHits.length === 0 && <p className="empty">No rules match.</p>}
        <div className="actions wrap">
          <button onClick={exportPages}>Export</button>
          <label className="file-btn">
            Import
            <input
              type="file"
              accept="application/json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) importFile(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </aside>
      <section className="panel wiki-editor">
        {note ? (
          <>
            <div className="row-card wiki-tools">
              <input
                className="wiki-title"
                aria-label="Page title"
                value={note.title}
                onChange={(e) => patch(note.id, { title: e.target.value })}
              />
              <div className="actions">
                <button onClick={() => move(note, -1)}>Up</button>
                <button onClick={() => move(note, 1)}>Down</button>
                <button onClick={() => setPreview((on) => !on)}>{preview ? "Hide preview" : "Show preview"}</button>
                <button className="danger" onClick={() => remove(note)}>Delete</button>
              </div>
            </div>
            <div className={preview ? "wiki-split" : "wiki-split solo"}>
              <textarea
                aria-label="Page text"
                value={note.body}
                onChange={(e) => patch(note.id, { body: e.target.value })}
                placeholder="A house rule or session note. Link a page with [[Page title]]."
              />
              {preview && (
                <article className="wiki-preview prose">
                  <WikiBody body={note.body} titles={titles} onOpenTitle={openTitle} />
                </article>
              )}
            </div>
          </>
        ) : article ? (
          <article className="wiki-preview prose rule-read">
            <p className="eyebrow">{article.section}</p>
            <h2>{article.title}</h2>
            <RuleFigure title={article.title} />
            <WikiBody body={article.body} titles={titles} onOpenTitle={openTitle} />
          </article>
        ) : (
          <p className="empty">No matching rule.</p>
        )}
      </section>
    </div>
  );
}

function previewLine(body: string): string {
  const line = body.replace(/^#+\s*/gm, "").split("\n").map((item) => item.trim()).find(Boolean);
  if (!line) return "Empty page";
  return line.length > 80 ? `${line.slice(0, 77)}…` : line;
}

function WikiBody({
  body,
  titles,
  onOpenTitle,
}: {
  body: string;
  titles: string[];
  onOpenTitle: (title: string) => void;
}) {
  const blocks = parseBlocks(body);
  if (blocks.length === 0) return <p className="empty">Nothing written yet.</p>;
  return (
    <>
      {blocks.map((block, index) => {
        if (block.kind === "h") {
          const Tag = block.level === 1 ? "h2" : "h3";
          return <Tag key={index}>{renderInline(block.text, titles, onOpenTitle, `h${index}`)}</Tag>;
        }
        if (block.kind === "ul") {
          return (
            <ul key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item, titles, onOpenTitle, `l${index}-${itemIndex}`)}</li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{renderInline(block.text, titles, onOpenTitle, `p${index}`)}</p>;
      })}
    </>
  );
}

type Block =
  | { kind: "h"; level: 1 | 2; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] };

function parseBlocks(body: string): Block[] {
  const blocks: Block[] = [];
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  let paragraph: string[] = [];
  let list: string[] = [];

  function flushParagraph() {
    const text = paragraph.join(" ").trim();
    if (text) blocks.push({ kind: "p", text });
    paragraph = [];
  }
  function flushList() {
    if (list.length) blocks.push({ kind: "ul", items: list });
    list = [];
  }

  for (const line of lines) {
    const heading = /^(#{1,2})\s+(.*)$/.exec(line);
    const item = /^[-*]\s+(.*)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ kind: "h", level: heading[1].length === 1 ? 1 : 2, text: heading[2] });
    } else if (item) {
      flushParagraph();
      list.push(item[1]);
    } else if (line.trim() === "") {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line.trim());
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

function renderInline(text: string, titles: string[], onOpenTitle: (title: string) => void, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\[\[([^\]]+)\]\]|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${index}`;
    if (match[1] != null) {
      const title = match[1].trim();
      const found = titles.some((item) => item.toLowerCase() === title.toLowerCase());
      nodes.push(
        found ? (
          <button key={key} type="button" className="wiki-link" onClick={() => onOpenTitle(title)}>
            {title}
          </button>
        ) : (
          <span key={key}>{title}</span>
        ),
      );
    } else if (match[2] != null) {
      nodes.push(<strong key={key}>{match[2]}</strong>);
    } else if (match[3] != null) {
      nodes.push(<code key={key}>{match[3]}</code>);
    }
    last = match.index + match[0].length;
    index += 1;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
