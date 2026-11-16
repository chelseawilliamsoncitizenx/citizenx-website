"use client";

import type { Campaign, Supplier } from "@citizenx/domain";
import Image from "next/image";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { CheckIcon, StarIcon } from "../../../components/icons";
import { createSandboxId, keys, readSandbox, seedSandboxAssignment, type SandboxAssignment, type SandboxNotification, type SandboxReview, type SandboxRole, writeSandbox } from "../../../lib/sandbox-store";

function Stars({ rating }: { rating: number }) {
  return <span className="stars" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <StarIcon size={18} className={star <= Math.round(rating) ? "filled" : ""} key={star} />)}</span>;
}

function CampaignProjectLink({ campaign }: { campaign: Campaign }) {
  return (
    <Link className="supplier-project-campaign-link" href={`/campaigns/${campaign.slug}/`}>
      View {campaign.title} campaign <span aria-hidden="true">→</span>
    </Link>
  );
}

export function SupplierProfile({ supplier, campaigns }: { supplier: Supplier; campaigns: Campaign[] }) {
  const [role, setRole] = useState<SandboxRole>("citizen");
  const [assignments, setAssignments] = useState<SandboxAssignment[]>([]);
  const [reviews, setReviews] = useState<SandboxReview[]>([]);
  const [campaignSlug, setCampaignSlug] = useState(campaigns[0]?.slug ?? "");
  const [milestones, setMilestones] = useState<string[]>([]);
  const [scope, setScope] = useState("");
  const [siteNote, setSiteNote] = useState("");
  const [sitePhotoDataUrl, setSitePhotoDataUrl] = useState("");
  const [sitePhotoAlt, setSitePhotoAlt] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const successHeading = useRef<HTMLHeadingElement>(null);

  const selectedCampaign = campaigns.find((campaign) => campaign.slug === campaignSlug) ?? campaigns[0];

  useEffect(() => {
    const refresh = () => {
      setRole(readSandbox<SandboxRole>(keys.role, "citizen"));
      setAssignments(readSandbox<SandboxAssignment[]>(keys.assignments, [seedSandboxAssignment]));
      setReviews(readSandbox<SandboxReview[]>(keys.reviews, []));
    };
    refresh();
    window.addEventListener("citizenx-sandbox-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("citizenx-sandbox-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    setMilestones(selectedCampaign?.milestones.slice(0, 1).map((milestone) => milestone.title) ?? []);
  }, [campaignSlug, selectedCampaign]);

  useEffect(() => {
    if (submitted) successHeading.current?.focus();
  }, [submitted]);

  const sandboxReviews = reviews.filter((review) => review.supplierSlug === supplier.slug);
  const rating = ((supplier.rating * supplier.completedJobs) + sandboxReviews.reduce((sum, review) => sum + review.rating, 0)) / (supplier.completedJobs + sandboxReviews.length);
  const allReviews = [...sandboxReviews.map((review) => ({ id: review.id, author: review.author, campaign: review.campaign, rating: review.rating, text: review.text, date: new Date(review.createdAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" }) })), ...supplier.reviews];
  const completedAssignments = useMemo(() => assignments.filter((assignment) => assignment.supplierSlug === supplier.slug && ["completion_approved", "paid", "reviewed", "completed"].includes(assignment.status)), [assignments, supplier.slug]);

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setPhotoError("");
    if (!file) { setSitePhotoDataUrl(""); return; }
    if (!file.type.startsWith("image/")) { setPhotoError("Choose a JPG, PNG or WebP image."); return; }
    if (file.size > 1_000_000) { setPhotoError("Choose an image smaller than 1 MB for this browser-only simulation."); return; }
    const reader = new FileReader();
    reader.onload = () => setSitePhotoDataUrl(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => setPhotoError("The photograph could not be read. Try another image.");
    reader.readAsDataURL(file);
  }

  function toggleMilestone(title: string) {
    setMilestones((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title]);
  }

  function submitEngagement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (role !== "campaign_creator" || !selectedCampaign || milestones.length === 0 || scope.trim().length < 20 || (sitePhotoDataUrl && sitePhotoAlt.trim().length < 8)) return;
    const now = new Date().toISOString();
    const assignment: SandboxAssignment = {
      id: createSandboxId("engagement"), supplierSlug: supplier.slug, supplierName: supplier.name, supplierEmail: supplier.email,
      campaignId: selectedCampaign.slug, campaignSlug: selectedCampaign.slug, campaignTitle: selectedCampaign.title,
      milestone: milestones.join(", "), milestones, amountRand: 0, status: "enquiry_sent", createdAt: now,
      scope: scope.trim(),
      ...(siteNote.trim() ? { siteNote: siteNote.trim() } : {}),
      ...(sitePhotoDataUrl ? { sitePhotoDataUrl } : {}),
      ...(sitePhotoAlt.trim() ? { sitePhotoAlt: sitePhotoAlt.trim() } : {}),
      messages: [{ id: createSandboxId("message"), senderRole: "campaign_creator", senderName: selectedCampaign.leader.name, text: `New work request: ${scope.trim()}`, createdAt: now }]
    };
    const currentAssignments = readSandbox<SandboxAssignment[]>(keys.assignments, [seedSandboxAssignment]);
    const notification: SandboxNotification = { id: createSandboxId("notification"), role: "supplier", title: `New enquiry from ${selectedCampaign.title}`, body: `${selectedCampaign.leader.name} invited ${supplier.name} to review work for ${milestones.join(", ")}.`, createdAt: now, emailPreviewTo: supplier.email };
    const currentNotifications = readSandbox<SandboxNotification[]>(keys.notifications, []);
    writeSandbox(keys.assignments, [assignment, ...currentAssignments]);
    writeSandbox(keys.notifications, [notification, ...currentNotifications].slice(0, 40));
    setAssignments([assignment, ...currentAssignments]);
    setSubmitted(true);
    setScope(""); setSiteNote(""); setSitePhotoDataUrl(""); setSitePhotoAlt("");
  }

  return (
    <>
      <section className="supplier-profile-hero">
        <div className="shell">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/suppliers/">Verified suppliers</Link><span aria-hidden="true">/</span><span aria-current="page">{supplier.name}</span></nav>
          <div className="supplier-profile-heading"><div className="supplier-mark supplier-mark-large" aria-hidden="true">{supplier.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div><div><div className="supplier-badges"><span className="verified-badge"><CheckIcon size={14} /> Verified</span><span>{supplier.category}</span></div><h1>{supplier.name}</h1><p>{supplier.location} · {supplier.serviceArea}</p></div></div>
          <p className="supplier-profile-summary">{supplier.description}</p>
          <div className="supplier-profile-facts"><div><Stars rating={rating} /><strong>{rating.toFixed(1)}</strong><span>rating</span></div><div><strong>{supplier.completedJobs + sandboxReviews.length}</strong><span>completed jobs</span></div><div><strong>{allReviews.length}</strong><span>public reviews</span></div><div><strong>{supplier.responseTime.replace("Usually replies ", "")}</strong><span>response time</span></div></div>
        </div>
      </section>

      <section className="section section-ivory"><div className="shell supplier-profile-layout"><div><section aria-labelledby="services-title"><p className="eyebrow">Services</p><h2 id="services-title">What {supplier.name} provides.</h2><ul className="service-tags service-tags-large">{supplier.services.map((service) => <li key={service}>{service}</li>)}</ul></section>
        <section className="supplier-projects" aria-labelledby="projects-title"><p className="eyebrow">Previous work</p><h2 id="projects-title">Completed CitizenX projects.</h2><div className="supplier-project-grid">{completedAssignments.map((assignment) => {
          const publicCampaign = campaigns.find((campaign) => campaign.slug === assignment.campaignSlug);
          return <article className="supplier-project-card" key={assignment.id}>{assignment.completionPhotoDataUrl ? <div className="supplier-project-image"><img src={assignment.completionPhotoDataUrl} alt={assignment.completionPhotoAlt ?? "Supplier completion evidence"} /></div> : null}<div><span className="verified-badge"><CheckIcon size={14} /> Sandbox completion approved</span><h3>{assignment.campaignUpdateTitle ?? assignment.milestone}</h3><p>{assignment.evidenceNote ?? assignment.scope}</p>{publicCampaign ? <CampaignProjectLink campaign={publicCampaign} /> : assignment.campaignTitle ? <small>{assignment.campaignTitle}</small> : null}</div></article>;
        })}{supplier.previousProjects.map((project) => {
          const publicCampaign = campaigns.find((campaign) => campaign.slug === project.campaignSlug);
          return <article className="supplier-project-card" key={project.id}>{project.image ? <div className="supplier-project-image"><Image src={project.image} alt={project.imageAlt ?? "Completed supplier project"} width={900} height={600} sizes="(max-width: 660px) calc(100vw - 56px), 35vw" /></div> : null}<div><span className="verified-badge"><CheckIcon size={14} /> Verified engagement</span><h3>{project.title}</h3><p>{project.summary}</p><small>{project.location} · {project.completedAt}</small>{publicCampaign ? <CampaignProjectLink campaign={publicCampaign} /> : <small>{project.campaign}</small>}</div></article>;
        })}</div></section>
        <section className="supplier-profile-reviews" aria-labelledby="reviews-title"><p className="eyebrow">Verified reviews</p><h2 id="reviews-title">Feedback from completed work.</h2><div>{allReviews.length ? allReviews.map((review) => <blockquote key={review.id}><Stars rating={review.rating} /><p>“{review.text}”</p><footer>{review.author} · {review.campaign} · {review.date}</footer></blockquote>) : <p>No public reviews yet.</p>}</div></section>
      </div><aside className="supplier-profile-aside"><p className="eyebrow">Supplier assurance</p><h2>Verified, not endorsed.</h2><p>CitizenX verification confirms that supplied business information was reviewed for this QA demo. Campaign Creators remain responsible for scope, quotation and completion decisions.</p><dl><div><dt>Verification</dt><dd>CitizenX verified</dd></div><div><dt>Service area</dt><dd>{supplier.serviceArea}</dd></div><div><dt>Demo email</dt><dd>{supplier.email}</dd></div></dl><Link className="button button-secondary button-wide" href="/supplier-engagements/">Open engagement workspace</Link></aside></div></section>

      <section className="section supplier-engagement-start" id="start-engagement" aria-labelledby="engagement-title"><div className="shell narrow-shell">{role === "campaign_creator" ? submitted ? <div className="success-card"><p className="eyebrow">Enquiry sent</p><h2 id="engagement-title" ref={successHeading} tabIndex={-1}>{supplier.name} has a new sandbox notification.</h2><p>An in-app notification and labelled email preview were created. No real email was sent.</p><div className="button-row button-row-center"><Link className="button button-primary" href="/supplier-engagements/">Continue in engagement workspace</Link><button type="button" className="button button-secondary" onClick={() => setSubmitted(false)}>Create another enquiry</button></div></div> : <form className="engagement-form" onSubmit={submitEngagement}><p className="eyebrow">Campaign Creator tool</p><h2 id="engagement-title">Invite {supplier.name} to a campaign.</h2><p>Describe the work clearly. The supplier can respond with questions, a meeting note and a formal quotation in the sandbox workspace.</p><div className="field"><label htmlFor="engagement-campaign">Campaign</label><select id="engagement-campaign" value={campaignSlug} onChange={(event) => setCampaignSlug(event.target.value)}>{campaigns.map((campaign) => <option value={campaign.slug} key={campaign.slug}>{campaign.title}</option>)}</select></div><fieldset className="milestone-picker"><legend>Milestones covered</legend>{selectedCampaign?.milestones.map((milestone) => <label key={milestone.id}><input type="checkbox" checked={milestones.includes(milestone.title)} onChange={() => toggleMilestone(milestone.title)} /><span><strong>{milestone.title}</strong><small>{milestone.description}</small></span></label>)}</fieldset><div className="field"><label htmlFor="engagement-scope">Detailed description of work</label><textarea id="engagement-scope" rows={6} minLength={20} required value={scope} onChange={(event) => setScope(event.target.value)} /></div><div className="field"><label htmlFor="engagement-site-note">Site or meeting information <span>(optional)</span></label><textarea id="engagement-site-note" rows={3} value={siteNote} onChange={(event) => setSiteNote(event.target.value)} placeholder="Access arrangements, preferred site-visit times or meeting details." /></div><div className="field"><label htmlFor="engagement-photo">Site photograph <span>(optional)</span></label><input id="engagement-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} /><small>JPG, PNG or WebP, smaller than 1 MB. Stored only in this browser.</small></div>{sitePhotoDataUrl ? <div className="field"><label htmlFor="engagement-photo-alt">Describe the photograph</label><input id="engagement-photo-alt" minLength={8} required value={sitePhotoAlt} onChange={(event) => setSitePhotoAlt(event.target.value)} /></div> : null}{photoError ? <p className="field-error standalone-error" role="alert">{photoError}</p> : null}<button className="button button-primary" type="submit" disabled={milestones.length === 0 || scope.trim().length < 20}>Send supplier enquiry</button><p className="fine-print">Creates an in-app notification and email preview only. No real message is sent.</p></form> : <div className="role-restricted-note"><p className="eyebrow">Public supplier profile</p><h2 id="engagement-title">Campaign assignment is available only to Campaign Creators.</h2><p>Citizens can review supplier history, ratings and completed projects without seeing operational assignment controls.</p><Link className="button button-secondary" href="/sandbox/">Change sandbox role</Link></div>}</div></section>
    </>
  );
}
