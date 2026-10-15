import { CheckIcon, ShieldIcon } from "./icons";

export function TrustStrip() {
  return (
    <section className="trust-strip" aria-labelledby="trust-strip-title">
      <div className="shell trust-grid">
        <div className="trust-heading">
          <ShieldIcon size={32} />
          <div>
            <p className="eyebrow">Built for trust</p>
            <h2 id="trust-strip-title">Your contribution stays traceable.</h2>
          </div>
        </div>
        <ul className="trust-list">
          <li><CheckIcon /> Verified campaign leaders</li>
          <li><CheckIcon /> Protected campaign balances</li>
          <li><CheckIcon /> Direct supplier payments</li>
          <li><CheckIcon /> Privacy-safe public ledger</li>
        </ul>
      </div>
    </section>
  );
}

