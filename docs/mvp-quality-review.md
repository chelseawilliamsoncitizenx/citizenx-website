# CitizenX MVP quality review

Reviewed: 11 November 2026

## What this pass improved

- Replaced abstract campaign art with six original, descriptive South African civic photographs.
- Expanded the campaign mix to include flood resilience, accessible public participation and environmental restoration.
- Renamed the public discovery experience to “Find a campaign” and added search, category and sort controls.
- Added a visible Home route and Start a campaign action to the primary navigation, plus a keyboard-accessible mobile menu.
- Added supplier rating thresholds and preserved the separation between sponsored visibility, verification and organic trust signals.
- Added focus management to multi-step donation, campaign creation and supplier promotion flows.
- Added an accessibility statement and a direct way to report barriers.
- Corrected font-variable scope so Bricolage Grotesque and Inter now render reliably instead of falling back to a compressed serif face.
- Rebuilt the About experience around CitizenX's current public story: the trust problem, the accountable funding model, operating principles, why now and ways to participate.
- Added a compact icon and geometric accent system derived from the public CitizenX brand language.
- Moved essential journeys into the main header and added keyboard-accessible secondary navigation.
- Made the header and sandbox role-aware, with distinct Citizen, Campaign Creator, Supplier and Admin tools.
- Split Admin work into campaign and supplier approval queues, each with sandbox decisions and a founding-team reviewer trail.
- Added an Admin control centre with the four authorised administrators: Patrick Schofield, Chelsea Williamson, Lindo Mathenjwa and Thatoyaona Harris.
- Corrected the supplier workflow so campaign creators submit completion evidence and an Admin separately approves or declines the sandbox payment before a verified review unlocks.
- Added a dedicated supplier-payment queue with campaign, milestone, evidence, invoice, approver, decision note and payment-reference context.
- Reworked campaign detail pages into a continuous contribution flow with story, milestones, campaigner updates, supporter messages and trust controls visible in one place.
- Added dated campaigner progress updates with photographs, descriptive alternatives and a browser-local Campaign Creator publishing tool.
- Replaced supporter initials with full-name or anonymous display choices and added optional public messages of support.
- Moved contribution visibility ahead of legal-name collection, preserving the distinction between a private legal name and an anonymous public contribution.
- Added an accessible 0–20% tip slider plus an “Or enter another amount” field; a custom rand amount overrides the slider and remains separate from campaign income.
- Split the public payments audit into deep-linked Income audit trail and Expense audit trail views, with a visible reconciliation equation and protected-but-unpaid allocations.
- Added scalable ledger search, status and date filters, pagination and CSV export.
- Replaced the income demo's lump-sum presentation with deterministic individual contribution records that reconcile exactly to every campaign total.
- Added public-interest expense evidence including invoice and VAT treatment, supplier verification, procurement method, approver, conflict declaration, payment reference and supporting evidence links.
- Removed empty supporter-message placeholders so contributions without a public message show only the supporter and amount.
- Relabelled the experience as QA while retaining demo-only data and clear warnings that no real payment or identity provider is contacted.

## Accessibility verification

The implementation targets WCAG 2.2 Level AA. Axe-core 4.13.0 was run with the `wcag2a`, `wcag2aa`, `wcag21aa` and `wcag22aa` tags against 17 representative routes. The six admin and supplier routes were rerun after the payment-control work:

- Home
- Find a campaign
- Campaign detail
- Contribution flow
- Public ledger
- Sandbox hub
- Campaign creator
- Admin review
- Supplier approval
- Admin control centre
- Supplier payment approval
- Verified suppliers
- Supplier registration
- Supplier promotion
- Accessibility statement
- About CitizenX
- How CitizenX works

The final November QA pass reran axe-core 4.13.0 against Campaign detail, Contribution flow, Income audit trail and Expense audit trail after the contribution and audit changes. Final result: zero automated violations across all four updated views, with the earlier 17-route result retained for the wider experience.

The 11 November launch pass used axe-core 4.14.0 against Home, Founding network contact, Campaign detail, Contribution flow, both ledger audit views, Verified suppliers and Supplier detail. One duplicate `main` landmark was found on Supplier detail, corrected, rebuilt and rerun. Final result: zero automated violations on all eight representative launch routes.

Manual checks covered visible keyboard focus, skip navigation, labelled controls, meaningful image alternatives, step-change focus, landmark and heading order, 390px reflow without page-level horizontal overflow, touch-target sizing, reduced-motion support and colour-token contrast. The November pass also exercised audit tabs and deep links, full-audit CSV export, an anonymous contribution without a support message, percentage and custom-rand tip calculation, supplier rating filters, creator-only supplier assignment and the complete browser-local supplier workflow from enquiry through quote, invoice, completion proof, mandatory campaign update, review and Admin payment approval.

Automated testing cannot establish full conformance on its own. Before a public beta, CitizenX should also complete assistive-technology testing with VoiceOver, NVDA and TalkBack users, browser and zoom-matrix testing, and an independent audit of the production identity, payment and document-upload journeys.

## Critical product assessment

The MVP now tells a coherent story from discovery to contribution, campaign creation, founding-team approval, supplier selection, milestone completion, admin-controlled payment, review and public ledger. Its strongest differentiator is not crowdfunding alone; it is controlled disbursement with visible evidence and supplier accountability.

The largest remaining risks are outside the static pilot:

1. Browser-local state is useful for demos but cannot support shared review queues, durable records or multi-user collaboration.
2. Verification, payments and protected balances are simulated. Production providers, failure states and reconciliation rules need end-to-end design.
3. Supplier approval, payment exceptions and review moderation need auditable policies, appeals and conflict-of-interest controls.
4. Campaign eligibility needs explicit rules for political neutrality, public-interest claims, prohibited content and evidence quality.
5. The public ledger needs a privacy model covering redaction, retention, corrections and POPIA responsibilities.
6. Sponsored suppliers need frequency limits and ranking rules so paid placement never weakens trust in the directory.

These are the recommended gates for moving from a strong interactive pilot to a production MVP.

## Recommended production admin controls

The pilot now makes campaign approval, supplier verification and evidence-backed payment approval usable. Before real transactions, the admin system should also include:

1. Role-based access, least privilege and two-person approval for high-risk payments.
2. Payment holds, failed-payment recovery, disputes, refunds and escalation ownership.
3. Provider reconciliation, immutable audit history and exportable finance reports.
4. Campaign, advert and review moderation with documented appeals and conflict declarations.
5. Privacy redaction, data-subject requests and retention controls aligned to CitizenX's POPIA responsibilities.
6. Sponsored-placement approval, frequency limits and clear separation from supplier verification and organic ranking.
