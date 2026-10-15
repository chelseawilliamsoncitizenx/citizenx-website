import Link from "next/link";
import { Logo } from "./logo";
import { RoleSwitcher } from "./role-switcher";

export function Header() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Logo />
        <nav aria-label="Primary navigation">
          <Link href="/discover/">Discover</Link>
          <Link href="/suppliers/">Suppliers</Link>
          <Link href="/how-it-works/">How it works</Link>
        </nav>
        <div className="header-actions">
          <RoleSwitcher />
          <Link className="button button-small button-light" href="/sandbox/">Open sandbox</Link>
        </div>
      </div>
    </header>
  );
}
