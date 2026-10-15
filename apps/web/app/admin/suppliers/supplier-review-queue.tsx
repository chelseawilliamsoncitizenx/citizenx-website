"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckIcon, FeatureIcon } from "../../../components/icons";
import { keys, readSandbox, seedSupplierApplication, type SandboxSupplierApplication, writeSandbox } from "../../../lib/sandbox-store";

export function SupplierReviewQueue() {
  const [applications, setApplications] = useState<SandboxSupplierApplication[]>([]);
  const [reviewer, setReviewer] = useState("Patrick");

  useEffect(() => setApplications(readSandbox<SandboxSupplierApplication[]>(keys.supplierApplications, [seedSupplierApplication])), []);

  function decide(id: string, status: "approved" | "changes_requested") {
    const next = applications.map((application) => application.id === id ? { ...application, status, reviewer } : application);
    setApplications(next);
    writeSandbox(keys.supplierApplications, next);
  }

  function reset(id: string) {
    const next: SandboxSupplierApplication[] = applications.map((application) => {
      if (application.id !== id) return application;
      const { reviewer: _reviewer, ...rest } = application;
      return { ...rest, status: "under_verification" };
    });
    setApplications(next);
    writeSandbox(keys.supplierApplications, next);
  }

  const pending = applications.filter((application) => application.status === "under_verification");

  return (
    <div className="review-layout">
      <aside className="reviewer-panel"><div className="reviewer-icon" aria-hidden="true"><FeatureIcon name="shield" /></div><p className="eyebrow">Decision maker</p><label htmlFor="supplier-reviewer">Reviewing as</label><select id="supplier-reviewer" value={reviewer} onChange={(event) => setReviewer(event.target.value)}><option>Patrick</option><option>Lindo</option><option>Thato</option></select><p>One founding-team approval is sufficient for this sandbox workflow.</p><Link className="text-link" href="/admin/review/">Switch to campaign approvals</Link></aside>
      <div>
        <div className="queue-heading"><h2>{pending.length} awaiting verification</h2><span className="sandbox-pill">Sandbox queue</span></div>
        {applications.length ? <div className="review-stack">{applications.map((application) => <article className="review-card supplier-review-card" key={application.id}><div className="review-card-head"><div><span className={`status-label status-${application.status}`}>{application.status.replaceAll("_", " ")}</span><h2>{application.businessName}</h2><p>{application.location} · {application.category}</p></div><span className="supplier-queue-icon" aria-hidden="true"><FeatureIcon name="supplier" size={27} /></span></div><dl className="supplier-application-facts"><div><dt>Registration</dt><dd>{application.registrationNumber}</dd></div><div><dt>Service area</dt><dd>{application.serviceArea}</dd></div><div><dt>Authorised contact</dt><dd>{application.contactName}</dd></div></dl><div className="review-checks"><span><CheckIcon /> Registration record supplied</span><span><CheckIcon /> Authorised contact declared</span><span><CheckIcon /> Service evidence simulated</span><span><CheckIcon /> Payout ownership simulated</span></div>{application.status === "under_verification" ? <div className="review-actions"><button className="button button-primary" type="button" onClick={() => decide(application.id, "approved")}>Approve supplier</button><button className="button button-secondary" type="button" onClick={() => decide(application.id, "changes_requested")}>Request changes</button></div> : <p className="decision-note">Decision recorded by {application.reviewer}. <button type="button" className="text-button" onClick={() => reset(application.id)}>Reset decision</button></p>}</article>)}</div> : <div className="empty-state"><h2>No applications yet.</h2><p>Register a sandbox supplier to populate this queue.</p><Link className="button button-primary" href="/suppliers/register/">Register a supplier</Link></div>}
      </div>
    </div>
  );
}
