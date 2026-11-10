import type { Metadata } from "next";
import { SandboxHub } from "./sandbox-hub";

export const metadata: Metadata = { title: "Sandbox workspace" };

export default function SandboxPage() {
  return (
    <section className="section section-ivory page-section">
      <div className="shell">
        <div className="page-heading sandbox-heading">
          <div>
            <p className="eyebrow">Interactive pilot</p>
            <h1>Test CitizenX from every side.</h1>
            <p>Switch roles, complete the core journeys and see how each action changes the sandbox. Nothing here moves real money; use demo names, messages and photographs only.</p>
          </div>
          <span className="sandbox-mode-badge">Sandbox mode</span>
        </div>
        <SandboxHub />
      </div>
    </section>
  );
}
