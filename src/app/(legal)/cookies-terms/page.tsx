import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookies Policy | Proddev Hub",
  description: "How Proddev Hub uses cookies and how you can control them.",
};

const LAST_UPDATED = "August 20, 2025";

export default function CookiesPage() {
  return (
    <main className="container mx-auto max-w-3xl py-10 px-4 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold">Cookies Policy</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {LAST_UPDATED}
        </p>
      </header>

      <section className="space-y-3">
        <p className="text-sm">
          Cookies are small text files placed on your device to store data. We
          use cookies and similar technologies to provide and secure our
          services, understand usage, and improve your experience.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Types of cookies we use</h2>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>
            <strong>Strictly necessary</strong>: required for sign-in, security,
            and core features.
          </li>
          <li>
            <strong>Functional</strong>: remember preferences (e.g., language,
            theme).
          </li>
          <li>
            <strong>Analytics</strong>: help us understand usage and improve
            courses and UX.
          </li>
          <li>
            <strong>Marketing</strong>: where applicable, to measure campaigns
            (we keep this minimal).
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Managing cookies</h2>
        <p className="text-sm">
          You can control cookies in your browser settings and via in-product
          consent banners where available. Blocking some cookies may impact site
          functionality (e.g., login sessions).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Changes to this policy</h2>
        <p className="text-sm text-muted-foreground">
          We may update this policy periodically. We’ll adjust the “Last
          updated” date and, where required, provide additional notice.
        </p>
      </section>

      <section className="space-y-1">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p className="text-sm">
          Email:{" "}
          <a className="underline" href="mailto:privacy@proddevhub.com">
            privacy@proddevhub.com
          </a>
        </p>
      </section>

      <footer className="text-xs text-muted-foreground">
        This page is informational only and not legal advice.
      </footer>
    </main>
  );
}
