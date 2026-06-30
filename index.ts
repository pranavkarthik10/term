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
import { PORTRAIT_FRAMES, PORTRAIT_ROWS } from "./ascii-art";

// ── palette ── warm amber-phosphor CRT ────────────────────────────────────
const C = {
  bg: "#0a0a0a",
  fg: "#f0e6d2",
  soft: "#c8b894",
  dim: "#8a7d5f",
  faint: "#5a5240",
  accent: "#ffb000", // amber
  gold: "#ffd166",
  selBg: "#ffb000",
  selFg: "#0a0a0a",
  selDim: "#5a3d0a",
  rule: "#2a2418",
} as const;

// scan-beam gradient over the portrait (index 0 = on the beam)
const BEAM = ["#fff0d0", "#ffd591", "#ffb000", "#cc8a1a", "#946614", "#62450f", "#40300c"];
const PORTRAIT_BASE = "#8a6a2e";

// wrap a single styled chunk into a StyledText for `content` assignment
const S = (chunk: TextChunk) => t`${chunk}`;

function openUrl(url?: string) {
  if (!url) return;
  const cmd =
    process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  spawn(cmd, [url], { stdio: "ignore", detached: true }).unref();
}

type AnyRenderer = Awaited<ReturnType<typeof createCliRenderer>>;
type Mode = "home" | "ships";

export function mount(renderer: AnyRenderer) {
  renderer.setBackgroundColor(C.bg);

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

  const stage = new BoxRenderable(renderer, {
    id: "stage",
    width: "100%",
    flexGrow: 1,
    flexDirection: "column",
  });
  root.add(stage);

  // ════════════════════════════════════════════════════════════════════════
  //  HOME VIEW
  // ════════════════════════════════════════════════════════════════════════
  const home = new BoxRenderable(renderer, {
    id: "home",
    width: "100%",
    flexGrow: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  });

  const portraitBox = new BoxRenderable(renderer, {
    id: "portrait",
    flexDirection: "column",
    alignItems: "flex-start",
  });
  home.add(portraitBox);
  const portraitRows: TextRenderable[] = [];
  for (let i = 0; i < PORTRAIT_ROWS; i++) {
    const row = new TextRenderable(renderer, {
      id: `pr-${i}`,
      content: S(fg(PORTRAIT_BASE)(PORTRAIT_FRAMES[0][i])),
    });
    portraitBox.add(row);
    portraitRows.push(row);
  }

  home.add(
    new ASCIIFontRenderable(renderer, {
      id: "homeLogo",
      text: "pranav",
      font: "tiny",
      color: C.fg,
      marginTop: 2,
    }),
  );
  home.add(
    new TextRenderable(renderer, {
      id: "homeName",
      marginTop: 2,
      content: t`${bold(fg(C.fg)(PROFILE.name))}`,
    }),
  );
  home.add(
    new TextRenderable(renderer, {
      id: "homeRole",
      marginTop: 1,
      content: t`${fg(C.accent)(EXPERIENCE[0].role)}  ${fg(C.faint)("·")}  ${fg(C.soft)(EXPERIENCE[0].company)}`,
    }),
  );
  home.add(
    new TextRenderable(renderer, {
      id: "homeLinks",
      marginTop: 3,
      content: t`${fg(C.soft)(PROFILE.site)}     ${fg(C.dim)(PROFILE.github)}     ${fg(C.dim)(PROFILE.x)}`,
    }),
  );

  // ════════════════════════════════════════════════════════════════════════
  //  SHIPS VIEW
  // ════════════════════════════════════════════════════════════════════════
  const ships = new BoxRenderable(renderer, {
    id: "ships",
    width: "100%",
    flexGrow: 1,
    flexDirection: "column",
  });

  const ruleRow = new BoxRenderable(renderer, {
    id: "ruleRow",
    width: "100%",
    height: 1,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  });
  ships.add(ruleRow);
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

  const body = new BoxRenderable(renderer, {
    id: "body",
    width: "100%",
    flexGrow: 1,
    flexDirection: "row",
    marginTop: 1,
  });
  ships.add(body);

  const list = new BoxRenderable(renderer, { id: "list", width: "52%", flexDirection: "column" });
  body.add(list);
  const detail = new BoxRenderable(renderer, {
    id: "detail",
    flexGrow: 1,
    flexDirection: "column",
    paddingLeft: 4,
  });
  body.add(detail);

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
    const name = new TextRenderable(renderer, { id: `row-${i}-n`, flexGrow: 1, content: ship.name, fg: C.fg });
    const type = new TextRenderable(renderer, { id: `row-${i}-t`, content: ship.type, fg: C.dim });
    box.add(name);
    box.add(type);
    list.add(box);
    return { box, name, type };
  });

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

  // ── shared footer ────────────────────────────────────────────────────────
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
  const footerLeft = new TextRenderable(renderer, { id: "footerLeft", flexGrow: 1, content: " " });
  const footerRight = new TextRenderable(renderer, { id: "footerRight", content: " " });
  footer.add(footerLeft);
  footer.add(footerRight);

  function setFooter(mode: Mode) {
    if (mode === "home") {
      footerLeft.content = t`${k("p")} ${l("projects")}${gap}${k("s")} ${l("site")}${gap}${k("g")} ${l("github")}${gap}${k("x")} ${l("x.com")}${gap}${k("q")} ${l("quit")}`;
      footerRight.content = S(fg(C.faint)("a terminal business card"));
    } else {
      footerLeft.content = t`${k("enter")} ${l("open")}${gap}${k("g")} ${l("github")}${gap}${k("s")} ${l("site")}${gap}${k("x")} ${l("x.com")}${gap}${k("p")}${l("/")}${k("esc")} ${l("home")}${gap}${k("q")} ${l("quit")}`;
      footerRight.content = S(fg(C.faint)("↑↓ / j k  move"));
    }
  }

  // ── ships detail rendering + selection ────────────────────────────────────
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
  function updateList() {
    rows.forEach((row, i) => {
      const on = i === selected;
      row.box.backgroundColor = on ? C.selBg : C.bg;
      row.name.fg = on ? C.selFg : C.fg;
      row.type.fg = on ? C.selDim : C.dim;
    });
    renderDetail(SHIPS[selected]);
  }
  updateList();

  // ── portrait animation (scan beam + gentle frame breathing) ───────────────
  let tick = 0;
  const timer = setInterval(() => {
    if (mode !== "home") return;
    tick++;
    const frame = PORTRAIT_FRAMES[Math.floor(tick / 8) % PORTRAIT_FRAMES.length];
    const beam = (Math.floor(tick * 0.8) % (PORTRAIT_ROWS + 10)) - 5;
    for (let i = 0; i < PORTRAIT_ROWS; i++) {
      const d = Math.abs(i - beam);
      const color = d < BEAM.length ? BEAM[d] : PORTRAIT_BASE;
      portraitRows[i].content = S(fg(color)(frame[i]));
    }
    renderer.requestRender();
  }, 70);
  if (typeof (timer as any).unref === "function") (timer as any).unref();

  // ── mode switching ────────────────────────────────────────────────────────
  let mode: Mode = "home";
  function setMode(next: Mode) {
    if (next === mode) return;
    stage.remove(mode === "home" ? "home" : "ships");
    stage.add(next === "home" ? home : ships);
    mode = next;
    setFooter(mode);
    renderer.requestRender();
  }

  stage.add(home);
  setFooter("home");

  // ── keys ──────────────────────────────────────────────────────────────────
  function move(delta: number) {
    selected = (selected + delta + SHIPS.length) % SHIPS.length;
    updateList();
    renderer.requestRender();
  }
  function quit() {
    clearInterval(timer);
    renderer.destroy();
    process.exit(0);
  }

  renderer.keyInput.on("keypress", (e: KeyEvent) => {
    const key = e.name;
    if (mode === "home") {
      switch (key) {
        case "p":
        case "return":
        case "enter":
          setMode("ships");
          break;
        case "s":
          openUrl("https://" + PROFILE.site);
          break;
        case "g":
          openUrl("https://" + PROFILE.github);
          break;
        case "x":
          openUrl("https://" + PROFILE.x);
          break;
        case "q":
        case "escape":
          quit();
      }
      return;
    }
    // ships mode
    switch (key) {
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
      case "p":
      case "escape":
        setMode("home");
        break;
      case "q":
        quit();
    }
  });
}

// ── bootstrap (skipped when imported for snapshot tests) ──────────────────
if (import.meta.main) {
  const renderer = await createCliRenderer({ exitOnCtrlC: true, targetFps: 30 });
  mount(renderer);
}
