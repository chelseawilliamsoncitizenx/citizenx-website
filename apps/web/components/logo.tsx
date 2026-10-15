import Link from "next/link";

export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="CitizenX home">
      citizen<span>X</span>
    </Link>
  );
}

