import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, FeatureIcon } from "../../components/icons";
import { FoundingNetworkForm } from "./founding-network-form";

export const metadata: Metadata = {
  title: "Join the founding network",
  description: "Contact CitizenX about joining its founding network, partnership opportunities or the public pilot."
};

export default function JoinPage() {
  return (
    <>
      <section className="simple-hero join-hero">
        <div className="shell join-hero-grid">
          <div>
            <p className="eyebrow eyebrow-light">Founding network</p>
            <h1>Help build a trusted way to fund civic action.</h1>
            <p>We are inviting values-aligned citizens, civic leaders, funders, suppliers and technical partners to help shape CitizenX.</p>
          </div>
          <div className="join-contact-card">
            <span aria-hidden="true"><FeatureIcon name="community" size={30} /></span>
            <p className="eyebrow">Direct contact</p>
            <h2>Prefer to use your own email?</h2>
            <p>Every public enquiry is directed to one monitored inbox.</p>
            <a className="text-link" href="mailto:hello@citizenx.fund?subject=CitizenX%20founding%20network%20enquiry">hello@citizenx.fund <ArrowIcon /></a>
          </div>
        </div>
      </section>

      <section className="section section-ivory" aria-labelledby="join-form-title">
        <div className="shell join-layout">
          <div className="join-intro">
            <p className="eyebrow">Start a conversation</p>
            <h2 id="join-form-title">Tell us how you would like to contribute.</h2>
            <p>This static website does not store or transmit your information. It prepares a structured email on your device for you to review before sending.</p>
            <ul className="join-points">
              <li><FeatureIcon name="verify" size={19} /> You decide what is sent</li>
              <li><FeatureIcon name="lock" size={19} /> Nothing is saved in the browser</li>
              <li><FeatureIcon name="track" size={19} /> A copy option is available if no email app opens</li>
            </ul>
            <Link className="text-link" href="/about/">Learn more about CitizenX <ArrowIcon /></Link>
          </div>
          <FoundingNetworkForm />
        </div>
      </section>
    </>
  );
}
