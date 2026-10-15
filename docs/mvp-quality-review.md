# CitizenX MVP quality review

Reviewed: 15 October 2026

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

## Accessibility verification

The implementation targets WCAG 2.2 Level AA. Axe-core 4.13.0 was run with the `wcag2a`, `wcag2aa`, `wcag21aa` and `wcag22aa` tags against 15 representative routes:

- Home
- Find a campaign
- Campaign detail
- Contribution flow
- Public ledger
- Sandbox hub
- Campaign creator
- Admin review
- Supplier approval
- Verified suppliers
- Supplier registration
- Supplier promotion
- Accessibility statement
- About CitizenX
- How CitizenX works

Final result: zero automated violations across the tested routes.

Manual checks covered visible keyboard focus, skip navigation, labelled controls, meaningful image alternatives, step-change focus, landmark and heading order, 390px reflow without horizontal overflow, touch-target sizing, reduced-motion support and colour-token contrast.

Automated testing cannot establish full conformance on its own. Before a public beta, CitizenX should also complete assistive-technology testing with VoiceOver, NVDA and TalkBack users, browser and zoom-matrix testing, and an independent audit of the production identity, payment and document-upload journeys.

## Critical product assessment

The MVP now tells a coherent story from discovery to contribution, campaign creation, founding-team approval, supplier selection, milestone completion, review and public ledger. Its strongest differentiator is not crowdfunding alone; it is controlled disbursement with visible evidence and supplier accountability.

The largest remaining risks are outside the static pilot:

1. Browser-local state is useful for demos but cannot support shared review queues, durable records or multi-user collaboration.
2. Verification, payments and protected balances are simulated. Production providers, failure states and reconciliation rules need end-to-end design.
3. Supplier approval and review moderation need auditable policies, appeals and conflict-of-interest controls.
4. Campaign eligibility needs explicit rules for political neutrality, public-interest claims, prohibited content and evidence quality.
5. The public ledger needs a privacy model covering redaction, retention, corrections and POPIA responsibilities.
6. Sponsored suppliers need frequency limits and ranking rules so paid placement never weakens trust in the directory.

These are the recommended gates for moving from a strong interactive pilot to a production MVP.
