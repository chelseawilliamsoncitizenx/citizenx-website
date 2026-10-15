import { formatZar } from "@citizenx/domain";
import { CheckIcon } from "./icons";

const rows = [
  { label: "Sipho's Plumbing", note: "Verified supplier · invoice #0431", amount: 4100000, state: "Paid" },
  { label: "JoJo Tanks SA", note: "Verified supplier · invoice #0432", amount: 2850000, state: "Paid" },
  { label: "Installation", note: "Protected pending proof of service", amount: 1470000, state: "Held" }
];

export function LedgerPreview() {
  return (
    <div className="ledger-preview" role="group" aria-label="Example transparent campaign ledger">
      <div className="ledger-preview-head">
        <div>
          <p className="eyebrow">Live campaign</p>
          <h2>Ward 12 clinic water tank</h2>
        </div>
        <span className="verified-badge"><CheckIcon size={14} /> Verified</span>
      </div>
      <p className="muted">Community project · funds paid directly to suppliers</p>
      <p className="hero-amount">{formatZar(8420000)} <span>of {formatZar(12000000)} goal</span></p>
      <div className="progress-track" role="progressbar" aria-label="Campaign funding progress" aria-valuenow={70} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: "70%" }} />
      </div>
      <div className="campaign-stats"><span>70% raised</span><span>412 contributors</span></div>
      <p className="ledger-kicker">Every rand leaves a trail</p>
      <ul className="ledger-preview-list">
        {rows.map((row) => (
          <li key={row.label}>
            <span className="status-icon"><CheckIcon /></span>
            <span><strong>{row.label}</strong><small>{row.state} · {row.note}</small></span>
            <strong>{formatZar(row.amount)}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
