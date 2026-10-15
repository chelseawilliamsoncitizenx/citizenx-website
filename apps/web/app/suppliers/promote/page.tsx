import { suppliers } from "@citizenx/domain";
import type { Metadata } from "next";
import { SupplierPromotion } from "./supplier-promotion";

export const metadata: Metadata = { title: "Promote supplier services" };

export default function SupplierPromotionPage() {
  return <section className="section section-ivory page-section"><div className="shell wizard-shell"><div className="page-heading"><p className="eyebrow">Supplier advertising sandbox</p><h1>Promote services without buying trust.</h1><p>Sponsored placements receive visibility only. Verification, organic ranking and review scores remain independent.</p></div><SupplierPromotion suppliers={suppliers} /></div></section>;
}
