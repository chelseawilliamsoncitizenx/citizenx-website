import { campaigns, getCampaign, publicLedgerEvents } from "@citizenx/domain";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicLedger } from "./public-ledger";

export function generateStaticParams() {
  return campaigns.map((campaign) => ({ slug: campaign.slug }));
}

export const metadata: Metadata = { title: "Public campaign ledger" };

export default async function LedgerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = getCampaign(slug);
  if (!campaign) notFound();
  return <PublicLedger campaign={campaign} seedEvents={publicLedgerEvents.filter((event) => event.campaignSlug === slug)} />;
}

