import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://app.pinkmanprotects.com"),
  title: {
    default: "Pinkman Protects — Phishing tests and awareness training",
    template: "%s · Pinkman Protects",
  },
  description:
    "Safe phishing tests, short lessons the moment someone slips, and clear reporting on where the risk is.",
  applicationName: "Pinkman Protects",
  openGraph: {
    title: "Pinkman Protects — Phishing tests and awareness training",
    description:
      "Safe phishing tests and in-the-moment lessons. See where human risk is, and watch it improve.",
    url: "/",
    siteName: "Pinkman Protects",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Pinkman Protects" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pinkman Protects — Phishing tests and awareness training",
    description: "Safe phishing tests and human-risk reporting.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="bg-canvas text-ink min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
