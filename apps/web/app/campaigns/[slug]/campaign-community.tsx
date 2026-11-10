"use client";

import { formatZar, type Campaign, type CampaignSupporter, type CampaignUpdate } from "@citizenx/domain";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowIcon, CheckIcon, FeatureIcon } from "../../../components/icons";
import { readSandboxDonations, type SandboxDonation } from "../../../lib/donations";
import { createSandboxId, keys, readSandbox, type SandboxCampaignUpdate, type SandboxRole, writeSandbox } from "../../../lib/sandbox-store";

type SupporterFilter = "recent" | "top";

export function CampaignCommunity({ campaign, seedUpdates, seedSupporters }: { campaign: Campaign; seedUpdates: CampaignUpdate[]; seedSupporters: CampaignSupporter[] }) {
  const [role, setRole] = useState<SandboxRole>("citizen");
  const [donations, setDonations] = useState<SandboxDonation[]>([]);
  const [sandboxUpdates, setSandboxUpdates] = useState<SandboxCampaignUpdate[]>([]);
  const [supporterFilter, setSupporterFilter] = useState<SupporterFilter>("recent");
  const [showAllSupporters, setShowAllSupporters] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState("");
  const [photoAlt, setPhotoAlt] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [posted, setPosted] = useState(false);

  function refresh() {
    setRole(readSandbox<SandboxRole>(keys.role, "citizen"));
    setDonations(readSandboxDonations().filter((donation) => donation.campaignSlug === campaign.slug));
    setSandboxUpdates(readSandbox<SandboxCampaignUpdate[]>(keys.campaignUpdates, []).filter((update) => update.campaignSlug === campaign.slug));
  }

  useEffect(() => {
    refresh();
    window.addEventListener("citizenx-sandbox-change", refresh);
    window.addEventListener("citizenx-donation-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("citizenx-sandbox-change", refresh);
      window.removeEventListener("citizenx-donation-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [campaign.slug]);

  const supporters = useMemo(() => {
    const sandbox: CampaignSupporter[] = donations.map((donation) => ({
      id: donation.id,
      campaignSlug: donation.campaignSlug,
      fullName: donation.visibility === "anonymous" ? "Anonymous supporter" : donation.fullName,
      amountCents: donation.amountCents,
      contributedAt: donation.occurredAt,
      ...(donation.message ? { message: donation.message } : {})
    }));
    const combined = [...sandbox, ...seedSupporters];
    return combined.sort((a, b) => supporterFilter === "top" ? b.amountCents - a.amountCents : b.contributedAt.localeCompare(a.contributedAt));
  }, [donations, seedSupporters, supporterFilter]);

  const updates = useMemo(() => {
    const local: CampaignUpdate[] = sandboxUpdates.map((update) => ({
      id: update.id,
      campaignSlug: update.campaignSlug,
      title: update.title,
      body: update.body,
      publishedAt: update.createdAt,
      author: update.author,
      ...(update.photoDataUrl ? { image: update.photoDataUrl, imageAlt: update.photoAlt ?? "Campaign progress photograph" } : {})
    }));
    return [...local, ...seedUpdates].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [sandboxUpdates, seedUpdates]);

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setPhotoError("");
    if (!file) {
      setPhotoDataUrl("");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setPhotoError("Choose a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > 1_000_000) {
      setPhotoError("For this browser-only demo, choose an image smaller than 1 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => setPhotoError("The photo could not be read. Try another image.");
    reader.readAsDataURL(file);
  }

  function postUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (title.trim().length < 5 || body.trim().length < 20 || (photoDataUrl && photoAlt.trim().length < 8)) return;
    const nextUpdate: SandboxCampaignUpdate = {
      id: createSandboxId("update"),
      campaignSlug: campaign.slug,
      title: title.trim(),
      body: body.trim(),
      author: campaign.leader.name,
      createdAt: new Date().toISOString(),
      ...(photoDataUrl ? { photoDataUrl, photoAlt: photoAlt.trim() } : {})
    };
    const allUpdates = readSandbox<SandboxCampaignUpdate[]>(keys.campaignUpdates, []);
    writeSandbox(keys.campaignUpdates, [nextUpdate, ...allUpdates].slice(0, 30));
    setTitle("");
    setBody("");
    setPhotoDataUrl("");
    setPhotoAlt("");
    setPosted(true);
    refresh();
  }

  const visibleSupporters = showAllSupporters ? supporters : supporters.slice(0, 5);
  const dateFormat = new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "short", year: "numeric" });

  return (
    <>
      <section className="section campaign-updates-section" id="updates" aria-labelledby="updates-title">
        <div className="shell">
          <div className="section-heading campaign-community-heading"><div><p className="eyebrow">Campaign updates</p><h2 id="updates-title">Progress you can see.</h2><p>Campaigners publish dated evidence and photographs so supporters can follow delivery.</p></div><span className="update-count"><FeatureIcon name="track" size={18} /> {updates.length} {updates.length === 1 ? "update" : "updates"}</span></div>

          {role === "campaign_creator" ? <form className="campaign-update-composer" onSubmit={postUpdate}><div><p className="eyebrow">Campaign Creator tool</p><h3>Post a progress update</h3><p>Updates are stored only in this browser and are clearly part of the QA sandbox.</p></div><div className="campaign-update-fields"><div className="field"><label htmlFor="update-title">Update title</label><input id="update-title" value={title} onChange={(event) => setTitle(event.target.value)} minLength={5} required /></div><div className="field"><label htmlFor="update-body">Progress made</label><textarea id="update-body" rows={5} value={body} onChange={(event) => setBody(event.target.value)} minLength={20} required /></div><div className="field"><label htmlFor="update-photo">Progress photograph <span>(optional)</span></label><input id="update-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} aria-describedby={photoError ? "photo-error" : "photo-help"} /><small id="photo-help">JPG, PNG or WebP, smaller than 1 MB for this browser-only demo.</small></div>{photoDataUrl ? <div className="field"><label htmlFor="update-photo-alt">Describe the photograph</label><input id="update-photo-alt" value={photoAlt} onChange={(event) => setPhotoAlt(event.target.value)} minLength={8} required /></div> : null}{photoError ? <p className="field-error standalone-error" id="photo-error">{photoError}</p> : null}<button className="button button-primary" type="submit">Publish sandbox update</button>{posted ? <p className="form-success" role="status"><CheckIcon /> Update published in this browser.</p> : null}</div></form> : null}

          <div className="campaign-update-grid">{updates.map((update) => <article className="campaign-update-card" key={update.id}>{update.image ? <div className="campaign-update-image">{update.image.startsWith("data:") ? <img src={update.image} alt={update.imageAlt ?? "Campaign progress photograph"} /> : <Image src={update.image} alt={update.imageAlt ?? "Campaign progress photograph"} width={1536} height={1024} sizes="(max-width: 660px) calc(100vw - 28px), 55vw" />}</div> : null}<div className="campaign-update-copy"><div><span>{dateFormat.format(new Date(update.publishedAt))}</span><span>By {update.author}</span></div><h3>{update.title}</h3><p>{update.body}</p><span className="evidence-label"><CheckIcon size={14} /> Campaigner progress update</span></div></article>)}</div>
        </div>
      </section>

      <section className="section section-ivory supporter-section" id="supporters" aria-labelledby="supporters-title">
        <div className="shell supporter-layout">
          <div>
            <div className="section-heading compact"><div><p className="eyebrow">Messages of support</p><h2 id="supporters-title">People backing this campaign.</h2></div><div className="supporter-filter" role="group" aria-label="Sort supporter activity"><button type="button" className={supporterFilter === "recent" ? "active" : ""} aria-pressed={supporterFilter === "recent"} onClick={() => setSupporterFilter("recent")}>Recent</button><button type="button" className={supporterFilter === "top" ? "active" : ""} aria-pressed={supporterFilter === "top"} onClick={() => setSupporterFilter("top")}>Top contributions</button></div></div>
            <div className="supporter-list">{visibleSupporters.map((supporter) => <article key={supporter.id}><div><span className="supporter-avatar" aria-hidden="true">{supporter.fullName === "Anonymous supporter" ? "A" : supporter.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div><strong>{supporter.fullName}</strong><small>{dateFormat.format(new Date(supporter.contributedAt))}</small></div><b>{formatZar(supporter.amountCents)}</b></div>{supporter.message ? <blockquote>“{supporter.message}”</blockquote> : null}</article>)}</div>
            {supporters.length > 5 ? <button type="button" className="button button-secondary" onClick={() => setShowAllSupporters((value) => !value)}>{showAllSupporters ? "Show fewer" : `View all ${supporters.length} supporters`}</button> : null}
          </div>
          <aside className="supporter-cta"><span aria-hidden="true"><FeatureIcon name="community" size={30} /></span><p className="eyebrow">Add your voice</p><h2>Back the work and leave encouragement.</h2><p>Your demo full name and optional message can appear here. Anonymous support remains available.</p><Link className="button button-primary button-wide" href={`/donate/${campaign.slug}/`}>Support this campaign <ArrowIcon /></Link><small>No real payment is processed in this QA pilot.</small></aside>
        </div>
      </section>
    </>
  );
}
