import { campaigns } from "@citizenx/domain";
import Link from "next/link";
import { CampaignCard } from "../components/campaign-card";
import { ArrowIcon } from "../components/icons";
import { LedgerPreview } from "../components/ledger-preview";
import { TrustStrip } from "../components/trust-strip";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light">Democracy, funded by the people.</p>
            <h1>Back the change you want to see.</h1>
            <p className="hero-lead">Discover verified civic campaigns, contribute securely, and follow how every rand is managed and used.</p>
            <div className="button-row">
              <Link className="button button-primary" href="/discover/">Discover campaigns <ArrowIcon /></Link>
              <Link className="button button-ghost" href="/how-it-works/">See how funds are protected</Link>
            </div>
            <p className="pilot-note"><span>Sandbox pilot</span> No real money or identity data is collected.</p>
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
            <Link className="text-link" href="/discover/">Explore all campaigns <ArrowIcon /></Link>
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
            <li><span>01</span><h3>Verify</h3><p>Campaign leaders, donors and suppliers pass appropriate checks.</p></li>
            <li><span>02</span><h3>Raise</h3><p>Clear goals, budgets and milestones show what funding will achieve.</p></li>
            <li><span>03</span><h3>Track</h3><p>Supporters see contributions, protected balances and verified activity.</p></li>
            <li><span>04</span><h3>Account</h3><p>Suppliers are paid against evidence, with a public audit trail.</p></li>
          </ol>
        </div>
      </section>
    </>
  );
}

