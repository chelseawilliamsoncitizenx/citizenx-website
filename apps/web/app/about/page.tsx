import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "../../components/icons";

export const metadata: Metadata = { title: "About CitizenX" };

export default function AboutPage() {
  return (
    <>
      <section className="simple-hero"><div className="shell narrow-copy"><p className="eyebrow eyebrow-light">About CitizenX</p><h1>Independent infrastructure for democratic trust.</h1><p>CitizenX is creating a secure, non-partisan platform where verified civic and political leaders can raise funds from the people they serve—and communities can see how every rand is managed and used.</p></div></section>
      <section className="section section-ivory"><div className="shell values-layout"><div><p className="eyebrow">Our purpose</p><h2>Participation grows when accountability grows with it.</h2><p>Communities want meaningful ways to resource public work, but trust is often standing in the way. CitizenX is designed to make funding clearer, safer and easier to follow.</p><p>The platform begins in South Africa with a vision to grow across Africa, shaped by local legal, civic and technological realities.</p></div><div className="principle-grid"><article><span>01</span><h3>Political neutrality</h3><p>Fair standards across parties and civic groupings.</p></article><article><span>02</span><h3>Verification</h3><p>Clear identity, eligibility and campaign checks.</p></article><article><span>03</span><h3>Transparency</h3><p>Visible goals, financial progress and reporting.</p></article><article><span>04</span><h3>Privacy and security</h3><p>Responsible treatment of donor and campaign data.</p></article></div></div></section>
      <section className="cta-band"><div className="shell"><div><p className="eyebrow eyebrow-light">Pilot programme</p><h2>Help shape a new standard for transparent civic funding.</h2></div><div className="button-row"><Link className="button button-light" href="/discover/">Explore the pilot <ArrowIcon /></Link><a className="button button-ghost" href="https://www.citizenx.fund/#join">Join the founding network</a></div></div></section>
    </>
  );
}
