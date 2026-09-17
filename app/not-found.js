import Link from "next/link";
import { Compass } from "lucide-react";
import "./globals.css";

// Root-level fallback for any URL that doesn't match a route in either the
// (public) or admin segment. app/(public)/not-found.js handles the common
// case (browsing to a bad product slug etc.) and gets the Navbar/Footer via
// its layout; this one has no nested layout to inherit chrome from.
export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="container-page flex min-h-screen flex-col items-center justify-center text-center">
          <Compass size={40} className="text-brand-300" />
          <h1 className="mt-4 font-display text-3xl font-extrabold text-ink">Page Not Found</h1>
          <p className="mt-2 max-w-sm text-ink-soft">The page you&apos;re looking for doesn&apos;t exist or may have moved.</p>
          <Link href="/" className="btn-primary mt-6">
            Back to Home
          </Link>
        </div>
      </body>
    </html>
  );
}
