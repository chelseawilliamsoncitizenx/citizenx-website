"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FeatureIcon } from "../../components/icons";
import { keys, readSandbox, sandboxAdmins, seedSandboxAssignment, seedSandboxCampaign, seedSupplierApplication, type SandboxAssignment, type SandboxCampaign, type SandboxSupplierApplication } from "../../lib/sandbox-store";

type Activity = { label: string; detail: string };

export function AdminControlCentre() {
  const [summary, setSummary] = useState({ campaigns: 0, suppliers: 0, payments: 0, released: 0 });
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    const refresh = () => {
      const campaigns = readSandbox<SandboxCampaign[]>(keys.campaigns, [seedSandboxCampaign]);
      const suppliers = readSandbox<SandboxSupplierApplication[]>(keys.supplierApplications, [seedSupplierApplication]);
      const assignments = readSandbox<SandboxAssignment[]>(keys.assignments, [seedSandboxAssignment]);
      const paymentPending = (assignment: SandboxAssignment) => assignment.status === "completion_approved";

      setSummary({
        campaigns: campaigns.filter((campaign) => campaign.status === "under_review").length,
        suppliers: suppliers.filter((supplier) => supplier.status === "under_verification").length,
        payments: assignments.filter(paymentPending).length,
        released: assignments.filter((assignment) => assignment.status === "paid" || assignment.status === "reviewed").length
      });

      const nextActivity: Activity[] = [
        ...assignments.filter((assignment) => assignment.paymentApprovedBy).map((assignment) => ({ label: "Supplier payment", detail: `${assignment.paymentApprovedBy} released R${assignment.amountRand.toLocaleString("en-ZA")} to ${assignment.supplierName}.` })),
        ...campaigns.filter((campaign) => campaign.reviewer).map((campaign) => ({ label: "Campaign decision", detail: `${campaign.reviewer} marked ${campaign.title} ${campaign.status.replaceAll("_", " ")}.` })),
        ...suppliers.filter((supplier) => supplier.reviewer).map((supplier) => ({ label: "Supplier decision", detail: `${supplier.reviewer} marked ${supplier.businessName} ${supplier.status.replaceAll("_", " ")}.` }))
      ];
      setActivity(nextActivity.slice(0, 4));
    };

    refresh();
    window.addEventListener("citizenx-sandbox-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("citizenx-sandbox-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <div className="admin-control-centre">
      <div className="admin-summary" aria-label="Admin queue summary">
        <div><span>Campaign reviews</span><strong>{summary.campaigns}</strong><small>awaiting decision</small></div>
        <div><span>Supplier checks</span><strong>{summary.suppliers}</strong><small>awaiting verification</small></div>
        <div><span>Payment releases</span><strong>{summary.payments}</strong><small>awaiting approval</small></div>
        <div><span>Payments released</span><strong>{summary.released}</strong><small>in this browser</small></div>
      </div>

      <div className="admin-action-grid">
        <article><span className="admin-action-icon" aria-hidden="true"><FeatureIcon name="campaign" /></span><p className="eyebrow">Eligibility</p><h2>Campaign approvals</h2><p>Validate public-interest purpose, campaign evidence, milestone scope and budget balance.</p><Link className="button button-primary" href="/admin/review/">Open campaign queue</Link></article>
        <article><span className="admin-action-icon" aria-hidden="true"><FeatureIcon name="verify" /></span><p className="eyebrow">Verification</p><h2>Supplier approvals</h2><p>Check registration, authorised contacts, service evidence and simulated payout ownership.</p><Link className="button button-primary" href="/admin/suppliers/">Open supplier queue</Link></article>
        <article><span className="admin-action-icon" aria-hidden="true"><FeatureIcon name="account" /></span><p className="eyebrow">Controlled disbursement</p><h2>Supplier payments</h2><p>Match evidence and invoice details to an approved milestone before releasing a sandbox payment.</p><Link className="button button-primary" href="/admin/payments/">Open payment queue</Link></article>
      </div>

      <div className="admin-oversight-grid">
        <section className="admin-panel" aria-labelledby="admin-team-title">
          <p className="eyebrow">Authorised administrators</p>
          <h2 id="admin-team-title">CitizenX admin team</h2>
          <ul className="admin-team-list">{sandboxAdmins.map((admin) => <li key={admin.email}><span aria-hidden="true">{admin.name.split(" ").map((part) => part[0]).join("")}</span><div><strong>{admin.name}</strong><a href={`mailto:hello@citizenx.fund?subject=${encodeURIComponent(`For ${admin.name} · CitizenX admin enquiry`)}`}>{admin.email}</a></div></li>)}</ul>
        </section>

        <section className="admin-panel" aria-labelledby="audit-title">
          <p className="eyebrow">Browser-local audit trail</p>
          <h2 id="audit-title">Recent decisions</h2>
          {activity.length ? <ol className="admin-activity-list">{activity.map((item, index) => <li key={`${item.label}-${index}`}><strong>{item.label}</strong><span>{item.detail}</span></li>)}</ol> : <p className="admin-empty-copy">No admin decisions have been recorded in this browser yet.</p>}
        </section>
      </div>

      <section className="admin-control-map" aria-labelledby="control-map-title">
        <div><p className="eyebrow">MVP control map</p><h2 id="control-map-title">What administration needs beyond approvals.</h2><p>The pilot now demonstrates the three highest-value controls. These additional controls are the production gates CitizenX should design before handling real funds or identity data.</p></div>
        <div className="control-map-grid">
          <article><strong>Access and dual control</strong><span>Named roles, least-privilege access and two-person approval for high-risk payments.</span><b>Production gate</b></article>
          <article><strong>Holds, disputes and refunds</strong><span>Pause a payment, investigate exceptions, resolve disputes and record refund outcomes.</span><b>Production gate</b></article>
          <article><strong>Reconciliation and exports</strong><span>Match bank or payment-provider records to campaign ledgers and export an immutable audit log.</span><b>Production gate</b></article>
          <article><strong>Content and review moderation</strong><span>Handle misleading claims, conflicts of interest, supplier appeals and abusive reviews.</span><b>Production gate</b></article>
          <article><strong>Privacy and retention</strong><span>Redact public evidence, manage POPIA requests and apply documented retention schedules.</span><b>Production gate</b></article>
          <article><strong>Sponsored placement oversight</strong><span>Approve advert claims, cap frequency and keep paid ranking separate from verification.</span><b>Production gate</b></article>
        </div>
      </section>
    </div>
  );
}
