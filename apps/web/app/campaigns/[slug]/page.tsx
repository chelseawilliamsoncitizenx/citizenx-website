import { campaignProgress, campaigns, formatZar, getCampaign } from "@citizenx/domain";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon, CheckIcon, ShieldIcon } from "../../../components/icons";

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
              <Link className="button button-secondary button-wide" href={`/ledger/${campaign.slug}/`}>View the public ledger</Link>
              <div className="protected-note"><ShieldIcon /><p><strong>Your contribution is protected.</strong><br />Funds are released to verified suppliers against approved evidence.</p></div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section section-ivory">
        <div className="shell detail-grid">
          <article className="story-copy">
            <p className="eyebrow">The project</p>
            <h2>Why this work matters</h2>
            <p>{campaign.story}</p>
            <h2>Planned milestones</h2>
            <ol className="milestone-list">
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
            <p>{campaign.leader.organisation}</p>
            <p className="verified-line"><CheckIcon /> Identity and organisation verified</p>
            <dl>
              <div><dt>Beneficiary</dt><dd>{campaign.beneficiaryType === "civic" ? "Civic organisation" : "Public-interest project"}</dd></div>
              <div><dt>Fund route</dt><dd>CitizenX Foundation NPC</dd></div>
              <div><dt>Payment model</dt><dd>Controlled supplier disbursement</dd></div>
            </dl>
          </aside>
        </div>
      </section>
    </>
  );
}
