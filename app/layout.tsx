import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LOOKISM STOCK EXCHANGE",
  description: "A cinematic Korean manhwa-inspired fictional stock market for Lookism factions and characters.",
  openGraph: {
    title: "LOOKISM STOCK EXCHANGE",
    description: "Bloomberg x Korean Manhwa x Cyberpunk Seoul",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

