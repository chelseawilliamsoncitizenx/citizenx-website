import { campaignProgress, campaigns, formatZar, getCampaign, getCampaignSupporters, getCampaignUpdates } from "@citizenx/domain";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon, CheckIcon, ShieldIcon } from "../../../components/icons";
import { CampaignCommunity } from "./campaign-community";

export function generateStaticParams() {
  return campaigns.map((campaign) => ({ slug: campaign.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const campaign = getCampaign(slug);
  return campaign ? { title: campaign.title, description: campaign.summary } : {};
}

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = getCampaign(slug);
  if (!campaign) notFound();
  const progress = campaignProgress(campaign);
  const updates = getCampaignUpdates(campaign.slug);
  const supporters = getCampaignSupporters(campaign.slug);
  const latestUpdate = updates[0];

  return (
    <>
      <section className="campaign-hero">
        <div className="shell">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/discover/">Find a campaign</Link><span aria-hidden="true">/</span><span aria-current="page">{campaign.title}</span>
          </nav>
          <div className="campaign-hero-grid">
            <div>
              <div className="campaign-meta campaign-meta-light">
                <span className="verified-badge"><CheckIcon size={14} /> Verified campaign</span>
                <span>{campaign.category}</span>
              </div>
              <h1>{campaign.title}</h1>
              <p className="campaign-summary">{campaign.summary}</p>
              <p className="campaign-location">{campaign.location} · {campaign.daysRemaining} days remaining</p>
              <div className="campaign-art campaign-art-large">
                <Image src={campaign.image} alt={campaign.imageAlt} width={1536} height={1024} sizes="(max-width: 960px) calc(100vw - 40px), 62vw" priority />
                {latestUpdate ? <span className="campaign-photo-update"><CheckIcon size={15} /> Updated {new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "short" }).format(new Date(latestUpdate.publishedAt))}</span> : null}
              </div>
            </div>
            <aside className="funding-card" aria-label="Campaign funding summary">
              <p className="funding-total">{formatZar(campaign.raisedCents)}</p>
              <p>raised of {formatZar(campaign.goalCents)} goal</p>
              <div className="progress-track" role="progressbar" aria-label="Funding progress" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <span style={{ width: `${progress}%` }} />
              </div>
              <div className="campaign-stats"><strong>{progress}% raised</strong><span>{campaign.contributorCount} contributors</span></div>
              <Link className="button button-primary button-wide" href={`/donate/${campaign.slug}/`}>Contribute securely <ArrowIcon /></Link>
              <Link className="button button-secondary button-wide" href={`/ledger/${campaign.slug}/?view=income`}>View the public ledger</Link>
              <div className="funding-quick-facts"><span><strong>{updates.length}</strong> progress updates</span><span><strong>{campaign.milestones.length}</strong> controlled milestones</span></div>
              <div className="protected-note"><ShieldIcon /><p><strong>Your contribution is protected.</strong><br />Funds are released to verified suppliers against approved evidence.</p></div>
            </aside>
          </div>
        </div>
      </section>

      <nav className="campaign-section-nav" aria-label="Campaign page sections"><div className="shell"><a href="#story">Story</a><a href="#milestones">Milestones</a><a href="#updates">Updates</a><a href="#supporters">Supporters</a><Link href={`/ledger/${campaign.slug}/?view=income`}>Income audit trail</Link><Link href={`/ledger/${campaign.slug}/?view=expenses`}>Expense audit trail</Link></div></nav>

      <section className="section section-ivory" id="story">
        <div className="shell detail-grid">
          <article className="story-copy">
            <p className="eyebrow">About this campaign</p>
            <h2>The story and intended impact.</h2>
            <p>{campaign.story}</p>
            <div className="campaign-story-assurance"><CheckIcon /><p><strong>CitizenX verified the campaign leadership and public-interest purpose.</strong><br />Supplier payments still require evidence and an admin decision.</p></div>
            <h2 id="milestones">Planned milestones</h2>
            <ol className="milestone-list" aria-labelledby="milestones">
              {campaign.milestones.map((milestone, index) => (
                <li key={milestone.id}>
                  <span className={`milestone-state milestone-${milestone.status}`}>{milestone.status === "funded" ? <CheckIcon /> : index + 1}</span>
                  <div><h3>{milestone.title}</h3><p>{milestone.description}</p></div>
                  <strong>{formatZar(milestone.amountCents)}</strong>
                </li>
              ))}
            </ol>
          </article>
          <aside className="leader-card">
            <p className="eyebrow">Campaign leadership</p>
            <div className="avatar" aria-hidden="true">{campaign.leader.name.split(" ").map((part) => part[0]).join("")}</div>
            <h2>{campaign.leader.name}</h2>
            <p>{campaign.leader.organisation}<br />{campaign.location}</p>
            <p className="verified-line"><CheckIcon /> Identity and organisation verified</p>
            <dl>
              <div><dt>Campaign status</dt><dd>Actively fundraising</dd></div>
              <div><dt>Time remaining</dt><dd>{campaign.daysRemaining} days</dd></div>
              <div><dt>Beneficiary</dt><dd>{campaign.beneficiaryType === "civic" ? "Civic organisation" : "Public-interest project"}</dd></div>
              <div><dt>Fund route</dt><dd>CitizenX Foundation NPC</dd></div>
              <div><dt>Payment model</dt><dd>Controlled supplier disbursement</dd></div>
            </dl>
          </aside>
        </div>
      </section>
      <CampaignCommunity campaign={campaign} seedUpdates={updates} seedSupporters={supporters} />
      <div className="campaign-mobile-cta"><span><strong>{formatZar(campaign.raisedCents)}</strong> raised</span><Link className="button button-primary" href={`/donate/${campaign.slug}/`}>Contribute</Link></div>
    </>
  );
}
