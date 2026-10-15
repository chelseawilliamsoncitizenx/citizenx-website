import type { Metadata } from "next";
import { SupplierRegistration } from "./supplier-registration";

export const metadata: Metadata = { title: "Register as a supplier" };

export default function SupplierRegistrationPage() {
  return <section className="section section-ivory page-section"><div className="shell wizard-shell"><div className="page-heading"><p className="eyebrow">Supplier sandbox</p><h1>Apply to become a verified supplier.</h1><p>Tell CitizenX what you provide, where you work and who is authorised to represent the business.</p></div><SupplierRegistration /></div></section>;
}
