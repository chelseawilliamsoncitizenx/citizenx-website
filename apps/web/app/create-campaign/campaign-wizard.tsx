"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckIcon } from "../../components/icons";
import { createSandboxId, keys, readSandbox, seedSandboxCampaign, type SandboxCampaign, writeSandbox } from "../../lib/sandbox-store";

const steps = ["Campaign", "Funding", "Milestones", "Evidence", "Review"];
const categories = ["Community", "Education", "Youth", "Democracy", "Environment"];

export function CampaignWizard() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState<SandboxCampaign | null>(null);
  const [error, setError] = useState("");
  const wizardBody = useRef<HTMLDivElement>(null);
  const previousStep = useRef(step);
  const [form, setForm] = useState({
    title: "Alexandra community food garden",
    summary: "Turn an unused municipal plot into a productive garden led by local growers.",
    category: "Community",
    location: "Alexandra, Gauteng",
    goalRand: 85000,
    milestones: [
      { title: "Site preparation", amountRand: 25000 },
      { title: "Water and growing infrastructure", amountRand: 38000 },
      { title: "Seedlings and training", amountRand: 22000 }
    ],
    evidence: { identity: true, authority: true, budget: true }
  });

  const milestoneTotal = useMemo(() => form.milestones.reduce((sum, item) => sum + Number(item.amountRand || 0), 0), [form.milestones]);

  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    const legend = wizardBody.current?.querySelector<HTMLElement>("legend");
    legend?.setAttribute("tabindex", "-1");
    legend?.focus();
  }, [step]);

  function next() {
    setError("");
    if (step === 0 && (!form.title.trim() || !form.summary.trim() || !form.location.trim())) return setError("Complete the campaign title, summary and location to continue.");
    if (step === 1 && form.goalRand < 1000) return setError("Enter a funding goal of at least R1,000.");
    if (step === 2 && (form.milestones.some((item) => !item.title.trim() || item.amountRand <= 0) || milestoneTotal !== form.goalRand)) return setError("Every milestone needs a title and amount, and the milestone total must equal the funding goal.");
    if (step === 3 && !Object.values(form.evidence).every(Boolean)) return setError("Confirm all three evidence items before continuing.");
    setStep((current) => Math.min(4, current + 1));
  }

  function submit() {
    const campaign: SandboxCampaign = {
      id: createSandboxId("campaign"),
      title: form.title.trim(), category: form.category, location: form.location.trim(), summary: form.summary.trim(),
      goalRand: form.goalRand, milestones: form.milestones, submittedAt: new Date().toISOString(), status: "under_review"
    };
    const existing = readSandbox<SandboxCampaign[]>(keys.campaigns, [seedSandboxCampaign]).filter((item) => item.id !== campaign.id);
    writeSandbox(keys.campaigns, [campaign, ...existing]);
    setSubmitted(campaign);
  }

  if (submitted) return (
    <div className="success-card" role="status">
      <span className="success-icon"><CheckIcon size={36} /></span>
      <p className="eyebrow">Submitted for review</p>
      <h1>{submitted.title}</h1>
      <p>Your sandbox campaign is now marked <strong>Under review</strong>. Patrick, Lindo or Thato can approve it from the Admin workspace.</p>
      <dl className="receipt-summary">
        <div><dt>Funding goal</dt><dd>R{form.goalRand.toLocaleString("en-ZA")}</dd></div>
        <div><dt>Milestones</dt><dd>{form.milestones.length}</dd></div>
        <div><dt>Status</dt><dd>Under review</dd></div>
      </dl>
      <div className="button-row button-row-center"><Link className="button button-primary" href="/admin/review/">Switch to Admin review</Link><Link className="button button-secondary" href="/sandbox/">Back to sandbox</Link></div>
    </div>
  );

  return (
    <div className="wizard-card">
      <ol className="wizard-progress" aria-label="Campaign creation progress">
        {steps.map((label, index) => <li className={index === step ? "current" : index < step ? "complete" : ""} aria-current={index === step ? "step" : undefined} key={label}><span>{index < step ? <CheckIcon size={15} /> : index + 1}</span>{label}</li>)}
      </ol>

      <div className="wizard-body" ref={wizardBody}>
        {step === 0 ? <fieldset><legend>Tell people what you want to change.</legend><p className="field-help">Use plain, specific language. This becomes the public campaign summary.</p><div className="form-grid"><div className="field field-wide"><label htmlFor="campaign-title">Campaign title</label><input id="campaign-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div><div className="field field-wide"><label htmlFor="campaign-summary">Public summary</label><textarea id="campaign-summary" rows={4} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></div><div className="field"><label htmlFor="campaign-category">Category</label><select id="campaign-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div><div className="field"><label htmlFor="campaign-location">Location</label><input id="campaign-location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div></div></fieldset> : null}

        {step === 1 ? <fieldset><legend>Set a clear funding goal.</legend><p className="field-help">CitizenX will protect the campaign balance and pay approved suppliers against evidence.</p><div className="goal-field"><span>R</span><label className="sr-only" htmlFor="campaign-goal">Funding goal in rand</label><input id="campaign-goal" type="number" min="1000" step="500" value={form.goalRand} onChange={(e) => setForm({ ...form, goalRand: Number(e.target.value) })} /></div><div className="info-panel"><strong>No unrestricted cash release</strong><p>Campaign funds remain traceable and are released to verified suppliers for approved milestones.</p></div></fieldset> : null}

        {step === 2 ? <fieldset><legend>Balance the milestone budget.</legend><p className="field-help">The total of all milestones must match the R{form.goalRand.toLocaleString("en-ZA")} funding goal.</p><div className="milestone-editor">{form.milestones.map((milestone, index) => <div className="milestone-edit-row" key={index}><span>{index + 1}</span><div className="field"><label htmlFor={`milestone-title-${index}`}>Milestone {index + 1}</label><input id={`milestone-title-${index}`} value={milestone.title} onChange={(e) => { const milestones = [...form.milestones]; milestones[index] = { ...milestone, title: e.target.value }; setForm({ ...form, milestones }); }} /></div><div className="field"><label htmlFor={`milestone-amount-${index}`}>Amount</label><div className="money-input"><span>R</span><input id={`milestone-amount-${index}`} type="number" min="1" value={milestone.amountRand} onChange={(e) => { const milestones = [...form.milestones]; milestones[index] = { ...milestone, amountRand: Number(e.target.value) }; setForm({ ...form, milestones }); }} /></div></div></div>)}</div><div className={`budget-total ${milestoneTotal === form.goalRand ? "balanced" : ""}`} aria-live="polite"><span>Milestone total</span><strong>R{milestoneTotal.toLocaleString("en-ZA")}</strong><small>{milestoneTotal === form.goalRand ? "Budget balanced" : `${milestoneTotal < form.goalRand ? "Remainder" : "Over budget"}: R${Math.abs(form.goalRand - milestoneTotal).toLocaleString("en-ZA")}`}</small></div></fieldset> : null}

        {step === 3 ? <fieldset><legend>Confirm the supporting evidence.</legend><p className="field-help">These checks are simulated for the pilot; no documents are uploaded.</p><div className="evidence-list"><label><input type="checkbox" checked={form.evidence.identity} onChange={(e) => setForm({ ...form, evidence: { ...form.evidence, identity: e.target.checked } })} /><span><strong>Identity and organisation</strong><small>Authorised representative and organisation details are ready.</small></span></label><label><input type="checkbox" checked={form.evidence.authority} onChange={(e) => setForm({ ...form, evidence: { ...form.evidence, authority: e.target.checked } })} /><span><strong>Authority to campaign</strong><small>The relevant mandate, resolution or beneficiary authority is ready.</small></span></label><label><input type="checkbox" checked={form.evidence.budget} onChange={(e) => setForm({ ...form, evidence: { ...form.evidence, budget: e.target.checked } })} /><span><strong>Budget evidence</strong><small>Supplier estimates or comparable evidence support the milestone budget.</small></span></label></div></fieldset> : null}

        {step === 4 ? <fieldset><legend>Review before submission.</legend><p className="field-help">The founding team will receive this campaign in the sandbox review queue.</p><article className="review-preview"><div><span className="verified-badge">Pending verification</span><span>{form.category}</span></div><h2>{form.title}</h2><p>{form.summary}</p><dl><div><dt>Location</dt><dd>{form.location}</dd></div><div><dt>Funding goal</dt><dd>R{form.goalRand.toLocaleString("en-ZA")}</dd></div><div><dt>Milestones</dt><dd>{form.milestones.length}</dd></div><div><dt>Reviewer</dt><dd>Patrick, Lindo or Thato</dd></div></dl></article></fieldset> : null}

        {error ? <p className="form-alert" role="alert">{error}</p> : null}
        <div className="form-actions"><button className="button button-secondary" type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>Back</button>{step < 4 ? <button className="button button-primary" type="button" onClick={next}>Continue</button> : <button className="button button-primary" type="button" onClick={submit}>Submit for review</button>}</div>
      </div>
    </div>
  );
}
