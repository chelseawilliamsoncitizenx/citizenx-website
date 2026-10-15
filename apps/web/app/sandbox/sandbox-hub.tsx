"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { keys, readSandbox, roleLabels, seedSandboxCampaign, type SandboxAdvert, type SandboxAssignment, type SandboxCampaign, type SandboxRole, type SandboxSupplierApplication, writeSandbox } from "../../lib/sandbox-store";

const roleActions: Record<SandboxRole, Array<{ title: string; copy: string; href: string; cta: string }>> = {
  citizen: [
    { title: "Find a verified campaign", copy: "Find a cause, contribute with sandbox money and follow its ledger.", href: "/discover/", cta: "Browse campaigns" },
    { title: "Explore trusted suppliers", copy: "See verification, ratings, reviews and clearly labelled promotions.", href: "/suppliers/", cta: "View suppliers" }
  ],
  campaign_creator: [
    { title: "Create a campaign", copy: "Build a goal, budget and milestones, then submit for founder approval.", href: "/create-campaign/", cta: "Start campaign" },
    { title: "Choose verified suppliers", copy: "Assign suppliers to a milestone and review them only after completed work.", href: "/suppliers/", cta: "Find a supplier" }
  ],
  supplier: [
    { title: "Register your business", copy: "Submit service and compliance details for mock verification.", href: "/suppliers/register/", cta: "Apply for verification" },
    { title: "Promote your services", copy: "Buy a clearly labelled 7- or 30-day sponsored placement with a sandbox payment.", href: "/suppliers/promote/", cta: "Create an advert" }
  ],
  admin: [
    { title: "Review campaign submissions", copy: "Approve a campaign or request changes with an auditable decision.", href: "/admin/review/", cta: "Open review queue" },
    { title: "Check supplier marketplace", copy: "Inspect how verified, sponsored and reviewed suppliers appear to creators.", href: "/suppliers/", cta: "Inspect directory" }
  ]
};

export function SandboxHub() {
  const [role, setRole] = useState<SandboxRole>("citizen");
  const [counts, setCounts] = useState({ campaigns: 0, applications: 0, assignments: 0, adverts: 0 });

  function refresh() {
    setRole(readSandbox<SandboxRole>(keys.role, "citizen"));
    setCounts({
      campaigns: readSandbox<SandboxCampaign[]>(keys.campaigns, [seedSandboxCampaign]).length,
      applications: readSandbox<SandboxSupplierApplication[]>(keys.supplierApplications, []).length,
      assignments: readSandbox<SandboxAssignment[]>(keys.assignments, []).length,
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
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{action.title}</h2>
              <p>{action.copy}</p>
              <Link className="button button-primary" href={action.href}>{action.cta}</Link>
            </article>
          ))}
        </div>
        <div className="sandbox-explainer">
          <strong>How to test the connected flow</strong>
          <p>Create a campaign as a Campaign Creator, approve it as Admin, assign a verified supplier, mark the job complete and leave a verified review. Each action is stored only in this browser.</p>
        </div>
      </div>
    </div>
  );
}
