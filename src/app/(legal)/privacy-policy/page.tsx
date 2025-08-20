import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Proddev Hub",
  description: "How Proddev Hub collects, uses, and protects your information.",
};

const LAST_UPDATED = "August 20, 2025";

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto max-w-3xl py-10 px-4 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {LAST_UPDATED}
        </p>
      </header>

      <section className="space-y-3">
        <p className="text-sm">
          This Privacy Policy explains how <strong>Proddev Hub</strong> (“we”,
          “us”) collects, uses, and shares information when you use our website
          and services.
        </p>
        <p className="text-xs text-muted-foreground">
          This summary is for general information and does not replace
          professional legal advice.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Information we collect</h2>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>
            <strong>Account info</strong>: name, email, password (hashed),
            verification status.
          </li>
          <li>
            <strong>Course activity</strong>: enrollments, progress signals,
            support interactions.
          </li>
          <li>
            <strong>Device & usage</strong>: IP address, browser, analytics
            events (aggregated).
          </li>
          <li>
            <strong>Cookies</strong>: see our Cookies Policy for details.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">How we use information</h2>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>Provide, personalize, and improve courses and features.</li>
          <li>Authenticate users, prevent fraud, and secure the platform.</li>
          <li>Communicate with you (e.g., receipts, reminders, support).</li>
          <li>Comply with legal obligations and enforce our Terms.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Sharing</h2>
        <p className="text-sm">
          We may share data with service providers (e.g., hosting, analytics,
          payment) under contracts that require appropriate safeguards. We don’t
          sell personal information.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Data retention</h2>
        <p className="text-sm">
          We keep data only as long as necessary for the purposes described
          above, unless a longer period is required by law.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Security</h2>
        <p className="text-sm">
          We use reasonable technical and organizational measures to protect
          your data. No system is 100% secure.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Your rights</h2>
        <p className="text-sm">
          Depending on your location, you may have rights to access, correct,
          delete, or export your data, and to object or restrict certain
          processing. To exercise rights, contact{" "}
          <a className="underline" href="mailto:privacy@proddevhub.com">
            privacy@proddevhub.com
          </a>
          .
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">International transfers</h2>
        <p className="text-sm">
          If we transfer data internationally, we use appropriate safeguards
          consistent with applicable law.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Children’s privacy</h2>
        <p className="text-sm">
          Our services are not directed to children under 13 (or the relevant
          age in your jurisdiction).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Changes</h2>
        <p className="text-sm text-muted-foreground">
          We may update this policy from time to time. We’ll update the “Last
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
        <p className="text-sm">Address: [Your Company Address]</p>
      </section>
    </main>
  );
}
