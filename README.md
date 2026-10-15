# CitizenX

CitizenX is independent digital infrastructure for transparent political and civic fundraising. This repository contains the pilot citizen journey targeted for founding-team review by **31 October 2026**.

## Current vertical slice

- Citizen home and campaign discovery
- Verified campaign detail and milestones
- Three-step sandbox contribution flow
- Privacy and source-of-funds choices
- Privacy-safe public campaign ledger
- Shared integer-cent money and ledger rules
- NestJS API boundary with a replaceable sandbox payment gateway

No real payments, identity checks or personal data are processed in this pilot.

## Stack

- `apps/web` — Next.js App Router, statically exported for the private review deployment
- `apps/api` — NestJS REST API boundary
- `packages/domain` — shared campaign, payment and double-entry ledger rules
- pnpm workspaces and strict TypeScript

## Run locally

```bash
pnpm install
pnpm dev
```

The web application runs on `http://localhost:3000`; the API runs on `http://localhost:4000/v1`.

## Verify

```bash
pnpm test
pnpm typecheck
pnpm build
```

## Product constraints

- Preserve the CitizenX identity used on [citizenx.fund](https://www.citizenx.fund/).
- Treat WCAG 2.2 AA as a release requirement, not a polish task.
- Store money as integer minor units and require balanced ledger transactions.
- Keep provider integrations behind interfaces so sandbox providers can be replaced without changing user journeys.
- Keep regulatory thresholds and beneficiary routing configurable pending legal sign-off.

See [docs/architecture.md](docs/architecture.md) and [docs/pilot-plan.md](docs/pilot-plan.md) for the implementation boundary and delivery plan.

