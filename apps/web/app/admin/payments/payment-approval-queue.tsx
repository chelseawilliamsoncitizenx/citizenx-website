"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckIcon, FeatureIcon } from "../../../components/icons";
import { keys, readSandbox, sandboxAdmins, seedSandboxAssignment, type SandboxAssignment, writeSandbox } from "../../../lib/sandbox-store";

function isPaymentPending(assignment: SandboxAssignment) {
  return assignment.status === "completion_submitted" || assignment.status === "completed";
}

export function PaymentApprovalQueue() {
  const [assignments, setAssignments] = useState<SandboxAssignment[]>([]);
  const [reviewer, setReviewer] = useState<string>(sandboxAdmins[0].name);
  const [decisionNote, setDecisionNote] = useState("");

  useEffect(() => setAssignments(readSandbox<SandboxAssignment[]>(keys.assignments, [seedSandboxAssignment])), []);

  function decide(id: string, status: "paid" | "evidence_requested") {
    const decidedAt = new Date().toISOString();
    const next = assignments.map((assignment): SandboxAssignment => {
      if (assignment.id !== id) return assignment;
      const { paymentReference: _existingReference, ...withoutReference } = assignment;
      const decision = {
        ...withoutReference,
        status,
        paymentApprovedBy: reviewer,
        paymentApprovedAt: decidedAt,
        paymentDecisionNote: decisionNote.trim() || (status === "paid" ? "Milestone evidence and invoice matched in the sandbox." : "More completion evidence requested.")
      };
      return status === "paid" ? { ...decision, paymentReference: `SBX-${Date.now().toString().slice(-8)}` } : decision;
    });
    setAssignments(next);
    writeSandbox(keys.assignments, next);
    setDecisionNote("");
  }

  function reset(id: string) {
    const next: SandboxAssignment[] = assignments.map((assignment) => {
      if (assignment.id !== id) return assignment;
      const { paymentApprovedBy: _approvedBy, paymentApprovedAt: _approvedAt, paymentReference: _reference, paymentDecisionNote: _note, ...rest } = assignment;
      return { ...rest, status: "completion_submitted" };
    });
    setAssignments(next);
    writeSandbox(keys.assignments, next);
  }

  const reviewable = assignments.filter((assignment) => assignment.status !== "assigned");
  const pending = assignments.filter(isPaymentPending);
  const reviewerEmail = sandboxAdmins.find((admin) => admin.name === reviewer)?.email;

  return (
    <div className="review-layout">
      <aside className="reviewer-panel"><div className="reviewer-icon" aria-hidden="true"><FeatureIcon name="account" /></div><p className="eyebrow">Payment approver</p><label htmlFor="payment-reviewer">Approving as</label><select id="payment-reviewer" value={reviewer} onChange={(event) => setReviewer(event.target.value)}>{sandboxAdmins.map((admin) => <option value={admin.name} key={admin.email}>{admin.name}</option>)}</select><a className="reviewer-email" href={`mailto:${reviewerEmail}`}>{reviewerEmail}</a><div className="field payment-note-field"><label htmlFor="payment-note">Decision note</label><textarea id="payment-note" rows={4} value={decisionNote} onChange={(event) => setDecisionNote(event.target.value)} placeholder="Add an approval note or explain what evidence is missing." /></div><p>This records a simulated decision only. It does not connect to a bank or payment provider.</p><Link className="text-link" href="/admin/">Back to admin control centre</Link></aside>
      <div>
        <div className="queue-heading"><h2>{pending.length} awaiting payment approval</h2><span className="sandbox-pill">Sandbox queue</span></div>
        {reviewable.length ? <div className="review-stack">{reviewable.map((assignment) => <article className="review-card payment-review-card" key={assignment.id}><div className="review-card-head"><div><span className={`status-label status-${assignment.status}`}>{assignment.status === "completion_submitted" || assignment.status === "completed" ? "payment review" : assignment.status.replaceAll("_", " ")}</span><h2>{assignment.supplierName}</h2><p>{assignment.campaignTitle ?? "Sandbox campaign"} · {assignment.milestone}</p></div><strong>R{assignment.amountRand.toLocaleString("en-ZA")}</strong></div><dl className="payment-facts"><div><dt>Invoice reference</dt><dd>{assignment.invoiceReference ?? "Not supplied"}</dd></div><div><dt>Completion evidence</dt><dd>{assignment.evidenceNote ?? "Evidence declared in sandbox"}</dd></div></dl><div className="review-checks"><span><CheckIcon /> Campaign milestone identified</span><span><CheckIcon /> Verified supplier assigned</span><span><CheckIcon /> Completion evidence submitted</span><span><CheckIcon /> Invoice amount matches job value</span></div>{isPaymentPending(assignment) ? <div className="review-actions"><button className="button button-primary" type="button" onClick={() => decide(assignment.id, "paid")}>Approve sandbox payment</button><button className="button button-secondary" type="button" disabled={decisionNote.trim().length < 10} onClick={() => decide(assignment.id, "evidence_requested")}>Request more evidence</button></div> : <div className="decision-note"><strong>{assignment.status === "paid" || assignment.status === "reviewed" ? "Payment released" : "Evidence requested"}</strong><span>Decision recorded by {assignment.paymentApprovedBy}. {assignment.paymentReference ? `Reference ${assignment.paymentReference}.` : null}</span>{assignment.paymentDecisionNote ? <span>{assignment.paymentDecisionNote}</span> : null}<button type="button" className="text-button" onClick={() => reset(assignment.id)}>Reset decision</button></div>}</article>)}</div> : <div className="empty-state"><h2>No supplier payments are ready.</h2><p>A campaign creator must assign a verified supplier and submit completion evidence first.</p><Link className="button button-primary" href="/suppliers/">Open supplier workflow</Link></div>}
      </div>
    </div>
  );
}
