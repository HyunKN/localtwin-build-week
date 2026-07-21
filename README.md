# LocalTwin — Evidence-Based Neighborhood Storefront Explorer

LocalTwin helps prospective small-business owners explore a Seoul neighborhood and understand the evidence behind a storefront decision before choosing a location.

This project is submitted to **OpenAI Build Week** in the **Apps for your life** track.

## What it does

- Searches supported commercial areas, stores, addresses, and industries.
- Keeps the selected location and analysis context together on an interactive MapLibre map.
- Presents same-category competition, opening and closing signals, foot-traffic context, population context, and an explainable location score.
- Preserves period, unit, method, and source context alongside analysis results.

## Current scope

The public demo intentionally focuses on three Seoul commercial areas: **Yeonnam, Hongdae, and Hapjeong**. It is a working, neighborhood-scale vertical slice—not a claim of Seoul-wide coverage.

3DGS scene creation is **not part of this submission**. Some supporting scene code remains in the repository, but it is not enabled in the public deployment and is not a submitted or demonstrated feature.

## Live demo

- Product: https://localtwin-product.vercel.app
- API health: https://localtwin-api.onrender.com/health

For the English, recording-ready submission screen, open `/en` after running the web app (for example, `http://127.0.0.1:5173/en`). It uses the same checked-in market-analysis snapshot and intentionally excludes the 3DGS path.

The API may need a brief warm-up before the first request.

## Run locally

Requirements:

- Node.js `>=24.11.0 <25`
- pnpm `11.7.0`
- Python environment managed by `uv` for the API

```powershell
cd product
pnpm install --frozen-lockfile
Copy-Item .env.example .env
Copy-Item apps/web/.env.example apps/web/.env.local
pnpm dev
```

`product/.env` contains server-only settings. Do not commit real API keys, database URLs, or tokens. The default browser API URL is `http://127.0.0.1:8000`.

## Verify

```powershell
cd product
pnpm check
```

This runs web formatting, TypeScript checks, linting, tests, and build, plus API linting and tests.

## How Codex and GPT-5.6 were used

Codex with GPT-5.6 supported the implementation across React state and map components, FastAPI router and repository boundaries, SQLAlchemy/Alembic database work, importer validation, focused regression tests, deployment configuration, and documentation. The working style was deliberately small and verifiable: inspect the existing behavior, isolate one responsibility, run a focused check, then move to the next slice.

## Repository layout

```text
product/
  apps/web/     React + Vite + TypeScript + MapLibre interface
  apps/api/     FastAPI analysis, search, score, and scene APIs
  data/         Local data boundaries and generated-asset placeholders
  scripts/      Product data and operational helpers
```

## Data and privacy boundary

LocalTwin separates source snapshots, canonical validation data, runtime analysis data, and UI responses. It does not place server credentials in the browser bundle. Unverified user-capture and 3DGS scene-processing paths are excluded from this submission.

## License

MIT. See [LICENSE](LICENSE).
