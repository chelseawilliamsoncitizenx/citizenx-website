"use client";

import type { Campaign, CampaignCategory } from "@citizenx/domain";
import { useMemo, useState } from "react";
import { CampaignCard } from "../../components/campaign-card";

const categories: Array<CampaignCategory | "All"> = ["All", "Community", "Education", "Youth"];

export function DiscoverClient({ campaigns }: { campaigns: Campaign[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CampaignCategory | "All">("All");

  const filtered = useMemo(() => {
    const normalised = query.trim().toLowerCase();
    return campaigns.filter((campaign) => {
      const matchesCategory = category === "All" || campaign.category === category;
      const matchesQuery = !normalised || [campaign.title, campaign.summary, campaign.location]
        .some((value) => value.toLowerCase().includes(normalised));
      return matchesCategory && matchesQuery;
    });
  }, [campaigns, category, query]);

  return (
    <div>
      <div className="filters" role="search" aria-label="Filter campaigns">
        <div className="field search-field">
          <label htmlFor="campaign-search">Search campaigns</label>
          <input id="campaign-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by cause or location" />
        </div>
        <fieldset className="filter-chips">
          <legend>Category</legend>
          <div>
            {categories.map((item) => (
              <button className={item === category ? "active" : ""} type="button" key={item} onClick={() => setCategory(item)} aria-pressed={item === category}>{item}</button>
            ))}
          </div>
        </fieldset>
      </div>
      <p className="result-count" aria-live="polite">{filtered.length} verified {filtered.length === 1 ? "campaign" : "campaigns"}</p>
      {filtered.length ? (
        <div className="card-grid">{filtered.map((campaign) => <CampaignCard campaign={campaign} key={campaign.slug} />)}</div>
      ) : (
        <div className="empty-state"><h2>No campaigns match those filters.</h2><p>Try another location, cause or category.</p></div>
      )}
    </div>
  );
}
