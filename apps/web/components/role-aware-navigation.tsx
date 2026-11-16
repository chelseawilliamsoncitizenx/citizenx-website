"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { keys, readSandbox, roleLabels, type SandboxRole, writeSandbox } from "../lib/sandbox-store";
import { ChevronIcon, FeatureIcon, type FeatureIconName } from "./icons";

type NavItem = { href: string; label: string; description?: string; icon: FeatureIconName };

const primaryNavigation: NavItem[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/discover/", label: "Find a campaign", icon: "search" },
  { href: "/suppliers/", label: "Suppliers", icon: "supplier" },
  { href: "/create-campaign/", label: "Start a campaign", icon: "campaign" }
];

const moreNavigation: NavItem[] = [
  { href: "/how-it-works/", label: "How it works", description: "Follow every rand from contribution to proof.", icon: "track" },
  { href: "/about/", label: "About CitizenX", description: "Our purpose, principles and public-interest model.", icon: "community" },
  { href: "/join/", label: "Join the founding network", description: "Contact CitizenX about partnerships and early participation.", icon: "globe" },
  { href: "/sandbox/", label: "Sandbox workspace", description: "Test the MVP safely from every role.", icon: "lock" },
  { href: "/accessibility/", label: "Accessibility", description: "How this pilot supports inclusive access.", icon: "verify" }
];

const roleTools: Record<SandboxRole, { label: string; description: string; items: NavItem[] }> = {
  citizen: {
    label: "Citizen tools",
    description: "Discover trusted civic work and follow the evidence.",
    items: [
      { href: "/discover/", label: "Find a campaign", description: "Browse verified public-interest campaigns.", icon: "search" },
      { href: "/suppliers/", label: "Verified suppliers", description: "See who delivers campaign milestones.", icon: "supplier" },
      { href: "/sandbox/", label: "Citizen workspace", description: "Try the contribution and tracking journey.", icon: "community" }
    ]
  },
  campaign_creator: {
    label: "Creator tools",
    description: "Plan, submit and deliver an accountable campaign.",
    items: [
      { href: "/create-campaign/", label: "Create a campaign", description: "Build the goal, budget and milestones.", icon: "campaign" },
      { href: "/suppliers/", label: "Find a supplier", description: "Choose verified help for campaign work.", icon: "supplier" },
      { href: "/supplier-engagements/", label: "Supplier engagements", description: "Manage quotations, invoices and completion approvals.", icon: "track" },
      { href: "/campaigns/ward-12-clinic-water-tank/#updates", label: "Post campaign update", description: "Share progress notes and demo photographs.", icon: "track" },
      { href: "/sandbox/", label: "Creator workspace", description: "See your full sandbox workflow.", icon: "track" }
    ]
  },
  supplier: {
    label: "Supplier tools",
    description: "Get verified, win trusted work and build a reputation.",
    items: [
      { href: "/suppliers/register/", label: "Apply for verification", description: "Register a supplier in the sandbox.", icon: "verify" },
      { href: "/supplier-engagements/", label: "Work enquiries", description: "Respond, quote, invoice and submit completion evidence.", icon: "track" },
      { href: "/suppliers/promote/", label: "Promote services", description: "Create a clearly labelled paid placement.", icon: "megaphone" },
      { href: "/suppliers/", label: "Supplier directory", description: "View ratings, reviews and assignments.", icon: "supplier" }
    ]
  },
  admin: {
    label: "Admin controls",
    description: "Review trust decisions and controlled disbursements.",
    items: [
      { href: "/admin/", label: "Admin control centre", description: "See all queues, admins and oversight controls.", icon: "shield" },
      { href: "/admin/review/", label: "Campaign approvals", description: "Approve campaigns or request changes.", icon: "campaign" },
      { href: "/admin/suppliers/", label: "Supplier approvals", description: "Verify suppliers before directory access.", icon: "supplier" },
      { href: "/admin/payments/", label: "Supplier payments", description: "Approve evidence-backed milestone payments.", icon: "account" }
    ]
  }
};

const roles = Object.entries(roleLabels) as Array<[SandboxRole, string]>;

function MenuItems({ items }: { items: NavItem[] }) {
  return items.map((item) => (
    <Link
      href={item.href}
      className="menu-link"
      key={`${item.href}-${item.label}`}
      onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}
    >
      <span className="menu-icon" aria-hidden="true"><FeatureIcon name={item.icon} size={19} /></span>
      <span><strong>{item.label}</strong>{item.description ? <small>{item.description}</small> : null}</span>
    </Link>
  ));
}

export function RoleAwareNavigation() {
  const [role, setRole] = useState<SandboxRole>("citizen");

  useEffect(() => {
    const refresh = () => setRole(readSandbox<SandboxRole>(keys.role, "citizen"));
    refresh();
    window.addEventListener("citizenx-sandbox-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("citizenx-sandbox-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  function changeRole(nextRole: SandboxRole) {
    setRole(nextRole);
    writeSandbox(keys.role, nextRole);
  }

  const activeTools = roleTools[role];

  return (
    <div className="header-navigation">
      <nav className="desktop-nav" aria-label="Primary navigation">
        {primaryNavigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
      </nav>

      <div className="header-actions">
        <div className="role-switcher">
          <span aria-hidden="true">Sandbox role</span>
          <label htmlFor="sandbox-role" className="sr-only">Choose sandbox role</label>
          <select id="sandbox-role" value={role} onChange={(event) => changeRole(event.target.value as SandboxRole)}>
            {roles.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
        </div>

        <details className={`nav-dropdown role-dropdown role-${role}`}>
          <summary><span>{activeTools.label}</span><ChevronIcon /></summary>
          <div className="nav-dropdown-panel">
            <p><strong>{roleLabels[role]} workspace</strong><span>{activeTools.description}</span></p>
            <nav aria-label={`${roleLabels[role]} tools`}><MenuItems items={activeTools.items} /></nav>
          </div>
        </details>

        <details className="nav-dropdown more-dropdown">
          <summary><span>More</span><ChevronIcon /></summary>
          <div className="nav-dropdown-panel">
            <p><strong>Explore CitizenX</strong><span>Essential information and pilot tools.</span></p>
            <nav aria-label="More CitizenX links"><MenuItems items={moreNavigation} /></nav>
          </div>
        </details>
      </div>

      <details className="mobile-nav">
        <summary>Menu</summary>
        <div className="mobile-nav-panel">
          <nav aria-label="Mobile primary navigation"><MenuItems items={primaryNavigation} /></nav>
          <div className="mobile-menu-group"><strong>{activeTools.label}</strong><nav aria-label={`Mobile ${roleLabels[role]} tools`}><MenuItems items={activeTools.items} /></nav></div>
          <div className="mobile-menu-group"><strong>More</strong><nav aria-label="Mobile secondary navigation"><MenuItems items={moreNavigation} /></nav></div>
        </div>
      </details>
    </div>
  );
}
