# Repository Guidelines

## Project Structure & Module Organization

This Yarn 1 repository contains two sibling applications. `web/` is a CRA/CRACO React frontend; application code lives in `web/src/`, static assets in `web/public/`, and component styles beside components as `index.module.less`. `server/` is a Koa service that creates RTC sessions and proxies the allowlisted VoiceChat actions. Add AIGC definitions under `server/scenes/<scene-id>.json`, using `default.json` as the schema example. Root files such as `vertc.taskfile.yaml` orchestrate the applications; generated `build/`, `web/build/`, coverage, and log directories should not be edited or committed.

## Build, Test, and Development Commands

- `yarn install --frozen-lockfile`, then the same command with `--cwd web` and `--cwd server`, installs all three lockfile-pinned dependency sets.
- `vertc dev` runs the preferred CLI-authenticated quick-start flow. With long-lived AK/SK configured locally, `yarn dev` starts the server and web app together.
- `yarn --cwd web build` creates the production frontend bundle.
- `yarn --cwd web eslint`, `stylelint`, and `prettier` apply frontend checks and fixes; review their rewrites before committing.

## Coding Style & Naming Conventions

Frontend TypeScript is strict. Follow `web/.prettierrc`: two spaces, single quotes, semicolons, 100-column lines, and ES5 trailing commas. Use PascalCase for React component directories/types, camelCase for functions and variables, `use...` for hooks, and `UPPER_SNAKE_CASE` for constants. Keep `.tsx` and its `.module.less` file together. Server code uses CommonJS and the existing two-space, semicolon-terminated style. Keep scene keys and OpenAPI field casing unchanged.

## Testing Guidelines

Run `yarn --cwd server test` for the built-in `node:test` suite and `yarn --cwd web test` for Jest through CRACO. Name tests `*.test.js` or `*.test.ts` and colocate them with the behavior they cover. Add regression coverage for changed session isolation, proxy validation, API-client, or Redux-state behavior. No numeric coverage threshold is configured.

## Commit & Pull Request Guidelines

Recent history uses concise Conventional Commit prefixes such as `feat:`, `fix:`, `docs:`, and `chore:`. Prefer an imperative summary; add a scope when useful, for example `fix(server): reject partial credentials`. Pull requests should explain affected flows, list validation commands, call out environment or scene-schema changes, link the relevant issue, and include screenshots for visible UI changes.

## Security & Configuration

Copy `.env.example` and `web/.env.example` to ignored `.env.local` files. Never commit App Keys, AK/SK pairs, tokens, or third-party credentials; reference server secrets from scene JSON as `${ENV_NAME}`. Report vulnerabilities through `SECURITY.md`, not a public issue.
