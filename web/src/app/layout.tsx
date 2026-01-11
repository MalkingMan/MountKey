import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MountKey - Weather-aware Mountain Data API",
  description: "Real-time weather risk insights for safer mountain expeditions. Get free API access to curated mountain and trail data.",
  keywords: ["mountain API", "weather risk", "hiking API", "trail data", "mountain weather"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-white text-gray-900`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
