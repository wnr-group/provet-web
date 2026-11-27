import localFont from "next/font/local";
import "./globals.css";
import { MotionProvider } from "@/components/motion/MotionProvider";
import InlineScript from "@/components/InlineScript";

// The fonts are files in app/fonts, not next/font/google: that downloads them
// from Google during every build, and the build fails when Google answers with
// an address Turbopack cannot read. Each family is one variable file covering
// every weight, plus a second for the extended Latin characters (the rupee
// sign, accented names), which the browser fetches only when a page uses one.
// next/font reads these options at build time, so they are written out in full.
const plusJakarta = localFont({
  src: "./fonts/plus-jakarta-sans-latin-wght-normal.woff2",
  variable: "--font-plus-jakarta",
  weight: "200 800",
});

const plusJakartaExt = localFont({
  src: "./fonts/plus-jakarta-sans-latin-ext-wght-normal.woff2",
  variable: "--font-plus-jakarta-ext",
  weight: "200 800",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF",
    },
  ],
});

const inter = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
});

const interExt = localFont({
  src: "./fonts/inter-latin-ext-wght-normal.woff2",
  variable: "--font-inter-ext",
  weight: "100 900",
  preload: false,
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF",
    },
  ],
});

export const metadata = {
  title: {
    default: "Provet",
    template: "%s - Provet",
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
    <html lang="en" className={`${plusJakarta.variable} ${plusJakartaExt.variable} ${inter.variable} ${interExt.variable}`} suppressHydrationWarning>
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
        <InlineScript
          html={
            "(function(){var d=document.documentElement;d.classList.add('js');" +
            "setTimeout(function(){d.classList.add('motion-timeout')},2500)})()"
          }
        />
      </head>
      <body className="antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
