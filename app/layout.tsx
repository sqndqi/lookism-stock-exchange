import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PTJ-Stocks",
  description: "A lowkey Lookism-inspired fictional stock board for PTJ universe characters and crews.",
  openGraph: {
    title: "PTJ-Stocks",
    description: "Lookism-inspired character and crew stocks",
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
