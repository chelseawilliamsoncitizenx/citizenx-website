# CitizenX pilot plan

Target review date: **31 October 2026**

Decision group: **Patrick, Lindo and Thato**

## Review build now available

The review build demonstrates the citizen trust journey and the connected campaign marketplace: discover and fund a campaign, create and approve a campaign, register or assign a supplier, simulate completion and payment, publish an engagement-gated review, and buy a clearly labelled sandbox promotion.

## Remaining work to reach pilot readiness

1. Confirm visual and content direction with the founding team.
2. Add production-grade authentication and scoped roles.
3. Persist campaigns, users and ledger transactions in PostgreSQL.
4. Connect one sandbox pay-in provider and verify webhook idempotency.
5. Connect a sandbox identity/KYD provider.
6. Replace browser-local campaign, supplier, review and advertising records with server-side persistence and audit logs.
7. Complete threat modelling, reconciliation tests and WCAG 2.2 AA audit.
8. Obtain legal sign-off for entity routing, trust language, PPFA controls, advertising rules and s18A treatment before real-money use.

## Explicitly deferred

Production payouts, supplier bidding and quote comparison, recurring giving, multi-language content and regulatory export suites are outside this review slice.
