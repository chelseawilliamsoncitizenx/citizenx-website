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
              <Link className="button button-ghost" href="/join/">Join the founding network</Link>
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
          <div className="accountability-heading"><p className="eyebrow">How CitizenX works</p><h2 id="journey-title">Accountability, built into every step.</h2></div>
          <ol className="step-grid">
            <li><span className="step-icon" aria-hidden="true"><FeatureIcon name="verify" /></span><div><span className="step-number">Step 01</span><h3>Verify</h3><p>Campaign leaders, donors and suppliers pass appropriate checks.</p></div></li>
            <li><span className="step-icon" aria-hidden="true"><FeatureIcon name="campaign" /></span><div><span className="step-number">Step 02</span><h3>Raise</h3><p>Clear goals, budgets and milestones show what funding will achieve.</p></div></li>
            <li><span className="step-icon" aria-hidden="true"><FeatureIcon name="track" /></span><div><span className="step-number">Step 03</span><h3>Track</h3><p>Supporters see contributions, protected balances and verified activity.</p></div></li>
            <li><span className="step-icon" aria-hidden="true"><FeatureIcon name="account" /></span><div><span className="step-number">Step 04</span><h3>Account</h3><p>Suppliers are paid against evidence, with a public audit trail.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="founding-network-band" aria-labelledby="founding-network-title">
        <div className="shell founding-network-inner">
          <div>
            <p className="eyebrow eyebrow-light">Build CitizenX with us</p>
            <h2 id="founding-network-title">Join the founding network.</h2>
            <p>Share your expertise, explore a partnership or help shape transparent civic funding in South Africa.</p>
          </div>
          <Link className="button founding-network-button" href="/join/">Join the founding network <ArrowIcon /></Link>
        </div>
      </section>
    </>
  );
}
