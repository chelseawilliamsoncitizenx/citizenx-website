# Architecture decision record: pilot foundation

## Decision

CitizenX starts as a TypeScript monorepo with a Next.js citizen experience, a NestJS domain API and shared framework-neutral domain rules. The private review build statically exports the frontend and uses browser-local sandbox transactions; production providers will be connected through the API.

## Boundaries

| Area | Pilot implementation | Production direction |
| --- | --- | --- |
| Web | Next.js App Router and static export | Server-rendered public campaign pages behind `app.citizenx.fund` |
| API | NestJS health and payment boundary | Modular identity, campaign, ledger, payment, compliance and admin services |
| Data | Typed fixtures and browser-local sandbox records | PostgreSQL in `af-south-1`, migrations and encrypted backups |
| Ledger | Balanced integer-cent domain transactions | ACID double-entry tables with immutable entries and hash chaining |
| Authentication | No identity data in the pilot | OTP-first identity with scoped roles |
| Payments | Replaceable sandbox gateway | PSP abstraction for Paystack/Peach/Ozow and controlled payouts |
| Verification | Fixed sandbox success state | KYD/KYB, PEP and sanctions providers behind adapters |
| Hosting | Private Sites review deployment | AWS `af-south-1`; marketing remains at `citizenx.fund` |

## Money invariants

1. Amounts are integer minor units plus an ISO-4217 currency.
2. Every value-moving transaction has equal debits and credits.
3. Campaign balances are derived from ledger entries rather than mutable balance fields.
4. Public ledger records omit private identity and payment data.
5. Supplier disbursements require a verified supplier, an approved invoice and milestone evidence.

## Accessibility baseline

The pilot includes semantic landmarks, a skip link, keyboard-visible focus, labelled controls, accessible progress indicators, status announcements, responsive layouts and reduced-motion support. Automated and manual audits remain a release gate before public use.

