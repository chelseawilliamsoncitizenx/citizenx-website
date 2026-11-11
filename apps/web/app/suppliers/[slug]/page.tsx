import { campaigns, getSupplier, suppliers } from "@citizenx/domain";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SupplierProfile } from "./supplier-profile";

export function generateStaticParams() {
  return suppliers.map((supplier) => ({ slug: supplier.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supplier = getSupplier(slug);
  return supplier ? { title: supplier.name, description: supplier.summary } : {};
}

export default async function SupplierPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supplier = getSupplier(slug);
  if (!supplier) notFound();
  return <SupplierProfile supplier={supplier} campaigns={campaigns} />;
}
