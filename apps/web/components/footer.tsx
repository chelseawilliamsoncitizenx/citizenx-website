import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Logo />
          <p>Transparent funding. Accountable leadership. Citizen-powered democracy.</p>
          <p className="footer-note">QA experience · Demo data only · No real payments are processed.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/">Home</Link>
          <Link href="/discover/">Find a campaign</Link>
          <Link href="/suppliers/">Verified suppliers</Link>
          <Link href="/create-campaign/">Start a campaign</Link>
          <Link href="/sandbox/">Sandbox workspace</Link>
          <Link href="/how-it-works/">How it works</Link>
          <Link href="/about/">About CitizenX</Link>
          <Link href="/accessibility/">Accessibility</Link>
          <a href="https://www.citizenx.fund/">Founding network</a>
        </nav>
        <div>
          <p className="eyebrow">Need help?</p>
          <a href="mailto:hello@citizenx.fund">hello@citizenx.fund</a>
          <p className="footer-note">Built accessibly for South Africa, with Africa in mind.</p>
        </div>
      </div>
    </footer>
  );
}
