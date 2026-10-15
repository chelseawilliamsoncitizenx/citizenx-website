import type { Metadata } from "next";
import { AdminControlCentre } from "./admin-control-centre";

export const metadata: Metadata = { title: "Admin control centre" };

export default function AdminPage() {
  return (
    <section className="section section-ivory page-section">
      <div className="shell">
        <div className="page-heading admin-heading">
          <p className="eyebrow">Admin sandbox</p>
          <h1>Protect trust at every decision.</h1>
          <p>Review campaigns, verify suppliers and release milestone payments from one operational workspace. Every action below is simulated and stored only in this browser.</p>
        </div>
        <AdminControlCentre />
      </div>
    </section>
  );
}
