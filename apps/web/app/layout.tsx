import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CitizenX — Democracy, funded by the people",
    template: "%s · CitizenX"
  },
  description: "Discover verified civic campaigns, contribute securely, and follow every rand through a transparent public ledger."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en-ZA">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

