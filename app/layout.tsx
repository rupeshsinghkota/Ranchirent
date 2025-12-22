import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import FloatingContactButtons from "@/components/FloatingContactButtons";
import Analytics from "@/components/Analytics";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ranchirent.in"),
  title: "RanchiRent.in | Verified Flats for Rent in Ranchi",
  description: "Find verified 1 BHK, 2 BHK, 3 BHK flats for rent in Ranchi directly from owners/brokers. No fake listings. Call now.",
  openGraph: {
    title: "verified Flats for Rent in Ranchi | RanchiRent",
    description: "Browse 500+ verified rental properties in Ranchi. Direct owner contacts, no spam.",
    url: "https://www.ranchirent.in",
    siteName: "RanchiRent",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verified Flats for Rent in Ranchi",
    description: "Find your dream home in Ranchi without the hassle. Verified listings only.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} font-sans antialiased bg-white text-gray-900`}
      >
        <Navbar />
        {children}
        <Footer />
        <FloatingContactButtons />
        <Analytics />
      </body>
    </html>
  );
}
