import type { Metadata } from "next";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { AppShell } from "@/components/AppShell";

const inter = Inter({ subsets: ["latin"] });

// page title and description shown in browser tab
export const metadata: Metadata = {
  title: "Real-Time Log Analyzer",
  description: "Monitor and analyze logs in real-time with powerful insights",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
