"use client";

import type { Campaign } from "@citizenx/domain";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";
import { CheckIcon, FeatureIcon, StarIcon } from "../../components/icons";
import { createSandboxId, keys, readSandbox, roleLabels, seedSandboxAssignment, type SandboxAssignment, type SandboxCampaignUpdate, type SandboxNotification, type SandboxReview, type SandboxRole, writeSandbox } from "../../lib/sandbox-store";

const statusLabels: Record<SandboxAssignment["status"], string> = {
  enquiry_sent: "Enquiry sent", questions_sent: "Supplier questions", quote_submitted: "Quotation submitted", quote_accepted: "Quotation accepted", quote_declined: "Quotation declined", invoice_submitted: "Invoice submitted", work_in_progress: "Work in progress", completion_submitted: "Completion submitted", completion_approved: "Completion approved", evidence_requested: "More evidence requested", paid: "Payment released", reviewed: "Reviewed", completed: "Completed", assigned: "Assigned"
};

function readPhoto(file: File | undefined, onSuccess: (dataUrl: string) => void, onError: (message: string) => void) {
  onError("");
  if (!file) { onSuccess(""); return; }
  if (!file.type.startsWith("image/")) { onError("Choose a JPG, PNG or WebP image."); return; }
  if (file.size > 1_000_000) { onError("Choose an image smaller than 1 MB for this browser-only simulation."); return; }
  const reader = new FileReader();
  reader.onload = () => onSuccess(typeof reader.result === "string" ? reader.result : "");
  reader.onerror = () => onError("The photograph could not be read. Try another image.");
  reader.readAsDataURL(file);
}

export function EngagementWorkspace({ campaigns }: { campaigns: Campaign[] }) {
  const [role, setRole] = useState<SandboxRole>("citizen");
  const [assignments, setAssignments] = useState<SandboxAssignment[]>([]);
  const [notifications, setNotifications] = useState<SandboxNotification[]>([]);
  const [activeId, setActiveId] = useState("");
  const [messageText, setMessageText] = useState("");
  const [meetingNote, setMeetingNote] = useState("");
  const [quoteAmount, setQuoteAmount] = useState(25000);
  const [quoteTerms, setQuoteTerms] = useState("");
  const [decisionNote, setDecisionNote] = useState("");
  const [invoiceReference, setInvoiceReference] = useState("");
  const [invoiceNote, setInvoiceNote] = useState("");
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateBody, setUpdateBody] = useState("");
  const [updatePhoto, setUpdatePhoto] = useState("");
  const [updatePhotoAlt, setUpdatePhotoAlt] = useState("");
  const [completionNote, setCompletionNote] = useState("");
  const [completionPhoto, setCompletionPhoto] = useState("");
  const [completionPhotoAlt, setCompletionPhotoAlt] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  function refresh() {
    const nextAssignments = readSandbox<SandboxAssignment[]>(keys.assignments, [seedSandboxAssignment]);
    setRole(readSandbox<SandboxRole>(keys.role, "citizen"));
    setAssignments(nextAssignments);
    setNotifications(readSandbox<SandboxNotification[]>(keys.notifications, []));
    setActiveId((current) => current && nextAssignments.some((assignment) => assignment.id === current) ? current : nextAssignments[0]?.id ?? "");
  }

  useEffect(() => {
    refresh();
    window.addEventListener("citizenx-sandbox-change", refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener("citizenx-sandbox-change", refresh); window.removeEventListener("storage", refresh); };
  }, []);

  const assignment = assignments.find((item) => item.id === activeId);
  const roleNotifications = useMemo(() => notifications.filter((notification) => notification.role === role).slice(0, 8), [notifications, role]);
  const campaign = campaigns.find((item) => item.slug === assignment?.campaignSlug);

  function saveAssignment(id: string, patch: Partial<SandboxAssignment>) {
    const next = assignments.map((item) => item.id === id ? { ...item, ...patch } : item);
    setAssignments(next);
    writeSandbox(keys.assignments, next);
  }

  function notify(targetRole: SandboxNotification["role"], title: string, body: string, emailPreviewTo?: string) {
    const next: SandboxNotification[] = [{ id: createSandboxId("notification"), role: targetRole, title, body, createdAt: new Date().toISOString(), ...(emailPreviewTo ? { emailPreviewTo } : {}) }, ...notifications].slice(0, 40);
    setNotifications(next);
    writeSandbox(keys.notifications, next);
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!assignment || (role !== "campaign_creator" && role !== "supplier") || messageText.trim().length < 3) return;
    const nextMessage = { id: createSandboxId("message"), senderRole: role, senderName: role === "supplier" ? assignment.supplierName : campaign?.leader.name ?? "Campaign Creator", text: messageText.trim(), createdAt: new Date().toISOString() } as const;
    const nextStatus = role === "supplier" && assignment.status === "enquiry_sent" ? "questions_sent" : assignment.status;
    saveAssignment(assignment.id, { messages: [...(assignment.messages ?? []), nextMessage], status: nextStatus, ...(role === "supplier" && meetingNote.trim() ? { meetingNote: meetingNote.trim() } : {}) });
    notify(role === "supplier" ? "campaign_creator" : "supplier", `New message about ${assignment.campaignTitle}`, messageText.trim(), role === "campaign_creator" ? assignment.supplierEmail : undefined);
    setMessageText(""); setMeetingNote("");
  }

  function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!assignment || role !== "supplier" || quoteAmount < 1 || quoteTerms.trim().length < 15) return;
    const reference = `QUO-SBX-${Date.now().toString().slice(-6)}`;
    const retainedMeetingNote = meetingNote.trim() || assignment.meetingNote;
    saveAssignment(assignment.id, { status: "quote_submitted", quoteReference: reference, quoteAmountRand: quoteAmount, amountRand: quoteAmount, quoteTerms: quoteTerms.trim(), quoteSubmittedAt: new Date().toISOString(), ...(retainedMeetingNote ? { meetingNote: retainedMeetingNote } : {}) });
    notify("campaign_creator", `Quotation received from ${assignment.supplierName}`, `${reference} for R${quoteAmount.toLocaleString("en-ZA")} is ready for review.`);
    setQuoteTerms(""); setMeetingNote("");
  }

  function decideQuote(accepted: boolean) {
    if (!assignment || role !== "campaign_creator" || (!accepted && decisionNote.trim().length < 10)) return;
    saveAssignment(assignment.id, { status: accepted ? "quote_accepted" : "quote_declined", quoteDecisionNote: decisionNote.trim() || "Quotation accepted in the sandbox." });
    notify("supplier", accepted ? `Quotation accepted for ${assignment.campaignTitle}` : `Quotation declined for ${assignment.campaignTitle}`, accepted ? "Submit the formal invoice to continue." : decisionNote.trim(), assignment.supplierEmail);
    setDecisionNote("");
  }

  function submitInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!assignment || role !== "supplier" || invoiceReference.trim().length < 4) return;
    saveAssignment(assignment.id, { status: "invoice_submitted", invoiceReference: invoiceReference.trim(), ...(invoiceNote.trim() ? { invoiceNote: invoiceNote.trim() } : {}) });
    notify("campaign_creator", `Invoice received from ${assignment.supplierName}`, `${invoiceReference.trim()} is ready. Confirm the work start and publish a campaign update.`);
    setInvoiceReference(""); setInvoiceNote("");
  }

  function publishWorkStart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!assignment || role !== "campaign_creator" || !assignment.campaignSlug || updateTitle.trim().length < 5 || updateBody.trim().length < 20 || (updatePhoto && updatePhotoAlt.trim().length < 8)) return;
    const update: SandboxCampaignUpdate = { id: createSandboxId("update"), campaignSlug: assignment.campaignSlug, title: updateTitle.trim(), body: updateBody.trim(), author: campaign?.leader.name ?? "Sandbox Campaign Creator", createdAt: new Date().toISOString(), ...(updatePhoto ? { photoDataUrl: updatePhoto, photoAlt: updatePhotoAlt.trim() } : {}) };
    const updates = readSandbox<SandboxCampaignUpdate[]>(keys.campaignUpdates, []);
    writeSandbox(keys.campaignUpdates, [update, ...updates].slice(0, 40));
    saveAssignment(assignment.id, { status: "work_in_progress", campaignUpdateTitle: update.title, campaignUpdateBody: update.body });
    notify("supplier", `Work authorised for ${assignment.campaignTitle}`, "The invoice was recorded and the Campaign Creator published a work-start update.", assignment.supplierEmail);
    setUpdateTitle(""); setUpdateBody(""); setUpdatePhoto(""); setUpdatePhotoAlt("");
  }

  function submitCompletion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!assignment || role !== "supplier" || completionNote.trim().length < 20 || (completionPhoto && completionPhotoAlt.trim().length < 8)) return;
    const retainedPhoto = completionPhoto || assignment.completionPhotoDataUrl;
    const retainedPhotoAlt = completionPhotoAlt.trim() || assignment.completionPhotoAlt;
    saveAssignment(assignment.id, { status: "completion_submitted", evidenceNote: completionNote.trim(), ...(retainedPhoto ? { completionPhotoDataUrl: retainedPhoto } : {}), ...(retainedPhotoAlt ? { completionPhotoAlt: retainedPhotoAlt } : {}) });
    notify("campaign_creator", `Completion submitted by ${assignment.supplierName}`, "Review the proof of completion, publish the mandatory campaign update and leave a supplier review.");
    setCompletionNote(""); setCompletionPhoto(""); setCompletionPhotoAlt("");
  }

  function approveCompletion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!assignment || role !== "campaign_creator" || !assignment.campaignSlug || updateTitle.trim().length < 5 || updateBody.trim().length < 20 || reviewText.trim().length < 15 || (updatePhoto && updatePhotoAlt.trim().length < 8)) return;
    const now = new Date().toISOString();
    const photoDataUrl = updatePhoto || assignment.completionPhotoDataUrl;
    const photoAlt = updatePhotoAlt.trim() || assignment.completionPhotoAlt;
    const update: SandboxCampaignUpdate = { id: createSandboxId("update"), campaignSlug: assignment.campaignSlug, title: updateTitle.trim(), body: updateBody.trim(), author: campaign?.leader.name ?? "Sandbox Campaign Creator", createdAt: now, ...(photoDataUrl ? { photoDataUrl, photoAlt: photoAlt || "Supplier proof of completion" } : {}) };
    const review: SandboxReview = { id: createSandboxId("review"), supplierSlug: assignment.supplierSlug, rating: reviewRating, text: reviewText.trim(), author: campaign?.leader.name ?? "Sandbox Campaign Creator", campaign: assignment.campaignTitle ?? "Sandbox campaign", createdAt: now };
    writeSandbox(keys.campaignUpdates, [update, ...readSandbox<SandboxCampaignUpdate[]>(keys.campaignUpdates, [])].slice(0, 40));
    writeSandbox(keys.reviews, [review, ...readSandbox<SandboxReview[]>(keys.reviews, [])].slice(0, 80));
    saveAssignment(assignment.id, { status: "completion_approved", campaignUpdateTitle: update.title, campaignUpdateBody: update.body });
    notify("supplier", `Completion approved for ${assignment.campaignTitle}`, "The campaign update and verified review are public. Admin payment approval is next.", assignment.supplierEmail);
    notify("admin", `Supplier payment ready: ${assignment.supplierName}`, `${assignment.campaignTitle} completion was approved with a mandatory update and review.`);
    setUpdateTitle(""); setUpdateBody(""); setUpdatePhoto(""); setUpdatePhotoAlt(""); setReviewText(""); setReviewRating(5);
  }

  const canMessage = assignment && (role === "campaign_creator" || role === "supplier") && !["quote_declined", "paid", "reviewed", "completed"].includes(assignment.status);

  return (
    <div className="engagement-workspace">
      <aside className="engagement-list" aria-labelledby="engagement-list-title"><p className="eyebrow">{roleLabels[role]} view</p><h2 id="engagement-list-title">Engagements</h2>{assignments.length ? <div>{assignments.map((item) => <button type="button" className={item.id === activeId ? "active" : ""} aria-pressed={item.id === activeId} onClick={() => setActiveId(item.id)} key={item.id}><strong>{item.supplierName}</strong><span>{item.campaignTitle}</span><small>{statusLabels[item.status]}</small></button>)}</div> : <p>No supplier engagements yet.</p>}<Link className="button button-secondary button-wide" href="/suppliers/">Find a supplier</Link></aside>

      <main className="engagement-detail">{assignment ? <><header><div><span className={`status-label status-${assignment.status}`}>{statusLabels[assignment.status]}</span><h2>{assignment.supplierName}</h2><p>{assignment.campaignTitle} · {(assignment.milestones ?? [assignment.milestone]).join(" · ")}</p></div>{assignment.quoteAmountRand ? <strong>R{assignment.quoteAmountRand.toLocaleString("en-ZA")}</strong> : null}</header><div className="engagement-scope"><p className="eyebrow">Scope of work</p><p>{assignment.scope ?? assignment.evidenceNote ?? "Seeded QA supplier engagement."}</p>{assignment.siteNote ? <p><strong>Site information:</strong> {assignment.siteNote}</p> : null}{assignment.meetingNote ? <p><strong>External meeting or site visit:</strong> {assignment.meetingNote}</p> : null}</div>

        <ol className="engagement-progress" aria-label="Supplier engagement progress">{["Enquiry", "Quotation", "Invoice", "Work", "Completion", "Payment"].map((label, index) => <li className={index <= (["enquiry_sent", "questions_sent"].includes(assignment.status) ? 0 : assignment.status === "quote_submitted" || assignment.status === "quote_accepted" || assignment.status === "quote_declined" ? 1 : assignment.status === "invoice_submitted" ? 2 : assignment.status === "work_in_progress" ? 3 : assignment.status === "completion_submitted" || assignment.status === "completion_approved" || assignment.status === "evidence_requested" ? 4 : 5) ? "complete" : ""} key={label}><span>{index + 1}</span>{label}</li>)}</ol>

        <section className="engagement-thread" aria-labelledby="thread-title"><h3 id="thread-title">Engagement messages</h3><div aria-live="polite">{assignment.messages?.length ? assignment.messages.map((message) => <article className={`message-${message.senderRole}`} key={message.id}><strong>{message.senderName}</strong><p>{message.text}</p><small>{new Date(message.createdAt).toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" })}</small></article>) : <p>No messages yet.</p>}</div>{canMessage ? <form onSubmit={sendMessage}><div className="field"><label htmlFor="engagement-message">Message as {roleLabels[role]}</label><textarea id="engagement-message" rows={3} minLength={3} required value={messageText} onChange={(event) => setMessageText(event.target.value)} /></div>{role === "supplier" ? <div className="field"><label htmlFor="meeting-note">External meeting or site-visit note <span>(optional)</span></label><input id="meeting-note" value={meetingNote} onChange={(event) => setMeetingNote(event.target.value)} placeholder="Example: Site visit agreed for Friday at 10:00" /></div> : null}<button className="button button-secondary" type="submit">Send sandbox message</button></form> : null}</section>

        {role === "supplier" && ["enquiry_sent", "questions_sent"].includes(assignment.status) ? <form className="workflow-action-card" onSubmit={submitQuote}><p className="eyebrow">Supplier action</p><h3>Submit a formal quotation</h3><div className="form-grid"><div className="field"><label htmlFor="quote-amount">Quotation amount</label><input id="quote-amount" type="number" min="1" required value={quoteAmount} onChange={(event) => setQuoteAmount(Number(event.target.value))} /></div><div className="field"><label htmlFor="quote-meeting">Meeting or site-visit note <span>(optional)</span></label><input id="quote-meeting" value={meetingNote} onChange={(event) => setMeetingNote(event.target.value)} /></div><div className="field field-wide"><label htmlFor="quote-terms">Scope, terms and assumptions</label><textarea id="quote-terms" rows={5} minLength={15} required value={quoteTerms} onChange={(event) => setQuoteTerms(event.target.value)} /></div></div><button className="button button-primary" type="submit">Send quotation</button></form> : null}
        {role === "campaign_creator" && assignment.status === "quote_submitted" ? <section className="workflow-action-card"><p className="eyebrow">Campaign Creator decision</p><h3>Review {assignment.quoteReference}</h3><p>{assignment.quoteTerms}</p><div className="field"><label htmlFor="quote-decision-note">Decision note</label><textarea id="quote-decision-note" rows={3} value={decisionNote} onChange={(event) => setDecisionNote(event.target.value)} placeholder="Required when declining the quotation." /></div><div className="button-row"><button className="button button-primary" type="button" onClick={() => decideQuote(true)}>Accept quotation</button><button className="button button-secondary" type="button" disabled={decisionNote.trim().length < 10} onClick={() => decideQuote(false)}>Decline with note</button></div></section> : null}
        {role === "supplier" && assignment.status === "quote_accepted" ? <form className="workflow-action-card" onSubmit={submitInvoice}><p className="eyebrow">Supplier action</p><h3>Submit the formal invoice</h3><div className="form-grid"><div className="field"><label htmlFor="invoice-reference">Invoice reference</label><input id="invoice-reference" minLength={4} required value={invoiceReference} onChange={(event) => setInvoiceReference(event.target.value)} /></div><div className="field field-wide"><label htmlFor="invoice-note">Invoice note <span>(optional)</span></label><textarea id="invoice-note" rows={3} value={invoiceNote} onChange={(event) => setInvoiceNote(event.target.value)} /></div></div><button className="button button-primary" type="submit">Submit invoice</button></form> : null}
        {role === "campaign_creator" && assignment.status === "invoice_submitted" ? <UpdateForm heading="Confirm work start and publish campaign update" button="Authorise work" title={updateTitle} body={updateBody} photo={updatePhoto} photoAlt={updatePhotoAlt} photoError={photoError} onTitle={setUpdateTitle} onBody={setUpdateBody} onPhoto={(event) => readPhoto(event.target.files?.[0], setUpdatePhoto, setPhotoError)} onPhotoAlt={setUpdatePhotoAlt} onSubmit={publishWorkStart} /> : null}
        {role === "supplier" && (assignment.status === "work_in_progress" || assignment.status === "evidence_requested") ? <form className="workflow-action-card" onSubmit={submitCompletion}><p className="eyebrow">Supplier action</p><h3>{assignment.status === "evidence_requested" ? "Resubmit proof of completion" : "Submit proof of completion"}</h3><div className="field"><label htmlFor="completion-note">Completion details and evidence</label><textarea id="completion-note" rows={5} minLength={20} required value={completionNote} onChange={(event) => setCompletionNote(event.target.value)} /></div><div className="field"><label htmlFor="completion-photo">Completion photograph <span>(optional)</span></label><input id="completion-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => readPhoto(event.target.files?.[0], setCompletionPhoto, setPhotoError)} /></div>{completionPhoto ? <div className="field"><label htmlFor="completion-photo-alt">Describe the photograph</label><input id="completion-photo-alt" minLength={8} required value={completionPhotoAlt} onChange={(event) => setCompletionPhotoAlt(event.target.value)} /></div> : null}{photoError ? <p className="field-error" role="alert">{photoError}</p> : null}<button className="button button-primary" type="submit">Send completion for approval</button></form> : null}
        {role === "campaign_creator" && assignment.status === "completion_submitted" ? <form className="workflow-action-card" onSubmit={approveCompletion}><p className="eyebrow">Mandatory completion approval</p><h3>Publish an update and review the supplier</h3><div className="field"><label htmlFor="completion-update-title">Campaign update title</label><input id="completion-update-title" minLength={5} required value={updateTitle} onChange={(event) => setUpdateTitle(event.target.value)} /></div><div className="field"><label htmlFor="completion-update-body">Campaign update</label><textarea id="completion-update-body" rows={5} minLength={20} required value={updateBody} onChange={(event) => setUpdateBody(event.target.value)} /></div><div className="field"><label htmlFor="approval-photo">Additional photograph <span>(optional)</span></label><input id="approval-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => readPhoto(event.target.files?.[0], setUpdatePhoto, setPhotoError)} /><small>The supplier&apos;s completion photograph is used automatically if no additional photograph is chosen.</small></div>{updatePhoto ? <div className="field"><label htmlFor="approval-photo-alt">Describe the photograph</label><input id="approval-photo-alt" minLength={8} required value={updatePhotoAlt} onChange={(event) => setUpdatePhotoAlt(event.target.value)} /></div> : null}<fieldset className="rating-field"><legend>Supplier rating</legend><div>{[1, 2, 3, 4, 5].map((value) => <label key={value}><input type="radio" name="completion-rating" value={value} checked={reviewRating === value} onChange={() => setReviewRating(value)} /><span aria-hidden="true"><StarIcon size={24} /></span><span className="sr-only">{value} stars</span></label>)}</div></fieldset><div className="field"><label htmlFor="completion-review">Supplier review</label><textarea id="completion-review" rows={4} minLength={15} required value={reviewText} onChange={(event) => setReviewText(event.target.value)} /></div><button className="button button-primary" type="submit" disabled={reviewText.trim().length < 15 || updateBody.trim().length < 20}>Approve completion and publish</button></form> : null}
        {role === "admin" ? <div className="workflow-action-card"><p className="eyebrow">Admin handoff</p><h3>Payment decisions remain separate.</h3><p>Only Campaign Creator-approved completion evidence enters the payment queue.</p><Link className="button button-primary" href="/admin/payments/">Open payment approvals</Link></div> : null}
        {role === "citizen" ? <div className="role-restricted-note"><FeatureIcon name="lock" /><h3>Operational supplier controls are hidden from Citizens.</h3><p>Citizens can inspect the resulting campaign updates, supplier history and public payment audit.</p></div> : null}
      </> : <div className="empty-state"><h2>No engagement selected.</h2><p>Start by choosing a verified supplier as a Campaign Creator.</p></div>}</main>

      <aside className="notification-centre" aria-labelledby="notifications-title"><p className="eyebrow">In-app notifications</p><h2 id="notifications-title">{roleLabels[role]} inbox</h2>{roleNotifications.length ? <ol>{roleNotifications.map((notification) => <li key={notification.id}><strong>{notification.title}</strong><p>{notification.body}</p><small>{new Date(notification.createdAt).toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" })}</small>{notification.emailPreviewTo ? <span>Email preview to {notification.emailPreviewTo} · not sent</span> : null}</li>)}</ol> : <p>No notifications for this role yet.</p>}</aside>
    </div>
  );
}

function UpdateForm({ heading, button, title, body, photo, photoAlt, photoError, onTitle, onBody, onPhoto, onPhotoAlt, onSubmit }: { heading: string; button: string; title: string; body: string; photo: string; photoAlt: string; photoError: string; onTitle: (value: string) => void; onBody: (value: string) => void; onPhoto: (event: ChangeEvent<HTMLInputElement>) => void; onPhotoAlt: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <form className="workflow-action-card" onSubmit={onSubmit}><p className="eyebrow">Campaign Creator action</p><h3>{heading}</h3><div className="field"><label htmlFor="work-update-title">Update title</label><input id="work-update-title" minLength={5} required value={title} onChange={(event) => onTitle(event.target.value)} /></div><div className="field"><label htmlFor="work-update-body">Campaign update</label><textarea id="work-update-body" rows={5} minLength={20} required value={body} onChange={(event) => onBody(event.target.value)} /></div><div className="field"><label htmlFor="work-update-photo">Progress photograph <span>(optional)</span></label><input id="work-update-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={onPhoto} /></div>{photo ? <div className="field"><label htmlFor="work-update-photo-alt">Describe the photograph</label><input id="work-update-photo-alt" minLength={8} required value={photoAlt} onChange={(event) => onPhotoAlt(event.target.value)} /></div> : null}{photoError ? <p className="field-error" role="alert">{photoError}</p> : null}<button className="button button-primary" type="submit">{button}</button></form>;
}
