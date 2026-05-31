import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ServiceWorkerRegister } from "@/components/sw-register";
import { BottomNav } from "@/components/BottomNav";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FilmLog",
  description: "Your analog film photography companion. Log rolls and shots with exposure data.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FilmLog",
  },
  openGraph: {
    title: "FilmLog",
    description: "Your analog film photography companion. Log rolls and shots with exposure data.",
    url: "https://filmlog.franciscocucullu.com",
    siteName: "FilmLog",
    images: [
      {
        url: "https://filmlog.franciscocucullu.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "FilmLog - Analog film photography companion",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FilmLog",
    description: "Your analog film photography companion. Log rolls and shots with exposure data.",
    images: ["https://filmlog.franciscocucullu.com/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#E5A100",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#111] text-[#ededed]">
        {children}
        <BottomNav />
        <ServiceWorkerRegister />
        <Analytics />
      </body>
    </html>
  );
}
