import Link from "next/link";
import { Logo } from "./logo";

export function Header() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Logo />
        <nav aria-label="Primary navigation">
          <Link href="/discover/">Discover</Link>
          <Link href="/how-it-works/">How it works</Link>
          <Link href="/about/">About</Link>
        </nav>
        <Link className="button button-small button-light" href="/discover/">
          Find a campaign
        </Link>
      </div>
    </header>
  );
}

