import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://buyandscrap.com"),
  title: {
    default: "BuyAndScrap — Cheap Cars With MOT | Buy & Sell UK",
    template: "%s | BuyAndScrap",
  },
  description:
    "Find cheap, reliable cars with MOT or sell yours for free. No commission, no middlemen — just honest sellers and honest cars. UK-wide marketplace.",
  keywords:
    "cheap cars, cars with MOT, buy cheap car UK, sell car free, cheap cars for sale, cars under 2000, budget cars UK",
  openGraph: {
    title: "BuyAndScrap — Cheap Cars With MOT",
    description:
      "Find cheap, reliable cars with MOT or sell yours for free. No commission, honest sellers.",
    type: "website",
    locale: "en_GB",
    url: "https://buyandscrap.com",
    siteName: "BuyAndScrap",
  },
  twitter: {
    card: "summary_large_image",
    title: "BuyAndScrap — Cheap Cars With MOT",
    description:
      "Find cheap, reliable cars with MOT or sell yours for free. UK-wide marketplace.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased bg-white min-h-screen flex flex-col`}>
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
        <Script src="https://analytics.buyandscrap.com/script.js" data-website-id="a49b5c83-4797-4e25-bef2-09e9666f0f6f" strategy="afterInteractive" />
      </body>
    </html>
  );
}
