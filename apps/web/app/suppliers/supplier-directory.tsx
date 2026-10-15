"use client";

import { supplierCategories, type Supplier, type SupplierCategory } from "@citizenx/domain";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckIcon, StarIcon } from "../../components/icons";
import { createSandboxId, keys, readSandbox, seedSandboxCampaign, type SandboxAdvert, type SandboxAssignment, type SandboxCampaign, type SandboxReview, type SandboxRole, writeSandbox } from "../../lib/sandbox-store";

type CategoryFilter = SupplierCategory | "All";
type RatingFilter = "all" | "4" | "4.5" | "4.8";

function Stars({ rating }: { rating: number }) {
  return <span className="stars" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <StarIcon className={star <= Math.round(rating) ? "filled" : ""} key={star} />)}</span>;
}

export function SupplierDirectory({ suppliers }: { suppliers: Supplier[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [minimumRating, setMinimumRating] = useState<RatingFilter>("all");
  const [role, setRole] = useState<SandboxRole>("citizen");
  const [adverts, setAdverts] = useState<SandboxAdvert[]>([]);
  const [assignments, setAssignments] = useState<SandboxAssignment[]>([]);
  const [reviews, setReviews] = useState<SandboxReview[]>([]);
  const [activeSupplier, setActiveSupplier] = useState<Supplier | null>(null);
  const [milestone, setMilestone] = useState("Site preparation");
  const [amountRand, setAmountRand] = useState(25000);
  const [reviewing, setReviewing] = useState<SandboxAssignment | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const assignmentHeading = useRef<HTMLHeadingElement>(null);
  const reviewHeading = useRef<HTMLHeadingElement>(null);

  function refresh() {
    setRole(readSandbox<SandboxRole>(keys.role, "citizen"));
    setAdverts(readSandbox<SandboxAdvert[]>(keys.adverts, []));
    setAssignments(readSandbox<SandboxAssignment[]>(keys.assignments, []));
    setReviews(readSandbox<SandboxReview[]>(keys.reviews, []));
  }
  useEffect(() => {
    refresh();
    window.addEventListener("citizenx-sandbox-change", refresh);
    return () => window.removeEventListener("citizenx-sandbox-change", refresh);
  }, []);

  useEffect(() => {
    if (activeSupplier) {
      assignmentHeading.current?.focus();
      assignmentHeading.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeSupplier]);

  useEffect(() => {
    if (reviewing) {
      reviewHeading.current?.focus();
      reviewHeading.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [reviewing]);

  const directorySuppliers = useMemo(() => {
    const promotedSlugs = new Set(adverts.map((advert) => suppliers.find((supplier) => supplier.name === advert.supplierName)?.slug).filter(Boolean));
    return suppliers.map((supplier) => {
      const advert = adverts.find((item) => item.supplierName === supplier.name);
      return advert ? { ...supplier, sponsored: true, summary: advert.description || advert.headline } : supplier;
    }).sort((a, b) => Number(Boolean(b.sponsored || promotedSlugs.has(b.slug))) - Number(Boolean(a.sponsored || promotedSlugs.has(a.slug))));
  }, [adverts, suppliers]);

  const ratingBySlug = useMemo(() => new Map(suppliers.map((supplier) => {
    const sandboxRatings = reviews.filter((review) => review.supplierSlug === supplier.slug);
    const ratingTotal = (supplier.rating * supplier.completedJobs) + sandboxRatings.reduce((sum, review) => sum + review.rating, 0);
    return [supplier.slug, ratingTotal / (supplier.completedJobs + sandboxRatings.length)] as const;
  })), [reviews, suppliers]);

  const filtered = useMemo(() => {
    const normalised = query.trim().toLowerCase();
    const threshold = minimumRating === "all" ? 0 : Number(minimumRating);
    return directorySuppliers.filter((supplier) => (category === "All" || supplier.category === category) && (ratingBySlug.get(supplier.slug) ?? supplier.rating) >= threshold && (!normalised || [supplier.name, supplier.summary, supplier.location, ...supplier.services].some((value) => value.toLowerCase().includes(normalised))));
  }, [category, directorySuppliers, minimumRating, query, ratingBySlug]);

  const campaigns = readSandbox<SandboxCampaign[]>(keys.campaigns, [seedSandboxCampaign]);
  const campaign = campaigns[0] ?? seedSandboxCampaign;
  const milestoneOptions = campaign.milestones.map((item) => item.title);

  function beginAssignment(supplier: Supplier) {
    if (role !== "campaign_creator") {
      writeSandbox(keys.role, "campaign_creator");
      setRole("campaign_creator");
    }
    setActiveSupplier(supplier);
    setMilestone(milestoneOptions[0] ?? "Campaign milestone");
  }

  function confirmAssignment() {
    if (!activeSupplier) return;
    const assignment: SandboxAssignment = { id: createSandboxId("job"), supplierSlug: activeSupplier.slug, supplierName: activeSupplier.name, milestone, amountRand, status: "assigned" };
    const next = [assignment, ...assignments.filter((item) => item.supplierSlug !== activeSupplier.slug)];
    setAssignments(next); writeSandbox(keys.assignments, next); setActiveSupplier(null);
  }

  function completeAssignment(assignment: SandboxAssignment) {
    const next = assignments.map((item) => item.id === assignment.id ? { ...item, status: "completed" as const } : item);
    setAssignments(next); writeSandbox(keys.assignments, next);
  }

  function submitReview() {
    if (!reviewing || reviewText.trim().length < 15) return;
    const review: SandboxReview = { id: createSandboxId("review"), supplierSlug: reviewing.supplierSlug, rating: reviewRating, text: reviewText.trim(), author: "Sandbox Campaign Creator", campaign: campaign.title, createdAt: new Date().toISOString() };
    const nextReviews = [review, ...reviews];
    const nextAssignments = assignments.map((item) => item.id === reviewing.id ? { ...item, status: "reviewed" as const } : item);
    setReviews(nextReviews); setAssignments(nextAssignments); writeSandbox(keys.reviews, nextReviews); writeSandbox(keys.assignments, nextAssignments); setReviewing(null); setReviewText("");
  }

  return (
    <div>
      <div className="filters supplier-filters" role="search" aria-label="Filter suppliers"><div className="field search-field"><label htmlFor="supplier-search">Search suppliers</label><input id="supplier-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by service, supplier or location" /></div><div className="field"><label htmlFor="supplier-category">Service category</label><select id="supplier-category" value={category} onChange={(e) => setCategory(e.target.value as CategoryFilter)}><option>All</option>{supplierCategories.map((item) => <option key={item}>{item}</option>)}</select></div><div className="field"><label htmlFor="supplier-rating">Minimum rating</label><select id="supplier-rating" value={minimumRating} onChange={(e) => setMinimumRating(e.target.value as RatingFilter)}><option value="all">Any rating</option><option value="4">4.0 and above</option><option value="4.5">4.5 and above</option><option value="4.8">4.8 and above</option></select></div></div>

      {activeSupplier ? <section className="supplier-workflow" id="supplier-workflow" aria-labelledby="assign-title"><div><p className="eyebrow">Campaign Creator workflow</p><h2 id="assign-title" ref={assignmentHeading} tabIndex={-1}>Assign {activeSupplier.name} to a milestone.</h2><p>This creates a sandbox supplier engagement for <strong>{campaign.title}</strong>.</p></div><div className="assignment-fields"><div className="field"><label htmlFor="assignment-milestone">Campaign milestone</label><select id="assignment-milestone" value={milestone} onChange={(e) => setMilestone(e.target.value)}>{milestoneOptions.map((item) => <option key={item}>{item}</option>)}</select></div><div className="field"><label htmlFor="assignment-amount">Approved job value</label><input id="assignment-amount" type="number" min="1" value={amountRand} onChange={(e) => setAmountRand(Number(e.target.value))} /></div></div><div className="button-row"><button type="button" className="button button-primary" onClick={confirmAssignment}>Assign verified supplier</button><button type="button" className="button button-secondary" onClick={() => setActiveSupplier(null)}>Cancel</button></div></section> : null}

      {reviewing ? <section className="supplier-workflow review-workflow" aria-labelledby="review-title"><div><p className="eyebrow">Verified engagement review</p><h2 id="review-title" ref={reviewHeading} tabIndex={-1}>Rate {reviewing.supplierName}.</h2><p>The sandbox job is complete and paid. Your review will be labelled as a verified engagement.</p></div><fieldset className="rating-field"><legend>Rating</legend><div>{[1, 2, 3, 4, 5].map((value) => <label key={value}><input type="radio" name="rating" value={value} checked={reviewRating === value} onChange={() => setReviewRating(value)} /><span aria-hidden="true"><StarIcon size={24} /></span><span className="sr-only">{value} stars</span></label>)}</div></fieldset><div className="field"><label htmlFor="review-text">Review</label><textarea id="review-text" rows={4} value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Describe the quality, reliability and evidence provided." aria-describedby={reviewText.length > 0 && reviewText.trim().length < 15 ? "review-error" : undefined} aria-invalid={reviewText.length > 0 && reviewText.trim().length < 15} /></div>{reviewText.length > 0 && reviewText.trim().length < 15 ? <p className="field-error" id="review-error">Write at least 15 characters.</p> : null}<div className="button-row"><button type="button" className="button button-primary" disabled={reviewText.trim().length < 15} onClick={submitReview}>Publish verified review</button><button type="button" className="button button-secondary" onClick={() => setReviewing(null)}>Cancel</button></div></section> : null}

      <p className="result-count" aria-live="polite">{filtered.length} verified {filtered.length === 1 ? "supplier" : "suppliers"}</p>
      {filtered.length ? <div className="supplier-grid">{filtered.map((supplier) => {
        const assignment = assignments.find((item) => item.supplierSlug === supplier.slug);
        const sandboxReviews = reviews.filter((review) => review.supplierSlug === supplier.slug);
        const allReviews = [...sandboxReviews.map((review) => ({ id: review.id, author: review.author, campaign: review.campaign, rating: review.rating, text: review.text, date: new Date(review.createdAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" }), verifiedEngagement: true })), ...supplier.reviews];
        const rating = ratingBySlug.get(supplier.slug) ?? supplier.rating;
        return <article className="supplier-card" key={supplier.slug}>
          {supplier.sponsored ? <div className="sponsored-label">Sponsored placement</div> : null}
          <div className="supplier-card-head"><div className="supplier-mark" aria-hidden="true">{supplier.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div><div><div className="supplier-badges"><span className="verified-badge"><CheckIcon size={14} /> Verified</span><span>{supplier.category}</span></div><h2>{supplier.name}</h2><p>{supplier.location} · {supplier.serviceArea}</p></div></div>
          <p>{supplier.summary}</p>
          <div className="supplier-rating"><Stars rating={rating} /><strong>{rating.toFixed(1)}</strong><span>{supplier.completedJobs + sandboxReviews.length} completed jobs · {allReviews.length} public {allReviews.length === 1 ? "review" : "reviews"}</span></div>
          <ul className="service-tags">{supplier.services.map((service) => <li key={service}>{service}</li>)}</ul>
          <p className="response-time">{supplier.responseTime}</p>
          {assignment ? <div className={`assignment-status assignment-${assignment.status}`}><strong>{assignment.milestone}</strong><span>{assignment.status === "assigned" ? `Assigned · R${assignment.amountRand.toLocaleString("en-ZA")}` : assignment.status === "completed" ? "Completed and paid · review unlocked" : "Completed · verified review published"}</span>{assignment.status === "assigned" ? <button type="button" className="button button-small button-primary" onClick={() => completeAssignment(assignment)}>Mark complete &amp; pay</button> : null}{assignment.status === "completed" ? <button type="button" className="button button-small button-primary" onClick={() => setReviewing(assignment)}>Leave verified review</button> : null}</div> : <button type="button" className="button button-secondary button-wide" onClick={() => beginAssignment(supplier)}>Assign to a milestone</button>}
          <details className="supplier-reviews"><summary>Read reviews ({allReviews.length})</summary>{allReviews.length ? <div>{allReviews.map((review) => <blockquote key={review.id}><div><Stars rating={review.rating} /><span><CheckIcon size={13} /> Verified engagement</span></div><p>“{review.text}”</p><footer>{review.author} · {review.campaign} · {review.date}</footer></blockquote>)}</div> : <p>No reviews yet. Be the first campaign creator to complete a verified job.</p>}</details>
        </article>;
      })}</div> : <div className="empty-state"><h2>No suppliers match those filters.</h2><p>Try a lower rating, another category or a broader search.</p></div>}
      <div className="directory-footer-cta"><div><p className="eyebrow">Are you a service provider?</p><h2>Earn trust through verified work.</h2><p>Registration and promotion are separate: approval is earned through verification, never advertising spend.</p></div><div className="button-row"><Link className="button button-primary" href="/suppliers/register/">Register your business</Link><Link className="button button-secondary" href="/suppliers/promote/">View promotion packages</Link></div></div>
    </div>
  );
}
