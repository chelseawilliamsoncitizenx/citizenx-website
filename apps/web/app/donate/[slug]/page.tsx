import { campaigns, getCampaign } from "@citizenx/domain";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DonationFlow } from "./donation-flow";

export function generateStaticParams() {
  return campaigns.map((campaign) => ({ slug: campaign.slug }));
}

export const metadata: Metadata = { title: "Contribute securely" };

export default async function DonatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = getCampaign(slug);
  if (!campaign) notFound();
  return <DonationFlow campaign={campaign} />;
}

