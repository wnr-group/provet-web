import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/motion/MotionProvider";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: {
    default: "Provet — Trusted Veterinary Medicine Supplier",
    template: "%s — Provet",
  },
  description:
    "Provet supplies quality veterinary medicines, vaccines and animal healthcare products backed by expert guidance.",
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning is scoped to this element's own attributes, not
    // its subtree. It is needed because the inline script below deliberately
    // adds classes to <html> before React hydrates - which is the whole point
    // of it running early - so the client className never matches the server's.
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Motion safety net. Entrances are server-rendered at opacity:0 (that
            is how framer-motion avoids a flash of un-animated content), which
            means a build where the JS never arrives would leave that content
            invisible forever. This runs before paint and marks the document as
            script-capable; MotionProvider then marks it as hydrated. If the
            hydration mark never lands within 2.5s, the CSS in globals.css
            reveals everything. Three failure modes covered: JS disabled (no
            `js` class), JS blocked or erroring (`motion-timeout` without
            `motion-ready`), and everything fine (rule never matches). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement;d.classList.add('js');" +
              "setTimeout(function(){d.classList.add('motion-timeout')},2500)})()",
          }}
        />
      </head>
      <body className="antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
