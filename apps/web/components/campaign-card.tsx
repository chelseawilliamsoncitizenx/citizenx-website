import { campaignProgress, formatZar, type Campaign } from "@citizenx/domain";
import Link from "next/link";
import { ArrowIcon, CheckIcon } from "./icons";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const progress = campaignProgress(campaign);

  return (
    <article className="campaign-card">
      <div className={`campaign-art campaign-art-${campaign.accent}`} aria-hidden="true">
        <span className="art-sun" />
        <span className="art-land art-land-back" />
        <span className="art-land art-land-front" />
        <span className="art-marker" />
      </div>
      <div className="campaign-card-body">
        <div className="campaign-meta">
          <span className="verified-badge"><CheckIcon size={14} /> Verified</span>
          <span>{campaign.category}</span>
        </div>
        <h3><Link href={`/campaigns/${campaign.slug}/`}>{campaign.title}</Link></h3>
        <p>{campaign.summary}</p>
        <p className="location">{campaign.location}</p>
        <div className="progress-copy">
          <strong>{formatZar(campaign.raisedCents)}</strong>
          <span>of {formatZar(campaign.goalCents)}</span>
        </div>
        <div className="progress-track" role="progressbar" aria-label={`${campaign.title} funding progress`} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="campaign-stats">
          <span>{progress}% raised</span>
          <span>{campaign.contributorCount} contributors</span>
        </div>
        <Link className="card-link" href={`/campaigns/${campaign.slug}/`}>
          View campaign <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}

