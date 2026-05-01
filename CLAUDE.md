# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Bleach is a Chrome extension (Manifest V3) that clears browsing data (cache, cookies, localStorage, IndexedDB, service workers, cacheStorage) with an optional whitelist of domains to exclude. Built with React 19, TypeScript, Vite, and Tailwind CSS v4.

## Commands

```bash
bun run dev      # watch mode build (for local extension development)
bun run build    # production build → dist/
bun run lint     # oxlint with auto-fix
bun run format   # oxfmt formatter for src/
```

Load the extension in Chrome by pointing to the `dist/` folder after building.

## Architecture

- `src/Main.tsx` — entry point, mounts `<Popup>` into `#root`
- `src/Popup.tsx` — the entire UI: textarea for domain whitelist, bleach button, state machine (IDLE → RUNNING → DONE → IDLE)
- `src/Status.ts` — `Status` enum used by Popup
- `src/styles.css` — Tailwind CSS entry
- `public/manifest.json` — Chrome extension manifest; requires `browsingData` and `storage` permissions
- `index.html` — popup HTML shell

The whitelist is persisted to `chrome.storage.local` under the key `"whitelist"`. Domain entries (one per line) are expanded to both `https://domain` and `https://www.domain` before being passed to `chrome.browsingData.remove` as `excludeOrigins`.

## Code conventions

- All imports must use the `@/` path alias (no relative imports) and include the `.ts`/`.tsx` extension explicitly.
- JSX props must be sorted alphabetically (enforced by `perfectionist/sort-jsx-props`).
- All functions require explicit return types (`@typescript-eslint/explicit-function-return-type`).
- `type` imports must use `import type` syntax.
- Double quotes for strings; 4-space indentation.
- `TODO` comments are warnings; `FIXME` comments are errors — avoid both.
- No commented-out code (`sonarjs/no-commented-code`).
