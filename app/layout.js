import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
