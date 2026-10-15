"use client";

import { formatZar, type Campaign, type PublicLedgerEvent } from "@citizenx/domain";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckIcon, ShieldIcon } from "../../../components/icons";

type StoredDonation = { id: string; campaignSlug: string; amountCents: number; occurredAt: string; visibility: "initials" | "anonymous"; method: "card" | "instant_eft" };

export function PublicLedger({ campaign, seedEvents }: { campaign: Campaign; seedEvents: PublicLedgerEvent[] }) {
  const [sandboxDonations, setSandboxDonations] = useState<StoredDonation[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("citizenx:sandbox-donations") ?? "[]") as StoredDonation[];
    setSandboxDonations(stored.filter((donation) => donation.campaignSlug === campaign.slug));
  }, [campaign.slug]);

  const sandboxTotal = sandboxDonations.reduce((sum, item) => sum + item.amountCents, 0);
  const supplierPayments = seedEvents.filter((event) => event.kind === "out").reduce((sum, event) => sum + event.amountCents, 0);
  const protectedBalance = campaign.raisedCents + sandboxTotal - supplierPayments;
  const entries = useMemo(() => {
    const sandbox: PublicLedgerEvent[] = sandboxDonations.map((donation) => ({
      id: donation.id,
      campaignSlug: donation.campaignSlug,
      occurredAt: donation.occurredAt,
      label: donation.visibility === "anonymous" ? "Anonymous contribution" : "G.W. contribution",
      detail: `Sandbox ${donation.method === "card" ? "card" : "instant EFT"} · browser-only record`,
      amountCents: donation.amountCents,
      kind: "in",
      verified: true
    }));
    return [...sandbox, ...seedEvents].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  }, [sandboxDonations, seedEvents]);

  const dateFormat = new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "short", year: "numeric" });

  return (
    <>
      <section className="ledger-hero">
        <div className="shell">
          <Link className="back-link back-link-light" href={`/campaigns/${campaign.slug}/`}>← Back to campaign</Link>
          <div className="ledger-title-row">
            <div><p className="eyebrow eyebrow-light">Public ledger</p><h1>{campaign.title}</h1><p>A privacy-safe view of funds raised, protected and paid.</p></div>
            <span className="ledger-verified"><ShieldIcon /><span><strong>Ledger verified</strong><small>Last reconciled 15 Oct 2026</small></span></span>
          </div>
          <div className="ledger-totals">
            <div><span>Total raised</span><strong>{formatZar(campaign.raisedCents + sandboxTotal)}</strong><small>{campaign.contributorCount + sandboxDonations.length} contributions</small></div>
            <div><span>Paid to suppliers</span><strong>{formatZar(supplierPayments)}</strong><small>2 verified payments</small></div>
            <div><span>Protected balance</span><strong>{formatZar(protectedBalance)}</strong><small>Ring-fenced for milestones</small></div>
          </div>
        </div>
      </section>
      <section className="section section-ivory">
        <div className="shell ledger-layout">
          <div>
            <div className="section-heading compact"><div><p className="eyebrow">Transaction trail</p><h2>Every rand leaves a trail.</h2></div><span className="sandbox-pill">Includes sandbox records</span></div>
            <div className="ledger-table" role="region" aria-label="Public transaction ledger" tabIndex={0}>
              <table>
                <thead><tr><th scope="col">Date</th><th scope="col">Activity</th><th scope="col">Status</th><th scope="col">Amount</th></tr></thead>
                <tbody>
                  {entries.map((event) => (
                    <tr key={event.id}>
                      <td>{dateFormat.format(new Date(event.occurredAt))}</td>
                      <td><strong>{event.label}</strong><small>{event.detail}</small></td>
                      <td><span className={`ledger-status status-${event.kind}`}><CheckIcon size={14} /> {event.kind === "in" ? "Received" : event.kind === "out" ? "Paid" : "Protected"}</span></td>
                      <td className={event.kind === "out" ? "amount-out" : "amount-in"}>{event.kind === "out" ? "−" : event.kind === "in" ? "+" : ""}{formatZar(event.amountCents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <aside className="ledger-explainer">
            <h2>What this ledger shows</h2>
            <p>CitizenX publishes the movement of campaign funds without exposing donors&apos; private identity or payment details.</p>
            <ul><li><CheckIcon /> Contributions after settlement</li><li><CheckIcon /> Approved supplier invoices</li><li><CheckIcon /> Protected milestone allocations</li><li><CheckIcon /> Reconciliation status</li></ul>
            <p className="fine-print">Pilot data is fictional. Production entries will be backed by immutable, balanced ledger transactions and a tamper-evident hash chain.</p>
          </aside>
        </div>
      </section>
    </>
  );
}

