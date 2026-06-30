# pranavkarthik · terminal business card

A two-mode TUI built with [OpenTUI](https://github.com/sst/opentui) + Bun.
Inspired by terminal portfolios like `ctate` and `milst`. Content is sourced from
[pranavkarthik.com](https://pranavkarthik.com).

```bash
bunx pranavkarthik
```

> Requires [Bun](https://bun.sh) — OpenTUI's render core is Bun-native, so this
> runs under `bunx`, not `npx`.

## Modes

**Home** — a minimal card: an animated ASCII portrait (baked from a photo, with a
sweeping scan-beam effect), name, current role, tagline, and links.

**Projects** — press `p`. A keyboard-driven list of recent ships on the left with a
live detail panel on the right (year, type, description, stack, awards, `NOW`/`EDU`).

## Keys

### Home
| Key   | Action                |
| ----- | --------------------- |
| `p` / `enter` | open Projects |
| `s`   | open pranavkarthik.com |
| `g`   | open GitHub           |
| `x`   | open x.com            |
| `q` / `esc` | quit            |

### Projects
| Key               | Action                                  |
| ----------------- | --------------------------------------- |
| `↑` `↓` / `j` `k` | move selection                          |
| `enter`           | open selected ship (live URL or GitHub) |
| `g`               | open selected ship's GitHub             |
| `s` / `x`         | open site / x.com                       |
| `p` / `esc`       | back to Home                            |
| `q`               | quit                                    |

## Develop

```bash
bun install
bun start                       # run locally
bun run snapshot.ts 100 40      # plain-text frame of Home
bun run snapshot.ts 100 36 ships# plain-text frame of Projects
bun run scripts/bake-portrait.ts <image>   # re-bake ascii-art.ts from a photo
```

## Files

- `index.ts` — the app. `mount(renderer)` builds both modes + the scan-beam
  animation; bootstraps a real `CliRenderer` when run directly.
- `data.ts` — all personal content (profile, ships, experience, education).
  Edit this to update the card.
- `ascii-art.ts` — auto-generated ASCII portrait frames (don't edit by hand).
- `scripts/bake-portrait.ts` — converts an image into `ascii-art.ts`.
- `snapshot.ts` — renders a plain-text frame for quick visual checks.

## License

MIT
