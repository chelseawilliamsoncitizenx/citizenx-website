import Link from "next/link";
import { Logo } from "./logo";
import { RoleSwitcher } from "./role-switcher";

export function Header() {
  const navigation = [
    { href: "/", label: "Home" },
    { href: "/discover/", label: "Find a campaign" },
    { href: "/suppliers/", label: "Suppliers" },
    { href: "/how-it-works/", label: "How it works" }
  ];

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
        </nav>
        <div className="header-actions">
          <RoleSwitcher />
          <Link className="button button-small button-light" href="/create-campaign/">Start a campaign</Link>
        </div>
        <details className="mobile-nav">
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">
            {navigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
            <Link href="/create-campaign/">Start a campaign</Link>
            <Link href="/sandbox/">Open sandbox</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
