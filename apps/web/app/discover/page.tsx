import type { Metadata } from "next";
import { campaigns } from "@citizenx/domain";
import { DiscoverClient } from "./discover-client";

export const metadata: Metadata = { title: "Find a campaign" };

export default function DiscoverPage() {
  return (
    <section className="section section-ivory page-section">
      <div className="shell">
        <div className="page-heading">
          <p className="eyebrow">Find a campaign</p>
          <h1>Fund work that matters to you.</h1>
          <p>Every campaign is verified and every contribution remains traceable through a privacy-safe public ledger.</p>
        </div>
        <DiscoverClient campaigns={campaigns} />
      </div>
    </section>
  );
}
