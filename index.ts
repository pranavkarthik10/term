#!/usr/bin/env bun
import {
  createCliRenderer,
  BoxRenderable,
  TextRenderable,
  ASCIIFontRenderable,
  t,
  bold,
  fg,
  type KeyEvent,
  type TextChunk,
} from "@opentui/core";
import { spawn } from "node:child_process";
import { PROFILE, SHIPS, EXPERIENCE, EDUCATION, type Ship } from "./data";

// ── palette ──────────────────────────────────────────────────────────────
const C = {
  bg: "#0a0a0a",
  fg: "#e8e8e8",
  soft: "#a1a1aa",
  dim: "#6b7280",
  faint: "#4b5563",
  accent: "#38bdf8", // cyan
  gold: "#fbbf24",
  selBg: "#f4f4f5",
  selFg: "#0a0a0a",
  selDim: "#3f3f46",
  rule: "#27272a",
} as const;

// wrap a single styled chunk into a StyledText for `content` assignment
const S = (chunk: TextChunk) => t`${chunk}`;

function openUrl(url?: string) {
  if (!url) return;
  const cmd =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "start"
        : "xdg-open";
  spawn(cmd, [url], { stdio: "ignore", detached: true }).unref();
}

type AnyRenderer = Awaited<ReturnType<typeof createCliRenderer>>;

export function mount(renderer: AnyRenderer) {
renderer.setBackgroundColor(C.bg);

// ── root ─────────────────────────────────────────────────────────────────
const root = new BoxRenderable(renderer, {
  id: "root",
  width: "100%",
  height: "100%",
  flexDirection: "column",
  backgroundColor: C.bg,
  paddingTop: 1,
  paddingLeft: 3,
  paddingRight: 3,
});
renderer.root.add(root);

// ── header: logo ─────────────────────────────────────────────────────────
root.add(
  new ASCIIFontRenderable(renderer, {
    id: "logo",
    text: "pranav",
    font: "block",
    color: C.fg,
  }),
);

// identity row: tagline (left) + links (right)
const idRow = new BoxRenderable(renderer, {
  id: "idRow",
  width: "100%",
  flexDirection: "row",
  marginTop: 1,
});
root.add(idRow);
idRow.add(
  new TextRenderable(renderer, {
    id: "tagline",
    flexGrow: 1,
    content: t`${fg(C.soft)(PROFILE.tagline)}`,
  }),
);
idRow.add(
  new TextRenderable(renderer, {
    id: "links",
    content: t`${fg(C.dim)(PROFILE.github)}    ${fg(C.dim)(PROFILE.x)}`,
  }),
);

// ── section rule ─────────────────────────────────────────────────────────
const ruleRow = new BoxRenderable(renderer, {
  id: "ruleRow",
  width: "100%",
  height: 1,
  flexDirection: "row",
  marginTop: 1,
  alignItems: "center",
  overflow: "hidden",
});
root.add(ruleRow);
ruleRow.add(
  new TextRenderable(renderer, {
    id: "ruleLabel",
    flexShrink: 0,
    content: t`${fg(C.dim)("RECENT SHIPS")} ${fg(C.accent)("▲")} `,
  }),
);
ruleRow.add(
  new TextRenderable(renderer, {
    id: "ruleLine",
    flexGrow: 1,
    flexShrink: 1,
    content: S(fg(C.rule)("─".repeat(220))),
  }),
);

// ── body: list (left) + detail (right) ───────────────────────────────────
const body = new BoxRenderable(renderer, {
  id: "body",
  width: "100%",
  flexGrow: 1,
  flexDirection: "row",
  marginTop: 1,
});
root.add(body);

const list = new BoxRenderable(renderer, {
  id: "list",
  width: "52%",
  flexDirection: "column",
});
body.add(list);

const detail = new BoxRenderable(renderer, {
  id: "detail",
  flexGrow: 1,
  flexDirection: "column",
  paddingLeft: 4,
});
body.add(detail);

// ── list rows ────────────────────────────────────────────────────────────
type Row = { box: BoxRenderable; name: TextRenderable; type: TextRenderable };
const rows: Row[] = SHIPS.map((ship, i) => {
  const box = new BoxRenderable(renderer, {
    id: `row-${i}`,
    width: "100%",
    height: 1,
    flexDirection: "row",
    paddingLeft: 1,
    paddingRight: 1,
    backgroundColor: C.bg,
  });
  const name = new TextRenderable(renderer, {
    id: `row-${i}-name`,
    flexGrow: 1,
    content: ship.name,
    fg: C.fg,
  });
  const type = new TextRenderable(renderer, {
    id: `row-${i}-type`,
    content: ship.type,
    fg: C.dim,
  });
  box.add(name);
  box.add(type);
  list.add(box);
  return { box, name, type };
});

// ── detail panel children ────────────────────────────────────────────────
const dTitle = new TextRenderable(renderer, { id: "dTitle", content: " " });
const dMeta = new TextRenderable(renderer, { id: "dMeta", content: " " });
const dDesc = new TextRenderable(renderer, { id: "dDesc", content: " ", marginTop: 1, wrapMode: "word" });
const dStackLabel = new TextRenderable(renderer, { id: "dStackLabel", content: S(fg(C.faint)("STACK")), marginTop: 1 });
const dStack = new TextRenderable(renderer, { id: "dStack", content: " ", wrapMode: "word" });
const dAward = new TextRenderable(renderer, { id: "dAward", content: " ", marginTop: 1, wrapMode: "word" });
detail.add(dTitle);
detail.add(dMeta);
detail.add(dDesc);
detail.add(dStackLabel);
detail.add(dStack);
detail.add(dAward);

// spacer pushes the about block to the bottom of the detail column
detail.add(new BoxRenderable(renderer, { id: "dSpacer", flexGrow: 1 }));
detail.add(
  new TextRenderable(renderer, {
    id: "dNow",
    wrapMode: "word",
    content: t`${fg(C.faint)("NOW")}  ${fg(C.dim)(`${EXPERIENCE[0].role} @ ${EXPERIENCE[0].company} · ${EXPERIENCE[0].when}`)}`,
  }),
);
detail.add(
  new TextRenderable(renderer, {
    id: "dEdu",
    wrapMode: "word",
    content: t`${fg(C.faint)("EDU")}  ${fg(C.dim)(`${EDUCATION.degree} · ${EDUCATION.institution} · ${EDUCATION.when}`)}`,
  }),
);

// ── footer ───────────────────────────────────────────────────────────────
const footer = new BoxRenderable(renderer, {
  id: "footer",
  width: "100%",
  flexDirection: "row",
  border: ["top"],
  borderColor: C.rule,
  marginTop: 1,
  alignItems: "center",
});
root.add(footer);

const k = (s: string) => bold(fg(C.accent)(s));
const l = (s: string) => fg(C.dim)(s);
const gap = l("   ");

footer.add(
  new TextRenderable(renderer, {
    id: "footerLeft",
    flexGrow: 1,
    content: t`${k("enter")} ${l("open")}${gap}${k("g")} ${l("github")}${gap}${k("s")} ${l("site")}${gap}${k("x")} ${l("x.com")}${gap}${k("q")} ${l("quit")}`,
  }),
);
footer.add(
  new TextRenderable(renderer, {
    id: "footerRight",
    content: S(fg(C.faint)("↑↓ / j k  move")),
  }),
);

// ── selection state ──────────────────────────────────────────────────────
let selected = 0;

function renderDetail(ship: Ship) {
  dTitle.content = S(bold(fg(C.fg)(ship.name)));
  dMeta.content = t`${fg(C.accent)(String(ship.year))}  ${fg(C.faint)("·")}  ${fg(C.dim)(ship.type)}`;
  dDesc.content = S(fg(C.soft)(ship.description));
  dStack.content = S(fg(C.dim)(ship.stack.join("  ·  ")));
  dAward.content = ship.awards?.length
    ? t`${fg(C.gold)("★ ")}${fg(C.dim)(ship.awards.join("  ·  "))}`
    : " ";
}

function update() {
  rows.forEach((row, i) => {
    const on = i === selected;
    row.box.backgroundColor = on ? C.selBg : C.bg;
    row.name.fg = on ? C.selFg : C.fg;
    row.type.fg = on ? C.selDim : C.dim;
  });
  renderDetail(SHIPS[selected]);
}
update();

// ── keys ─────────────────────────────────────────────────────────────────
function move(delta: number) {
  selected = (selected + delta + SHIPS.length) % SHIPS.length;
  update();
}

renderer.keyInput.on("keypress", (e: KeyEvent) => {
  switch (e.name) {
    case "down":
    case "j":
      move(1);
      break;
    case "up":
    case "k":
      move(-1);
      break;
    case "g":
      openUrl(SHIPS[selected].github ?? "https://" + PROFILE.github);
      break;
    case "s":
      openUrl("https://" + PROFILE.site);
      break;
    case "x":
      openUrl("https://" + PROFILE.x);
      break;
    case "return":
    case "enter":
      openUrl(SHIPS[selected].url ?? SHIPS[selected].github);
      break;
    case "q":
    case "escape":
      renderer.destroy();
      process.exit(0);
  }
});
}

// ── bootstrap (skipped when imported for snapshot tests) ──────────────────
if (import.meta.main) {
  const renderer = await createCliRenderer({ exitOnCtrlC: true, targetFps: 30 });
  mount(renderer);
}
