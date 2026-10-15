import type { Metadata } from "next";
import { SupplierReviewQueue } from "./supplier-review-queue";

export const metadata: Metadata = { title: "Admin supplier approvals" };

export default function AdminSuppliersPage() {
  return <section className="section section-ivory page-section"><div className="shell"><div className="page-heading"><p className="eyebrow">Admin sandbox</p><h1>Supplier approval queue.</h1><p>Review registration, authorised contacts and service evidence before a supplier can appear as verified.</p></div><SupplierReviewQueue /></div></section>;
}
