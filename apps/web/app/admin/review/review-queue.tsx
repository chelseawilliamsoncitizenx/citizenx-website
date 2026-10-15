"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckIcon } from "../../../components/icons";
import { keys, readSandbox, sandboxAdmins, seedSandboxCampaign, type SandboxCampaign, writeSandbox } from "../../../lib/sandbox-store";

export function ReviewQueue() {
  const [campaigns, setCampaigns] = useState<SandboxCampaign[]>([]);
  const [selectedReviewer, setSelectedReviewer] = useState<string>(sandboxAdmins[0].name);
  useEffect(() => setCampaigns(readSandbox<SandboxCampaign[]>(keys.campaigns, [seedSandboxCampaign])), []);

  function decide(id: string, status: "approved" | "changes_requested") {
    const next = campaigns.map((campaign) => campaign.id === id ? { ...campaign, status, reviewer: selectedReviewer } : campaign);
    setCampaigns(next);
    writeSandbox(keys.campaigns, next);
  }

  const pending = campaigns.filter((campaign) => campaign.status === "under_review");
  return (
    <div className="review-layout">
      <aside className="reviewer-panel"><p className="eyebrow">Decision maker</p><label htmlFor="reviewer">Reviewing as</label><select id="reviewer" value={selectedReviewer} onChange={(e) => setSelectedReviewer(e.target.value)}>{sandboxAdmins.map((admin) => <option value={admin.name} key={admin.email}>{admin.name}</option>)}</select><a className="reviewer-email" href={`mailto:${sandboxAdmins.find((admin) => admin.name === selectedReviewer)?.email}`}>{sandboxAdmins.find((admin) => admin.name === selectedReviewer)?.email}</a><p>One named admin approval is sufficient in this sandbox. Production payments should use stronger separation of duties.</p><Link className="text-link" href="/admin/">Back to admin control centre</Link></aside>
      <div>
        <div className="queue-heading"><h2>{pending.length} awaiting review</h2><span className="sandbox-pill">Sandbox queue</span></div>
        {campaigns.length ? <div className="review-stack">{campaigns.map((campaign) => <article className="review-card" key={campaign.id}><div className="review-card-head"><div><span className={`status-label status-${campaign.status}`}>{campaign.status.replaceAll("_", " ")}</span><h2>{campaign.title}</h2><p>{campaign.location} · {campaign.category}</p></div><strong>R{campaign.goalRand.toLocaleString("en-ZA")}</strong></div><p>{campaign.summary}</p><div className="review-checks"><span><CheckIcon /> Goal and milestones balance</span><span><CheckIcon /> Evidence declarations complete</span><span><CheckIcon /> Eligible public-interest purpose</span></div><details><summary>View milestone budget</summary><ul>{campaign.milestones.map((milestone) => <li key={milestone.title}><span>{milestone.title}</span><strong>R{milestone.amountRand.toLocaleString("en-ZA")}</strong></li>)}</ul></details>{campaign.status === "under_review" ? <div className="review-actions"><button className="button button-primary" type="button" onClick={() => decide(campaign.id, "approved")}>Approve campaign</button><button className="button button-secondary" type="button" onClick={() => decide(campaign.id, "changes_requested")}>Request changes</button></div> : <p className="decision-note">Decision recorded by {campaign.reviewer}. <button type="button" className="text-button" onClick={() => { const next: SandboxCampaign[] = campaigns.map((item) => { if (item.id !== campaign.id) return item; const { reviewer: _reviewer, ...rest } = item; return { ...rest, status: "under_review" }; }); setCampaigns(next); writeSandbox(keys.campaigns, next); }}>Reset decision</button></p>}</article>)}</div> : <div className="empty-state"><h2>No campaigns yet.</h2><p>Create a campaign to populate this queue.</p><Link className="button button-primary" href="/create-campaign/">Create a campaign</Link></div>}
      </div>
    </div>
  );
}
