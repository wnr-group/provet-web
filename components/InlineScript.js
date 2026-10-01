"use client";

// An inline <script> that runs once, as the browser parses the server HTML -
// before first paint, before React hydrates.
//
// React warns when rendering produces a <script> in the browser ("Scripts
// inside React components are never executed when rendering on the client"),
// and it's right that it never runs there. So, following Next.js's guide
// (node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md):
// on the server it is a real script; in the browser it renders as inert
// text/plain, and suppressHydrationWarning accepts the differing `type`. A
// client component, so the browser half really runs in the browser.
export default function InlineScript({ html }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
