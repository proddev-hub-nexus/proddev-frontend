import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Proddev Hub",
  description: "The rules for using Proddev Hub and its services.",
};

const LAST_UPDATED = "August 20, 2025";

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-3xl py-10 px-4 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {LAST_UPDATED}
        </p>
      </header>

      <section className="space-y-2">
        <p className="text-sm">
          By accessing or using Proddev Hub, you agree to these Terms. If you do
          not agree, do not use our services.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Accounts</h2>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>
            Provide accurate information and keep your credentials secure.
          </li>
          <li>You are responsible for activity under your account.</li>
          <li>We may suspend or terminate accounts for policy violations.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Courses & Enrollment</h2>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>Course availability, schedules, and content may change.</li>
          <li>
            Enrollment may require payment; billing terms will be disclosed at
            checkout.
          </li>
          <li>
            We may provide support channels (e.g., WhatsApp links) as part of
            enrollment.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Acceptable Use</h2>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>No unlawful, infringing, or abusive activity.</li>
          <li>Do not attempt to disrupt or reverse engineer the service.</li>
          <li>
            Respect intellectual property; do not redistribute course materials
            without permission.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Intellectual Property</h2>
        <p className="text-sm">
          All content, trademarks, and logos are owned by Proddev Hub or its
          licensors. You are granted a limited, non-transferable license to
          access content for personal learning purposes.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Third-Party Services</h2>
        <p className="text-sm">
          We may integrate third-party tools (e.g., payments, analytics,
          WhatsApp). Their terms and privacy policies apply to your use of those
          services.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Disclaimers</h2>
        <p className="text-sm">
          Services are provided “as is” without warranties of any kind. We do
          not guarantee uninterrupted or error-free operation.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Limitation of Liability</h2>
        <p className="text-sm">
          To the maximum extent permitted by law, Proddev Hub is not liable for
          indirect, incidental, special, consequential, or punitive damages, or
          any loss of profits or data.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Termination</h2>
        <p className="text-sm">
          We may suspend or terminate access for violations of these Terms or
          where required by law.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Governing Law</h2>
        <p className="text-sm">
          These Terms are governed by the laws of [Your Country/State], without
          regard to conflict of law principles. Venue and jurisdiction will be
          in [Your Courts].
        </p>
      </section>

      <section className="space-y-1">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p className="text-sm">
          Email:{" "}
          <a className="underline" href="mailto:legal@proddevhub.com">
            legal@proddevhub.com
          </a>
        </p>
        <p className="text-sm">Address: [Your Company Address]</p>
      </section>

      <footer className="text-xs text-muted-foreground">
        This page is informational only and not legal advice. Consult your
        counsel to tailor these Terms to your needs.
      </footer>
    </main>
  );
}
