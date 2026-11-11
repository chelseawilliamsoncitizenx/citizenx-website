import { campaigns } from "@citizenx/domain";
import type { Metadata } from "next";
import { EngagementWorkspace } from "./engagement-workspace";

export const metadata: Metadata = { title: "Supplier engagement workspace" };

export default function SupplierEngagementsPage() {
  return <section className="section section-ivory page-section"><div className="shell"><div className="page-heading"><p className="eyebrow">Browser-local QA workflow</p><h1>Supplier engagement workspace.</h1><p>Test enquiries, questions, quotations, invoices, completion evidence, campaign updates, verified reviews and admin payment handoff from the active sandbox role.</p></div><EngagementWorkspace campaigns={campaigns} /></div></section>;
}
