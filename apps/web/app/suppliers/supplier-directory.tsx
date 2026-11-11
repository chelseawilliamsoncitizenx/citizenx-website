"use client";

import { supplierCategories, type Supplier, type SupplierCategory } from "@citizenx/domain";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckIcon, StarIcon } from "../../components/icons";
import { keys, readSandbox, type SandboxAdvert, type SandboxReview, type SandboxRole } from "../../lib/sandbox-store";

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
  const [reviews, setReviews] = useState<SandboxReview[]>([]);

  useEffect(() => {
    const refresh = () => {
      setRole(readSandbox<SandboxRole>(keys.role, "citizen"));
      setAdverts(readSandbox<SandboxAdvert[]>(keys.adverts, []));
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

  const directorySuppliers = useMemo(() => suppliers.map((supplier) => {
    const advert = adverts.find((item) => item.supplierName === supplier.name);
    return advert ? { ...supplier, sponsored: true, summary: advert.description || advert.headline } : supplier;
  }).sort((a, b) => Number(Boolean(b.sponsored)) - Number(Boolean(a.sponsored))), [adverts, suppliers]);

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

  return (
    <div>
      <div className="filters supplier-filters" role="search" aria-label="Filter suppliers"><div className="field search-field"><label htmlFor="supplier-search">Search suppliers</label><input id="supplier-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by service, supplier or location" /></div><div className="field"><label htmlFor="supplier-category">Service category</label><select id="supplier-category" value={category} onChange={(event) => setCategory(event.target.value as CategoryFilter)}><option>All</option>{supplierCategories.map((item) => <option key={item}>{item}</option>)}</select></div><div className="field"><label htmlFor="supplier-rating">Minimum rating</label><select id="supplier-rating" value={minimumRating} onChange={(event) => setMinimumRating(event.target.value as RatingFilter)}><option value="all">Any rating</option><option value="4">4.0 and above</option><option value="4.5">4.5 and above</option><option value="4.8">4.8 and above</option></select></div></div>

      <p className="result-count" aria-live="polite">{filtered.length} verified {filtered.length === 1 ? "supplier" : "suppliers"}</p>
      {filtered.length ? <div className="supplier-grid">{filtered.map((supplier) => {
        const sandboxReviews = reviews.filter((review) => review.supplierSlug === supplier.slug);
        const rating = ratingBySlug.get(supplier.slug) ?? supplier.rating;
        const reviewCount = supplier.reviews.length + sandboxReviews.length;
        return <article className="supplier-card" key={supplier.slug}>
          {supplier.sponsored ? <div className="sponsored-label">Sponsored placement</div> : null}
          <div className="supplier-card-head"><div className="supplier-mark" aria-hidden="true">{supplier.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div><div><div className="supplier-badges"><span className="verified-badge"><CheckIcon size={14} /> Verified</span><span>{supplier.category}</span></div><h2><Link href={`/suppliers/${supplier.slug}/`}>{supplier.name}</Link></h2><p>{supplier.location} · {supplier.serviceArea}</p></div></div>
          <p>{supplier.summary}</p>
          <div className="supplier-rating"><Stars rating={rating} /><strong>{rating.toFixed(1)}</strong><span>{supplier.completedJobs + sandboxReviews.length} completed jobs · {reviewCount} public {reviewCount === 1 ? "review" : "reviews"}</span></div>
          <ul className="service-tags">{supplier.services.map((service) => <li key={service}>{service}</li>)}</ul>
          <p className="response-time">{supplier.responseTime}</p>
          <div className="supplier-card-actions"><Link className="button button-secondary" href={`/suppliers/${supplier.slug}/`}>View supplier profile</Link>{role === "campaign_creator" ? <Link className="button button-primary" href={`/suppliers/${supplier.slug}/#start-engagement`}>Assign to a campaign</Link> : null}</div>
        </article>;
      })}</div> : <div className="empty-state"><h2>No suppliers match those filters.</h2><p>Try a lower rating, another category or a broader search.</p></div>}
      <div className="directory-footer-cta"><div><p className="eyebrow">Are you a service provider?</p><h2>Earn trust through verified work.</h2><p>Registration and promotion are separate: approval is earned through verification, never advertising spend.</p></div><div className="button-row"><Link className="button button-primary" href="/suppliers/register/">Register your business</Link><Link className="button button-secondary" href="/suppliers/promote/">View promotion packages</Link></div></div>
    </div>
  );
}
