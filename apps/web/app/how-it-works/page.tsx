import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, CheckIcon } from "../../components/icons";
import { TrustStrip } from "../../components/trust-strip";

export const metadata: Metadata = { title: "How CitizenX works" };

export default function HowItWorksPage() {
  return (
    <>
      <section className="simple-hero"><div className="shell narrow-copy"><p className="eyebrow eyebrow-light">How it works</p><h1>Transparent by design, accountable in practice.</h1><p>CitizenX connects verified campaigns with people who want to fund change—and keeps the movement of money visible from contribution to delivery.</p></div></section>
      <section className="section section-ivory"><div className="shell"><ol className="process-list">
        <li><span>01</span><div><p className="eyebrow">Verify</p><h2>Start with accountable people and organisations.</h2><p>Campaign leaders, donors and suppliers complete checks appropriate to their role. Risk signals can be reviewed by CitizenX trust operations before money moves.</p><ul><li><CheckIcon /> Identity and organisation checks</li><li><CheckIcon /> PEP and sanctions screening</li><li><CheckIcon /> Clear campaign eligibility</li></ul></div></li>
        <li><span>02</span><div><p className="eyebrow">Raise</p><h2>Make the plan visible before asking for support.</h2><p>Campaigns publish a goal, a budget and evidence-based milestones so contributors can understand what their funding is intended to achieve.</p></div></li>
        <li><span>03</span><div><p className="eyebrow">Protect</p><h2>Keep campaign funds separate and controlled.</h2><p>Contributions enter a protected campaign balance. Approved suppliers are paid against invoices and milestones instead of unrestricted cash being released.</p></div></li>
        <li><span>04</span><div><p className="eyebrow">Account</p><h2>Let every supporter follow the trail.</h2><p>Privacy-safe ledger activity, delivery evidence and campaign updates create a durable public record of progress.</p></div></li>
      </ol><div className="center-cta"><Link className="button button-primary" href="/discover/">Find a verified campaign <ArrowIcon /></Link></div></div></section>
      <TrustStrip />
    </>
  );
}
