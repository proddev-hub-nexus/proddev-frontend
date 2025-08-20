import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility | Proddev Hub",
  description:
    "Our commitment to accessibility and inclusive learning at Proddev Hub.",
};

const LAST_UPDATED = "August 20, 2025";

export default function AccessibilityPage() {
  return (
    <main className="container mx-auto max-w-3xl py-10 px-4 space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold">Accessibility Statement</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {LAST_UPDATED}
        </p>
      </header>

      <section className="space-y-4">
        <p className="text-sm text-muted-foreground">
          We want everyone to learn and build with Proddev Hub. We are committed
          to providing a website and learning experience that is accessible to
          the widest possible audience.
        </p>
        <p className="text-sm">
          Our goal is to conform to <strong>WCAG 2.1 AA</strong> guidelines. We
          continuously improve color contrast, keyboard navigation, focus
          states, and screen reader support across the app.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Measures we take</h2>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>Semantic HTML and ARIA attributes for assistive technologies.</li>
          <li>Keyboard navigability and visible focus outlines.</li>
          <li>Color contrast checks for UI components.</li>
          <li>Captions or transcripts for multimedia where applicable.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Compatibility</h2>
        <p className="text-sm text-muted-foreground">
          Proddev Hub should work with modern browsers (Chrome, Edge, Firefox,
          Safari) and current operating systems on desktop and mobile.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Feedback</h2>
        <p className="text-sm">
          If you encounter any accessibility barriers, please contact us:
        </p>
        <ul className="list-disc pl-6 text-sm">
          <li>
            Email:{" "}
            <a className="underline" href="mailto:accessibility@proddevhub.com">
              accessibility@proddevhub.com
            </a>
          </li>
          <li>
            WhatsApp:{" "}
            <a
              className="underline"
              href="https://wa.me/2349000000000"
              target="_blank"
              rel="noopener noreferrer"
            >
              +234 900 000 0000
            </a>
          </li>
        </ul>
        <p className="text-xs text-muted-foreground">
          We typically respond within 3–5 business days.
        </p>
      </section>

      <footer className="text-xs text-muted-foreground">
        Note: This statement is provided for general information and is not
        legal advice.
      </footer>
    </main>
  );
}
