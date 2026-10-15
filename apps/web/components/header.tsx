import { Logo } from "./logo";
import { RoleAwareNavigation } from "./role-aware-navigation";

export function Header() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Logo />
        <RoleAwareNavigation />
      </div>
    </header>
  );
}
