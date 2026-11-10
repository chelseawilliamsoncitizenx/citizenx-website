"use client";

import { formatZar, type Campaign, type PublicLedgerEvent } from "@citizenx/domain";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckIcon, ShieldIcon } from "../../../components/icons";
import { readSandboxDonations, type SandboxDonation } from "../../../lib/donations";

export function PublicLedger({ campaign, seedEvents }: { campaign: Campaign; seedEvents: PublicLedgerEvent[] }) {
  const [sandboxDonations, setSandboxDonations] = useState<SandboxDonation[]>([]);

  useEffect(() => {
    const refresh = () => setSandboxDonations(readSandboxDonations().filter((donation) => donation.campaignSlug === campaign.slug));
    refresh();
    window.addEventListener("citizenx-donation-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("citizenx-donation-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [campaign.slug]);

  const incomeEntries = useMemo(() => {
    const sandbox: PublicLedgerEvent[] = sandboxDonations.map((donation) => ({
      id: donation.id,
      campaignSlug: donation.campaignSlug,
      occurredAt: donation.occurredAt,
      label: donation.visibility === "anonymous" ? "Anonymous supporter" : donation.fullName,
      detail: `${donation.message || `Sandbox ${donation.method === "card" ? "card" : "instant EFT"} contribution`}${donation.tipCents ? ` · ${formatZar(donation.tipCents)} platform tip recorded separately` : ""}`,
      amountCents: donation.amountCents,
      kind: "in",
      verified: true
    }));
    return [...sandbox, ...seedEvents.filter((event) => event.kind === "in")].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  }, [sandboxDonations, seedEvents]);

  const expenseEntries = useMemo(() => seedEvents.filter((event) => event.kind === "out").sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)), [seedEvents]);
  const protectedEntries = useMemo(() => seedEvents.filter((event) => event.kind === "held").sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)), [seedEvents]);
  const sandboxIncome = sandboxDonations.reduce((sum, item) => sum + item.amountCents, 0);
  const totalIncome = campaign.raisedCents + sandboxIncome;
  const totalExpenses = expenseEntries.reduce((sum, event) => sum + event.amountCents, 0);
  const protectedBalance = totalIncome - totalExpenses;
  const dateFormat = new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "short", year: "numeric" });

  return (
    <>
      <section className="ledger-hero">
        <div className="shell">
          <Link className="back-link back-link-light" href={`/campaigns/${campaign.slug}/`}>← Back to campaign</Link>
          <div className="ledger-title-row">
            <div><p className="eyebrow eyebrow-light">Payments audit</p><h1>{campaign.title}</h1><p>Income and expenses are separated so every source and payment can be reviewed clearly.</p></div>
            <span className="ledger-verified"><ShieldIcon /><span><strong>Audit reconciled</strong><small>Demo data · 10 Nov 2026</small></span></span>
          </div>
          <div className="ledger-totals ledger-totals-four">
            <div><span>Total income</span><strong>{formatZar(totalIncome)}</strong><small>{campaign.contributorCount + sandboxDonations.length} campaign contributions</small></div>
            <div><span>Total expenses</span><strong>{formatZar(totalExpenses)}</strong><small>{expenseEntries.length} verified supplier payments</small></div>
            <div><span>Protected balance</span><strong>{formatZar(protectedBalance)}</strong><small>Income less paid expenses</small></div>
            <div><span>Allocated, not paid</span><strong>{formatZar(protectedEntries.reduce((sum, entry) => sum + entry.amountCents, 0))}</strong><small>Held pending evidence</small></div>
          </div>
        </div>
      </section>

      <section className="section section-ivory">
        <div className="shell audit-layout">
          <div className="audit-main">
            <div className="audit-intro"><div><p className="eyebrow">Clear audit views</p><h2>Money in and money out.</h2><p>Campaign income never shares a table with supplier expenses. Platform tips are recorded separately and do not increase campaign income.</p></div><span className="sandbox-pill">Includes browser-only demo records</span></div>

            <section className="audit-panel audit-panel-income" aria-labelledby="income-title">
              <div className="audit-panel-head"><div><span className="audit-direction" aria-hidden="true">↓</span><div><p className="eyebrow">Income audit</p><h2 id="income-title">Where campaign money came from</h2></div></div><strong>{formatZar(totalIncome)}</strong></div>
              <div className="ledger-table" role="region" aria-label="Campaign income audit" tabIndex={0}>
                <table><thead><tr><th scope="col">Date</th><th scope="col">Source</th><th scope="col">Record</th><th scope="col">Income</th></tr></thead><tbody>{incomeEntries.map((event) => <tr key={event.id}><td>{dateFormat.format(new Date(event.occurredAt))}</td><td><strong>{event.label}</strong></td><td><small>{event.detail}</small><span className="ledger-status status-in"><CheckIcon size={14} /> Settled</span></td><td className="amount-in">+{formatZar(event.amountCents)}</td></tr>)}</tbody></table>
              </div>
            </section>

            <section className="audit-panel audit-panel-expense" aria-labelledby="expense-title">
              <div className="audit-panel-head"><div><span className="audit-direction" aria-hidden="true">↑</span><div><p className="eyebrow">Expense audit</p><h2 id="expense-title">Where campaign money went</h2></div></div><strong>{formatZar(totalExpenses)}</strong></div>
              <div className="ledger-table" role="region" aria-label="Campaign expense audit" tabIndex={0}>
                <table><thead><tr><th scope="col">Date</th><th scope="col">Payee</th><th scope="col">Evidence</th><th scope="col">Expense</th></tr></thead><tbody>{expenseEntries.length ? expenseEntries.map((event) => <tr key={event.id}><td>{dateFormat.format(new Date(event.occurredAt))}</td><td><strong>{event.label}</strong></td><td><small>{event.detail}</small><span className="ledger-status status-out"><CheckIcon size={14} /> Paid to verified supplier</span></td><td className="amount-out">−{formatZar(event.amountCents)}</td></tr>) : <tr><td colSpan={4}>No supplier expenses have been paid yet.</td></tr>}</tbody></table>
              </div>
            </section>

            <section className="protected-allocation-panel" aria-labelledby="protected-title"><div><p className="eyebrow">Protected allocations</p><h2 id="protected-title">Committed, but not yet paid</h2><p>These amounts remain inside the campaign balance until milestone evidence and an admin payment decision are complete.</p></div><ul>{protectedEntries.map((event) => <li key={event.id}><span><strong>{event.label}</strong><small>{event.detail}</small></span><b>{formatZar(event.amountCents)}</b></li>)}</ul></section>
          </div>

          <aside className="ledger-explainer">
            <h2>How to read this audit</h2>
            <p>The three views answer different questions without mixing transaction types.</p>
            <ul><li><CheckIcon /> Income shows settled contributions</li><li><CheckIcon /> Expenses show approved supplier payments</li><li><CheckIcon /> Protected allocations are not expenses</li><li><CheckIcon /> The balance reconciles income less expenses</li></ul>
            <div className="reconciliation-equation"><span>Income</span><b>{formatZar(totalIncome)}</b><span>Less expenses</span><b>−{formatZar(totalExpenses)}</b><strong>Protected balance</strong><strong>{formatZar(protectedBalance)}</strong></div>
            <p className="fine-print">Pilot data is fictional. Production entries require balanced ledger transactions, immutable decision history and provider reconciliation.</p>
          </aside>
        </div>
      </section>
    </>
  );
}
