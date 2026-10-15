type IconProps = { size?: number; title?: string; className?: string };

export type FeatureIconName =
  | "account"
  | "campaign"
  | "community"
  | "globe"
  | "home"
  | "lock"
  | "megaphone"
  | "search"
  | "shield"
  | "supplier"
  | "track"
  | "verify";

function iconA11y(title?: string) {
  return title ? { role: "img", "aria-label": title } : { "aria-hidden": true as const };
}

export function CheckIcon({ size = 18, title }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden={title ? undefined : true} role={title ? "img" : undefined}>
      {title ? <title>{title}</title> : null}
      <path d="m5 12.5 4.2 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowIcon({ size = 18, title }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden={title ? undefined : true} role={title ? "img" : undefined}>
      {title ? <title>{title}</title> : null}
      <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShieldIcon({ size = 24, title }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden={title ? undefined : true} role={title ? "img" : undefined}>
      {title ? <title>{title}</title> : null}
      <path d="M12 3 20 6v5c0 5.1-3.4 8.5-8 10-4.6-1.5-8-4.9-8-10V6l8-3Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="m8.5 12 2.2 2.1 4.8-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FeatureIcon({ name, size = 24, title, className }: IconProps & { name: FeatureIconName }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", className, ...iconA11y(title) };
  const stroke = { stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  return (
    <svg {...common}>
      {name === "home" ? <><path d="m3 11 9-8 9 8" {...stroke} /><path d="M5 10v10h14V10M9 20v-6h6v6" {...stroke} /></> : null}
      {name === "search" ? <><circle cx="10.5" cy="10.5" r="6.5" {...stroke} /><path d="m15.5 15.5 5 5" {...stroke} /></> : null}
      {name === "campaign" ? <><path d="M4 13V8l12-4v13L4 13Z" {...stroke} /><path d="M16 8.5c2 .5 3 1.6 3 3s-1 2.5-3 3M7 14l1 6h4l-1.5-5" {...stroke} /></> : null}
      {name === "supplier" ? <><path d="M3 9h18M5 9V6h14v3M5 9v11h14V9" {...stroke} /><path d="M9 20v-6h6v6M7 3h10" {...stroke} /></> : null}
      {name === "shield" || name === "verify" ? <><path d="M12 3 20 6v5c0 5.1-3.4 8.5-8 10-4.6-1.5-8-4.9-8-10V6l8-3Z" {...stroke} />{name === "verify" ? <path d="m8.5 12 2.2 2.1 4.8-5" {...stroke} /> : <path d="M12 8v4m0 4h.01" {...stroke} />}</> : null}
      {name === "track" ? <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" {...stroke} /><circle cx="4" cy="7" r="1.5" {...stroke} /><circle cx="10" cy="3" r="1.5" {...stroke} /><circle cx="16" cy="10" r="1.5" {...stroke} /></> : null}
      {name === "account" ? <><path d="M5 4h14v16H5z" {...stroke} /><path d="M8 8h8M8 12h5M8 16h3" {...stroke} /><path d="m15 16 1.3 1.3L19 14.5" {...stroke} /></> : null}
      {name === "lock" ? <><rect x="4" y="10" width="16" height="11" rx="2" {...stroke} /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" {...stroke} /></> : null}
      {name === "community" ? <><circle cx="9" cy="8" r="3" {...stroke} /><circle cx="17" cy="9" r="2" {...stroke} /><path d="M3 20c0-4 2.5-7 6-7s6 3 6 7M14 14c3.5 0 6 2.2 6 6" {...stroke} /></> : null}
      {name === "globe" ? <><circle cx="12" cy="12" r="9" {...stroke} /><path d="M3 12h18M12 3c2.5 2.4 3.7 5.4 3.7 9s-1.2 6.6-3.7 9c-2.5-2.4-3.7-5.4-3.7-9S9.5 5.4 12 3Z" {...stroke} /></> : null}
      {name === "megaphone" ? <><path d="M4 13V8l12-4v13L4 13Z" {...stroke} /><path d="M7 14l1 6h4l-1.5-5M19 8v5" {...stroke} /></> : null}
    </svg>
  );
}

export function ChevronIcon({ size = 16, title, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} {...iconA11y(title)}><path d="m7 9 5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function StarIcon({ size = 15, title, className }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...iconA11y(title)}><path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.5 6.3-.9L12 2.8Z" fill="currentColor" /></svg>;
}
