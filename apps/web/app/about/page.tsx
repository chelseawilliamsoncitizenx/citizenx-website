import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, CheckIcon, FeatureIcon, type FeatureIconName } from "../../components/icons";

export const metadata: Metadata = { title: "About CitizenX" };

const principles: Array<{ title: string; copy: string; icon: FeatureIconName }> = [
  { title: "Political neutrality", copy: "Fair, non-partisan standards across political parties and civic groupings.", icon: "community" },
  { title: "Verification", copy: "Clear eligibility, identity and campaign-vetting requirements.", icon: "verify" },
  { title: "Transparency", copy: "Visible goals, financial progress, milestones and public reporting.", icon: "track" },
  { title: "Privacy and security", copy: "Responsible collection and protection of donor and campaign data.", icon: "lock" },
  { title: "Independent oversight", copy: "Governance designed to protect public trust and prevent undue influence.", icon: "shield" }
];

const partners: Array<{ title: string; copy: string; icon: FeatureIconName }> = [
  { title: "Funders", copy: "Support the development, governance and testing of the platform.", icon: "account" },
  { title: "Civic, legal and democracy partners", copy: "Help shape a credible, locally grounded model.", icon: "community" },
  { title: "Technology and compliance partners", copy: "Contribute expertise and responsible infrastructure.", icon: "lock" },
  { title: "Political and civic leaders", copy: "Express interest in participating in a future pilot.", icon: "megaphone" },
  { title: "Media and public-education partners", copy: "Help communities understand and engage with the model.", icon: "globe" }
];

export default function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <span className="about-shape about-shape-large" aria-hidden="true" />
        <span className="about-shape about-shape-small" aria-hidden="true" />
        <div className="shell about-hero-grid">
          <div>
            <p className="eyebrow eyebrow-light">About CitizenX</p>
            <h1>Independent infrastructure for democratic trust.</h1>
            <p>CitizenX is building a secure, non-partisan platform where verified civic and political leaders raise funds from the people they serve—and communities can see how every rand is raised, managed and used.</p>
            <div className="about-origin"><span aria-hidden="true"><FeatureIcon name="globe" /></span><p><strong>Starting in South Africa.</strong> Built with a vision to grow across Africa.</p></div>
          </div>
          <div className="about-ledger" role="group" aria-label="Example of a transparent campaign trail">
            <div className="about-ledger-head"><div><span>Community project</span><h2>School library rebuild</h2></div><span className="verified-badge"><CheckIcon size={14} /> Verified</span></div>
            <div className="about-ledger-amount"><strong>R52,900</strong><span>of R90,000 goal</span></div>
            <div className="progress-track"><span style={{ width: "59%" }} /></div>
            <p className="ledger-kicker">Every rand leaves a trail</p>
            <ul>
              <li><span className="status-icon"><CheckIcon size={15} /></span><span><strong>Paid to Thandi&apos;s Joinery</strong><small>Verified supplier · invoice #0088</small></span><b>R34,000</b></li>
              <li><span className="about-pending-dot" aria-hidden="true" /><span><strong>Awaiting proof of service</strong><small>Shelving · released on completion</small></span><b>R18,900</b></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-ivory about-problem" aria-labelledby="about-problem-title">
        <div className="shell about-split">
          <div className="about-section-heading"><span className="section-symbol" aria-hidden="true"><FeatureIcon name="community" size={28} /></span><p className="eyebrow">The problem</p><h2 id="about-problem-title">Communities want change. Trust is standing in the way.</h2></div>
          <div className="about-copy"><p>Across Africa, communities are asked to participate in democracy without always being able to see how political and civic work is funded, or whether resources reach their intended purpose.</p><p>Political and civic leaders also need credible, lawful ways to mobilise support for campaigns, community projects and ongoing public participation. CitizenX is being built to close that gap.</p></div>
        </div>
      </section>

      <section className="section about-solution" aria-labelledby="about-solution-title">
        <div className="shell about-split">
          <div className="about-section-heading"><span className="section-symbol symbol-light" aria-hidden="true"><FeatureIcon name="track" size={28} /></span><p className="eyebrow eyebrow-light">The solution</p><h2 id="about-solution-title">An independent platform where every rand leaves a trail.</h2></div>
          <div className="about-copy"><p>CitizenX lets verified civic and political leaders raise from the people they serve, with verification, donor transparency and accountable disbursement built in from day one.</p><ul className="about-check-list"><li><CheckIcon /> Clear public goals and budgets</li><li><CheckIcon /> Controlled, evidence-led disbursements</li><li><CheckIcon /> Direct payments to verified suppliers</li><li><CheckIcon /> A visible audit trail for communities</li></ul></div>
        </div>
      </section>

      <section className="section how-summary" aria-labelledby="about-how-title">
        <div className="shell"><p className="eyebrow">How it works</p><h2 id="about-how-title">Accountability, built into every step.</h2><ol className="step-grid about-step-grid"><li><div className="step-marker"><span>01</span><i aria-hidden="true"><FeatureIcon name="verify" /></i></div><h3>Verify</h3><p>Identity, compliance and eligibility checks establish who may participate.</p></li><li><div className="step-marker"><span>02</span><i aria-hidden="true"><FeatureIcon name="campaign" /></i></div><h3>Raise</h3><p>Verified leaders publish clear goals, budgets and milestones.</p></li><li><div className="step-marker"><span>03</span><i aria-hidden="true"><FeatureIcon name="track" /></i></div><h3>Track</h3><p>Supporters follow funding, decisions and impact as work progresses.</p></li><li><div className="step-marker"><span>04</span><i aria-hidden="true"><FeatureIcon name="account" /></i></div><h3>Account</h3><p>Protected disbursement and evidence create an independent audit trail.</p></li></ol></div>
      </section>

      <section className="section section-ivory" aria-labelledby="principles-title"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Our principles</p><h2 id="principles-title">Independent by design. Accountable in practice.</h2></div><p className="section-intro">CitizenX is democratic trust infrastructure—not a vehicle for any political party, ideology or individual.</p></div><div className="principle-card-grid">{principles.map((principle, index) => <article key={principle.title}><div className="principle-icon" aria-hidden="true"><FeatureIcon name={principle.icon} /></div><span>{String(index + 1).padStart(2, "0")}</span><h3>{principle.title}</h3><p>{principle.copy}</p></article>)}</div></div></section>

      <section className="about-why" aria-labelledby="why-now-title"><div className="shell"><div className="about-why-mark" aria-hidden="true"><FeatureIcon name="globe" size={34} /></div><div><p className="eyebrow eyebrow-light">Why now</p><h2 id="why-now-title">Democracy needs new infrastructure for trust.</h2><p>Digital fundraising can bring citizens closer to the leaders, campaigns and projects they believe in. But participation without transparency can deepen distrust. CitizenX is creating a model where access to funding and accountability grow together.</p></div></div></section>

      <section className="section section-ivory" aria-labelledby="involved-title"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Get involved</p><h2 id="involved-title">Help build a new standard for transparent civic funding.</h2></div><p className="section-intro">We are inviting values-aligned organisations and individuals to join CitizenX at its earliest stage.</p></div><div className="partner-grid">{partners.map((partner) => <article key={partner.title}><span className="partner-icon" aria-hidden="true"><FeatureIcon name={partner.icon} /></span><h3>{partner.title}</h3><p>{partner.copy}</p></article>)}</div></div></section>

      <section className="cta-band"><div className="shell"><div><p className="eyebrow eyebrow-light">Founding network</p><h2>Help shape the pilot and the trust model behind it.</h2></div><div className="button-row"><Link className="button button-light" href="/sandbox/">Explore the MVP <ArrowIcon /></Link><Link className="button button-ghost" href="/join/">Join the founding network</Link></div></div></section>
    </>
  );
}
