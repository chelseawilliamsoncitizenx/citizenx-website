import type { Metadata } from "next";
import { ReviewQueue } from "./review-queue";

export const metadata: Metadata = { title: "Admin campaign review" };

export default function AdminReviewPage() {
  return <section className="section section-ivory page-section"><div className="shell"><div className="page-heading"><p className="eyebrow">Admin sandbox</p><h1>Campaign review queue.</h1><p>Approve transparent, eligible campaigns or request changes before they become discoverable.</p></div><ReviewQueue /></div></section>;
}
