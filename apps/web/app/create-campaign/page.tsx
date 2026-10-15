import type { Metadata } from "next";
import { CampaignWizard } from "./campaign-wizard";

export const metadata: Metadata = { title: "Create a sandbox campaign" };

export default function CreateCampaignPage() {
  return (
    <section className="section section-ivory page-section">
      <div className="shell wizard-shell">
        <div className="page-heading">
          <p className="eyebrow">Campaign Creator sandbox</p>
          <h1>Create a transparent campaign.</h1>
          <p>Build the public case, balance the milestone budget and submit it to the founding team for review.</p>
        </div>
        <CampaignWizard />
      </div>
    </section>
  );
}
