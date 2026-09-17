import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <Compass size={40} className="text-brand-300" />
      <h1 className="mt-4 font-display text-3xl font-extrabold text-ink">Page Not Found</h1>
      <p className="mt-2 max-w-sm text-ink-soft">The page you&apos;re looking for doesn&apos;t exist or may have moved.</p>
      <Link href="/" className="btn-primary mt-6">
        Back to Home
      </Link>
    </div>
  );
}
