# pranav · terminal

A TUI personal page, built with [OpenTUI](https://github.com/sst/opentui) + Bun.
Inspired by terminal portfolios like `ctate` and `milst`. Content is sourced from
[pranavkarthik.com](https://pranavkarthik.com).

```
██████╗  ██████╗   █████╗  ███╗   ██╗  █████╗  ██╗   ██╗
██╔══██╗ ██╔══██╗ ██╔══██╗ ████╗  ██║ ██╔══██╗ ██║   ██║
██████╔╝ ██████╔╝ ███████║ ██╔██╗ ██║ ███████║ ██║   ██║
██╔═══╝  ██╔══██╗ ██╔══██║ ██║╚██╗██║ ██╔══██║ ╚██╗ ██╔╝
██║      ██║  ██║ ██║  ██║ ██║ ╚████║ ██║  ██║  ╚████╔╝
╚═╝      ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝  ╚═══╝ ╚═╝  ╚═╝   ╚═══╝
```

## Run

```bash
bun install
bun start          # or: bun run index.ts
```

Make it a global command:

```bash
chmod +x index.ts
bun link           # then run `pranav` from anywhere
```

## Keys

| Key               | Action                                  |
| ----------------- | --------------------------------------- |
| `↑` `↓` / `j` `k` | move selection                          |
| `enter`           | open selected ship (live URL or GitHub) |
| `g`               | open selected ship's GitHub             |
| `s`               | open pranavkarthik.com                   |
| `x`               | open x.com profile                      |
| `q` / `esc`       | quit                                    |

## Layout

- **Left** — selectable list of recent ships (most recent first).
- **Right** — live detail for the selected ship: year, type, description, stack,
  awards, plus a `NOW` / `EDU` block.
- **Bottom** — keybinding hints.

## Files

- `index.ts` — the app. `mount(renderer)` builds the UI; bootstraps a real
  `CliRenderer` when run directly.
- `data.ts` — all personal content (profile, ships, experience, education).
  Edit this to update the page.
- `snapshot.ts` — renders a plain-text frame for quick visual checks:
  `bun run snapshot.ts [cols] [rows]`.
