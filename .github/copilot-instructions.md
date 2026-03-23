# Copilot Instructions for screeps-server-mockup

## Project Overview

A Node.js library that runs a private Screeps server one tick at a time for automated testing of Screeps bot code. It wraps the official `@screeps/engine`, `@screeps/driver`, and `@screeps/common` packages, providing a controllable test harness where you add bots, advance ticks manually, and inspect game state.

## Build, Test, and Lint

```bash
yarn build          # Compile TypeScript → dist/
yarn test           # Build + run full Mocha suite
yarn lint           # ESLint on src/, test/, utils/
yarn coverage       # Build + tests with nyc coverage
```

Run a single test by name:

```bash
yarn build && npx mocha --ui tdd --grep "test name here" dist/test/
```

Tests run against compiled JS in `dist/`, so always build first.

## Architecture

```
ScreepsServer (EventEmitter)
  ├── .world → World
  │     ├── addBot() → User (EventEmitter)
  │     └── setTerrain() / getTerrain() → TerrainMatrix
  └── manages child processes: storage, engine_runner, engine_processor
```

**Core flow:** `new ScreepsServer()` → `server.start()` → `server.world.addBot(...)` → loop `server.tick()` → `server.stop()`

- `ScreepsServer` (`src/screepsServer.ts`) — Forks engine/storage child processes, manages connections, exposes `tick()` to advance game state one step at a time.
- `World` (`src/world.ts`) — Manages rooms, terrain, room objects, and bots. Provides `stubWorld()` for quick setup using prebuilt data from `assets/rooms.json`.
- `User` (`src/user.ts`) — Represents a player bot. Subscribes to console output and notifications via EventEmitter. Provides async getters for memory, CPU, GCL, and segments.
- `TerrainMatrix` (`src/terrainMatrix.ts`) — 50×50 grid of plain/wall/swamp values that serializes to a 2500-char string for storage.

The `assets/` directory contains bootstrap JSON (db.json, rooms.json, mods.json) copied into the server directory on `server.connect()`.

## Key Conventions

- **TypeScript strict mode** with CommonJS output targeting ES2018.
- **Async/await everywhere** — all server/world/user operations return Promises.
- **Private fields use `_` prefix** (e.g., `_id`, `_username`, `_server`), exposed via getters.
- **Lodash** is used pervasively: `_.map`, `_.find`, `_.each`, `_.defaults`, etc. Import as `import * as _ from 'lodash'`.
- **Database access** uses MongoDB-like syntax via `this.server.common.storage.db['collection.name']` with `find()`, `findOne()`, `insert()`, `update()`.
- **Tests use Mocha TDD UI** (`suite`/`test` instead of `describe`/`it`) with Node.js `assert`. Each test creates its own `ScreepsServer` instance, runs ticks, and calls `server.stop()` in cleanup. Tests use `stdHooks.hookWrite()` from `utils/stdhooks.js` to suppress engine console noise.
