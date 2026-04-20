import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { BoosterSessionGuard } from "@/components/shared/booster-session-guard";
import { ClientSessionGuard } from "@/components/shared/client-session-guard";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-headline",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Zenith Booster",
  description: "Booster profile settings",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${manrope.variable} bg-background text-on-background font-body selection:bg-primary/30`}
      >
        <ClientSessionGuard />
        <BoosterSessionGuard>{children}</BoosterSessionGuard>
      </body>
    </html>
  );
}