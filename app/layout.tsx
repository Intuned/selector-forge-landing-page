import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AgentationDevTools } from "@/components/dev/AgentationDevTools";
import { PostHogProvider } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Selector Forge — Forged, not copied.",
  description:
    "Every selector is generated, stress-tested against the page, and certified before you see it. The brittle ones never survive.",
};

// Google Fonts used by the in-browser hero component. The component references
// these families by their literal names ('Space Mono', 'Bricolage Grotesque',
// 'Archivo'), matching the MagicPath canvas, so they are loaded as a webfont
// stylesheet rather than via next/font's hashed family names.
const FORGE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Space+Mono:wght@400;700&display=swap";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={FORGE_FONTS_HREF} />
      </head>
      <body className="min-h-full flex flex-col">
        <PostHogProvider>{children}</PostHogProvider>
        {/* Dev-only visual-feedback toolbar; renders null in production. */}
        <AgentationDevTools />
      </body>
    </html>
  );
}
