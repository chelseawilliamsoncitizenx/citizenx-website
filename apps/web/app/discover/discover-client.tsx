"use client";

import { campaignProgress, type Campaign, type CampaignCategory } from "@citizenx/domain";
import { useMemo, useState } from "react";
import { CampaignCard } from "../../components/campaign-card";

const categories: Array<CampaignCategory | "All"> = ["All", "Community", "Democracy", "Education", "Environment", "Youth"];
type SortOption = "recommended" | "closest" | "ending";

export function DiscoverClient({ campaigns }: { campaigns: Campaign[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CampaignCategory | "All">("All");
  const [sort, setSort] = useState<SortOption>("recommended");

  const filtered = useMemo(() => {
    const normalised = query.trim().toLowerCase();
    const matches = campaigns.filter((campaign) => {
      const matchesCategory = category === "All" || campaign.category === category;
      const matchesQuery = !normalised || [campaign.title, campaign.summary, campaign.location]
        .some((value) => value.toLowerCase().includes(normalised));
      return matchesCategory && matchesQuery;
    });
    return [...matches].sort((a, b) => {
      if (sort === "closest") return campaignProgress(b) - campaignProgress(a);
      if (sort === "ending") return a.daysRemaining - b.daysRemaining;
      return 0;
    });
  }, [campaigns, category, query, sort]);

  return (
    <div>
      <div className="filters campaign-filters" role="search" aria-label="Filter and sort campaigns">
        <div className="field search-field">
          <label htmlFor="campaign-search">Search campaigns</label>
          <input id="campaign-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by cause or location" />
        </div>
        <div className="field">
          <label htmlFor="campaign-sort">Sort campaigns</label>
          <select id="campaign-sort" value={sort} onChange={(event) => setSort(event.target.value as SortOption)}>
            <option value="recommended">Recommended</option>
            <option value="closest">Closest to goal</option>
            <option value="ending">Ending soon</option>
          </select>
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
