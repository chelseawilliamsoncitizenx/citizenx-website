"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FeatureIcon, type FeatureIconName } from "../../components/icons";
import { keys, readSandbox, roleLabels, seedSandboxAssignment, seedSandboxCampaign, seedSupplierApplication, type SandboxAdvert, type SandboxAssignment, type SandboxCampaign, type SandboxRole, type SandboxSupplierApplication, writeSandbox } from "../../lib/sandbox-store";

const roleActions: Record<SandboxRole, Array<{ title: string; copy: string; href: string; cta: string; icon: FeatureIconName }>> = {
  citizen: [
    { title: "Find a verified campaign", copy: "Find a cause, contribute with sandbox money and follow its ledger.", href: "/discover/", cta: "Browse campaigns", icon: "search" },
    { title: "Explore trusted suppliers", copy: "See verification, ratings, reviews and clearly labelled promotions.", href: "/suppliers/", cta: "View suppliers", icon: "supplier" }
  ],
  campaign_creator: [
    { title: "Create a campaign", copy: "Build a goal, budget and milestones, then submit for founder approval.", href: "/create-campaign/", cta: "Start campaign", icon: "campaign" },
    { title: "Choose verified suppliers", copy: "Assign suppliers to a milestone and review them only after completed work.", href: "/suppliers/", cta: "Find a supplier", icon: "supplier" }
  ],
  supplier: [
    { title: "Register your business", copy: "Submit service and compliance details for mock verification.", href: "/suppliers/register/", cta: "Apply for verification", icon: "verify" },
    { title: "Promote your services", copy: "Buy a clearly labelled 7- or 30-day sponsored placement with a sandbox payment.", href: "/suppliers/promote/", cta: "Create an advert", icon: "megaphone" }
  ],
  admin: [
    { title: "Open the admin control centre", copy: "See campaign, supplier and payment queues together with the named admin team.", href: "/admin/", cta: "View admin controls", icon: "shield" },
    { title: "Release supplier payments", copy: "Check milestone evidence and invoice details before approving a sandbox payment.", href: "/admin/payments/", cta: "Review payments", icon: "account" }
  ]
};

const roleDescriptions: Record<SandboxRole, string> = {
  citizen: "Discover causes, contribute safely and inspect the public evidence trail.",
  campaign_creator: "Build a transparent proposal, appoint verified suppliers and report delivery.",
  supplier: "Apply for verification, promote services transparently and build a rated track record.",
  admin: "Protect trust by approving campaigns, verifying suppliers and controlling milestone payments."
};

const roleIcons: Record<SandboxRole, FeatureIconName> = {
  citizen: "community",
  campaign_creator: "campaign",
  supplier: "supplier",
  admin: "shield"
};

export function SandboxHub() {
  const [role, setRole] = useState<SandboxRole>("citizen");
  const [counts, setCounts] = useState({ campaigns: 0, applications: 0, assignments: 0, adverts: 0 });

  function refresh() {
    setRole(readSandbox<SandboxRole>(keys.role, "citizen"));
    setCounts({
      campaigns: readSandbox<SandboxCampaign[]>(keys.campaigns, [seedSandboxCampaign]).length,
      applications: readSandbox<SandboxSupplierApplication[]>(keys.supplierApplications, [seedSupplierApplication]).length,
      assignments: readSandbox<SandboxAssignment[]>(keys.assignments, [seedSandboxAssignment]).length,
      adverts: readSandbox<SandboxAdvert[]>(keys.adverts, []).length
    });
  }

  useEffect(() => {
    refresh();
    window.addEventListener("citizenx-sandbox-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("citizenx-sandbox-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  function switchRole(nextRole: SandboxRole) {
    setRole(nextRole);
    writeSandbox(keys.role, nextRole);
  }

  return (
    <div className="sandbox-layout">
      <aside className="persona-panel" aria-labelledby="persona-title">
        <p className="eyebrow">Current persona</p>
        <h2 id="persona-title">{roleLabels[role]}</h2>
        <p>Choose a role to reveal the actions available to that participant.</p>
        <div className="persona-list">
          {(Object.entries(roleLabels) as Array<[SandboxRole, string]>).map(([value, label]) => (
            <button type="button" className={value === role ? "active" : ""} onClick={() => switchRole(value)} aria-pressed={value === role} key={value}>
              <span className="persona-dot" aria-hidden="true" />{label}
            </button>
          ))}
        </div>
        <button className="text-button" type="button" onClick={() => {
          Object.values(keys).forEach((key) => { if (key !== keys.role) window.localStorage.removeItem(key); });
          window.dispatchEvent(new CustomEvent("citizenx-sandbox-change"));
        }}>Reset sandbox activity</button>
      </aside>

      <div>
        <div className={`role-banner role-banner-${role}`} role="status" aria-live="polite">
          <span className="role-banner-icon" aria-hidden="true"><FeatureIcon name={roleIcons[role]} size={30} /></span>
          <div><p>You are viewing CitizenX as</p><h2>{roleLabels[role]}</h2><span>{roleDescriptions[role]}</span></div>
          {role === "admin" ? <div className="role-banner-links"><Link href="/admin/">Control centre</Link><Link href="/admin/review/">Campaigns</Link><Link href="/admin/suppliers/">Suppliers</Link><Link href="/admin/payments/">Payments</Link></div> : null}
        </div>
        <div className="workspace-summary">
          <div><span>Campaigns</span><strong>{counts.campaigns}</strong></div>
          <div><span>Supplier applications</span><strong>{counts.applications}</strong></div>
          <div><span>Supplier jobs</span><strong>{counts.assignments}</strong></div>
          <div><span>Active adverts</span><strong>{counts.adverts}</strong></div>
        </div>
        <p className="eyebrow">{roleLabels[role]} actions</p>
        <div className="workspace-action-grid">
          {roleActions[role].map((action, index) => (
            <article key={action.href}>
              <div className="workspace-action-mark"><span>{String(index + 1).padStart(2, "0")}</span><i aria-hidden="true"><FeatureIcon name={action.icon} /></i></div>
              <h2>{action.title}</h2>
              <p>{action.copy}</p>
              <Link className="button button-primary" href={action.href}>{action.cta}</Link>
            </article>
          ))}
        </div>
        <div className="sandbox-explainer">
          <strong>How to test the connected flow</strong>
          <p>Create a campaign as a Campaign Creator, approve it as Admin, assign a verified supplier, submit completion evidence, approve the supplier payment as Admin and then leave a verified review. Each action is stored only in this browser.</p>
        </div>
      </div>
    </div>
  );
}
