import { campaigns } from "@citizenx/domain";
import Link from "next/link";
import { CampaignCard } from "../components/campaign-card";
import { ArrowIcon, FeatureIcon } from "../components/icons";
import { LedgerPreview } from "../components/ledger-preview";
import { TrustStrip } from "../components/trust-strip";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <span className="hero-shape" aria-hidden="true" />
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light">Democracy, funded by the people.</p>
            <h1>Back the change you want to see.</h1>
            <p className="hero-lead">Find verified civic campaigns, contribute securely, and follow how every rand is managed and used.</p>
            <div className="button-row">
              <Link className="button button-primary" href="/discover/">Find a campaign <ArrowIcon /></Link>
              <Link className="button button-ghost" href="/how-it-works/">See how funds are protected</Link>
            </div>
            <p className="pilot-note"><span>QA pilot</span> Use demo information only. No real payments are processed.</p>
          </div>
          <LedgerPreview />
        </div>
      </section>

      <section className="section section-ivory" aria-labelledby="featured-title">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Verified campaigns</p>
              <h2 id="featured-title">Community work you can follow.</h2>
            </div>
            <Link className="text-link" href="/discover/">Find all campaigns <ArrowIcon /></Link>
          </div>
          <div className="card-grid">
            {campaigns.map((campaign) => <CampaignCard campaign={campaign} key={campaign.slug} />)}
          </div>
        </div>
      </section>

      <TrustStrip />

      <section className="section how-summary" aria-labelledby="journey-title">
        <div className="shell">
          <p className="eyebrow">How CitizenX works</p>
          <h2 id="journey-title">Accountability, built into every step.</h2>
          <ol className="step-grid">
            <li><div className="step-marker"><span>01</span><i aria-hidden="true"><FeatureIcon name="verify" /></i></div><h3>Verify</h3><p>Campaign leaders, donors and suppliers pass appropriate checks.</p></li>
            <li><div className="step-marker"><span>02</span><i aria-hidden="true"><FeatureIcon name="campaign" /></i></div><h3>Raise</h3><p>Clear goals, budgets and milestones show what funding will achieve.</p></li>
            <li><div className="step-marker"><span>03</span><i aria-hidden="true"><FeatureIcon name="track" /></i></div><h3>Track</h3><p>Supporters see contributions, protected balances and verified activity.</p></li>
            <li><div className="step-marker"><span>04</span><i aria-hidden="true"><FeatureIcon name="account" /></i></div><h3>Account</h3><p>Suppliers are paid against evidence, with a public audit trail.</p></li>
          </ol>
        </div>
      </section>
    </>
  );
}
