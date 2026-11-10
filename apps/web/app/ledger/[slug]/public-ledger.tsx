"use client";

import { formatZar, type Campaign, type PublicLedgerEvent } from "@citizenx/domain";
import Link from "next/link";
import { type KeyboardEvent, useEffect, useMemo, useState } from "react";
import { CheckIcon, ShieldIcon } from "../../../components/icons";
import { readSandboxDonations, type SandboxDonation } from "../../../lib/donations";

type AuditView = "income" | "expenses";
type AuditStatus = "all" | "settled" | "aggregate" | "paid";
type AuditDateRange = "all" | "7" | "30" | "90";

const pageSize = 8;

function csvCell(value: string | number): string {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export function PublicLedger({ campaign, seedEvents }: { campaign: Campaign; seedEvents: PublicLedgerEvent[] }) {
  const [sandboxDonations, setSandboxDonations] = useState<SandboxDonation[]>([]);
  const [activeView, setActiveView] = useState<AuditView>("income");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AuditStatus>("all");
  const [dateRange, setDateRange] = useState<AuditDateRange>("all");
  const [page, setPage] = useState(1);

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

  useEffect(() => {
    const syncViewFromUrl = () => {
      const requested = new URL(window.location.href).searchParams.get("view");
      setActiveView(requested === "expenses" ? "expenses" : "income");
      setStatus("all");
    };
    syncViewFromUrl();
    window.addEventListener("popstate", syncViewFromUrl);
    return () => window.removeEventListener("popstate", syncViewFromUrl);
  }, []);

  useEffect(() => setPage(1), [activeView, search, status, dateRange]);

  const incomeEntries = useMemo(() => {
    const sandbox: PublicLedgerEvent[] = sandboxDonations.map((donation) => {
      const tipDetail = donation.tipCents ? ` · ${donation.tipPercent > 0 ? `${donation.tipPercent}% (${formatZar(donation.tipCents)})` : formatZar(donation.tipCents)} platform tip recorded separately` : "";
      return {
        id: donation.id,
        campaignSlug: donation.campaignSlug,
        occurredAt: donation.occurredAt,
        label: donation.visibility === "anonymous" ? "Anonymous supporter" : donation.fullName,
        detail: `${donation.message || `Sandbox ${donation.method === "card" ? "card" : "instant EFT"} contribution`}${tipDetail}`,
        amountCents: donation.amountCents,
        kind: "in",
        verified: true,
        reference: `CX-SBX-${donation.id.slice(0, 8).toUpperCase()}`,
        recordType: "individual",
        status: "settled",
        paymentMethod: donation.method === "card" ? "Card" : "Instant EFT"
      };
    });
    return [...sandbox, ...seedEvents.filter((event) => event.kind === "in")].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  }, [sandboxDonations, seedEvents]);

  const expenseEntries = useMemo(() => seedEvents.filter((event) => event.kind === "out").sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)), [seedEvents]);
  const protectedEntries = useMemo(() => seedEvents.filter((event) => event.kind === "held").sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)), [seedEvents]);
  const sandboxIncome = sandboxDonations.reduce((sum, item) => sum + item.amountCents, 0);
  const totalIncome = campaign.raisedCents + sandboxIncome;
  const totalExpenses = expenseEntries.reduce((sum, event) => sum + event.amountCents, 0);
  const protectedBalance = totalIncome - totalExpenses;
  const allocatedNotPaid = protectedEntries.reduce((sum, entry) => sum + entry.amountCents, 0);
  const unresolvedVariance = totalIncome - totalExpenses - protectedBalance;
  const campaignReference = campaign.slug === "ward-12-clinic-water-tank" ? "CX-CAM-W12-001" : `CX-CAM-${campaign.slug.replaceAll("-", "").slice(0, 8).toUpperCase()}`;
  const dateFormat = new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "short", year: "numeric" });

  const sourceEntries = activeView === "income" ? incomeEntries : expenseEntries;
  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();
    const cutoff = dateRange === "all" ? null : Date.now() - Number(dateRange) * 24 * 60 * 60 * 1000;
    return sourceEntries.filter((event) => {
      const searchable = [event.label, event.detail, event.reference, event.paymentMethod, event.milestone, event.invoiceReference, event.supplierVerification, event.approver, event.paymentReference].filter(Boolean).join(" ").toLowerCase();
      const matchesSearch = !query || searchable.includes(query);
      const matchesDate = cutoff === null || new Date(event.occurredAt).getTime() >= cutoff;
      const matchesStatus = status === "all" || (status === "aggregate" ? event.recordType === "aggregate" : event.status === status);
      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [sourceEntries, search, status, dateRange]);

  const pageCount = Math.max(1, Math.ceil(filteredEntries.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedEntries = filteredEntries.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function changeView(nextView: AuditView) {
    setActiveView(nextView);
    setStatus("all");
    const url = new URL(window.location.href);
    url.searchParams.set("view", nextView);
    window.history.pushState({}, "", url);
  }

  function handleViewKey(event: KeyboardEvent<HTMLButtonElement>, nextView: AuditView) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    changeView(nextView);
    window.requestAnimationFrame(() => document.getElementById(`${nextView === "income" ? "income" : "expenses"}-tab`)?.focus());
  }

  function downloadAuditCsv() {
    const header = activeView === "income"
      ? ["Date", "Contributor", "Reference", "Record type", "Payment route", "Status", "Amount (ZAR)"]
      : ["Date", "Supplier", "Reference", "Milestone", "Invoice", "VAT treatment", "Supplier verification", "Procurement evidence", "Approver", "Conflict declaration", "Payment reference", "Status", "Amount (ZAR)"];
    const rows = filteredEntries.map((event) => activeView === "income"
      ? [dateFormat.format(new Date(event.occurredAt)), event.label, event.reference ?? "", event.recordType ?? "", event.paymentMethod ?? "", event.status ?? "", (event.amountCents / 100).toFixed(2)]
      : [dateFormat.format(new Date(event.occurredAt)), event.label, event.reference ?? "", event.milestone ?? "", event.invoiceReference ?? "", event.vatTreatment ?? "", event.supplierVerification ?? "", event.procurementMethod ?? "", event.approver ?? "", event.conflictDeclaration ?? "", event.paymentReference ?? "", event.status ?? "", (event.amountCents / 100).toFixed(2)]
    );
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${campaign.slug}-${activeView}-audit.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <section className="ledger-hero">
        <div className="shell">
          <Link className="back-link back-link-light" href={`/campaigns/${campaign.slug}/`}>← Back to campaign</Link>
          <div className="ledger-title-row">
            <div><p className="eyebrow eyebrow-light">Public payments audit</p><h1>{campaign.title}</h1><p>Follow settled income, supplier payments and protected commitments without mixing transaction types.</p></div>
            <span className="ledger-verified"><ShieldIcon /><span><strong>Audit reconciled</strong><small>Demo data · 10 Nov 2026</small></span></span>
          </div>
          <div className="ledger-totals ledger-totals-four" aria-label="Campaign financial summary">
            <div><span>Total income</span><strong>{formatZar(totalIncome)}</strong><small>{campaign.contributorCount + sandboxDonations.length} campaign contributions</small></div>
            <div><span>Total expenses</span><strong>{formatZar(totalExpenses)}</strong><small>{expenseEntries.length} verified supplier payments</small></div>
            <div><span>Protected balance</span><strong>{formatZar(protectedBalance)}</strong><small>Income less paid expenses</small></div>
            <div><span>Allocated, not paid</span><strong>{formatZar(allocatedNotPaid)}</strong><small>Held pending evidence</small></div>
          </div>
        </div>
      </section>

      <section className="section section-ivory">
        <div className="shell audit-layout">
          <div className="audit-main">
            <div className="audit-intro"><div><p className="eyebrow">Public-interest oversight</p><h2>Trace every rand with the right context.</h2><p>The public view protects donor privacy while exposing the references, evidence, decisions and reconciliation information needed to scrutinise campaign funds.</p></div><span className="sandbox-pill">QA demo records</span></div>

            <dl className="audit-context-grid">
              <div><dt>Campaign reference</dt><dd>{campaignReference}</dd></div>
              <div><dt>Reporting period</dt><dd>1 Oct–10 Nov 2026</dd></div>
              <div><dt>Last reconciled</dt><dd>10 Nov 2026 · 14:00 SAST</dd></div>
              <div><dt>Refunds</dt><dd>{formatZar(0)}</dd></div>
              <div><dt>Unresolved variance</dt><dd>{formatZar(unresolvedVariance)}</dd></div>
            </dl>

            <div className="audit-view-tabs" role="tablist" aria-label="Choose audit trail">
              <button id="income-tab" type="button" role="tab" tabIndex={activeView === "income" ? 0 : -1} aria-selected={activeView === "income"} aria-controls="audit-records-panel" className={activeView === "income" ? "active" : ""} onClick={() => changeView("income")} onKeyDown={(event) => handleViewKey(event, event.key === "End" || event.key === "ArrowRight" ? "expenses" : "income")}><span aria-hidden="true">↓</span><strong>Income audit trail</strong><small>{incomeEntries.length} visible records</small></button>
              <button id="expenses-tab" type="button" role="tab" tabIndex={activeView === "expenses" ? 0 : -1} aria-selected={activeView === "expenses"} aria-controls="audit-records-panel" className={activeView === "expenses" ? "active" : ""} onClick={() => changeView("expenses")} onKeyDown={(event) => handleViewKey(event, event.key === "Home" || event.key === "ArrowLeft" ? "income" : "expenses")}><span aria-hidden="true">↑</span><strong>Expense audit trail</strong><small>{expenseEntries.length} supplier payments</small></button>
            </div>

            <section id="audit-records-panel" className={`audit-panel ${activeView === "income" ? "audit-panel-income" : "audit-panel-expense"}`} role="tabpanel" aria-labelledby={activeView === "income" ? "income-tab" : "expenses-tab"}>
              <div className="audit-panel-head"><div><span className="audit-direction" aria-hidden="true">{activeView === "income" ? "↓" : "↑"}</span><div><p className="eyebrow">{activeView === "income" ? "Income audit" : "Expense audit"}</p><h2>{activeView === "income" ? "Where campaign money came from" : "Where campaign money went"}</h2></div></div><strong>{formatZar(activeView === "income" ? totalIncome : totalExpenses)}</strong></div>

              <div className="audit-filters" aria-label={`${activeView} audit filters`}>
                <div className="field"><label htmlFor="audit-search">Search records</label><input id="audit-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={activeView === "income" ? "Name or reference" : "Supplier, invoice or milestone"} /></div>
                <div className="field"><label htmlFor="audit-status">Status</label><select id="audit-status" value={status} onChange={(event) => setStatus(event.target.value as AuditStatus)}><option value="all">All statuses</option>{activeView === "income" ? <><option value="settled">Settled</option><option value="aggregate">Aggregated settlements</option></> : <option value="paid">Paid</option>}</select></div>
                <div className="field"><label htmlFor="audit-date">Date</label><select id="audit-date" value={dateRange} onChange={(event) => setDateRange(event.target.value as AuditDateRange)}><option value="all">All dates</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></div>
                <button className="button button-secondary audit-export" type="button" onClick={downloadAuditCsv}>Download CSV</button>
              </div>

              <p className="audit-result-count" aria-live="polite">Showing {pagedEntries.length} of {filteredEntries.length} matching records</p>

              {activeView === "income" ? (
                <div className="ledger-table" role="region" aria-label="Campaign income audit" tabIndex={0}>
                  <table><thead><tr><th scope="col">Date</th><th scope="col">Contributor</th><th scope="col">Reference &amp; route</th><th scope="col">Status</th><th scope="col">Income</th></tr></thead><tbody>{pagedEntries.length ? pagedEntries.map((event) => <tr key={event.id}><td>{dateFormat.format(new Date(event.occurredAt))}</td><td><strong>{event.label}</strong><small>{event.detail}</small></td><td><strong>{event.reference ?? "Recorded contribution"}</strong><small>{event.paymentMethod ?? "Settlement route recorded"}</small></td><td><span className="ledger-status status-in"><CheckIcon size={14} /> {event.recordType === "aggregate" ? "Settled aggregate" : "Settled"}</span></td><td className="amount-in">+{formatZar(event.amountCents)}</td></tr>) : <tr><td colSpan={5}>No income records match these filters.</td></tr>}</tbody></table>
                </div>
              ) : (
                <div className="ledger-table expense-ledger-table" role="region" aria-label="Campaign expense audit" tabIndex={0}>
                  <table><thead><tr><th scope="col">Date</th><th scope="col">Supplier</th><th scope="col">Audit evidence</th><th scope="col">Approval &amp; payment</th><th scope="col">Expense</th></tr></thead><tbody>{pagedEntries.length ? pagedEntries.map((event) => <tr key={event.id}><td>{dateFormat.format(new Date(event.occurredAt))}</td><td><strong>{event.label}</strong><small>{event.supplierVerification ?? "CitizenX verified supplier"}</small></td><td><strong>{event.milestone ?? event.detail}</strong><dl className="audit-record-meta"><div><dt>Invoice</dt><dd>{event.invoiceReference ?? "Recorded"}</dd></div><div><dt>VAT</dt><dd>{event.vatTreatment ?? "Not applicable"}</dd></div><div><dt>Procurement</dt><dd>{event.procurementMethod ?? "Evidence reviewed"}</dd></div></dl>{event.evidenceHref ? <Link className="audit-evidence-link" href={event.evidenceHref}>{event.evidenceLabel ?? "View evidence"}</Link> : null}</td><td><dl className="audit-record-meta"><div><dt>Approver</dt><dd>{event.approver ?? "Admin approved"}</dd></div><div><dt>Conflict check</dt><dd>{event.conflictDeclaration ?? "Recorded"}</dd></div><div><dt>Payment ref</dt><dd>{event.paymentReference ?? event.reference ?? "Recorded"}</dd></div></dl><span className="ledger-status status-out"><CheckIcon size={14} /> Paid</span></td><td className="amount-out">−{formatZar(event.amountCents)}</td></tr>) : <tr><td colSpan={5}>No supplier expenses match these filters.</td></tr>}</tbody></table>
                </div>
              )}

              {pageCount > 1 ? <nav className="audit-pagination" aria-label={`${activeView} audit pages`}><button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button><span>Page {currentPage} of {pageCount}</span><button type="button" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>Next</button></nav> : null}
            </section>

            {activeView === "expenses" ? <section className="protected-allocation-panel" aria-labelledby="protected-title"><div><p className="eyebrow">Protected commitments</p><h2 id="protected-title">Allocated, but not yet paid</h2><p>These amounts remain inside the protected campaign balance until evidence and an admin payment decision are complete.</p></div><ul>{protectedEntries.map((event) => <li key={event.id}><span><strong>{event.label}</strong><small>{event.reference} · {event.detail}</small>{event.evidenceHref ? <Link className="audit-evidence-link" href={event.evidenceHref}>{event.evidenceLabel ?? "Review evidence"}</Link> : null}</span><b>{formatZar(event.amountCents)}</b></li>)}</ul></section> : null}
          </div>

          <aside className="ledger-explainer">
            <p className="eyebrow">Oversight guide</p><h2>{activeView === "income" ? "What to verify in income" : "What to verify in spending"}</h2>
            {activeView === "income" ? <><p>Check the funding source, transaction reference, settlement route and whether a public identity has been withheld.</p><ul><li><CheckIcon /> Individual and aggregate records are labelled</li><li><CheckIcon /> Platform tips never increase campaign income</li><li><CheckIcon /> Public anonymity does not expose private identity data</li><li><CheckIcon /> Refunds and variances remain visible in the summary</li></ul></> : <><p>Check the supplier, milestone, invoice, VAT treatment, procurement evidence, approver and conflict declaration before accepting a payment as accounted for.</p><ul><li><CheckIcon /> Supplier verification is recorded</li><li><CheckIcon /> Invoice and milestone evidence are linked</li><li><CheckIcon /> Approval and payment references are separated</li><li><CheckIcon /> Protected commitments are not reported as paid expenses</li></ul></>}
            <div className="reconciliation-equation"><span>Income</span><b>{formatZar(totalIncome)}</b><span>Less expenses</span><b>−{formatZar(totalExpenses)}</b><strong>Protected balance</strong><strong>{formatZar(protectedBalance)}</strong></div>
            <p className="audit-boundary"><strong>Public-interest record, not statutory certification.</strong><br />CSD, VAT and procurement fields are demo oversight references. CitizenX does not claim PFMA, MFMA or government procurement compliance.</p>
          </aside>
        </div>
      </section>
    </>
  );
}
