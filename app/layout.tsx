import type { Metadata } from "next";
import { ToastViewport } from "@/components/ToastViewport";
import "./globals.css";

export const metadata: Metadata = {
  title: "AURA EXCHANGE | Seoul Fighter Market Terminal",
  description: "A premium fictional Lookism-inspired exchange for fighter assets, crew sectors, chapter odds, and rumor-driven market movement.",
  openGraph: {
    title: "AURA EXCHANGE",
    description: "Seoul underground fighter market terminal",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <ToastViewport />
      </body>
    </html>
  );
}
