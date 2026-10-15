import type { Metadata } from "next";
import { PaymentApprovalQueue } from "./payment-approval-queue";

export const metadata: Metadata = { title: "Admin supplier payments" };

export default function AdminPaymentsPage() {
  return <section className="section section-ivory page-section"><div className="shell"><div className="page-heading"><p className="eyebrow">Admin sandbox</p><h1>Supplier payment queue.</h1><p>Release funds only after completion evidence, invoice details and the campaign milestone agree. No real money moves in this sandbox.</p></div><PaymentApprovalQueue /></div></section>;
}
