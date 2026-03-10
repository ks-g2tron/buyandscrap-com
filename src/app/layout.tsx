import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Buy & Scrap | Scrap My Car UK — Get Cash for Your Scrap Car Today",
  description:
    "Scrap your car for cash with Buy & Scrap. Free collection, best prices, and fully licensed. Get an instant free quote for scrapping your car anywhere in the UK.",
  keywords:
    "scrap my car, scrap car UK, sell scrap car, car scrapping service, free car collection, cash for scrap cars, scrap vehicle, scrap car prices",
  openGraph: {
    title: "Buy & Scrap | Get Cash For Your Scrap Car Today",
    description:
      "Free collection, best prices, fully licensed. Get your free quote now.",
    type: "website",
    locale: "en_GB",
    url: "https://buyandscrap.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased bg-white`}>
        {children}
      </body>
    </html>
  );
}
