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
  metadataBase: new URL("https://ranchirent.in"),
  title: {
    default: "RanchiRent.in | Verified Flats, PG & Rooms for Rent in Ranchi",
    template: "%s | RanchiRent",
  },
  description: "Find verified 1 BHK, 2 BHK, 3 BHK flats, PG/hostels & rooms for rent in Ranchi. Direct owner contact, no brokerage spam. 500+ verified listings in Lalpur, Bariatu, Morabadi, Kanke Road & more.",
  keywords: [
    "flat for rent in Ranchi",
    "room for rent in Ranchi",
    "PG in Ranchi",
    "hostel in Ranchi",
    "1 BHK flat in Ranchi",
    "2 BHK flat in Ranchi",
    "3 BHK flat in Ranchi",
    "Ranchi rental property",
    "house for rent in Ranchi",
    "bachelor accommodation Ranchi",
    "family flat Ranchi",
    "flat near Lalpur",
    "flat near Bariatu",
    "flat near Morabadi",
    "flat near Kanke Road",
    "Ranchi rent",
    "RanchiRent",
  ],
  authors: [{ name: "RanchiRent" }],
  creator: "RanchiRent",
  publisher: "RanchiRent",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Verified Flats & PG for Rent in Ranchi | RanchiRent",
    description: "Browse 500+ verified rental properties in Ranchi. Flats, PG, hostels - direct owner contacts, no spam. Find your perfect home today!",
    url: "https://ranchirent.in",
    siteName: "RanchiRent",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verified Flats & PG for Rent in Ranchi",
    description: "Find your dream home in Ranchi without the hassle. 500+ verified listings. Direct owner contact.",
  },
  alternates: {
    canonical: "https://ranchirent.in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // Replace with actual code when available
  },
  category: "Real Estate",
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "RanchiRent",
  description: "Verified flats, PG & rooms for rent in Ranchi. Direct owner contact, no brokerage spam.",
  url: "https://ranchirent.in",
  telephone: "+91-7557777987",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ranchi",
    addressRegion: "Jharkhand",
    addressCountry: "IN",
  },
  areaServed: {
    "@type": "City",
    name: "Ranchi",
  },
  priceRange: "₹3,000 - ₹50,000/month",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "09:00",
    closes: "21:00",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${outfit.variable} font-sans antialiased bg-white text-gray-900`}
        suppressHydrationWarning
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

