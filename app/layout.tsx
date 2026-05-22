import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PTJ-Stocks",
  description: "A lowkey Lookism-inspired Seoul underground crew market for PTJ universe fighters and crews.",
  openGraph: {
    title: "PTJ-Stocks",
    description: "Lookism-inspired fighter and crew market",
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
