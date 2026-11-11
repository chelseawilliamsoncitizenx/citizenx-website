"use client";

import { FormEvent, useState } from "react";

const interests = [
  "Citizen or community participant",
  "Civic or political leader",
  "Funder or foundation",
  "Supplier or service provider",
  "Technology, legal or compliance partner",
  "Media or public-education partner",
  "Something else"
] as const;

export function FoundingNetworkForm() {
  const [form, setForm] = useState<{ name: string; email: string; organisation: string; interest: (typeof interests)[number]; message: string }>({
    name: "",
    email: "",
    organisation: "",
    interest: interests[0],
    message: ""
  });
  const [status, setStatus] = useState("");

  function emailBody() {
    return [
      "Hello CitizenX,",
      "",
      "I would like to join the founding network.",
      "",
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Organisation: ${form.organisation || "Not provided"}`,
      `Area of interest: ${form.interest}`,
      "",
      "How I would like to contribute:",
      form.message,
      "",
      "Sent from the CitizenX founding-network enquiry page."
    ].join("\n");
  }

  function mailtoUrl() {
    return `mailto:hello@citizenx.fund?subject=${encodeURIComponent(`Founding network enquiry · ${form.interest}`)}&body=${encodeURIComponent(emailBody())}`;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Your email app should open with a prepared message. Review it, then press send.");
    window.location.href = mailtoUrl();
  }

  async function copyDetails() {
    const details = `To: hello@citizenx.fund\nSubject: Founding network enquiry · ${form.interest}\n\n${emailBody()}`;
    try {
      await navigator.clipboard.writeText(details);
      setStatus("Email details copied. Paste them into any email service and send to hello@citizenx.fund.");
    } catch {
      setStatus("Copy was blocked by your browser. Please email hello@citizenx.fund directly.");
    }
  }

  return (
    <form className="join-form" onSubmit={submit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="join-name">Full name</label>
          <input id="join-name" autoComplete="name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="join-email">Email address</label>
          <input id="join-email" type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </div>
        <div className="field field-wide">
          <label htmlFor="join-organisation">Organisation <span className="optional-label">(optional)</span></label>
          <input id="join-organisation" autoComplete="organization" value={form.organisation} onChange={(event) => setForm({ ...form, organisation: event.target.value })} />
        </div>
        <div className="field field-wide">
          <label htmlFor="join-interest">I am interested as a…</label>
          <select id="join-interest" required value={form.interest} onChange={(event) => setForm({ ...form, interest: event.target.value as (typeof interests)[number] })}>
            {interests.map((interest) => <option key={interest}>{interest}</option>)}
          </select>
        </div>
        <div className="field field-wide">
          <label htmlFor="join-message">How would you like to contribute?</label>
          <textarea id="join-message" rows={6} required minLength={20} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Tell us about your interest, experience or proposed partnership." />
        </div>
      </div>
      <p className="fine-print">Selecting “Prepare email” opens your default email application. CitizenX receives nothing until you review and send the message.</p>
      <div className="form-actions join-form-actions">
        <button className="button button-primary" type="submit">Prepare email to CitizenX</button>
        <button className="button button-secondary" type="button" onClick={copyDetails}>Copy email details</button>
      </div>
      {status ? <p className="form-alert join-status" role="status">{status}</p> : null}
    </form>
  );
}
