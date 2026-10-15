import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "CitizenX accessibility statement and ways to report an access barrier."
};

export default function AccessibilityPage() {
  return (
    <>
      <section className="simple-hero">
        <div className="shell narrow-copy">
          <p className="eyebrow eyebrow-light">Accessibility</p>
          <h1>CitizenX should work for every citizen.</h1>
          <p>We are building this pilot to meet WCAG 2.2 Level AA and to remain usable with keyboards, screen readers, zoom and reduced-motion settings.</p>
        </div>
      </section>
      <section className="section section-ivory">
        <div className="shell accessibility-copy">
          <div>
            <p className="eyebrow">What we support</p>
            <h2>Access is part of the product, not an add-on.</h2>
          </div>
          <div>
            <ul className="accessibility-list">
              <li>Visible keyboard focus and a skip link to the main content.</li>
              <li>Semantic headings, landmarks, labels and status announcements.</li>
              <li>Text alternatives for meaningful campaign photography.</li>
              <li>Colour contrast designed for WCAG AA, without relying on colour alone.</li>
              <li>Responsive layouts that reflow on narrow screens and at high zoom.</li>
              <li>Reduced motion for people who request it in their device settings.</li>
            </ul>
            <h2>Tell us about a barrier</h2>
            <p>If anything prevents you from finding, understanding or completing a task, email <a href="mailto:hello@citizenx.fund">hello@citizenx.fund</a>. Please include the page and what you were trying to do.</p>
            <p className="fine-print">This statement applies to the CitizenX MVP pilot and was last reviewed in October 2026.</p>
          </div>
        </div>
      </section>
    </>
  );
}
