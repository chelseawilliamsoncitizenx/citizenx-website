"use client";

import { formatZar, type Campaign } from "@citizenx/domain";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowIcon, CheckIcon, ShieldIcon } from "../../../components/icons";
import { writeSandboxDonation, type DonationPaymentMethod, type DonationVisibility, type SandboxDonation } from "../../../lib/donations";

const amountOptions = [2000, 5000, 10000, 25000];

export function DonationFlow({ campaign }: { campaign: Campaign }) {
  const [step, setStep] = useState(1);
  const [amountCents, setAmountCents] = useState(5000);
  const [customAmount, setCustomAmount] = useState("");
  const [visibility, setVisibility] = useState<DonationVisibility>("public");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [declared, setDeclared] = useState(false);
  const [method, setMethod] = useState<DonationPaymentMethod>("instant_eft");
  const [tipPercentage, setTipPercentage] = useState(10);
  const [customTip, setCustomTip] = useState("");
  const [receipt, setReceipt] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const flowPanel = useRef<HTMLFormElement>(null);
  const previousStep = useRef(step);

  const donationAmount = customAmount ? Math.max(0, Math.round(Number(customAmount) * 100)) : amountCents;
  const customTipCents = customTip === "" ? null : Math.max(0, Math.round(Number(customTip) * 100));
  const tipCents = customTipCents ?? Math.round(donationAmount * tipPercentage / 100);
  const totalCents = donationAmount + tipCents;
  const canContinue = Number.isInteger(donationAmount) && donationAmount >= 2000;
  const hasValidName = fullName.trim().split(/\s+/).length >= 2 && fullName.trim().length >= 5;
  const currency = useMemo(() => formatZar(donationAmount), [donationAmount]);

  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    const legend = flowPanel.current?.querySelector<HTMLElement>("legend");
    legend?.setAttribute("tabindex", "-1");
    legend?.focus();
  }, [step]);

  function chooseAmount(value: number) {
    setAmountCents(value);
    setCustomAmount("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!declared || !canContinue || !hasValidName) return;
    setBusy(true);
    const id = crypto.randomUUID();
    const donation: SandboxDonation = {
      id,
      campaignSlug: campaign.slug,
      amountCents: donationAmount,
      tipCents,
      tipPercent: customTipCents === null ? tipPercentage : 0,
      occurredAt: new Date().toISOString(),
      visibility,
      method,
      fullName: fullName.trim(),
      message: message.trim()
    };
    writeSandboxDonation(donation);
    setReceipt(`CX-SBX-${id.slice(0, 8).toUpperCase()}`);
    setBusy(false);
  }

  if (receipt) {
    return (
      <section className="section section-ivory page-section">
        <div className="shell narrow-shell">
          <div className="success-card" role="status">
            <span className="success-icon"><CheckIcon size={34} /></span>
            <p className="eyebrow">Sandbox contribution complete</p>
            <h1>Thank you for backing this work.</h1>
            <p>Your simulated contribution of <strong>{currency}</strong> to <strong>{campaign.title}</strong> has been recorded in this browser.</p>
            <dl className="receipt-summary">
              <div><dt>Reference</dt><dd>{receipt}</dd></div>
              <div><dt>Payment</dt><dd>Sandbox · {method === "instant_eft" ? "Instant EFT" : "Card"}</dd></div>
              <div><dt>Supporter</dt><dd>{visibility === "anonymous" ? "Anonymous" : fullName.trim()}</dd></div>
              <div><dt>CitizenX tip</dt><dd>{customTipCents === null ? `${tipPercentage}% · ` : "Custom amount · "}{formatZar(tipCents)}</dd></div>
              <div><dt>Total</dt><dd>{formatZar(totalCents)}</dd></div>
            </dl>
            <div className="button-row button-row-center">
              <Link className="button button-primary" href={`/campaigns/${campaign.slug}/#supporters`}>See your support message <ArrowIcon /></Link>
              <Link className="button button-secondary" href={`/ledger/${campaign.slug}/?view=income`}>View the income audit</Link>
            </div>
            <p className="fine-print">This QA receipt is not valid for tax or accounting purposes. Demo information remains in this browser.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section section-ivory page-section donation-page">
      <div className="shell donation-layout">
        <div>
          <Link className="back-link" href={`/campaigns/${campaign.slug}/`}>← Back to campaign</Link>
          <p className="eyebrow">Secure contribution</p>
          <h1>Support {campaign.title}</h1>
          <ol className="donation-steps" aria-label="Contribution progress">
            {["Amount", "Visibility & message", "Payment"].map((label, index) => {
              const number = index + 1;
              return <li key={label} className={number === step ? "current" : number < step ? "complete" : ""} aria-current={number === step ? "step" : undefined}><span>{number < step ? <CheckIcon size={15} /> : number}</span>{label}</li>;
            })}
          </ol>
          <form className="donation-form" onSubmit={submit} ref={flowPanel}>
            {step === 1 ? (
              <fieldset>
                <legend>Choose your contribution</legend>
                <p className="field-help">The minimum QA contribution is R20.</p>
                <div className="amount-grid">
                  {amountOptions.map((amount) => <button type="button" key={amount} className={!customAmount && amount === amountCents ? "selected" : ""} aria-pressed={!customAmount && amount === amountCents} onClick={() => chooseAmount(amount)}>{formatZar(amount)}</button>)}
                </div>
                <div className="field amount-field"><label htmlFor="custom-amount">Or enter another amount</label><span>R</span><input id="custom-amount" inputMode="decimal" min="20" step="1" type="number" value={customAmount} onChange={(event) => setCustomAmount(event.target.value)} placeholder="Other amount" aria-describedby={!canContinue ? "amount-error" : undefined} aria-invalid={!canContinue} /></div>
                {!canContinue ? <p className="field-error" id="amount-error">Enter an amount of at least R20.</p> : null}
                <button className="button button-primary button-wide" type="button" disabled={!canContinue} onClick={() => setStep(2)}>Continue with {currency} <ArrowIcon /></button>
              </fieldset>
            ) : null}

            {step === 2 ? (
              <fieldset>
                <legend>Choose your donation visibility</legend>
                <p className="field-help">Public visibility is separate from the private information used to process a contribution.</p>
                <div className="choice-stack donation-visibility-options">
                  <label className={visibility === "public" ? "selected" : ""}><input type="radio" name="visibility" value="public" checked={visibility === "public"} onChange={() => setVisibility("public")} /><span><strong>Show my full name</strong><small>Campaign example: “{fullName.trim() || "Thandi Maseko"} contributed {currency}”</small></span></label>
                  <label className={visibility === "anonymous" ? "selected" : ""}><input type="radio" name="visibility" value="anonymous" checked={visibility === "anonymous"} onChange={() => setVisibility("anonymous")} /><span><strong>Keep my contribution anonymous</strong><small>Campaign example: “Anonymous supporter contributed {currency}”</small></span></label>
                </div>
                <div className="field supporter-name-field"><label htmlFor="supporter-name">Full legal name</label><input id="supporter-name" type="text" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="e.g. Thandi Maseko" aria-describedby={fullName && !hasValidName ? "name-error" : "supporter-name-help"} aria-invalid={Boolean(fullName) && !hasValidName} /><small id="supporter-name-help">{visibility === "anonymous" ? "Kept private in the campaign view. Use demo information only." : "Displayed with this demo contribution. Use demo information only."}</small></div>
                {fullName && !hasValidName ? <p className="field-error standalone-error" id="name-error">Enter a first name and surname.</p> : null}
                <div className="field supporter-message-field"><label htmlFor="support-message">Message of support <span>(optional)</span></label><textarea id="support-message" rows={4} maxLength={240} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Share encouragement with the campaign team." /><small>{message.length}/240 characters</small></div>
                <div className="sandbox-check"><CheckIcon /><p><strong>Sandbox payment and fraud checks</strong><br />Payment, fraud and compliance checks are simulated in this demo. Production checks will depend on CitizenX&apos;s approved provider and policy.</p></div>
                <label className="check-field"><input type="checkbox" checked={declared} onChange={(event) => setDeclared(event.target.checked)} /><span>I confirm that this contribution uses my own lawful funds and that the details supplied for a real contribution would be accurate.</span></label>
                <div className="form-actions"><button className="button button-secondary" type="button" onClick={() => setStep(1)}>Back</button><button className="button button-primary" type="button" disabled={!declared || !hasValidName} onClick={() => setStep(3)}>Continue <ArrowIcon /></button></div>
              </fieldset>
            ) : null}

            {step === 3 ? (
              <fieldset>
                <legend>Choose a sandbox payment method</legend>
                <div className="choice-stack">
                  <label className={method === "instant_eft" ? "selected" : ""}><input type="radio" name="method" value="instant_eft" checked={method === "instant_eft"} onChange={() => setMethod("instant_eft")} /><span><strong>Instant EFT</strong><small>Simulated secure bank payment</small></span></label>
                  <label className={method === "card" ? "selected" : ""}><input type="radio" name="method" value="card" checked={method === "card"} onChange={() => setMethod("card")} /><span><strong>Debit or credit card</strong><small>Simulated secure card checkout</small></span></label>
                </div>
                <div className="tip-box tip-slider-box"><div><p className="eyebrow">Optional tip</p><strong>CitizenX charges a 0% platform fee for this campaign.</strong><p>Your optional tip helps us keep the service available and support more citizen-led projects. It remains separate from the campaign contribution.</p></div><div className="tip-slider-control"><output htmlFor="tip-percentage" aria-live="polite">{customTipCents !== null ? `Custom tip · ${formatZar(tipCents)}` : tipPercentage === 0 ? "No tip" : `${tipPercentage}% · ${formatZar(tipCents)}`}</output><input id="tip-percentage" type="range" min="0" max="20" step="1" value={tipPercentage} onChange={(event) => { setTipPercentage(Number(event.target.value)); setCustomTip(""); }} aria-label="Optional CitizenX tip percentage" aria-valuetext={customTipCents !== null ? `Custom tip, ${formatZar(tipCents)}` : tipPercentage === 0 ? "No tip" : `${tipPercentage} percent, ${formatZar(tipCents)}`} /><div className="tip-scale" aria-hidden="true"><span>0%</span><span>5%</span><span>10%</span><span>15%</span><span>20%</span></div><div className="field custom-tip-field"><label htmlFor="custom-tip">Or enter another amount</label><span aria-hidden="true">R</span><input id="custom-tip" type="number" min="0" step="1" inputMode="decimal" value={customTip} onChange={(event) => { setCustomTip(event.target.value); if (event.target.value !== "") setTipPercentage(0); }} placeholder="Custom tip" /></div></div></div>
                <div className="order-summary"><div><span>Campaign contribution</span><strong>{formatZar(donationAmount)}</strong></div><div><span>Optional CitizenX tip</span><strong>{formatZar(tipCents)}</strong></div><div className="order-total"><span>Total</span><strong>{formatZar(totalCents)}</strong></div></div>
                <div className="form-actions"><button className="button button-secondary" type="button" onClick={() => setStep(2)}>Back</button><button className="button button-primary" type="submit" disabled={busy}>{busy ? "Processing…" : "Complete sandbox contribution"} <ArrowIcon /></button></div>
              </fieldset>
            ) : null}
          </form>
        </div>
        <aside className="donation-assurance">
          <ShieldIcon size={34} />
          <h2>How your funds are protected</h2>
          <ul><li><CheckIcon /> Held in a protected campaign balance</li><li><CheckIcon /> Paid to verified suppliers</li><li><CheckIcon /> Matched to invoices and milestones</li><li><CheckIcon /> Separated into income and expense audits</li></ul>
          <p>This QA demo never contacts a bank or payment provider.</p>
        </aside>
      </div>
    </section>
  );
}
