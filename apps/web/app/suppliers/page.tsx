import { suppliers } from "@citizenx/domain";
import type { Metadata } from "next";
import Link from "next/link";
import { SupplierDirectory } from "./supplier-directory";

export const metadata: Metadata = { title: "Verified suppliers" };

export default function SuppliersPage() {
  return (
    <section className="section section-ivory page-section">
      <div className="shell">
        <div className="directory-heading">
          <div className="page-heading">
            <p className="eyebrow">Verified supplier marketplace</p>
            <h1>Find trusted partners for campaign work.</h1>
            <p>Compare verified businesses, completed CitizenX jobs and reviews from campaign creators with a completed paid engagement.</p>
          </div>
          <div className="directory-ctas"><Link className="button button-primary" href="/suppliers/register/">Register as a supplier</Link><Link className="button button-secondary" href="/suppliers/promote/">Promote your services</Link></div>
        </div>
        <div className="marketplace-principles" aria-label="Marketplace safeguards"><span>✓ Verification cannot be bought</span><span>✓ Reviews require completed work</span><span>✓ Paid placements are clearly labelled</span></div>
        <SupplierDirectory suppliers={suppliers} />
      </div>
    </section>
  );
}
