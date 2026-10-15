"use client";

import { formatZar, type Campaign } from "@citizenx/domain";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowIcon, CheckIcon, ShieldIcon } from "../../../components/icons";

type Visibility = "initials" | "anonymous";
type PaymentMethod = "card" | "instant_eft";
type StoredDonation = { id: string; campaignSlug: string; amountCents: number; occurredAt: string; visibility: Visibility; method: PaymentMethod };

const amountOptions = [2000, 5000, 10000, 25000];
const storageKey = "citizenx:sandbox-donations";

export function DonationFlow({ campaign }: { campaign: Campaign }) {
  const [step, setStep] = useState(1);
  const [amountCents, setAmountCents] = useState(5000);
  const [customAmount, setCustomAmount] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("initials");
  const [declared, setDeclared] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>("instant_eft");
  const [tipPercent, setTipPercent] = useState(0);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const flowPanel = useRef<HTMLFormElement>(null);
  const previousStep = useRef(step);

  const donationAmount = customAmount ? Math.max(0, Math.round(Number(customAmount) * 100)) : amountCents;
  const tipCents = Math.round(donationAmount * tipPercent / 100);
  const totalCents = donationAmount + tipCents;
  const canContinue = Number.isInteger(donationAmount) && donationAmount >= 2000;
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
    if (!declared || !canContinue) return;
    setBusy(true);
    const id = crypto.randomUUID();
    const donation: StoredDonation = {
      id,
      campaignSlug: campaign.slug,
      amountCents: donationAmount,
      occurredAt: new Date().toISOString(),
      visibility,
      method
    };
    const existing = JSON.parse(localStorage.getItem(storageKey) ?? "[]") as StoredDonation[];
    localStorage.setItem(storageKey, JSON.stringify([donation, ...existing].slice(0, 20)));
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
              <div><dt>Visibility</dt><dd>{visibility === "anonymous" ? "Anonymous" : "Initials only"}</dd></div>
            </dl>
            <div className="button-row button-row-center">
              <Link className="button button-primary" href={`/ledger/${campaign.slug}/`}>See it in the ledger <ArrowIcon /></Link>
              <Link className="button button-secondary" href={`/campaigns/${campaign.slug}/`}>Return to campaign</Link>
            </div>
            <p className="fine-print">This is a prototype receipt and is not valid for tax or accounting purposes.</p>
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
            {["Amount", "Privacy & KYD", "Payment"].map((label, index) => {
              const number = index + 1;
              return <li key={label} className={number === step ? "current" : number < step ? "complete" : ""} aria-current={number === step ? "step" : undefined}><span>{number < step ? <CheckIcon size={15} /> : number}</span>{label}</li>;
            })}
          </ol>
          <form className="donation-form" onSubmit={submit} ref={flowPanel}>
            {step === 1 ? (
              <fieldset>
                <legend>Choose your contribution</legend>
                <p className="field-help">The minimum pilot contribution is R20.</p>
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
                <legend>Choose what appears publicly</legend>
                <p className="field-help">Your contact and verification details are never published.</p>
                <div className="choice-stack">
                  <label className={visibility === "initials" ? "selected" : ""}><input type="radio" name="visibility" value="initials" checked={visibility === "initials"} onChange={() => setVisibility("initials")} /><span><strong>Show my initials</strong><small>Ledger example: “G.W. contributed R50”</small></span></label>
                  <label className={visibility === "anonymous" ? "selected" : ""}><input type="radio" name="visibility" value="anonymous" checked={visibility === "anonymous"} onChange={() => setVisibility("anonymous")} /><span><strong>Contribute anonymously</strong><small>Ledger example: “Anonymous contribution”</small></span></label>
                </div>
                <div className="sandbox-check"><CheckIcon /><p><strong>Sandbox identity check passed</strong><br />The production service will use an approved KYD provider. No identity data is collected in this pilot.</p></div>
                <label className="check-field"><input type="checkbox" checked={declared} onChange={(event) => setDeclared(event.target.checked)} /><span>I confirm that this contribution uses my own lawful funds and that the details supplied for a real contribution would be accurate.</span></label>
                <div className="form-actions"><button className="button button-secondary" type="button" onClick={() => setStep(1)}>Back</button><button className="button button-primary" type="button" disabled={!declared} onClick={() => setStep(3)}>Continue <ArrowIcon /></button></div>
              </fieldset>
            ) : null}

            {step === 3 ? (
              <fieldset>
                <legend>Choose a sandbox payment method</legend>
                <div className="choice-stack">
                  <label className={method === "instant_eft" ? "selected" : ""}><input type="radio" name="method" value="instant_eft" checked={method === "instant_eft"} onChange={() => setMethod("instant_eft")} /><span><strong>Instant EFT</strong><small>Simulated Ozow-style bank payment</small></span></label>
                  <label className={method === "card" ? "selected" : ""}><input type="radio" name="method" value="card" checked={method === "card"} onChange={() => setMethod("card")} /><span><strong>Debit or credit card</strong><small>Simulated secure card checkout</small></span></label>
                </div>
                <div className="tip-box"><div><strong>CitizenX charges campaigns 0%</strong><p>Optional tips help keep the platform independent.</p></div><select aria-label="Optional CitizenX tip" value={tipPercent} onChange={(event) => setTipPercent(Number(event.target.value))}><option value={0}>No tip</option><option value={5}>5% tip</option><option value={10}>10% tip</option></select></div>
                <div className="order-summary"><div><span>Campaign contribution</span><strong>{formatZar(donationAmount)}</strong></div><div><span>Optional CitizenX tip</span><strong>{formatZar(tipCents)}</strong></div><div className="order-total"><span>Total</span><strong>{formatZar(totalCents)}</strong></div></div>
                <div className="form-actions"><button className="button button-secondary" type="button" onClick={() => setStep(2)}>Back</button><button className="button button-primary" type="submit" disabled={busy}>{busy ? "Processing…" : "Complete sandbox contribution"} <ArrowIcon /></button></div>
              </fieldset>
            ) : null}
          </form>
        </div>
        <aside className="donation-assurance">
          <ShieldIcon size={34} />
          <h2>How your funds are protected</h2>
          <ul><li><CheckIcon /> Held in a protected campaign balance</li><li><CheckIcon /> Paid to verified suppliers</li><li><CheckIcon /> Matched to invoices and milestones</li><li><CheckIcon /> Shown in a privacy-safe public ledger</li></ul>
          <p>This pilot never contacts a bank or payment provider.</p>
        </aside>
      </div>
    </section>
  );
}
