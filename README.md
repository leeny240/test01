# SubNote Design System (test)

Design tokens and React components for SubNote, exported from the Figma file
[구독 관리 앱 — 컨셉 드래프트](https://www.figma.com/design/3SQS9RokgZFhh5NUs8Q6Er).

```
Figma variables & text styles ──export──▶ tokens/tokens.json ──npm run tokens──▶ src/styles/tokens.css ──▶ React components
```

## Structure

| Path | What it is |
|---|---|
| `tokens/tokens.json` | Source of truth exported from Figma (DTCG-style). Collections: `primitives`, `color`, `space`, `radius`, `typography`, `component`, plus `textStyles`. Mode-dependent tokens keep both values in `$extensions.modes` (`desktop` / `mobile`). |
| `scripts/build-tokens.mjs` | Converts `tokens.json` into CSS custom properties. Names match the WEB code syntax on each Figma variable (e.g. `color/button/primary/bg` → `--color-button-primary-bg`). |
| `src/styles/tokens.css` | Generated — do not edit. Desktop values on `:root`; mobile values under `[data-mode="mobile"]` and `@media (max-width: 640px)`. Text styles become `.text-*` classes. |
| `src/components/` | React components mirroring the Figma Components page (same names and variants). Styles in `components.css` use tokens only. |
| `src/prototype/` | Interactive **Add Subscription · First Decision** prototype composed from the components (default route). Under 640px it switches to the mobile layout and token mode. |
| `src/Gallery.tsx` | Component gallery at `#components`, with a Desktop / Mobile mode switch (`?mode=mobile#components` also works). |

## Components

| Figma component | React | Variants / props |
|---|---|---|
| Button | `Button` | `variant` primary · secondary, `size` md · sm, states via `:hover` / `:active` / `:focus-visible` / `disabled`, `icon`, `iconPosition` |
| Input Field | `InputField` | default, hover, focus, read-only, disabled, `error` |
| Option | `Option`, `OptionGroup` | default, hover, selected, disabled |
| Toggle | `Toggle` | on / off |
| Status Chip | `StatusChip` | `tone` neutral · muted · accent · success · ink · subtle, `showDot` |
| Step Badge, Tile, Avatar, Icon Button, Nav Item | `StepBadge`, `Tile`, `Avatar`, `IconButton`, `NavItem` | |
| Stat Card, Detected Item, Decision Card, Usage Meter, Upload Dropzone | `StatCard`, `DetectedItem`, `DecisionCard`, `UsageMeter`, `UploadDropzone` | |
| Icon/* (25) | `Icon` | `name` |

`previewState` / `previewHover` / `previewDragOver` props only force a state for documentation; real interaction works without them.

## Scripts

```bash
npm install
npm run dev        # regenerates tokens.css, then starts the gallery
npm run build      # regenerates tokens.css, type-checks, builds
npm run tokens     # only regenerate tokens.css
```

## Syncing from Figma

Variables changed in Figma? Ask Claude to **"sync tokens"**: it re-exports the Figma variables into
`tokens/tokens.json`, runs `npm run tokens`, and commits the diff. Automatic sync (GitHub Actions + Figma
Variables REST API) and Code Connect need a Figma Enterprise / Organization plan.
