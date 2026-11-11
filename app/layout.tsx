import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://codemap.dev"),
  title: {
    default: "CodeMap — Dependency graph for any JS/TS repo",
    template: "%s · CodeMap",
  },
  description:
    "Paste a GitHub URL and get an interactive map of every import in a JavaScript or TypeScript repository. Spot circular dependencies and trace the blast radius of a change.",
  applicationName: "CodeMap",
  keywords: [
    "dependency graph",
    "code visualization",
    "circular dependencies",
    "blast radius",
    "javascript",
    "typescript",
  ],
  authors: [{ name: "CodeMap" }],
  openGraph: {
    type: "website",
    siteName: "CodeMap",
    title: "CodeMap — Dependency graph for any JS/TS repo",
    description:
      "Paste a GitHub URL and get an interactive map of every import in a JavaScript or TypeScript repository.",
    url: "https://codemap.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeMap — Dependency graph for any JS/TS repo",
    description:
      "Paste a GitHub URL and get an interactive map of every import in a JavaScript or TypeScript repository.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#fcfcf9",
};

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
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
